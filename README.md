Full Next.js App scaffold with auth (email/password + Google OAuth placeholder), Prisma, Tailwind and simple file upload.
Deploy steps (summary):
1. Create a PostgreSQL database (Supabase/Neon/Railway).
2. Set DATABASE_URL in Vercel environment variables.
3. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET if using Google OAuth.
4. Upload project to GitHub and connect to Vercel.
5. In Vercel, set environment variables: DATABASE_URL, JWT_SECRET (random string).
6. On first deploy, run Prisma migrations locally or use the SQL provided in prisma_migration.sql.
