# PIN Associate Platform - Pre-Deployment Checklist

**Domain:** pinconsultancyservices.com  
**Deployment Date:** _________________  
**Deployment Platform:** Vercel

---

## ✅ CRITICAL SECURITY ITEMS (MUST DO BEFORE DEPLOYMENT)

### 1. Environment Variables Setup in Vercel
- [ ] Go to Vercel Project Settings → Environment Variables
- [ ] Add all variables from `.env.example` (DO NOT commit `.env` file)
- [ ] **Required Variables:**
  ```
  DATABASE_URL=your_production_database_url
  NEXTAUTH_SECRET=your_secure_secret_key_here
  NEXTAUTH_URL=https://pinconsultancyservices.com
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_live_paystack_public_key
  PAYSTACK_SECRET_KEY=your_live_paystack_secret_key
  NEXT_PUBLIC_API_BASE_URL=https://pinconsultancyservices.com/api
  NODE_ENV=production
  ```

### 2. Change ALL Compromised Passwords
**THESE PASSWORDS WERE EXPOSED IN GIT HISTORY - CHANGE IMMEDIATELY:**

- [ ] Admin Account
  - Old: `admin@pinassociate.com` / `PINadmin2026!`
  - New: Create strong password (min 16 chars, mixed case, numbers, symbols)
  - Update in production database

- [ ] Student Demo Account
  - Old: `student@pinassociate.com` / `PINstudent2026!`
  - New: Create strong password
  - Update in production database

- [ ] Client Demo Account
  - Old: `client@pinassociate.com` / `PINclient2026!`
  - New: Create strong password
  - Update in production database

### 3. Paystack Configuration
- [ ] Switch to **LIVE** Paystack keys (not test keys)
- [ ] Add `pinconsultancyservices.com` to Paystack whitelist domains
- [ ] Configure webhook URL: `https://pinconsultancyservices.com/api/payments/webhook`
- [ ] Test a small live payment transaction
- [ ] Verify callback URL works: `https://pinconsultancyservices.com/api/payments/callback`

### 4. Database Security
- [ ] Ensure production database has strong password
- [ ] Database accessible only from Vercel IP ranges
- [ ] SSL/TLS enabled for database connections
- [ ] Run all Alembic migrations: `alembic upgrade head`
- [ ] Backup production database before launch

---

## 🔍 TESTING CHECKLIST

### Pre-Launch Testing (Staging Environment)
- [ ] Test user registration flow
- [ ] Test login (all 3 roles: student, instructor, admin)
- [ ] Test password reset functionality
- [ ] Test payment flow (use Paystack test mode first)
- [ ] Test file uploads (profile pictures, documents)
- [ ] Test all admin dashboard features
- [ ] Test student portal (classes, payments, profile)
- [ ] Test instructor portal (class management, students)
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test dark mode on all pages
- [ ] Test all navigation links
- [ ] Test contact form submissions

### Cross-Browser Testing
- [ ] Chrome (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Firefox
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Performance Testing
- [ ] Run Lighthouse audit (target: 90+ on all metrics)
- [ ] Check page load times (target: < 3 seconds)
- [ ] Verify images are optimized
- [ ] Test under slow 3G connection

---

## 🌐 SEO & DOMAIN SETUP

### Domain Configuration
- [ ] Point domain `pinconsultancyservices.com` to Vercel
- [ ] Configure DNS records (A, AAAA, CNAME)
- [ ] Enable SSL certificate (Vercel auto-provisions)
- [ ] Set up `www` redirect to non-www (or vice versa)
- [ ] Verify domain propagation (use DNS checker tools)

### Google Search Console Setup
- [ ] Add property: `https://pinconsultancyservices.com`
- [ ] Verify ownership via DNS or HTML file
- [ ] Submit sitemap: `https://pinconsultancyservices.com/sitemap.xml`
- [ ] Submit `robots.txt` for crawling
- [ ] Request indexing for homepage and key pages

### Google Business Profile
- [ ] Create business listing
  - Name: PIN Associate Consultancy Services
  - Address: Lagos, Nigeria
  - Phone: (from contact info)
  - Website: https://pinconsultancyservices.com
  - Category: Educational Consultant
- [ ] Verify business ownership
- [ ] Add business hours
- [ ] Upload photos (office, logo, team)
- [ ] Add business description with keywords

### Analytics Setup
- [ ] Set up Google Analytics 4
- [ ] Add GA4 tracking code to `layout.tsx`
- [ ] Configure goals/conversions:
  - Application submissions
  - Payment completions
  - Registration form submissions
  - Contact form submissions
- [ ] Set up Google Tag Manager (optional)
- [ ] Test analytics tracking

### Social Media Integration
- [ ] Update Open Graph meta tags (already done)
- [ ] Create Twitter Card meta tags (already done)
- [ ] Share launch post on:
  - LinkedIn (professional network)
  - Facebook
  - Twitter/X
  - Instagram
- [ ] Update social media profiles with website link

---

## 📝 CONTENT VERIFICATION

### Critical Content Review
- [ ] Verify all dates are correct:
  - Lectures start: January 9, 2027
  - Registration deadline: February 14, 2027
  - Exam diet: May/June 2027
- [ ] Check all contact information is accurate
- [ ] Verify all email addresses are monitored
- [ ] Review all course descriptions
- [ ] Check all pricing information
- [ ] Verify team member bios and LinkedIn links
- [ ] Review legal pages (if applicable):
  - Privacy Policy
  - Terms of Service
  - Refund Policy

### Image & Media Review
- [ ] Verify all images load correctly
- [ ] Check image alt texts for accessibility
- [ ] Ensure logo displays properly (favicon)
- [ ] Test video embeds (YouTube classes)
- [ ] Verify no broken images

---

## 🛡️ SECURITY VERIFICATION

### Run Security Checks
- [ ] Run `.\verify-seo.ps1` (includes security checks)
- [ ] Check for exposed API keys in browser DevTools
- [ ] Verify no console.log statements in production
- [ ] Test CSP headers (Content Security Policy)
- [ ] Verify HSTS headers
- [ ] Check X-Frame-Options (clickjacking protection)
- [ ] Test rate limiting on API endpoints
- [ ] Verify CORS configuration

### Authentication & Authorization
- [ ] Test role-based access control
- [ ] Verify students can't access admin routes
- [ ] Verify instructors can't access admin routes
- [ ] Test session timeout
- [ ] Verify logout functionality
- [ ] Test "Remember Me" functionality
- [ ] Check password strength requirements

---

## 📊 MONITORING & MAINTENANCE

### Set Up Monitoring
- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (Sentry or similar)
- [ ] Configure uptime monitoring (UptimeRobot, Pingdom)
- [ ] Set up email alerts for downtime
- [ ] Monitor API endpoint response times
- [ ] Set up log aggregation

### Backup Strategy
- [ ] Configure automated database backups
- [ ] Test database restore procedure
- [ ] Document backup schedule
- [ ] Store backups in separate location

### Post-Launch Monitoring Plan
- [ ] Monitor error logs daily (first week)
- [ ] Check analytics daily (first week)
- [ ] Review user feedback channels
- [ ] Monitor payment processing success rates
- [ ] Check email deliverability
- [ ] Monitor page load times

---

## 📱 COMMUNICATION SETUP

### Email Configuration
- [ ] Configure professional email (e.g., info@pinconsultancyservices.com)
- [ ] Set up email forwarding
- [ ] Test contact form email delivery
- [ ] Test registration confirmation emails
- [ ] Test password reset emails
- [ ] Configure SMTP for transactional emails
- [ ] Add SPF, DKIM, DMARC records to DNS

### Customer Support Channels
- [ ] Set up dedicated support email
- [ ] Configure phone lines (if applicable)
- [ ] Set up WhatsApp Business (optional)
- [ ] Create FAQ page or knowledge base
- [ ] Train support staff on platform features

---

## 🚀 DEPLOYMENT STEPS

### Vercel Deployment Process
1. [ ] Connect GitHub repository to Vercel
2. [ ] Configure build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
3. [ ] Set all environment variables (see Section 1)
4. [ ] Deploy to production
5. [ ] Verify deployment success
6. [ ] Check deployment logs for errors

### Post-Deployment Verification
- [ ] Visit `https://pinconsultancyservices.com`
- [ ] Check SSL certificate is valid (green padlock)
- [ ] Test homepage loads correctly
- [ ] Run through critical user flows:
  - Register → Login → Browse Courses → Apply
  - Make test payment
  - Admin dashboard access
- [ ] Check all API endpoints respond correctly
- [ ] Verify database connections work
- [ ] Test file upload functionality
- [ ] Check email delivery works

### DNS & Domain Verification
- [ ] Run: `nslookup pinconsultancyservices.com`
- [ ] Run: `curl -I https://pinconsultancyservices.com`
- [ ] Check HTTPS redirect works (http → https)
- [ ] Check www redirect works (if configured)
- [ ] Verify domain propagation globally

---

## 📋 LEGAL & COMPLIANCE

### Legal Pages (Create if Missing)
- [ ] Privacy Policy (REQUIRED - handles user data)
- [ ] Terms of Service
- [ ] Cookie Policy (if using cookies)
- [ ] Refund/Cancellation Policy
- [ ] Acceptable Use Policy

### Compliance Checks
- [ ] GDPR compliance (if serving EU users)
- [ ] Data protection measures in place
- [ ] User consent for data collection
- [ ] Cookie consent banner (if applicable)

---

## 🎯 LAUNCH DAY CHECKLIST

### Morning of Launch
- [ ] Final database backup
- [ ] Final code review
- [ ] Check all team members are ready
- [ ] Prepare incident response plan
- [ ] Have rollback plan ready

### Launch Moment
- [ ] Deploy to production
- [ ] Monitor deployment logs
- [ ] Verify all systems operational
- [ ] Test critical paths immediately
- [ ] Send launch announcement

### First 24 Hours Post-Launch
- [ ] Monitor error logs continuously
- [ ] Check analytics for traffic patterns
- [ ] Monitor payment processing
- [ ] Respond to user feedback quickly
- [ ] Check email deliverability
- [ ] Monitor server performance
- [ ] Be ready for quick fixes

---

## 🔄 POST-LAUNCH TASKS (Week 1)

### Days 1-3
- [ ] Monitor all metrics closely
- [ ] Gather user feedback
- [ ] Fix any critical bugs immediately
- [ ] Update documentation based on issues found
- [ ] Check SEO indexing progress

### Days 4-7
- [ ] Analyze initial analytics data
- [ ] Review and optimize slow pages
- [ ] Gather team feedback on admin tools
- [ ] Plan first feature updates
- [ ] Create user onboarding improvements

### Week 2-4
- [ ] Submit site to educational directories
- [ ] Start content marketing (blog posts)
- [ ] Build backlinks for SEO
- [ ] Gather testimonials from early users
- [ ] Plan marketing campaigns

---

## 📞 EMERGENCY CONTACTS

**Technical Issues:**
- Developer: _________________
- Database Admin: _________________
- Hosting (Vercel): support@vercel.com

**Business Issues:**
- Project Manager: _________________
- Academic Director: _________________

**Third-Party Services:**
- Paystack Support: support@paystack.com
- Domain Registrar: _________________

---

## ✅ FINAL SIGN-OFF

**Pre-Deployment Review:**
- [ ] All critical items completed
- [ ] All testing passed
- [ ] All stakeholders approve
- [ ] Backup and rollback plan ready
- [ ] Team briefed on launch plan

**Approved By:**
- Technical Lead: _________________ Date: _______
- Project Manager: _________________ Date: _______
- Business Owner: _________________ Date: _______

---

## 📚 HELPFUL COMMANDS

### Build & Test Locally
```powershell
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run SEO verification
.\verify-seo.ps1
```

### Vercel CLI Commands
```powershell
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

### Database Commands
```bash
# Run migrations
alembic upgrade head

# Create backup
pg_dump -h hostname -U username dbname > backup.sql

# Restore backup
psql -h hostname -U username dbname < backup.sql
```

---

**Document Version:** 1.0  
**Last Updated:** November 25, 2026  
**Next Review:** After successful deployment
