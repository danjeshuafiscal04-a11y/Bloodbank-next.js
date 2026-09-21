-- RedCross Blood Bank Supabase setup
-- Run this in a new free Supabase project's SQL editor.
-- Passwords are handled only by Supabase Auth, not by these tables.

create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'donor' check (role in ('donor', 'admin', 'super_admin')),
  full_name text not null default 'RedCross User',
  email text,
  phone text,
  address text,
  blood_type text,
  eligibility_status text not null default 'Eligible',
  password_updated_label text not null default 'just now',
  two_factor_enabled boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists donors (
  donor_code text primary key,
  profile_id uuid references profiles(id) on delete set null,
  full_name text not null,
  contact text,
  email text,
  blood_type text,
  eligibility_status text not null default 'Eligible',
  last_donation_at date,
  last_donation_label text not null default 'Never',
  registered_at date,
  registered_label text not null default 'Today',
  total_units integer not null default 0,
  registration_details jsonb,
  screening_details jsonb,
  donation_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Private helper schema for database-owned Auth hooks.
-- This schema is not part of the exposed Supabase Data API.
create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;

create or replace function app_private.create_donor_profile_for_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  safe_full_name text := coalesce(nullif(trim(metadata->>'full_name'), ''), 'RedCross Donor');
  safe_email text := new.email;
  safe_phone text := nullif(trim(metadata->>'phone'), '');
  safe_address text := nullif(trim(metadata->>'address'), '');
  safe_blood_type text := coalesce(nullif(trim(metadata->>'blood_type'), ''), 'Unknown');
  safe_weight text := nullif(trim(metadata->>'weight'), '');
  safe_age text := nullif(trim(metadata->>'age'), '');
  safe_last_donation_date text := nullif(trim(metadata->>'last_donation_date'), '');
  safe_other_medical_details text := nullif(trim(metadata->>'other_medical_details'), '');
  safe_medical_history jsonb := case
    when jsonb_typeof(metadata->'medical_history') = 'array' then metadata->'medical_history'
    else '[]'::jsonb
  end;
  safe_donor_code text := 'D-' || upper(substr(replace(new.id::text, '-', ''), 1, 8));
begin
  insert into public.profiles (
    id,
    role,
    full_name,
    email,
    phone,
    address,
    blood_type,
    updated_at
  )
  values (
    new.id,
    'donor',
    safe_full_name,
    safe_email,
    safe_phone,
    safe_address,
    safe_blood_type,
    now()
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    phone = excluded.phone,
    address = excluded.address,
    blood_type = excluded.blood_type,
    updated_at = now();

  insert into public.donors (
    donor_code,
    profile_id,
    full_name,
    contact,
    email,
    blood_type,
    eligibility_status,
    last_donation_label,
    registered_at,
    registered_label,
    total_units,
    registration_details,
    updated_at
  )
  values (
    safe_donor_code,
    new.id,
    safe_full_name,
    safe_phone,
    safe_email,
    safe_blood_type,
    'Eligible',
    coalesce(safe_last_donation_date, 'Never'),
    current_date,
    'Today',
    0,
    jsonb_build_object(
      'fullName', safe_full_name,
      'email', safe_email,
      'phone', safe_phone,
      'address', safe_address,
      'bloodType', safe_blood_type,
      'age', safe_age,
      'weight', safe_weight,
      'lastDonationDate', safe_last_donation_date,
      'medicalHistory', safe_medical_history,
      'otherMedicalDetails', safe_other_medical_details
    ),
    now()
  )
  on conflict (donor_code) do update set
    profile_id = excluded.profile_id,
    full_name = excluded.full_name,
    contact = excluded.contact,
    email = excluded.email,
    blood_type = excluded.blood_type,
    registration_details = excluded.registration_details,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists create_redcross_donor_profile_after_auth_signup on auth.users;
create trigger create_redcross_donor_profile_after_auth_signup
after insert on auth.users
for each row execute function app_private.create_donor_profile_for_new_auth_user();

create table if not exists donation_centers (
  id text primary key,
  name text not null,
  center_type text not null default 'Major Clinic',
  address text,
  latitude numeric(10, 7) not null,
  longitude numeric(10, 7) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists appointments (
  id text primary key,
  profile_id uuid references profiles(id) on delete cascade,
  donor_code text references donors(donor_code) on delete set null,
  center_name text,
  donation_center_id text references donation_centers(id) on delete set null,
  service_type text not null default 'Whole Blood Donation',
  scheduled_date text,
  scheduled_time text,
  scheduled_at timestamptz,
  status text not null default 'Confirmed',
  eligibility_answers jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists blood_requests (
  id text primary key,
  profile_id uuid references profiles(id) on delete set null,
  patient_name text not null,
  hospital_name text not null,
  physician_name text,
  contact_number text,
  blood_type text not null,
  component_type text not null default 'Whole Blood',
  units_needed integer not null check (units_needed > 0),
  required_at timestamptz,
  urgency text not null default 'routine',
  diagnosis text,
  status text not null default 'Submitted',
  submitted_at text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists inventory_units (
  id text primary key,
  unit_code text unique,
  blood_type text not null,
  component_type text not null default 'Whole Blood',
  units integer not null default 1 check (units > 0),
  collection_date date,
  expiry_date date,
  status text not null default 'Available',
  storage_zone text,
  storage_temperature numeric(5, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists donation_entries (
  id text primary key,
  donor_code text,
  donor_name text not null,
  contact_number text,
  blood_type text not null,
  units integer not null check (units > 0),
  component_type text not null default 'Whole Blood',
  collection_date text,
  collection_time text,
  facility text,
  staff_name text,
  notes text,
  screening_status text,
  eligibility_status text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists campaigns (
  id text primary key,
  title text not null,
  description text,
  date_range text,
  locations text,
  image_url text,
  starts_at date,
  ends_at date,
  location_summary text,
  status text not null default 'Upcoming',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notifications (
  id text primary key,
  target_role text,
  profile_id uuid references profiles(id) on delete set null,
  type text not null,
  title text not null,
  body text not null,
  time_label text,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id text primary key default gen_random_uuid()::text,
  profile_id uuid references profiles(id) on delete set null,
  actor_name text,
  actor_role text,
  action text not null,
  ip_address text,
  status text not null default 'Success',
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists documents (
  id text primary key default gen_random_uuid()::text,
  blood_request_id text references blood_requests(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  storage_bucket text not null default 'blood-request-documents',
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table donors enable row level security;
alter table donation_centers enable row level security;
alter table appointments enable row level security;
alter table blood_requests enable row level security;
alter table inventory_units enable row level security;
alter table donation_entries enable row level security;
alter table campaigns enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;
alter table documents enable row level security;

grant usage on schema public to anon, authenticated;

grant select on table donation_centers, campaigns to anon;

grant select, insert, update on table profiles to authenticated;
grant select, insert, update, delete on table donors to authenticated;
grant select, insert, update, delete on table donation_centers to authenticated;
grant select, insert, update, delete on table appointments to authenticated;
grant select, insert, update, delete on table blood_requests to authenticated;
grant select, insert, update, delete on table inventory_units to authenticated;
grant select, insert, update, delete on table donation_entries to authenticated;
grant select, insert, update, delete on table campaigns to authenticated;
grant select, insert, update, delete on table notifications to authenticated;
grant select, insert, update, delete on table audit_logs to authenticated;
grant select, insert, update, delete on table documents to authenticated;

grant usage, select on all sequences in schema public to authenticated;
grant usage, select on all sequences in schema public to anon;

alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant usage, select on sequences to authenticated;

drop policy if exists "profiles own select" on profiles;
create policy "profiles own select" on profiles for select to authenticated using (id = auth.uid());
drop policy if exists "profiles own insert" on profiles;
create policy "profiles own insert" on profiles for insert to authenticated with check (id = auth.uid());
drop policy if exists "profiles own update" on profiles;
create policy "profiles own update" on profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "donors select own or staff" on donors;
create policy "donors select own or staff" on donors for select to authenticated using (
  profile_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);
drop policy if exists "donors insert own or staff" on donors;
create policy "donors insert own or staff" on donors for insert to authenticated with check (
  profile_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);
drop policy if exists "donors update staff" on donors;
create policy "donors update staff" on donors for update to authenticated using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
) with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);

drop policy if exists "centers public read" on donation_centers;
create policy "centers public read" on donation_centers for select to anon, authenticated using (true);
drop policy if exists "centers staff write" on donation_centers;
create policy "centers staff write" on donation_centers for all to authenticated using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
) with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);

drop policy if exists "appointments own or staff read" on appointments;
create policy "appointments own or staff read" on appointments for select to authenticated using (
  profile_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);
drop policy if exists "appointments own or staff write" on appointments;
create policy "appointments own or staff write" on appointments for all to authenticated using (
  profile_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
) with check (
  profile_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);

drop policy if exists "requests own or staff read" on blood_requests;
create policy "requests own or staff read" on blood_requests for select to authenticated using (
  profile_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);
drop policy if exists "requests own or staff write" on blood_requests;
create policy "requests own or staff write" on blood_requests for all to authenticated using (
  profile_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
) with check (
  profile_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);

drop policy if exists "inventory staff read" on inventory_units;
create policy "inventory staff read" on inventory_units for select to authenticated using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);
drop policy if exists "inventory staff write" on inventory_units;
create policy "inventory staff write" on inventory_units for all to authenticated using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
) with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);

drop policy if exists "donation entries staff read" on donation_entries;
create policy "donation entries staff read" on donation_entries for select to authenticated using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);
drop policy if exists "donation entries staff write" on donation_entries;
create policy "donation entries staff write" on donation_entries for all to authenticated using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
) with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);

drop policy if exists "campaigns public read" on campaigns;
create policy "campaigns public read" on campaigns for select to anon, authenticated using (true);
drop policy if exists "campaigns staff write" on campaigns;
create policy "campaigns staff write" on campaigns for all to authenticated using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
) with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);

drop policy if exists "notifications own target or staff read" on notifications;
create policy "notifications own target or staff read" on notifications for select to authenticated using (
  profile_id = auth.uid()
  or target_role is null
  or target_role = (select p.role from profiles p where p.id = auth.uid())
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);
drop policy if exists "notifications staff write or own update" on notifications;
create policy "notifications staff write or own update" on notifications for all to authenticated using (
  profile_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
) with check (
  profile_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);

drop policy if exists "audit super admin read" on audit_logs;
create policy "audit super admin read" on audit_logs for select to authenticated using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'super_admin')
);
drop policy if exists "audit staff insert" on audit_logs;
create policy "audit staff insert" on audit_logs for insert to authenticated with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);

drop policy if exists "documents own or staff read" on documents;
create policy "documents own or staff read" on documents for select to authenticated using (
  profile_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);
drop policy if exists "documents own or staff insert" on documents;
create policy "documents own or staff insert" on documents for insert to authenticated with check (
  profile_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
);

insert into donation_centers (id, name, center_type, address, latitude, longitude)
values
  ('CTR-SR-LAGUNA', 'PRC Laguna Chapter - Santa Rosa Branch', 'Santa Rosa Red Cross', 'Rotary Lane, Brgy. Tagapo, City of Santa Rosa, Laguna', 14.3155400, 121.1110400),
  ('CTR-PORT-AREA', 'Port Area Center', 'Major Clinic', 'Port Area, Manila', 14.5922000, 120.9709000),
  ('CTR-MAKATI-HQ', 'Makati National HQ', 'Collection Point', 'Makati City', 14.5547000, 121.0244000),
  ('CTR-QC-MOBILE', 'Quezon City Mobile Drive', 'Mobile Drive', 'Quezon City', 14.6760000, 121.0437000),
  ('CTR-PASAY-HUB', 'Pasay Donation Hub', 'Major Clinic', 'Pasay City', 14.5378000, 120.9911000)
on conflict (id) do update set
  name = excluded.name,
  center_type = excluded.center_type,
  address = excluded.address,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  updated_at = now();

insert into campaigns (id, title, description, date_range, locations, status, image_url)
values
  ('CMP-1001', 'Spring Drive 2024', 'Annual spring blood collection drive across regional community centers targeting type-O donors.', 'March 15 - April 10', '12 Locations', 'Upcoming', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDisvyxYy-VGYKouaf8rmM1lDjqGnl25OQfx7ISsGsj-U8UxUSkyQdSHdCclYgkQqHGmpINiOj4_JqxUOfJtSZykflKxrxJZuynte4Vh_QaXwQDQjc5KIM8hzVTA7nME-d3C31QS6Mv-y8eXJITNvRWR_bG0-6V4KP3iAiOeQF9BMT8cpew9WxBFPGZAkh6ECv7WHkZfw3ZnuF5Hnl3MYM0-_BvAA4RDRAuAoHt5u0zffPk-bnjSMOJWBZm9qq6uLwcX-6G3gTyKE'),
  ('CMP-1002', 'Community Heroes Week', 'Mobile donation campaign for offices, schools, and neighborhood health partners in Laguna.', 'April 22 - April 30', 'Santa Rosa, Laguna', 'Open', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDywHSBgfb-2Nl7yl4zUzIllz3YWGraPzPnuA9LxxnB6LLoViAK_oFHePRKi71m92loEOOWLxToqBLXK_hjXGxf-H61ncJiWMp-O9AqyrXX3hTJHA5xL6MNjAh1ztaS-cDQhHhYGG-zS0jZlhC8vlEQ53Up0_VZcWR9EpdHG4-v16vvUUrIkS3lCvk_gJJUxqanVEKHv_HmAVkwLLg_9ZSAk8ZaYRzH8Z6L8ENF_pV3wKYZhRxfNaHK-MDDu7oiMVc_Tfzmz63j1Mg'),
  ('CMP-1003', 'Corporate Lifeline Drive', 'Corporate partner drive focused on employee donor registration and platelet awareness.', 'May 03 - May 18', '8 Corporate Sites', 'Upcoming', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRugzP9wGrYoqHab5jozufSA4_T5ZjREGPt8W2kYdBp3uAjERW-1h_lbe29D_3FihJakRylna5TQIBZY3F7AcGRhTKatg5Cowyb6nXyZevWUP4dqPi9f5pvo2zT6876wCREEvjFRU9HqunHiHx9W_cgj8W_4DhhhXzllRIPu55Nrjc1dgNBAvYfvaf3MgGYvV8MxtYJT1WvQ_CQddhLtNmxIcaml4sazmLShV9QCkcKCmjHWQGdn_B4SVYsHAsnTTOmBN66Op91Fw'),
  ('CMP-1004', 'Emergency Stock Boost', 'Emergency preparedness campaign supporting urgent blood stock readiness before typhoon season.', 'June 01 - June 14', 'Regional Centers', 'Urgent', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX95p7cBihcJwMwTB-QWFzRghozp6gzKOuI4dwY_Hd0gdS46STq6EoMPYP3iQHuulBGDbiOwyz3Kd7vgFbcZxHIMnrQnwwXDAdGv9nrseI5PZf786ZOYyC5zvzQYSR3UHo3wpa3JQT9C63P4PlGbiIwE2fJDKU7ZYzUX2HAjfhOuoOQf7iP56ImjUDx_CsfAwEpJnqJHadUNmMudKyUGwzgLWVS_JKL99wHYz3UJfwbvFDMUBhXTlGjSrJKy-Fh6MFEiHR6D4_G0w'),
  ('CMP-1005', 'Youth Donor Mission', 'Youth volunteer recruitment and first-time donor education campaign for college campuses.', 'July 08 - July 20', '5 Campuses', 'Planning', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMKC2FnXEnpFQCMT-Cxrqim6mgxs-wlRl9VJ7_ez-M8ZoY2nN2pslWQEinlWdZHO4Z46xccb559RC0iZP0tiEsAGMaqk1T6dyhMOSVE_tUA7t-pBzMvUS0pcDGA81wHIWepxhUACz80BsXoeMINkQbiLOSLGKuche3tANQIiK9B0rFyYBCwhRI0txyD4WayeHQHf0oOcvVtwLBp40VQl0Tkufy4p9ENOSEHD3r_8-oUIfjdV1B4GwZNhRiy57cxnjjhzyW2bcXcFI')
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  date_range = excluded.date_range,
  locations = excluded.locations,
  status = excluded.status,
  image_url = excluded.image_url,
  updated_at = now();

insert into inventory_units (id, blood_type, component_type, units, status)
values
  ('INV-OPOS', 'O+', 'Whole Blood', 412, 'Optimal'),
  ('INV-ONEG', 'O-', 'Whole Blood', 45, 'Critical'),
  ('INV-APOS', 'A+', 'Whole Blood', 380, 'Optimal'),
  ('INV-ANEG', 'A-', 'Whole Blood', 112, 'Low'),
  ('INV-BPOS', 'B+', 'Whole Blood', 82, 'Critical'),
  ('INV-BNEG', 'B-', 'Whole Blood', 65, 'Low'),
  ('INV-ABPOS', 'AB+', 'Whole Blood', 220, 'Optimal'),
  ('INV-ABNEG', 'AB-', 'Whole Blood', 24, 'Critical')
on conflict (id) do update set
  units = excluded.units,
  status = excluded.status,
  updated_at = now();

insert into donors (donor_code, full_name, contact, blood_type, eligibility_status, last_donation_label, registered_label, total_units)
values
  ('D-10294', 'Arthur Morgan', 'arthur.m@example.com', 'O-', 'Eligible', 'Nov 12, 2023', 'Jan 05, 2020', 12),
  ('D-22910', 'Sadie Crawford', 'sadie.c@example.com', 'A+', 'Deferred', 'Dec 01, 2023', 'Mar 15, 2021', 4),
  ('D-55821', 'John Dutton', 'john.d@example.com', 'B-', 'Eligible', 'Aug 24, 2023', 'May 12, 2019', 7)
on conflict (donor_code) do update set
  full_name = excluded.full_name,
  contact = excluded.contact,
  blood_type = excluded.blood_type,
  eligibility_status = excluded.eligibility_status,
  last_donation_label = excluded.last_donation_label,
  registered_label = excluded.registered_label,
  total_units = excluded.total_units,
  updated_at = now();

insert into notifications (id, type, title, body, time_label)
values
  ('N-1', 'Matching Alert', 'O- Donor Match Available', 'A compatible O- donor has been identified.', '10 mins ago'),
  ('N-2', 'Registration', 'New Donor Registration', 'John Doe has completed registration.', '45 mins ago'),
  ('N-3', 'System Alert', 'Low Stock Warning: B+', 'B+ units are approaching minimum threshold.', 'Yesterday')
on conflict (id) do update set
  type = excluded.type,
  title = excluded.title,
  body = excluded.body,
  time_label = excluded.time_label,
  updated_at = now();

insert into audit_logs (id, actor_name, actor_role, action, ip_address, status, metadata)
values
  ('AUD-1', 'Unknown User', 'Unauthorized', 'Unauthorized Login Attempt', '45.122.10.8', 'Failed', '{"severity":"critical"}'),
  ('AUD-2', 'Mark Davis', 'Admin', 'Updated Inventory Thresholds', '192.168.1.12', 'Success', '{"severity":"low"}')
on conflict (id) do update set
  actor_name = excluded.actor_name,
  actor_role = excluded.actor_role,
  action = excluded.action,
  ip_address = excluded.ip_address,
  status = excluded.status,
  metadata = excluded.metadata,
  updated_at = now();

insert into storage.buckets (id, name, public)
values ('blood-request-documents', 'blood-request-documents', false)
on conflict (id) do nothing;

drop policy if exists "documents storage owner read" on storage.objects;
create policy "documents storage owner read" on storage.objects for select to authenticated using (
  bucket_id = 'blood-request-documents'
  and (
    owner = auth.uid()
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin'))
  )
);

drop policy if exists "documents storage owner upload" on storage.objects;
create policy "documents storage owner upload" on storage.objects for insert to authenticated with check (
  bucket_id = 'blood-request-documents'
  and owner = auth.uid()
);

drop policy if exists "documents storage owner update" on storage.objects;
create policy "documents storage owner update" on storage.objects for update to authenticated using (
  bucket_id = 'blood-request-documents'
  and owner = auth.uid()
) with check (
  bucket_id = 'blood-request-documents'
  and owner = auth.uid()
);
