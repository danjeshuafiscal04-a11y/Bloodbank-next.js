# RedCross Blood Bank

Current architecture:

- Frontend: Next.js, TypeScript, Tailwind CSS, lucide-react, Recharts, Leaflet/OpenStreetMap
- Backend/data/auth/storage: Supabase free project
- Active app folder: `asthethic`

Laravel is not required for this website. The active website connects directly to Supabase from the Next.js app using only public browser-safe Supabase values.

## Project Structure

```txt
asthethic/             Next.js RedCross Blood Bank app
supabase-schema.sql    Supabase tables, RLS policies, seed data, storage policy, and Auth signup trigger
SUPABASE_SETUP.md      Supabase setup instructions
```

## Environment

Create or update `asthethic/.env.local`:

```txt
NEXT_PUBLIC_APP_NAME="RedCross Blood Bank"
NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR-PUBLIC-ANON-KEY"
```

Never add a Supabase service role key to any `NEXT_PUBLIC_*` variable.

## Run Locally

```powershell
cd "C:\Users\danje\OneDrive\Documents\RED CROSS BLOOD BANK\asthethic"
npm install
npm run dev -- -p 3002 -H 0.0.0.0
```

Open:

```txt
http://127.0.0.1:3002/
```

## Demo Accounts

Create these users in Supabase Auth:

```txt
donor@redcross.test
admin@redcross.test
superadmin@redcross.test
```

Passwords are stored only by Supabase Auth. Do not put passwords in SQL tables, localStorage, screenshots, or source files.

After creating the users, insert/update their roles in `profiles` using the SQL shown in `SUPABASE_SETUP.md`.
