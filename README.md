# 🆘 SOS Connection

**Emergency Internet Repair Service Platform** - Connect customers with technicians in under 2 hours.

Premium French web application with Stripe pre-authorization, built with Hono.js, React, and PostgreSQL.

---

## 🎯 What Is This?

SOS Connection is a **pay-only-if-fixed** emergency internet repair service for Paris & Île-de-France.

**How it works:**
1. Customer submits SOS request with problem details
2. €50 pre-authorization hold via Stripe (not charged yet)
3. Technician arrives within 2 hours
4. If fixed → Admin captures payment (€50 charged)
5. If not fixed → Pre-authorization released (€0 charged)

---

## ✨ Features

### Customer-Facing
- 🎨 **Premium Landing Page** - Modern French UI with hero, stats, form
- 📝 **SOS Request Form** - Validated form with Stripe integration
- ✅ **Success Page** - Confirmation with request details & progress tracking
- ⭕ **Cancel Page** - Reassuring message when payment is canceled
- 📱 **Fully Responsive** - Mobile, tablet, desktop optimized

### Admin Dashboard
- 🔐 **Secure Login** - JWT authentication with remember me
- 📊 **Request Management** - View all SOS requests with filters
- 💳 **Payment Control** - Capture or cancel pre-authorized payments
- 📈 **Real-time Stats** - Status counts and request tracking
- 🎯 **Status Filtering** - Filter by pending, assigned, completed, etc.

### Technical
- ⚡ **Fast Backend** - Hono.js API on Bun runtime
- 🗄️ **PostgreSQL Database** - Prisma ORM for type-safe queries
- 💳 **Stripe Integration** - Pre-authorization (manual capture)
- 🔒 **Secure Auth** - JWT tokens + httpOnly cookies
- 🪝 **Webhook Support** - Stripe event handling
- ✅ **Validation** - Zod schemas on frontend & backend

---

## 🚀 Quick Start

Get running in 5 minutes! Follow the **[QUICK_START.md](./QUICK_START.md)** guide.

### TL;DR

```bash
# Backend
cd backend
npm install
# Create .env (see QUICK_START.md)
npx prisma db push
npm run dev

# Frontend (new terminal)
cd frontend
npm install
# Create .env (see QUICK_START.md)
npm run dev
```

Visit: http://localhost:5173

---

## 📁 Project Structure

```
sos/
├── backend/                    # Hono.js API
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   │   ├── auth.ts       # Admin login
│   │   │   ├── payment.ts    # Checkout creation
│   │   │   ├── admin.ts      # Capture/cancel/list
│   │   │   └── webhook.ts    # Stripe events
│   │   ├── services/          # Business logic
│   │   ├── controllers/       # Request handlers
│   │   ├── lib/              # Utilities (prisma, logger)
│   │   └── schemas/          # Zod validation
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── tests/                # Integration tests
│
└── frontend/                  # React + Vite
    ├── src/
    │   ├── pages/            # Main pages
    │   │   ├── LandingPage.tsx
    │   │   ├── SuccessPage.tsx
    │   │   ├── CancelPage.tsx
    │   │   └── admin/
    │   │       ├── LoginPage.tsx
    │   │       └── DashboardPage.tsx
    │   ├── components/        # Reusable UI
    │   │   ├── Hero.tsx
    │   │   ├── SOSForm.tsx
    │   │   ├── HowItWorks.tsx
    │   │   ├── FAQ.tsx
    │   │   └── Footer.tsx
    │   ├── services/          # API clients
    │   ├── contexts/          # React context (auth)
    │   └── types/            # TypeScript interfaces
    └── public/               # Static assets
```

---

## 🛠️ Tech Stack

### Backend
- **[Hono.js](https://hono.dev/)** - Ultra-fast web framework
- **[Bun](https://bun.sh/)** - Fast JavaScript runtime
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Robust database
- **[Stripe](https://stripe.com/)** - Payment processing
- **[Pino](https://github.com/pinojs/pino)** - Fast logging
- **[Zod](https://zod.dev/)** - Schema validation

### Frontend
- **[React 18](https://react.dev/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Axios](https://axios-http.com/)** - HTTP client
- **[Lucide React](https://lucide.dev/)** - Icon library

---

## 📊 Database Schema

```prisma
model SOSRequest {
  id              String    @id @default(cuid())
  name            String
  phone           String
  email           String
  address         String
  operator        String
  connectionType  String
  delay           String
  details         String
  status          SOSStatus @default(PENDING)
  stripeSessionId String?   @unique
  paymentIntentId String?   @unique
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum SOSStatus {
  PENDING
  ASSIGNED
  COMPLETED
  FAILED
  CANCELED
}
```

---

## 🔌 API Endpoints

### Public Routes
- `GET /health` - Health check
- `POST /checkout` - Create Stripe session
- `GET /checkout/:id` - Get session details
- `POST /webhook/stripe` - Stripe events

### Auth Routes
- `POST /auth/login` - Admin login

### Protected Admin Routes
- `GET /admin/requests?status=` - List requests
- `POST /admin/capture` - Capture payment
- `POST /admin/cancel` - Cancel payment

---

## 🎨 Design System

### Colors
- **Background**: `#F4F7FB` (light gray)
- **Navy**: `#0A1733` (text primary)
- **Navy Dark**: `#0B1A3B` (buttons, cards)
- **Electric Blue**: `#2E5BFF` (accent, CTAs)

### Typography
- **Titles**: Space Grotesk (bold, modern)
- **Body**: Inter (clean, readable)

### Components
- Rounded corners (8-16px radius)
- Soft shadows for depth
- Smooth transitions (200ms)
- Hover effects on interactive elements

---

## 🧪 Testing

See **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** for:
- End-to-end testing scenarios
- Integration testing steps
- Troubleshooting guide
- Database inspection commands

### Quick Test

```bash
# Test backend health
curl http://localhost:4242/health

# Test admin login
curl -X POST http://localhost:4242/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

---

## 🔐 Security

- ✅ JWT authentication for admin routes
- ✅ httpOnly cookies for session security
- ✅ CORS configuration
- ✅ Input validation (Zod schemas)
- ✅ SQL injection prevention (Prisma)
- ✅ Stripe webhook signature verification
- ✅ Environment variable configuration

**⚠️ Production Checklist:**
- Change `ADMIN_PASSWORD` to strong password
- Use production Stripe keys (`sk_live_...`)
- Set strong `AUTH_JWT_SECRET`
- Enable HTTPS
- Configure proper CORS origins
- Set up rate limiting
- Enable logging & monitoring

---

## 🚀 Deployment

### Backend (Railway, Render, Fly.io)

```bash
cd backend
npm run build
# Set environment variables in platform
# Run: npm start
```

### Frontend (Vercel, Netlify)

```bash
cd frontend
npm run build
# Deploy dist/ folder
# Set VITE_API_URL environment variable
```

### Database

Use managed PostgreSQL:
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)
- [Render](https://render.com/)

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get running in 5 minutes
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Complete testing guide
- **[frontend/README.md](./frontend/README.md)** - Frontend documentation
- **[frontend/SETUP.md](./frontend/SETUP.md)** - Frontend setup details

---

## 🤝 Contributing

This is a complete, production-ready project. To extend:

1. **Add Features**:
   - SMS notifications (Twilio)
   - Email confirmations (SendGrid)
   - Real-time updates (WebSockets)
   - Technician tracking (Google Maps)
   - File uploads (photos of issue)

2. **Improve UI**:
   - Add animations (Framer Motion)
   - Dark mode toggle
   - Multi-language support (i18n)

3. **Enhance Admin**:
   - Analytics dashboard
   - Export to CSV
   - Technician management
   - Revenue tracking

---

## 📄 License

Proprietary - SOS Connection © 2025

---

## 🆘 Support

For issues or questions:
- Email: support@sos-connection.fr
- Check **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** for troubleshooting

---

## 🎉 Credits

Built with:
- ⚡ Bun & Hono.js for blazing-fast backend
- ⚛️ React & Vite for modern frontend
- 💳 Stripe for secure payments
- 🎨 Tailwind CSS for beautiful design

**Made with ❤️ for emergency internet repair services in Paris**

---

**Ready to get started?** → See **[QUICK_START.md](./QUICK_START.md)** 🚀

