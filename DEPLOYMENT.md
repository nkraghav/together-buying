# Deployment Guide

This guide covers deploying GroupBuy SaaS to production on Vercel.

## Pre-Deployment Checklist

### 1. Database Setup

Set up a production PostgreSQL database:

**Recommended providers:**
- **Supabase** (Free tier available) - https://supabase.com
- **Neon** (Generous free tier) - https://neon.tech
- **PlanetScale** (MySQL alternative) - https://planetscale.com
- **AWS RDS** (Enterprise) - https://aws.amazon.com/rds/

**Steps:**
1. Create a new database
2. Copy the connection string
3. Update `DATABASE_URL` in your environment variables

### 2. Environment Variables

Prepare all required environment variables (see `ENV.md` for details):

**Required:**
- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

**Optional but recommended:**
- OAuth provider credentials (Google, GitHub)
- Email service (SendGrid)
- SMS service (Twilio)
- Storage (S3)

### 3. Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Deploying to Vercel

### Method 1: Deploy from GitHub (Recommended)

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure project:**
   - Framework Preset: **Next.js**
   - Build Command: `prisma generate && next build`
   <!-- - Build Command: `npx prisma generate && next build` -->
   <!-- - Build Command: `npx prisma generate --schema=prisma/schema.prisma && next build` -->
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Add environment variables:**
   - Click "Environment Variables"
   - Add all required variables (from `.env`)
   - Make sure to select appropriate environments (Production, Preview, Development)

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://<project-name>.vercel.app`

### Method 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Post-Deployment Steps

### 1. Run Database Migrations

Vercel doesn't run migrations automatically. You have two options:

**Option A: Run locally against production DB**
```bash
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

**Option B: Add to build command (not recommended for production)**
```bash
npx prisma generate && npx prisma migrate deploy && next build
```

### 2. Seed Initial Data (Optional)

For production, you typically don't seed data. But if needed:

```bash
DATABASE_URL="your-production-url" npm run prisma:seed
```

### 3. Configure Custom Domain

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` to your custom domain

### 4. Set up Monitoring

**Vercel Analytics:**
1. Go to project settings → Analytics
2. Enable Web Analytics and Speed Insights

**Sentry (Error Tracking):**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Add to environment variables:
```env
SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
```

### 5. Test Production Deployment

Test critical flows:
- [ ] Sign up / Sign in
- [ ] Browse projects
- [ ] Join a group
- [ ] Payment flow (use Stripe test mode first)
- [ ] Partner dashboard access
- [ ] Admin dashboard access

### 6. Switch Stripe to Live Mode

Once testing is complete:

1. Go to Stripe Dashboard
2. Toggle to "Live mode"
3. Get new API keys
4. Update environment variables:
   - `STRIPE_SECRET_KEY` (starts with `sk_live_`)
   - `STRIPE_PUBLISHABLE_KEY` (starts with `pk_live_`)
5. Update webhook endpoint
6. Copy new `STRIPE_WEBHOOK_SECRET`

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Commits to `main` branch
- **Preview**: Pull requests and other branches

### GitHub Actions Integration

The included `.github/workflows/ci.yml` will:
1. Run tests on every PR
2. Build the application
3. Deploy preview to Vercel
4. Deploy to production on merge to main

**Required GitHub Secrets:**
- `VERCEL_TOKEN` - From https://vercel.com/account/tokens
- `VERCEL_ORG_ID` - From Vercel project settings
- `VERCEL_PROJECT_ID` - From Vercel project settings

## Database Migrations in Production

### Best Practices

1. **Never run migrations automatically in build**
2. **Always backup before migrations**
3. **Test migrations in staging first**
4. **Use migration scripts for data changes**

### Migration Workflow

```bash
# 1. Create migration locally
npm run prisma:migrate

# 2. Test locally
# 3. Commit migration files
git add prisma/migrations
git commit -m "Add migration: <description>"

# 4. Push to GitHub (triggers CI/CD)
git push

# 5. After deployment, run migration manually
DATABASE_URL="production-url" npx prisma migrate deploy
```

## Scaling Considerations

### Database

**Connection Pooling:**

For better performance, use connection pooling:

```env
# Direct connection (for migrations)
DATABASE_URL="postgresql://..."

# Pooled connection (for app)
DATABASE_URL="postgresql://...?pgbouncer=true"
```

**Read Replicas:**

For high traffic, set up read replicas:
```typescript
// lib/prisma.ts
export const prismaRead = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_READ_URL } }
});
```

### Caching

Implement caching for:
- Project listings
- Static content
- User sessions

```typescript
// Example with Redis
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});
```

### CDN for Static Assets

Use Vercel's built-in CDN or external:
- Cloudflare CDN
- AWS CloudFront
- Cloudinary for images

## Monitoring & Observability

### Essential Monitoring

1. **Vercel Dashboard** - Basic metrics
2. **Sentry** - Error tracking
3. **LogRocket** - Session replay
4. **Datadog** - APM (Enterprise)

### Key Metrics to Monitor

- Response time (p95, p99)
- Error rate
- Database query performance
- API endpoint latency
- Stripe webhook success rate

### Alerts

Set up alerts for:
- High error rate (>1%)
- Slow response time (>2s)
- Failed payments
- Database connection issues

## Security Checklist

- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables secured
- [ ] Rate limiting implemented
- [ ] CORS configured properly
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS protection (Next.js handles this)
- [ ] CSRF protection
- [ ] Regular dependency updates
- [ ] Security headers configured

## Rollback Procedure

If deployment fails:

1. **Via Vercel Dashboard:**
   - Go to Deployments
   - Find previous working deployment
   - Click "Promote to Production"

2. **Via CLI:**
   ```bash
   vercel rollback
   ```

3. **Via Git:**
   ```bash
   git revert HEAD
   git push
   ```

## Backup Strategy

### Database Backups

**Automated (Recommended):**
- Enable automatic backups in your database provider
- Retention: 7-30 days
- Test restore procedure monthly

**Manual:**
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Code Backups

- Primary: GitHub repository
- Secondary: Vercel deployment history
- Local: Regular git pulls

## Cost Optimization

### Vercel

- Free tier: Hobby projects
- Pro ($20/month): Production apps
- Enterprise: Custom pricing

### Database

- Supabase Free: 500MB, good for MVP
- Neon Free: 3GB, autoscaling
- Paid: ~$25-100/month for production

### Stripe

- No monthly fee
- 2.9% + $0.30 per transaction

### Total Estimated Costs

- **MVP**: $0-50/month
- **Small Business**: $100-300/month
- **Scale-up**: $500-2000/month

## Troubleshooting

### Build Failures

```bash
# Check build logs in Vercel dashboard
# Common issues:
# 1. Missing environment variables
# 2. TypeScript errors
# 3. Prisma generation failed
```

### Database Connection Issues

```bash
# Verify connection string
npx prisma db pull

# Check connection pooling
# Add ?connection_limit=10 to URL
```

### Webhook Failures

```bash
# Test webhook locally with Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Check webhook logs in Stripe Dashboard
```

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Stripe Docs: https://stripe.com/docs

## Checklist: Production Ready

- [ ] Database set up and migrations run
- [ ] All environment variables configured
- [ ] Stripe webhooks configured
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Monitoring set up
- [ ] Error tracking enabled
- [ ] Backup strategy implemented
- [ ] Security checklist completed
- [ ] Performance tested
- [ ] Payment flow tested (live mode)
- [ ] All critical features tested
- [ ] Team access configured
- [ ] Documentation updated

---

🚀 **Ready to deploy!** Follow this guide step by step and you'll have a production-ready deployment.

