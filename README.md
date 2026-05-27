# AnimateUI Showcase

A premium React + Vite component showcase inspired by Watermelon UI, Aceternity UI, and Magic UI.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Supabase Auth, Database, and Storage
- React Syntax Highlighter

## Local Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ADMIN_EMAIL=you@example.com
```

## Supabase Setup

Run `supabase/schema.sql` in your Supabase SQL editor. Create a Google OAuth provider in Supabase Auth, then add your deployed Vercel URL as an allowed redirect URL.

Add your email to the database allowlist after running the schema:

```sql
insert into public.admin_users (email) values ('you@example.com');
```

The frontend falls back to mock components when Supabase variables are missing, so the UI remains previewable during local development.
