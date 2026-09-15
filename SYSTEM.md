# PIN Associate — System Documentation

> Last updated: September 2026  
> Maintainer: Development team  
> This document is the single source of truth for understanding, updating, and deploying the PIN Associate platform. Keep it current whenever the system changes.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Repository Structure](#2-repository-structure)
3. [Tech Stack](#3-tech-stack)
4. [Local Development Setup](#4-local-development-setup)
5. [Environment Variables](#5-environment-variables)
6. [Default Credentials](#6-default-credentials)
7. [Google OAuth Setup](#7-google-oauth-setup)
8. [Paystack Payment Setup](#8-paystack-payment-setup)
9. [Frontend — Page & Route Reference](#9-frontend--page--route-reference)
10. [How to Update Content](#10-how-to-update-content)
11. [Backend — API Reference](#11-backend--api-reference)
12. [Portal Access & Roles](#12-portal-access--roles)
13. [Admin Portal (Staff)](#13-admin-portal-staff)
14. [Cloudinary (Media Files)](#14-cloudinary-media-files)
15. [Database](#15-database)
16. [Deployment](#16-deployment)
17. [Common Tasks](#17-common-tasks)
18. [Placeholders to Replace Before Launch](#18-placeholders-to-replace-before-launch)

---

## 1. Overview

PIN Associate is a Nigerian professional services firm offering:

| Service Line | What it is |
|---|---|
| **ICAN/ACCA Tutoring** | Professional examination preparation for ICAN, ACCA, CITN, ATS, CISA, and Diploma in IFRS |
| **Business & Financial Consultancy** | Advisory, taxation, financial statements, audits, and asset review |
| **Corporate Training** | Bespoke financial intelligence and strategy training for organisations |

The platform consists of:
- A **public marketing website** (homepage + about, corporate, contact, payment pages)
- A **Student Portal** (fee balance, payment history, downloadable study materials)
- A **Client Portal** (engagement progress, downloadable deliverables)
- A **Training Portal** (programme enrollment, materials, payment status)
- A **Staff Admin Portal** (fee updates, document upload)
- A **Django REST API backend** serving all portals

---

## 2. Repository Structure

```
pin-ass/
├── pin-frontend/          ← Next.js 16 App Router frontend
│   ├── src/
│   │   ├── app/           ← Pages and route segments
│   │   │   ├── page.tsx                   Homepage
│   │   │   ├── about/page.tsx
│   │   │   ├── corporate/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── payment/page.tsx
│   │   │   └── portal/
│   │   │       ├── login/page.tsx
│   │   │       ├── register/page.tsx
│   │   │       ├── student/               Student portal
│   │   │       ├── client/                Client portal
│   │   │       └── training/              Training portal
│   │   ├── components/
│   │   │   ├── home/      ← All homepage sections
│   │   │   ├── layout/    ← Navbar, Footer, PageHero, GlobalWidgets
│   │   │   ├── portal/    ← Auth pages + shared PortalShell + all portal content
│   │   │   ├── about/
│   │   │   ├── corporate/
│   │   │   ├── contact/
│   │   │   ├── payment/
│   │   │   └── ui/        ← Reusable UI primitives
│   │   ├── data/          ← Pure TypeScript data files (no JSX)
│   │   │   ├── team.ts
│   │   │   └── achievements.ts
│   │   └── lib/
│   │       ├── auth.ts    ← JWT helpers, apiFetch, googleAuth
│   │       ├── config.ts  ← Re-exports from components/lib/config.ts
│   │       └── utils.ts   ← cn() classname helper
│   └── src/components/lib/
│       └── config.ts      ← SITE_CONFIG (WhatsApp, Paystack key, bank details, contact)
│
└── pinbackend/            ← Django 6 REST API
    ├── accounts/          ← Custom User model, JWT auth, Google OAuth
    ├── students/          ← StudentProfile, FeeRecord, FeeBalance, StudyMaterial
    ├── clients/           ← ClientEngagement, Deliverable
    ├── training/          ← TrainingEnrollment, TrainingMaterial, TrainingPayment
    └── pinbackend/        ← Django settings, root URLs
```

---

## 3. Tech Stack

### Frontend
| Tool | Version | Role |
|---|---|---|
| Next.js | 16.3.4 | Framework (App Router, server/client components) |
| React | 19.2.8 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling (CSS-first config via `@theme inline` in globals.css) |
| Framer Motion | 13 | Animations (restrained — key moments only) |
| Lucide React | 1.39 | Icons |

**No Shadcn/UI, no Radix, no React Query, no Zustand, no axios.** Everything is custom-built.

### Backend
| Tool | Version | Role |
|---|---|---|
| Django | 6.0 | Web framework |
| Django REST Framework | 3.18 | API layer |
| Simple JWT | 5.5 | JWT authentication |
| django-cors-headers | — | CORS |
| SQLite (dev) / PostgreSQL (prod) | — | Database |
| Cloudinary | — | Media file hosting |
| python-decouple | — | Environment variable management |

---

## 4. Local Development Setup

### Prerequisites
- Python 3.12+
- Node.js 20+
- npm

### Backend

```bash
cd pinbackend

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt \
            django-cors-headers python-decouple requests

# Run migrations
python manage.py migrate

# Create default accounts
python manage.py seed_defaults

# Start backend (runs on port 8000)
python manage.py runserver
```

### Frontend

```bash
cd pin-frontend

# Install dependencies
npm install

# Create .env.local (see Section 5)
cp .env.local.example .env.local   # or create manually

# Start frontend (runs on port 3000)
npm run dev
```

The site will be at **http://localhost:3000**  
The API will be at **http://localhost:8000**

---

## 5. Environment Variables

### Frontend — `pin-frontend/.env.local`

```env
# Backend API URL (no trailing slash)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Paystack public key — get from dashboard.paystack.com
# Use pk_test_... for development, pk_live_... for production
NEXT_PUBLIC_PAYSTACK_KEY=pk_test_REPLACE_WITH_YOUR_KEY

# Google OAuth Client ID — get from console.cloud.google.com
# See Section 7 for setup instructions
NEXT_PUBLIC_GOOGLE_CLIENT_ID=REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID
```

### Backend — `pinbackend/.env`

```env
SECRET_KEY=your-django-secret-key-here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Database (leave blank to use SQLite in dev)
# DATABASE_URL=postgres://user:password@localhost:5432/pinassociate

# Paystack secret key — get from dashboard.paystack.com
PAYSTACK_SECRET_KEY=sk_test_REPLACE_WITH_YOUR_KEY

# Google OAuth Client ID (same value as frontend)
GOOGLE_OAUTH_CLIENT_ID=REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID

# Cloudinary URL — get from cloudinary.com dashboard
# Format: cloudinary://api_key:api_secret@cloud_name
CLOUDINARY_URL=cloudinary://REPLACE_WITH_YOUR_CLOUDINARY_URL

# Email backend (set to SMTP config in production)
# EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
```

---

## 6. Default Credentials

These accounts are created by running `python manage.py seed_defaults`.

| Role | Email | Password |
|---|---|---|
| **Staff / Admin** | `admin@pinassociate.com` | `PINadmin2026!` |
| **Demo Student** | `student@pinassociate.com` | `PINstudent2026!` |
| **Demo Client** | `client@pinassociate.com` | `PINclient2026!` |

**⚠ Change all passwords before going to production:**

```bash
python manage.py changepassword admin@pinassociate.com
# — or —
python manage.py seed_defaults --force-update
```

The login page shows these credentials in a yellow notice panel during development. Remove that panel before launch by deleting the `{/* Default credentials notice */}` block in `LoginPageContent.tsx`.

---

## 7. Google OAuth Setup

### Step 1 — Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project named "PIN Associate"
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add **Authorised JavaScript origins**:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
7. Add **Authorised redirect URIs** (optional for this implementation — we use the implicit flow)
8. Click **Create** and copy the **Client ID**

### Step 2 — Add to environment variables

**Frontend** (`pin-frontend/.env.local`):
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

**Backend** (`pinbackend/.env`):
```env
GOOGLE_OAUTH_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

### Step 3 — Verify it works

1. Open `/portal/login` or `/portal/register`
2. The "Continue with Google" button should render (rendered by Google's script, not custom CSS)
3. Click it → Google sign-in popup → redirects to the appropriate portal

### How the flow works

```
User clicks "Continue with Google"
  → Google Identity Services popup
  → User approves
  → Google returns an ID token (credential string)
  → Frontend sends token to POST /api/auth/google/
  → Backend verifies token with Google's tokeninfo endpoint
  → Backend checks audience matches our Client ID
  → Backend finds or creates a User (email from Google profile)
  → Backend returns PIN JWT tokens (same format as email login)
  → Frontend stores tokens → redirects to portal
```

New Google users default to the **STUDENT** role unless the user selected "Consultancy Client" on the register page before clicking the Google button.

---

## 8. Paystack Payment Setup

1. Create a Paystack account at [paystack.com](https://paystack.com)
2. Get your **Test** public and secret keys from the Paystack dashboard
3. Add them to `.env.local` (frontend) and `.env` (backend)
4. The payment page loads the Paystack inline script from `https://js.paystack.co/v1/inline.js`
5. When a payment completes, Paystack calls the `callback` function with `{ reference }` — the frontend shows a success state with the reference number

**To switch from test to live:**
- Change `pk_test_...` to `pk_live_...` in frontend `.env.local`
- Change `sk_test_...` to `sk_live_...` in backend `.env`

**Bank transfer details** are configured in `pin-frontend/src/components/lib/config.ts` under `bankAccounts`. Update the three objects (student, client, training) with the real account details.

---

## 9. Frontend — Page & Route Reference

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Homepage (all 13+ sections) |
| `/about` | `src/app/about/page.tsx` | Company story, team, values |
| `/corporate` | `src/app/corporate/page.tsx` | Consultancy + training services |
| `/contact` | `src/app/contact/page.tsx` | Tabbed contact form |
| `/payment` | `src/app/payment/page.tsx` | Paystack + bank transfer |
| `/portal/login` | `src/app/portal/login/page.tsx` | JWT + Google sign-in |
| `/portal/register` | `src/app/portal/register/page.tsx` | Email + Google registration |
| `/portal/student` | `src/app/portal/student/page.tsx` | Student dashboard |
| `/portal/student/profile` | `src/app/portal/student/profile/page.tsx` | Student profile |
| `/portal/student/fees` | `src/app/portal/student/fees/page.tsx` | Fee balance + history |
| `/portal/student/materials` | `src/app/portal/student/materials/page.tsx` | Study material downloads |
| `/portal/client` | `src/app/portal/client/page.tsx` | Client dashboard |
| `/portal/client/profile` | `src/app/portal/client/profile/page.tsx` | Client profile |
| `/portal/client/deliverables` | `src/app/portal/client/deliverables/page.tsx` | Document downloads |
| `/portal/training` | `src/app/portal/training/page.tsx` | Training dashboard |
| `/portal/training/profile` | `src/app/portal/training/profile/page.tsx` | Trainee profile |
| `/portal/training/materials` | `src/app/portal/training/materials/page.tsx` | Training materials |
| `/portal/training/fees` | `src/app/portal/training/fees/page.tsx` | Payment status |
| `/admin-portal` | `src/app/admin-portal/page.tsx` | Staff internal tool (not linked publicly) |

---

## 10. How to Update Content

All content is in TypeScript data files — **no code changes needed** for most updates.

### Management Team (`src/data/team.ts`)

```typescript
// To add/update a team member:
{
  id: "unique-slug",
  name: "Full Name",
  role: "Job Title",
  quals: "ACA, ACCA",
  bio: "2–3 sentence bio.",
  initials: "AB",       // used as fallback avatar
  color: "#1E3A8A",     // avatar background color
  image: "https://res.cloudinary.com/..."  // add photo URL here
}
```
Add the entry to the `teamMembers` array. The homepage TeamSection and the /about page both automatically show the full array.

### Achievements & Awards (`src/data/achievements.ts`)

```typescript
{
  id: "unique-slug",
  year: "2025",
  title: "Award Name",
  body: "Description of the award or milestone.",
  image: "https://res.cloudinary.com/...",  // optional
  category: "award" | "milestone" | "recognition"
}
```

### Site-wide Config (`src/components/lib/config.ts`)

Update this file for:
- **WhatsApp number / group link** — change `whatsappNumber` or `whatsappGroupLink`
- **Bank account details** — update `bankAccounts.student`, `.client`, `.training`
- **Contact details** — update `contact.phone`, `.email`, `.address`, `.hours`

### Registration / Fee Table (`src/components/home/RegistrationSection.tsx`)

The fee table is defined in the `programmes` array near the top of the file. Update `fee` values each diet season.

### FAQ Section (`src/components/home/FAQSection.tsx`)

The `faqs` array near the top of the file. Add, remove, or edit questions and answers directly.

### Navigation Links

- **Navbar:** `src/components/layout/Navbar.tsx` — update `navLinks` or `programmes` arrays
- **Footer:** `src/components/layout/Footer.tsx` — update `programmes`, `services`, `portals`, `company` arrays

### Exam Diet Dates (`src/components/home/RegistrationSection.tsx`)

At the top of the file:
```typescript
const dietInfo = {
  diet: "November / December 2026",
  registrationDeadline: "31 October 2026",
  lecturesStart: "1 September 2026",
  examDates: "November – December 2026",
  status: "open",
};
```
Update these each diet season.

### Hero Background Slides (`src/components/home/HeroSection.tsx`)

The `bgSlides` array. Replace `src` values with new Cloudinary image URLs.

---

## 11. Backend — API Reference

Base URL: `http://localhost:8000` (development) / `https://api.yourdomain.com` (production)

All protected endpoints require: `Authorization: Bearer <access_token>`

### Auth (`/api/auth/`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register/` | None | Create new account |
| POST | `/api/auth/login/` | None | Email + password login → JWT |
| POST | `/api/auth/login/refresh/` | None | Refresh access token |
| POST | `/api/auth/logout/` | Required | Blacklist refresh token |
| GET/PATCH | `/api/auth/me/` | Required | Get/update own user profile |
| POST | `/api/auth/google/` | None | Google ID token → JWT |

**Register payload:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "password2": "SecurePass123!",
  "first_name": "Adaeze",
  "last_name": "Okonkwo",
  "phone_number": "+2348012345678",
  "role": "STUDENT"
}
```

**Login response:**
```json
{
  "access": "<jwt>",
  "refresh": "<jwt>",
  "user": { "id": "...", "email": "...", "role": "STUDENT", ... }
}
```

### Students (`/api/students/`)

| Method | Path | Role | Description |
|---|---|---|---|
| GET/PATCH | `/api/students/me/profile/` | STUDENT | Own profile |
| GET | `/api/students/me/fees/` | STUDENT | Confirmed payment records |
| GET | `/api/students/me/balance/` | STUDENT | Fee balance summary |
| GET | `/api/students/me/materials/` | STUDENT | Study materials for their programme |
| GET | `/api/students/staff/list/` | STAFF | All student profiles |
| GET/PATCH | `/api/students/staff/<id>/` | STAFF | Specific student |
| GET/PATCH | `/api/students/staff/<id>/balance/` | STAFF | Update fee balance |
| POST | `/api/students/staff/fee-record/` | STAFF | Record a payment |
| POST | `/api/students/staff/materials/upload/` | STAFF | Upload study material |
| DELETE | `/api/students/staff/materials/<id>/delete/` | STAFF | Delete study material |

### Clients (`/api/clients/`)

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/clients/me/engagements/` | CLIENT | Own engagement list |
| GET | `/api/clients/me/engagements/<id>/` | CLIENT/STAFF | Engagement detail + deliverables |
| GET | `/api/clients/me/deliverables/` | CLIENT | All own deliverables |
| GET/POST | `/api/clients/staff/engagements/` | STAFF | List / create engagements |
| GET/PATCH/DELETE | `/api/clients/staff/engagements/<id>/` | STAFF | Manage engagement |
| POST | `/api/clients/staff/deliverables/upload/` | STAFF | Upload document to engagement |
| DELETE | `/api/clients/staff/deliverables/<id>/delete/` | STAFF | Delete deliverable |

### Training (`/api/training/`)

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/training/me/enrollments/` | Any auth | Own enrollments |
| GET | `/api/training/me/enrollments/<id>/` | Any auth | Enrollment detail |
| GET | `/api/training/me/materials/` | Any auth | Materials for confirmed programmes |
| GET | `/api/training/me/payments/` | Any auth | Payment history |
| GET/POST | `/api/training/staff/enrollments/` | STAFF | List / create enrollments |
| GET/PATCH/DELETE | `/api/training/staff/enrollments/<id>/` | STAFF | Manage enrollment |
| POST | `/api/training/staff/materials/upload/` | STAFF | Upload training material |
| DELETE | `/api/training/staff/materials/<id>/delete/` | STAFF | Delete material |
| POST | `/api/training/staff/payments/` | STAFF | Record training payment |

---

## 12. Portal Access & Roles

The `User` model has three roles:

| Role | Assigned to | Portal access |
|---|---|---|
| `STUDENT` | Students on ICAN/ACCA/etc. programmes | `/portal/student/*` |
| `CLIENT` | Consultancy clients | `/portal/client/*` |
| `STAFF` | PIN Associate staff | `/admin-portal` + all API endpoints |

**Training participants** use the `STUDENT` role and access `/portal/training/*`.  
The portal shell detects the current path and renders the correct nav.

### Auth flow

```
1. User submits email/password OR Google credential
2. Backend verifies → issues access token (30 min) + refresh token (7 days)
3. Frontend stores tokens in localStorage (keys: pin_access, pin_refresh, pin_user)
4. apiFetch() attaches Bearer token to every request
5. On 401 → auto-refresh using refresh token
6. On refresh failure → clear tokens → redirect to /portal/login
```

---

## 13. Admin Portal (Staff)

URL: `/admin-portal` (not linked from public navigation)

Only users with `role = STAFF` can access this page. Non-staff users are redirected to their own portal automatically.

### What staff can do here

**Student Fees tab:**
- Search students by name, email, or registration number
- Expand any student to update their `total_fees_due` and add a staff note
- The backend automatically recalculates `balance_due` from confirmed payment records

**Client Documents tab:**
- Search client engagements by title
- Expand any engagement to upload a document
- Enter a Cloudinary URL (upload the file to Cloudinary first, paste the URL here)
- Select document type and mark as final or draft

**Training tab:**
- Links to the Django admin (`/admin/training/`) for full training management

### Django Admin

Full database management is available at `http://localhost:8000/admin/`.  
Log in with the staff superuser account (`admin@pinassociate.com` / `PINadmin2026!`).

The Django admin provides direct access to all models: Users, StudentProfiles, FeeRecords, ClientEngagements, Deliverables, TrainingEnrollments, and more.

---

## 14. Cloudinary (Media Files)

All uploaded files (study materials, deliverables, training materials) should be hosted on Cloudinary.

### Setup

1. Create an account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy `CLOUDINARY_URL`
3. Add it to `pinbackend/.env`

### Uploading files

Currently, files are uploaded directly through the Cloudinary dashboard or API, and the URL is then pasted into the admin portal or Django admin. To add direct upload from the admin portal in future, integrate Cloudinary's upload widget.

**Recommended folder structure on Cloudinary:**
```
pin-associate/
  study-materials/
    ican/
    acca/
    ...
  deliverables/
    <client-id>/
      <engagement-id>/
  training-materials/
    fin-intel/
    tax-updates/
    ...
  team-photos/
  site-images/
```

---

## 15. Database

### Development
SQLite (`pinbackend/db.sqlite3`) — no setup required.

### Production (PostgreSQL)

1. Create a PostgreSQL database
2. Install `psycopg2`: `pip install psycopg2-binary`
3. Install `dj-database-url`: `pip install dj-database-url`
4. Add to `pinbackend/.env`:
   ```env
   DATABASE_URL=postgres://username:password@host:5432/pinassociate
   ```
5. Uncomment the database config in `pinbackend/pinbackend/settings.py`:
   ```python
   import dj_database_url
   DATABASES = {"default": dj_database_url.config(conn_max_age=600)}
   ```
6. Run migrations: `python manage.py migrate`

### Migrations

Any time a model is changed:
```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 16. Deployment

### Frontend (Vercel — recommended)

1. Push repository to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Set **Root Directory** to `pin-frontend`
4. Add environment variables (see Section 5)
5. Deploy

### Backend (Railway, Render, or VPS)

**Railway / Render:**
1. Add `pinbackend/requirements.txt` with all dependencies
2. Set environment variables
3. Set start command: `python manage.py migrate && gunicorn pinbackend.wsgi`

**VPS (Ubuntu):**
```bash
# Install dependencies
pip install gunicorn psycopg2-binary dj-database-url whitenoise

# Collect static files
python manage.py collectstatic --noinput

# Run with gunicorn
gunicorn pinbackend.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

Use **nginx** as a reverse proxy in front of gunicorn.

### Production checklist

- [ ] Set `DEBUG=False` in `.env`
- [ ] Set a strong random `SECRET_KEY`
- [ ] Set `ALLOWED_HOSTS` to your actual domain
- [ ] Set `CORS_ALLOWED_ORIGINS` to your frontend domain
- [ ] Switch to PostgreSQL
- [ ] Configure Cloudinary
- [ ] Set Paystack live keys
- [ ] Change all default passwords (`python manage.py seed_defaults --force-update`)
- [ ] Remove the default credentials notice panel from `LoginPageContent.tsx`
- [ ] Set up HTTPS (Let's Encrypt)
- [ ] Configure email backend for password reset emails

---

## 17. Common Tasks

### Add a new team member

1. Open `pin-frontend/src/data/team.ts`
2. Add a new object to the `teamMembers` array
3. Upload their photo to Cloudinary and set the `image` field
4. The homepage and /about page update automatically

### Update exam diet dates and fees

1. Open `pin-frontend/src/components/home/RegistrationSection.tsx`
2. Update the `dietInfo` object at the top
3. Update the `programmes` fee table array

### Upload a study material for students

1. Upload the PDF/file to Cloudinary
2. Log in to the Django admin: `http://yourdomain.com/admin/`
3. Go to **Students → Study Materials → Add**
4. Fill in the title, programme, diet, type
5. Paste the Cloudinary URL into `cloudinary_url`
6. Save — the material immediately appears in the student portal

### Upload a deliverable for a client

**Via Admin Portal:**
1. Go to `/admin-portal`
2. Click the "Client Documents" tab
3. Search for the client's engagement
4. Click "Upload Document ↓"
5. Paste the Cloudinary URL and fill in the details

**Via Django Admin:**
1. Go to `http://yourdomain.com/admin/clients/clientengagement/`
2. Find the engagement
3. Scroll to the Deliverables inline
4. Add a new deliverable with the Cloudinary URL

### Update a student's fee balance

**Via Admin Portal:**
1. Go to `/admin-portal` → Student Fees tab
2. Search for the student
3. Click "Update Fees ↓"
4. Enter the new total fees due and an optional note
5. Save — balance is automatically recalculated

**Via Django Admin:**
1. Go to `http://yourdomain.com/admin/students/feebalance/`
2. Find the student's balance record
3. Update and save

### Create a new staff account

```bash
python manage.py createsuperuser
# or via Django admin: Users → Add User → set role to STAFF
```

### Reset a user's password

```bash
python manage.py changepassword user@example.com
```

### Run database migrations after a model change

```bash
cd pinbackend
python manage.py makemigrations
python manage.py migrate
```

---

## 18. Placeholders to Replace Before Launch

Search the codebase for `[PLACEHOLDER]` to find all items pending confirmation from PIN Associate.

| Location | What to replace |
|---|---|
| `src/data/team.ts` | Full names, credentials, and photos for all 4 team members |
| `src/data/achievements.ts` | Actual award names, descriptions, and images |
| `src/components/lib/config.ts` | Real phone number, email, office address, WhatsApp group link |
| `src/components/lib/config.ts` | Bank account details (3 categories: student, client, training) |
| `src/components/layout/Footer.tsx` | Social media profile URLs (currently all `href="#"`) |
| `pin-frontend/.env.local` | `NEXT_PUBLIC_PAYSTACK_KEY` — real Paystack public key |
| `pin-frontend/.env.local` | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — Google OAuth client ID |
| `pinbackend/.env` | `PAYSTACK_SECRET_KEY`, `GOOGLE_OAUTH_CLIENT_ID`, `CLOUDINARY_URL` |
| `src/components/portal/LoginPageContent.tsx` | Remove the yellow default credentials notice panel |
| `pinbackend/pinbackend/settings.py` | Replace SQLite with PostgreSQL for production |
| All contact info | Replace `+234 800 000 0000` and `info@pinassociates.com.ng` with real values |

---

*End of documentation. Update this file whenever the system changes.*
