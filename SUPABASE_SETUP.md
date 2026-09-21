# RedCross Supabase Setup

This website uses the Supabase free tier for Auth, Postgres, and Storage. Passwords must be handled only by Supabase Auth.

## 1. Create Or Open Your Supabase Project

Use your project:

```txt
https://hdhsehwxtzpimizelfai.supabase.co
```

In Supabase Dashboard, open SQL Editor and run:

```txt
supabase-schema.sql
```

The schema creates:

- app tables
- RLS policies
- seed records
- private Storage bucket
- private Auth trigger for donor registration

The donor registration trigger creates matching `profiles` and `donors` rows when Supabase Auth creates a new user, even when Confirm Email is enabled.

## 2. Add Next.js Environment Values

Create or update:

```txt
C:\Users\danje\OneDrive\Documents\RED CROSS BLOOD BANK\asthethic\.env.local
```

Use:

```txt
NEXT_PUBLIC_APP_NAME="RedCross Blood Bank"
NEXT_PUBLIC_SUPABASE_URL="https://hdhsehwxtzpimizelfai.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR-PUBLIC-ANON-KEY"
```

Only the anon key belongs in the browser. Never add a service role key to this app.

## 3. Create Demo Auth Accounts

In Supabase Dashboard > Authentication > Users, create:

```txt
donor@redcross.test
admin@redcross.test
superadmin@redcross.test
```

Use secure passwords in Supabase Auth.

Then open SQL Editor and replace the UUID placeholders with the matching Auth user IDs:

```sql
insert into profiles (id, role, full_name, email, phone, blood_type)
values
  ('DONOR_AUTH_UUID', 'donor', 'Juan Dela Cruz', 'donor@redcross.test', '+63 912 345 6789', 'O+'),
  ('ADMIN_AUTH_UUID', 'admin', 'RedCross Admin', 'admin@redcross.test', null, null),
  ('SUPERADMIN_AUTH_UUID', 'super_admin', 'Alex Rivera', 'superadmin@redcross.test', null, null)
on conflict (id) do update set
  role = excluded.role,
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  blood_type = excluded.blood_type,
  updated_at = now();
```

## 4. Turn Off Confirm Email For Local/Demo Registration

For now, use instant registration with no email confirmation.

In Supabase Dashboard:

```txt
Authentication -> Sign In / Providers -> Email
```

Then turn off:

```txt
Confirm email
```

After this, when a donor registers:

1. Supabase Auth creates the user.
2. Supabase returns an active session immediately.
3. The website saves the donor profile and opens the donor portal.
4. No confirmation email is required.

This is free. You do not need a paid SMTP provider for this local/demo setup.

For stricter production use later, turn Confirm Email back on. The private SQL trigger in `supabase-schema.sql` still supports that safer mode.

## 5. Login Behavior

- Donor login uses the email typed in the Donor Portal form.
- Admin Access accepts an email in Staff ID.
- If Staff ID is not an email, admin login uses `admin@redcross.test`.
- If Staff ID contains `super` or `sa-`, super admin login uses `superadmin@redcross.test`.

## 6. Run Locally

```powershell
cd "C:\Users\danje\OneDrive\Documents\RED CROSS BLOOD BANK\asthethic"
npm run dev -- -p 3002 -H 0.0.0.0
```

Open:

```txt
http://127.0.0.1:3002/
```
