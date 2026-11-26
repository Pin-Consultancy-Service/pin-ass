# PIN Associate Education Platform

Professional education platform for PIN Consultancy Services, providing comprehensive training programs in Professional Indemnity Insurance, Accident Investigation, and related fields.

🌐 **Live Site:** [pinconsultancyservices.com](https://pinconsultancyservices.com)

## 🎯 Platform Overview

PIN Associate delivers industry-leading training programs through a modern, secure web platform featuring:

- **Public Website** - Course catalog, instructor profiles, testimonials, and enrollment
- **Student Portal** - Course materials, assignments, practice tests, and progress tracking  
- **Instructor Portal** - Content management, student monitoring, and communication tools
- **Admin Portal** - User management, payment tracking, and system administration

## 🏗️ Architecture

### Frontend (Next.js 15)
- **Framework:** Next.js 15 with App Router
- **UI:** React 19, Tailwind CSS, Framer Motion
- **Features:** Server-side rendering, dark mode, responsive design
- **Location:** `/pin-frontend`

### Backend (FastAPI)
- **Framework:** FastAPI with SQLAlchemy 2.0
- **Database:** PostgreSQL with Alembic migrations
- **Auth:** JWT-based authentication with bcrypt
- **Integrations:** Paystack payments, WhatsApp Business API
- **Location:** `/pin-backend`

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design.

## 🚀 Quick Start

### Frontend Development

```bash
cd pin-frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`

### Backend Development

```bash
cd pin-backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Runs on `http://localhost:8000`

## 📚 Documentation

- **[System Configuration](./SYSTEM.md)** - Environment setup and configuration
- **[Architecture Guide](./ARCHITECTURE.md)** - Technical architecture and design decisions
- **[Deployment Checklist](./docs/deployment/PRE_DEPLOYMENT_CHECKLIST.md)** - Pre-deployment verification
- **[Security Guide](./docs/deployment/SECURITY_PRE_PUSH_CHECKLIST.md)** - Security best practices
- **[Push Guide](./docs/deployment/PUSH_TO_GITHUB_GUIDE.md)** - Safe GitHub deployment workflow

### Frontend Documentation
- `/pin-frontend/SECURITY.md` - Frontend security implementation
- `/pin-frontend/AUTH.md` - Authentication flow
- `/pin-frontend/DEMO_MODE.md` - Demo mode features
- `/pin-frontend/SEO_IMPLEMENTATION_GUIDE.md` - SEO setup guide

### Backend Documentation  
- `/pin-backend/API_FLOW.md` - API endpoint documentation
- `/pin-backend/app/models/README.md` - Database models
- `/pin-backend/app/schemas/README.md` - API schemas

## 🔒 Security

This platform implements comprehensive security measures:

- ✅ JWT authentication with secure token rotation
- ✅ Role-based access control (RBAC)
- ✅ Input validation and sanitization
- ✅ HTTPS/TLS encryption
- ✅ CORS configuration
- ✅ Rate limiting and DDoS protection
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Secure payment integration (Paystack)

**Important:** Never commit `.env` files. Use `.env.example` templates with placeholder values only.

## 🎨 Features

### For Students
- Browse and enroll in courses
- Access course materials and resources
- Complete assignments and practice tests
- Track progress and certifications
- Manage payment plans

### For Instructors
- Create and manage course content
- Monitor student progress
- Grade assignments
- Communicate with students
- Generate reports

### For Administrators
- User management (students, instructors, clients)
- Payment and revenue tracking
- System configuration
- Bulk operations and imports
- Analytics and reporting

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form

**Backend:**
- FastAPI
- SQLAlchemy 2.0
- PostgreSQL
- Alembic
- Pydantic V2
- JWT Authentication

**DevOps:**
- Vercel (Frontend hosting)
- Railway/Render (Backend hosting)
- GitHub Actions (CI/CD)
- Cloudflare (DNS/CDN)

## 📦 Project Structure

```
pin-ass/
├── pin-frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and config
│   │   └── data/         # Static data
│   └── public/           # Static assets
├── pin-backend/          # FastAPI backend application  
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Auth and config
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic
│   └── migrations/       # Alembic migrations
└── docs/                 # Project documentation
    └── deployment/       # Deployment guides
```

## 🌟 Key Highlights

- **Modern Tech Stack** - Latest versions of Next.js, React, and FastAPI
- **Type Safety** - Full TypeScript coverage on frontend, Pydantic on backend
- **Performance** - Server-side rendering, optimized images, edge caching
- **SEO Optimized** - Dynamic metadata, sitemap, robots.txt, structured data
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark Mode** - System-aware theme switching
- **Accessibility** - WCAG 2.1 AA compliant
- **Security First** - Comprehensive security implementation
- **Developer Experience** - Hot reload, TypeScript, ESLint, Prettier

## 🤝 Contributing

This is a private project for PIN Consultancy Services. For access or contributions, contact the development team.

## 📝 License

Proprietary - © 2024 PIN Consultancy Services. All rights reserved.

## 📞 Support

For technical support or questions:
- **Website:** [pinconsultancyservices.com](https://pinconsultancyservices.com)
- **Email:** Contact through website form

---

**Built with ❤️ for PIN Consultancy Services**
