# Environment Variables Guide

This document describes all environment variables used in GroupBuy SaaS.

## Required Variables

### Database

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

PostgreSQL connection string. For local development:
```
postgresql://postgres:postgres@localhost:5432/groupbuy_dev
```

For production, use your hosted database URL (e.g., Supabase, Neon, or AWS RDS).

### NextAuth.js

```env
NEXTAUTH_URL="http://localhost:3000"
```

The base URL of your application. Change to your production domain in production.

```env
NEXTAUTH_SECRET="your-secret-key-32-characters-long"
```

Generate with: `openssl rand -base64 32`

**IMPORTANT**: Keep this secret secure and never commit it to version control.

### Stripe

```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

Get these from your [Stripe Dashboard](https://dashboard.stripe.com/apikeys).

For local webhook testing, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Optional Variables

### OAuth Providers

#### Google OAuth

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

Setup at: https://console.cloud.google.com/apis/credentials

Authorized redirect URIs:
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

#### GitHub OAuth

```env
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

Setup at: https://github.com/settings/developers

Authorization callback URL:
- Development: `http://localhost:3000/api/auth/callback/github`
- Production: `https://yourdomain.com/api/auth/callback/github`

### Email (SendGrid)

```env
SENDGRID_API_KEY="SG...."
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```

Get API key from: https://app.sendgrid.com/settings/api_keys

### SMS (Twilio)

```env
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

Get credentials from: https://console.twilio.com

### Storage (S3-Compatible)

```env
S3_BUCKET_NAME="your-bucket-name"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-key"
S3_ENDPOINT="https://s3.amazonaws.com"  # Optional, for S3-compatible services
```

Works with:
- AWS S3
- Supabase Storage
- MinIO
- DigitalOcean Spaces
- Cloudflare R2

### Maps

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key"
```

Get from: https://console.cloud.google.com/apis/credentials

Enable these APIs:
- Maps JavaScript API
- Geocoding API
- Places API

### Analytics

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

Get from: https://analytics.google.com/

### App Configuration

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="GroupBuy SaaS"
```

### Feature Flags

```env
ENABLE_REALTIME="true"
ENABLE_WHATSAPP="false"
```

## Environment Files

- `.env` - Local development (gitignored)
- `.env.example` - Template with example values (committed)
- `.env.production` - Production secrets (gitignored)
- `.env.test` - Test environment (gitignored)

## Security Best Practices

1. **Never commit secrets** to version control
2. **Rotate keys regularly** (every 90 days recommended)
3. **Use different keys** for development and production
4. **Restrict API key permissions** to minimum required
5. **Monitor usage** through provider dashboards
6. **Use environment-specific keys** for each deployment

## Vercel Deployment

Add environment variables in Vercel dashboard:

1. Go to Project Settings
2. Click "Environment Variables"
3. Add each variable for Production, Preview, and Development
4. Click "Save"

## Troubleshooting

### "DATABASE_URL is not defined"

Ensure `.env` file exists in project root and contains `DATABASE_URL`.

### "Unauthorized" errors with Stripe

Verify `STRIPE_SECRET_KEY` is correct and starts with `sk_`.

### OAuth callback errors

Check redirect URIs match exactly (including http vs https).

### Email sending fails

Verify `SENDGRID_FROM_EMAIL` is verified in SendGrid dashboard.

## Example .env File

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/groupbuy_dev"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-key-change-in-production"

# Stripe
STRIPE_SECRET_KEY="sk_test_51..."
STRIPE_PUBLISHABLE_KEY="pk_test_51..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Optional: OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional: Email
SENDGRID_API_KEY=""
SENDGRID_FROM_EMAIL="noreply@localhost"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="GroupBuy SaaS"
```

