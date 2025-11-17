# GroupBuy SaaS - Real Estate Group Buying Platform

A production-ready, multi-tenant SaaS platform built with Next.js that enables collective purchasing of real estate projects. Users can form or join groups to negotiate bulk discounts with developers.

## 🚀 Features

- **Multi-Tenant Architecture**: Isolated data per tenant with role-based access control
- **Group Buying**: Create and join purchase groups for collective negotiation
- **Secure Payments**: Stripe integration with escrow functionality
- **Real-Time Updates**: Live group status and negotiation tracking
- **Project Management**: Complete CRUD for real estate projects and inventory
- **Analytics Dashboard**: Partner and admin dashboards with metrics
- **Authentication**: NextAuth.js with email/password and OAuth support
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: Server-side rendering with meta tags
- **Type-Safe**: Full TypeScript implementation with Prisma ORM

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe
- **Styling**: Tailwind CSS 4
- **Testing**: Jest + React Testing Library + Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 21.x or higher
- PostgreSQL 14+ database
- Stripe account for payments
- npm or yarn package manager

## 🏗 Installation

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd together-buying
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/groupbuy_saas"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Additional services
SENDGRID_API_KEY=""
TWILIO_ACCOUNT_SID=""
```

### 3. Database Setup

Generate Prisma Client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Seed Database

Populate the database with sample data (2 tenants, 4 projects, groups):

```bash
npm run prisma:seed
```

**Test Accounts Created:**
- Admin: `admin@realestate-marketplace.com` / `password123`
- Organizer: `organizer@realestate-marketplace.com` / `password123`
- Buyer: `buyer1@example.com` / `password123`

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
together-buying/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth endpoints
│   │   │   ├── projects/     # Project CRUD
│   │   │   ├── groups/       # Group management
│   │   │   ├── payments/     # Payment intents
│   │   │   └── webhooks/     # Stripe webhooks
│   │   ├── projects/         # Project pages
│   │   ├── groups/           # Group pages
│   │   ├── dashboard/        # User dashboard
│   │   ├── partner/          # Partner dashboard
│   │   └── admin/            # Admin dashboard
│   ├── components/           # React components
│   ├── lib/                  # Utilities
│   │   ├── prisma.ts         # Prisma client
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── stripe.ts         # Stripe helpers
│   │   ├── rbac.ts           # Role-based access control
│   │   └── utils.ts          # Utility functions
│   └── types/                # TypeScript types
├── tests/                    # Test files
│   ├── unit/                 # Jest unit tests
│   └── e2e/                  # Playwright E2E tests
└── .github/
    └── workflows/            # CI/CD pipelines
```

## 🗄 Database Schema

The database includes the following main models:

- **Tenant**: Multi-tenant isolation
- **User**: Authentication with roles (BUYER, ORGANIZER, PARTNER_ADMIN, SUPER_ADMIN)
- **Project**: Real estate projects with inventory
- **Group**: Purchase groups with status tracking
- **GroupMember**: Group membership and commitments
- **Transaction**: Payment records
- **Offer**: Negotiation offers and counter-offers
- **CaseStudy** & **Article**: Content management

View full schema: `prisma/schema.prisma`

## 🔐 Authentication & Authorization

### Roles

1. **BUYER**: Browse projects, join groups, make payments
2. **ORGANIZER**: Create/manage groups, access analytics
3. **PARTNER_ADMIN**: Full tenant management, user management
4. **SUPER_ADMIN**: Platform-wide access, tenant management

### Signing In

```typescript
import { signIn } from 'next-auth/react';

await signIn('credentials', {
  email: 'user@example.com',
  password: 'password',
});
```

## 💳 Payment Flow

1. User joins a group
2. Frontend calls `/api/payments/intent` with group and amount
3. Stripe PaymentIntent is created
4. User completes payment on frontend
5. Webhook receives payment confirmation
6. Transaction and GroupMember records are updated

### Testing Payments

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Failure: `4000 0000 0000 0002`

## 🧪 Testing

### Unit Tests

```bash
npm run test
npm run test:watch
```

### E2E Tests

```bash
npx playwright install  # First time only
npm run test:e2e
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Vercel will automatically:
- Build the application
- Run database migrations (configure in build settings)
- Deploy to production

### Database Migrations

For production, use:

```bash
npx prisma migrate deploy
```

## 📊 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations (dev)
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
npm test                 # Run Jest tests
npm run test:e2e         # Run Playwright tests
```

## 🔧 API Endpoints

### Projects

- `GET /api/projects` - List projects (with filters)
- `POST /api/projects` - Create project (Organizer+)
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project

### Groups

- `GET /api/groups` - List groups
- `POST /api/groups` - Create group (Organizer+)
- `GET /api/groups/[id]` - Get group details
- `PATCH /api/groups/[id]` - Update group
- `POST /api/groups/[id]/join` - Join group

### Payments

- `POST /api/payments/intent` - Create payment intent
- `POST /api/webhooks/stripe` - Stripe webhook handler

## 🎨 Customization

### Branding

Update branding in:
- `src/app/layout.tsx` - Metadata
- `src/components/Header.tsx` - Logo and navigation
- `tailwind.config.js` - Color scheme

### Multi-Tenancy

Each tenant has isolated data. To add a tenant:

```typescript
await prisma.tenant.create({
  data: {
    name: 'My Organization',
    slug: 'my-org',
    plan: 'professional',
  },
});
```

## 🐛 Troubleshooting

### Prisma Client not found

```bash
npm run prisma:generate
```

### Database connection issues

Check `DATABASE_URL` in `.env` and ensure PostgreSQL is running.

### Stripe webhook not working locally

Use Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue](#)
- Email: support@groupbuy-saas.com

## 🗺 Roadmap

- [ ] WhatsApp notifications
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered price prediction
- [ ] Video tours integration

---

Built with ❤️ using Next.js, TypeScript, and Prisma
