import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:6tvL0HttVm7F2mnO@db.htloyjkapowawietftkr.supabase.co:5432/postgres';

async function seed() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL!');

    // Create donor
    const donorQuery = `
      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
      ) values (
        '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'donor@redcross.test', crypt('Donor123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Juan Dela Cruz"}', now(), now()
      ) returning id;
    `;
    const res1 = await client.query(donorQuery);
    console.log('Donor created:', res1.rows[0].id);

    // Create admin
    const adminQuery = `
      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
      ) values (
        '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'admin@redcross.test', crypt('Admin123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "RedCross Admin"}', now(), now()
      ) returning id;
    `;
    const res2 = await client.query(adminQuery);
    console.log('Admin created:', res2.rows[0].id);
    await client.query("UPDATE public.profiles SET role = 'admin' WHERE id = $1", [res2.rows[0].id]);

    // Create super admin
    const superQuery = `
      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
      ) values (
        '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'superadmin@redcross.test', crypt('Superadmin123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Alex Rivera"}', now(), now()
      ) returning id;
    `;
    const res3 = await client.query(superQuery);
    console.log('Super Admin created:', res3.rows[0].id);
    await client.query("UPDATE public.profiles SET role = 'super_admin' WHERE id = $1", [res3.rows[0].id]);

    console.log('All accounts created and roles updated successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

seed();
