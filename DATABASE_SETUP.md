# Database Setup Guide

You have **3 options** to get a PostgreSQL database running:

## Option 1: Supabase (Recommended - Easiest) ⭐

**Free tier includes:**
- 500 MB database
- Automatic backups
- No credit card required

**Setup (2 minutes):**

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub
4. Click "New Project"
5. Choose:
   - Name: `groupbuy-dev`
   - Database Password: (save this!) #kX-$hHz7J!fT&n5
   - Region: Closest to you
   - Plan: Free
6. Wait for database to be ready (~2 minutes)
7. Go to **Settings → Database**
8. Copy the **Connection String** (URI mode)
9. Update your `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```
10. Run migrations:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

## Option 2: Neon (Also Great) 🚀

**Free tier includes:**
- 3 GB storage
- Autoscaling
- Fast setup

**Setup:**

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project
4. Copy connection string
5. Update `.env` file
6. Run migrations

## Option 3: Fix Local PostgreSQL

Your local PostgreSQL has a shared memory issue. To fix:

```bash
# Check current kernel settings
sysctl kern.sysv.shmmax
sysctl kern.sysv.shmall

# If values are too low, increase them (requires sudo)
sudo sysctl -w kern.sysv.shmmax=4194304
sudo sysctl -w kern.sysv.shmall=1024

# Then start PostgreSQL
brew services restart postgresql@14

# Create database
createdb groupbuy_dev

# Run migrations
npm run prisma:migrate
npm run prisma:seed
```

## Current Status

✅ Prisma Client generated  
✅ Environment variables configured  
⏳ Database not running (need to choose option above)  
⏳ Migrations pending  
⏳ Seed data pending  

## Next Steps

1. Choose database option (Supabase recommended)
2. Update `DATABASE_URL` in `.env`
3. Run: `npm run prisma:migrate`
4. Run: `npm run prisma:seed`
5. Run: `npm run dev`
6. Visit: http://localhost:3000

## Quick Commands

```bash
# Check if database is accessible
npx prisma db pull

# Create tables
npm run prisma:migrate

# Add sample data
npm run prisma:seed

# Open database GUI
npm run prisma:studio

# Start dev server
npm run dev
```

## Test Accounts (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@realestate-marketplace.com | password123 |
| Organizer | organizer@realestate-marketplace.com | password123 |
| Buyer | buyer1@example.com | password123 |

---

**Need Help?** The easiest option is Supabase - it takes just 2 minutes to set up and works perfectly for development and production!

New Commit
