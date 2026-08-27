# Sign Wranglers

A Next.js app for requesting and returning campaign yard signs, with a password-protected admin dashboard for tracking each sign's status. Built for a specific county's primary election, but the candidate list, colors, and branding all live in config files so it can be adapted for a different region.

## Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/WTC-HD/Sign-Wranglers.git
   npm install
   ```
   `npm install` reads `package.json` and installs every dependency the project needs (Next.js, React, Supabase, Tailwind, Resend, etc.) — no need to install anything individually.

2. Create a [Supabase](https://supabase.com) project, and in it create a table named `signs` with these columns:

   | Column | Type |
   |---|---|
   | `name` | text |
   | `address` | text |
   | `email` | text |
   | `status` | text |
   | `pickup_requested` | bool |
   | `candidates` | jsonb |

   Supabase automatically adds `id` and `created_at` columns to every new table — you don't need to create those yourself.

3. Enable Row Level Security (RLS) on the `signs` table, with **no policies**. The app never uses the public/anon key to talk to Supabase — every route runs server-side using a service role key, which bypasses RLS by design. Leaving RLS on with zero policies means the anon key (the one that's ever exposed publicly) has no access at all.

4. Sign up for [Resend](https://resend.com) and get an API key. Note: this project currently ships with email-sending commented out (see `app/api/requests/route.ts` and `app/api/pickup/route.ts`) until a real sending domain is verified — `onboarding@resend.dev`, Resend's default sandbox address, can only deliver to the account owner, not real users. Uncomment those blocks once you've verified your own domain with Resend.

5. Copy `.env.example` to a new file named `.env.local`, and fill in real values:
   ```bash
   cp .env.example .env.local
   ```
   - `NEXT_PUBLIC_SUPABASE_URL` — from your Supabase project's API settings
   - `SUPABASE_SERVICE_ROLE_KEY` — also from Supabase's API settings (the `secret`/`service_role` key, **not** the public one)
   - `RESEND_API_KEY` — from your Resend dashboard
   - `ADMIN_PASSWORD` — pick your own password for the admin dashboard

6. Customize for your own election:
   - `app/config/site.ts` — site name, tab title, and description
   - `app/config/races.ts` — the candidates, races, and ballot measures shown in the dropdown
   - `app/globals.css` — the `:root` block at the top defines the color palette (`--brand-primary`, `--brand-accent`, etc.) if you want different colors than the default

7. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see it.

## Admin dashboard

Visit `/admin/login` and enter your `ADMIN_PASSWORD` to reach `/admin` — a dashboard listing every sign request/pickup, with buttons to move each one through its status (`requested`/`pickup_requested` → `enroute` → `delivered`/`picked_up`).

## Deploying

This project deploys cleanly to [Vercel](https://vercel.com):

1. Push your repo to GitHub.
2. On Vercel, **Add New Project** and import the GitHub repo — it auto-detects Next.js.
3. Add the same four environment variables from `.env.local` in Vercel's project settings during import.
4. Deploy. Every future `git push` to your main branch automatically triggers a new deployment.
