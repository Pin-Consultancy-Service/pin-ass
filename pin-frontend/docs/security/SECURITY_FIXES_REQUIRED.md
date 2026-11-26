# 🚨 IMMEDIATE SECURITY FIXES REQUIRED

## ⚠️ CRITICAL - DO THESE NOW (BEFORE PUSHING TO GITHUB)

### 1. Replace .gitignore
```bash
# Backup current
mv .gitignore .gitignore.old

# Use secure version
mv .gitignore.SECURE .gitignore

# Verify
cat .gitignore
```

### 2. Replace .env.example
```bash
# Backup current
mv .env.example .env.example.old

# Use secure version
mv .env.example.SECURE .env.example

# Verify
cat .env.example
```

### 3. Fix Paystack API Routes

**File**: `src/app/api/payments/initialize/route.ts`

**Replace line 4:**
```typescript
// BEFORE (INSECURE):
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_xxxxxxxxxxxxx';

// AFTER (SECURE):
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
if (!PAYSTACK_SECRET_KEY) {
  return NextResponse.json(
    { error: 'Payment service not configured' },
    { status: 500 }
  );
}
```

**File**: `src/app/api/payments/callback/route.ts`

**Replace line 3:**
```typescript
// BEFORE (INSECURE):
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_xxxxxxxxxxxxx';

// AFTER (SECURE):
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
if (!PAYSTACK_SECRET_KEY) {
  return NextResponse.json(
    { error: 'Payment service not configured' },
    { status: 500 }
  );
}
```

### 4. Disable TEST_MODE for Production

**File**: `src/lib/auth.ts`

**Change line 13:**
```typescript
// BEFORE:
export const TEST_MODE = true;

// AFTER (for production):
export const TEST_MODE = process.env.NODE_ENV !== 'production';
```

This will automatically disable TEST_MODE in production.

### 5. Add Security Headers

**File**: `next.config.ts`

Replace entire file with:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://res.cloudinary.com",
              "font-src 'self' data:",
              "connect-src 'self' http://localhost:8000 https://api.paystack.co",
              "frame-src 'self' https://www.youtube.com",
            ].join('; ')
          }
        ],
      },
    ];
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    qualities: [75, 85],
  },
};

export default nextConfig;
```

### 6. Change ALL Compromised Passwords

**THESE PASSWORDS ARE COMPROMISED** (seen in Git history):
- ❌ `admin@pinassociate.com` / `PINadmin2026!`
- ❌ `student@pinassociate.com` / `PINstudent2026!`
- ❌ `client@pinassociate.com` / `PINclient2026!`

**Generate new strong passwords**:
```bash
# Use a password manager (LastPass, 1Password, Bitwarden)
# Or generate random passwords:
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

Update passwords in your backend database immediately!

---

## 🧹 CLEAN GIT HISTORY (CRITICAL)

Your current Git history contains exposed passwords. You have 2 options:

### Option 1: Start Fresh (RECOMMENDED)
```bash
# 1. Make all fixes above
# 2. Delete the repo from GitHub
# 3. Remove .git folder
rm -rf .git

# 4. Initialize new repo
git init
git add .
git commit -m "Initial commit - secure version"

# 5. Create new GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/NEW_REPO_NAME.git
git push -u origin main
```

### Option 2: Clean History (Advanced)
```bash
# Install BFG Repo-Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove sensitive files from history
java -jar bfg.jar --delete-files .gitignore
java -jar bfg.jar --delete-files .env.example

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: Destructive)
git push --force --all
```

---

## 📝 BEFORE COMMITTING CHECKLIST

- [ ] All 6 fixes above completed
- [ ] `.gitignore` replaced with secure version
- [ ] `.env.example` replaced with secure version
- [ ] Paystack routes throw errors instead of using defaults
- [ ] TEST_MODE set to false or environment-dependent
- [ ] Security headers added to next.config.ts
- [ ] All passwords changed
- [ ] `.env` file created but NOT committed
- [ ] Verified `.env` is in `.gitignore`
- [ ] Ran `git status` - no `.env` file shown
- [ ] Tested app still works after changes

---

## 🔐 FINAL VERIFICATION

Before pushing:

```bash
# 1. Check what will be committed
git status

# 2. Verify .env is NOT listed
# If you see .env, STOP! Add it to .gitignore

# 3. Check .gitignore contains .env
cat .gitignore | grep ".env"

# 4. Search for passwords in files to be committed
git grep -i "PINadmin2026"
git grep -i "PINstudent2026"
git grep -i "sk_test_"

# If any results, FIX before committing!

# 5. Build to ensure nothing broken
npm run build

# 6. Commit safely
git add .
git commit -m "Security fixes: Remove exposed credentials, add security headers"
git push
```

---

## 🆘 EMERGENCY CONTACTS

If you've already pushed compromised data:
1. **IMMEDIATELY** change all passwords
2. Rotate all API keys (Paystack, WhatsApp, etc.)
3. Check access logs for suspicious activity
4. Consider starting a fresh repository
5. Enable 2FA on all accounts

---

## ✅ POST-DEPLOYMENT SECURITY

After deploying:
1. Run security scan: https://observatory.mozilla.org/
2. Check SSL: https://www.ssllabs.com/ssltest/
3. Verify headers: https://securityheaders.com/
4. Test for vulnerabilities: `npm audit`

---

**Remember**: Once credentials are in Git history, they're compromised forever. Change them immediately!
