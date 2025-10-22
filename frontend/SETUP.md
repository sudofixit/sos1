# 🚀 Setup Guide - SOS Connection Frontend

## Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or pnpm

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Create Environment File

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:4242
```

For production:
```env
VITE_API_URL=https://your-api-domain.com
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Backend Configuration

Make sure your backend is running on `http://localhost:4242` (or update VITE_API_URL).

The backend should have these environment variables set:

```env
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
```

## Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## 🎨 Design Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Modern French UI with Space Grotesk & Inter fonts
- ✅ Premium color scheme (Navy + Electric Blue)
- ✅ Smooth animations and transitions
- ✅ Form validation with Zod
- ✅ Stripe Checkout integration
- ✅ Success/Cancel flow pages

## 📱 Tested Viewports

- Mobile: 375px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## 🔧 Troubleshooting

### CORS Errors

If you see CORS errors, make sure the backend has CORS enabled for your frontend URL.

### API Connection Issues

1. Check that backend is running on port 4242
2. Verify VITE_API_URL in .env
3. Check browser console for errors

### Stripe Redirect Issues

Make sure the backend's `FRONTEND_URL` matches your frontend URL exactly.

## 📦 Tech Stack

- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS
- React Router v6
- React Hook Form + Zod
- Axios
- Lucide React (Icons)

## 🎯 Pages Overview

### Landing Page (`/`)
- Hero section with CTA
- SOS Form with validation
- How It Works section
- FAQ accordion
- Footer

### Success Page (`/success`)
- Payment confirmation
- Request details display
- Next steps information

### Cancel Page (`/cancel`)
- Cancellation message
- Options to retry or go home

Enjoy building with SOS Connection! 🎉

