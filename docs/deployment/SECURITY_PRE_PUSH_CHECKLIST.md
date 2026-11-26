# Security Pre-Push Checklist
**CRITICAL: Review this before EVERY git push!**

## ❌ NEVER Push These Files (Already in .gitignore)

### Environment & Secrets
- ❌ `.env` - Contains ALL your secret keys
- ❌ `.env.local`
- ❌ `.env.development.local`
- ❌ `.env.production.local`
- ❌ Any file with actual API keys, passwords, or tokens

### Backend Sensitive
- ❌ `pin-backend/.env` - Database credentials, API keys
- ❌ `pin-backend/.venv/` - Python virtual environment
- ❌ `*.db`, `*.sqlite`, `*.sqlite3` - Database files
- ❌ `__pycache__/` - Python cache

### Frontend Build Artifacts
- ❌ `pin-frontend/.next/` - Next.js build output
- ❌ `pin-frontend/node_modules/` - Dependencies
- ❌ `pin-frontend/out/` - Export output

### System Files
- ❌ `.DS_Store` - Mac system files
- ❌ `*.pem` - SSL certificates and private keys

---

## ✅ SAFE to Push

### Documentation (.md files)
- ✅ `README.md` - Project documentation
- ✅ `ARCHITECTURE.md` - System design docs
- ✅ `API_FLOW.md` - API documentation
- ✅ Security guides that DON'T contain:
  - Actual passwords
  - Real API keys
  - Database connection strings
  - Internal IP addresses

### Configuration Templates
- ✅ `.env.example` - Template with PLACEHOLDER values only
- ✅ `.env.production.example` - Template with PLACEHOLDER values only
- ✅ `.gitignore` - Git ignore rules

### Source Code
- ✅ All `/src` files
- ✅ `/public` assets (images, fonts, etc.)
- ✅ `/components`, `/pages`, `/app` directories
- ✅ Configuration files: `package.json`, `tsconfig.json`, `next.config.ts`

---

## 🔍 Pre-Push Security Scan

### Step 1: Check for Exposed Secrets
Run these commands before pushing:

```powershell
# Frontend - Check for secret patterns
cd pin-frontend
Get-ChildItem -Recurse -File | Select-String -Pattern "sk_live_|sk_test_|pk_live_|pk_test_|AKIA|password.*=|secret.*=|token.*=" | Select-Object Path, LineNumber, Line

# Backend - Check for secrets
cd ../pin-backend
Get-ChildItem -Recurse -File -Exclude .venv | Select-String -Pattern "password|secret|api_key|token" | Select-Object Path, LineNumber
```

### Step 2: Verify .gitignore is Working
```powershell
# Check what Git will track
git status

# If you see .env files or node_modules, STOP!
# Fix .gitignore before proceeding
```

### Step 3: Review Staged Files
```powershell
# See exactly what will be pushed
git diff --cached --name-only

# Review the actual changes
git diff --cached
```

---

## 🚨 If You Accidentally Pushed Secrets

### Immediate Actions:
1. **ROTATE ALL COMPROMISED KEYS IMMEDIATELY**
   - Paystack: Generate new keys at dashboard.paystack.com
   - Database: Change password in hosting provider
   - JWT/NextAuth: Generate new secrets
   - WhatsApp: Revoke and create new token

2. **Remove from Git History**
   ```powershell
   # WARNING: This rewrites history!
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch path/to/file" \
   --prune-empty --tag-name-filter cat -- --all
   
   # Force push (only if repository is not shared yet!)
   git push origin --force --all
   ```

3. **Notify Team** - If working with others, let them know

---

## 📋 Comprehensive File Review

### Documentation Files Review
Before pushing .md files, check they don't contain:
- ❌ Real database URLs
- ❌ Actual API keys (use `YOUR_KEY_HERE` instead)
- ❌ Production server IPs or domains
- ❌ Real user passwords or credentials
- ❌ Internal company information
- ❌ Customer data or PII

### Safe Documentation Practices:
- ✅ Use placeholder values: `YOUR_API_KEY_HERE`
- ✅ Redact sensitive paths: `/path/to/secret` → `/path/to/**REDACTED**`
- ✅ Generic examples: `user@example.com`, `123.45.67.89` → `YOUR_IP_HERE`

---

## 🛡️ Files That Look Safe But Aren't

### Be Careful With:
1. **Lock files** (`package-lock.json`, `yarn.lock`)
   - ✅ SAFE to push (no secrets)
   - Track dependency versions

2. **Config files** (`next.config.ts`, `tsconfig.json`)
   - ✅ Usually SAFE
   - ⚠️ Check for hardcoded URLs or tokens

3. **SQL migration files**
   - ✅ SAFE if they only contain schema
   - ❌ NEVER include seed data with real user info

4. **Test files**
   - ✅ SAFE if using mock data
   - ❌ NEVER include real API keys "for testing"

5. **Docker files** (`Dockerfile`, `docker-compose.yml`)
   - ✅ SAFE structure
   - ❌ NEVER hardcode passwords (use ENV vars)

---

## ✅ Your Current .gitignore Status

### Frontend (.gitignore)
```
✅ .env and all variants
✅ node_modules
✅ .next build output
✅ *.pem certificates
✅ debug logs
```

### Backend (.gitignore)
```
✅ .env
✅ .venv (Python virtual environment)
✅ *.db, *.sqlite files
✅ __pycache__
✅ build artifacts
```

---

## 🎯 Push Safety Checklist

Before running `git push`, verify:

- [ ] No `.env` files in `git status`
- [ ] No files with actual passwords visible
- [ ] `.env.example` only has PLACEHOLDER values
- [ ] No hardcoded API keys in source code
- [ ] No database credentials in migration files
- [ ] No real user data in test/seed files
- [ ] Reviewed all .md files for sensitive info
- [ ] Checked build artifacts aren't included
- [ ] Verified node_modules isn't tracked

---

## 📝 Notes on .md Files

### Documentation You SHOULD Push:
1. **README.md** - Project overview, setup instructions
2. **ARCHITECTURE.md** - System design documentation
3. **API_FLOW.md** - API endpoint documentation
4. **SECURITY.md** - Security policies (generic)
5. **DEPLOYMENT_GUIDE.md** - Deployment instructions
6. **COURSE_PAGES_UPDATE.md** - Feature documentation

### What to Redact in .md Files:
- Real URLs → Use `https://your-domain.com`
- Real emails → Use `admin@example.com`
- Actual passwords → Use `YOUR_PASSWORD_HERE`
- API keys → Use `pk_test_YOUR_KEY_HERE`
- Database strings → Use `postgresql://user:pass@host:5432/db`

---

## 🔐 Additional Security Measures

### 1. Use Git Hooks (Optional)
Create `.git/hooks/pre-commit`:
```bash
#!/bin/sh
# Prevent committing .env files
if git diff --cached --name-only | grep -E '\.env$'; then
    echo "ERROR: Attempting to commit .env file!"
    echo "Remove it with: git reset HEAD .env"
    exit 1
fi
```

### 2. Enable GitHub Secret Scanning
- Go to repository Settings → Security
- Enable "Secret scanning"
- Enable "Push protection"

### 3. Use .gitignore Globally
```powershell
# Create global .gitignore
echo ".env`n.env.local`n*.pem`n.DS_Store" > ~/.gitignore_global
git config --global core.excludesfile ~/.gitignore_global
```

---

## ⚠️ Common Mistakes to Avoid

1. **"It's just test keys"** - Attackers use test keys to probe
2. **"I'll remove it later"** - Git history keeps it forever
3. **"The repo is private"** - Private repos can be leaked
4. **"I renamed .env to .env.backup"** - Still contains secrets!
5. **".env.example is safe"** - Only if it has PLACEHOLDERS

---

## 📞 If You Need Help

**Before pushing, ask yourself:**
- Does this file contain real passwords? ❌ Don't push
- Does this file contain API keys? ❌ Don't push
- Does this file contain database URLs? ❌ Don't push
- Is this generated by build/install? ❌ Don't push
- Is this a template with placeholders? ✅ Safe to push

**When in doubt, DON'T PUSH IT!**

---

**Last Updated:** November 25, 2026  
**Review this checklist before EVERY push to GitHub!**
