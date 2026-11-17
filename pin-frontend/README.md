# 🎓 PIN Associate Education Platform - Frontend

> A comprehensive education management system for accounting and taxation professional certification courses.

## 📋 Project Overview

PIN Associate is a multi-portal education platform serving students, instructors, corporate training clients, and administrators. Built with Next.js 16.3.4, React, and TypeScript, featuring a modern, responsive dark-mode UI.

### Key Features

- **🎨 Modern UI/UX** - Glassmorphism design, smooth animations, full dark mode support
- **👨‍🎓 Student Portal** - Dashboard, assignments, classes, fees, practice exams, support
- **👨‍🏫 Instructor Portal** - Class management, grading, materials, student progress
- **🏢 Training Portal** - Corporate training programs, materials, certificates, fees
- **🎯 Admin CRM** - Advanced analytics, student/instructor management, communications, finance
- **💰 Payment Integration** - Paystack payment gateway with installment support
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile
- **🔒 Security First** - Comprehensive security headers, secure authentication

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_ORG/pin-associate-frontend.git
cd pin-associate-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials (see Environment Setup below)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔐 Environment Setup

The application requires environment variables for authentication, payments, and communications.

### Required Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/pinassociate"

# Authentication (Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET="your-64-character-secret"
NEXTAUTH_SECRET="your-64-character-secret"
NEXTAUTH_URL="http://localhost:3000"

# Paystack Payment Gateway (Get from https://dashboard.paystack.com/)
PAYSTACK_SECRET_KEY="sk_test_your_key_here"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_your_key_here"

# Email (Gmail App Password: https://myaccount.google.com/apppasswords)
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

**⚠️ NEVER commit your `.env` file to Git!**

See `.env.example` for complete configuration options.

## 🏗️ Project Structure

```
pin-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin CRM pages
│   │   ├── instructor/        # Instructor portal pages
│   │   ├── portal/            # Student & training portals
│   │   ├── api/               # API routes (payments, support)
│   │   └── (marketing pages)  # Landing, about, courses, etc.
│   ├── components/
│   │   ├── admin/             # Admin CRM components
│   │   ├── instructor/        # Instructor portal components
│   │   ├── portal/            # Student/training components
│   │   ├── landing/           # Marketing components
│   │   └── ui/                # Reusable UI components
│   ├── lib/                   # Utilities and mock data
│   │   ├── mockData files     # Mock data (replace with API calls)
│   │   ├── auth.ts            # Authentication logic
│   │   └── utils.ts           # Helper functions
│   └── styles/
│       └── globals.css        # Global styles and CSS variables
├── public/                    # Static assets
├── .env.example              # Environment variables template
└── next.config.ts            # Next.js configuration (security headers)
```

## 🎯 Available Portals

### Student Portal (`/portal/student`)
- Dashboard with course progress
- Assignments and submissions
- Class schedule and recordings
- Fee management and payment
- Practice exams
- Support chat (WhatsApp integration)

**Test Credentials:**
- Email: `student@pinassociate.com`
- Password: (Contact admin - previous credentials compromised)

### Instructor Portal (`/instructor`)
- Class management and scheduling
- Assignment grading
- Student progress tracking
- Learning materials upload

**Test Credentials:**
- Email: `instructor@pinassociate.com`
- Password: (Contact admin)

### Training Portal (`/portal/training`)
- Corporate training programs
- Certificate management
- Training materials
- Fee tracking

**Test Credentials:**
- Email: `client@pinassociate.com`
- Password: (Contact admin)

### Admin CRM (`/admin`)
- Advanced analytics dashboard
- Student and instructor management
- Multi-channel communications (Email/SMS/WhatsApp)
- Class and course management
- Finance and reports
- Settings and configuration

**Test Credentials:**
- Email: `admin@pinassociate.com`
- Password: (Contact admin)

## 🛠️ Development

### Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Mock Data

Currently, the application uses mock data located in `src/lib/mock*.ts` files. To integrate with a real backend:

1. Replace mock data imports with API calls
2. Update authentication in `src/lib/auth.ts`
3. Configure backend URL in `.env`

See `src/lib/mockData.ts` comments for API integration instructions.

## 🔒 Security

This application implements comprehensive security measures:

- ✅ **Security Headers** - HSTS, CSP, X-Frame-Options, etc.
- ✅ **Authentication** - JWT-based with secure session management
- ✅ **Payment Security** - Paystack integration with webhook verification
- ✅ **Input Validation** - TypeScript type safety throughout
- ✅ **Environment Variables** - Sensitive data never in code
- ✅ **Fail-Closed Pattern** - Missing configs throw errors, never use defaults

**Important Security Notes:**
- Previous test credentials were compromised and removed from repository
- Always change default passwords before deployment
- Never commit `.env` file to version control
- Rotate secrets regularly (every 90 days minimum)

See `SECURITY_FIXES_SUMMARY.md` for detailed security audit results.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Important:** Configure environment variables in Vercel dashboard, NOT in code!

See `DEPLOYMENT_READY_CHECKLIST.md` for complete deployment instructions.

### Environment Requirements

- **Production:** Set all environment variables in hosting platform
- **Test Mode:** Automatically disabled when `NODE_ENV=production`
- **Paystack Keys:** Must be configured, no default fallbacks

## 📊 Features by Portal

### Student Features
- ✅ Real-time progress tracking
- ✅ Assignment submission and grading
- ✅ Video class recordings (YouTube integration)
- ✅ Fee payment with installments
- ✅ Practice exam system
- ✅ AI support chatbot

### Instructor Features
- ✅ Class scheduling with Google Meet links
- ✅ Assignment creation and grading
- ✅ Student progress analytics
- ✅ Materials management
- ✅ Attendance tracking

### Admin Features
- ✅ SVG-based charts (zero external dependencies)
- ✅ Multi-channel communications system
- ✅ Advanced student/instructor management
- ✅ Finance dashboard with analytics
- ✅ Report generation
- ✅ User and permission management

## 🎨 Design Features

- **Dark Mode:** Full support with localStorage persistence
- **Responsive:** Mobile-first design, works on all screen sizes
- **Glassmorphism:** Modern UI with frosted glass effects
- **Animations:** Smooth transitions and micro-interactions
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation
- **Color Scheme:** CSS variables for easy theme customization

## 🔧 Technology Stack

- **Framework:** Next.js 16.3.4 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Icons:** Lucide React
- **Charts:** Custom SVG (no external libraries)
- **Authentication:** JWT with NextAuth patterns
- **Payments:** Paystack
- **Deployment:** Vercel

## 📚 Documentation

- `DEPLOYMENT_READY_CHECKLIST.md` - Step-by-step deployment guide
- `SECURITY_FIXES_SUMMARY.md` - Security audit and fixes
- `ARCHITECTURE.md` - System architecture (if available)
- `.env.example` - Environment variable documentation

## 🐛 Known Issues / Limitations

- **Mock Data:** Application currently uses mock data. Backend integration required for production.
- **WhatsApp Integration:** Requires WhatsApp Business API setup (see `.env.example`)
- **Email Sending:** Requires SMTP configuration (Gmail App Password recommended)
- **Video Upload:** Uses YouTube embeds; native video hosting not implemented

## 🤝 Contributing

This is a private organizational project. For access or questions:

1. Contact project administrator
2. Review security guidelines in `SECURITY_FIXES_SUMMARY.md`
3. Follow TypeScript and React best practices
4. Test all changes in dark mode
5. Ensure responsive design on mobile

## 📄 License

Proprietary - PIN Associate Education Platform
© 2026 PIN Associate. All rights reserved.

## 🆘 Support

For technical issues or deployment questions:
- Review `DEPLOYMENT_READY_CHECKLIST.md`
- Check Next.js docs: https://nextjs.org/docs
- Contact: [Your Support Contact]

---

**Build Status:** ✅ Production Ready
**Last Security Audit:** November 2026
**Next.js Version:** 16.3.4
