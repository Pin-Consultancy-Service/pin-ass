# Security Verification Script - Run Before Git Push
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Security Pre-Push Verification" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$issues = 0

# Check 1: Look for .env files in staging
Write-Host "[1/6] Checking for .env files..." -ForegroundColor Yellow
$envFiles = git status --short | Select-String "\.env" | Where-Object { $_ -notmatch "^D " -and $_ -notmatch "\.env\.example" }
if ($envFiles) {
    Write-Host "  ❌ DANGER: .env files detected!" -ForegroundColor Red
    Write-Host "  $envFiles" -ForegroundColor Red
    $issues++
} else {
    # Check if there are deletions of .env files (which is good!)
    $envDeletions = git status --short | Select-String "^D.*\.env$"
    if ($envDeletions) {
        Write-Host "  ✅ Removing .env from git tracking (GOOD!)" -ForegroundColor Green
    } else {
        Write-Host "  ✅ No .env files in staging" -ForegroundColor Green
    }
}

# Check 2: Search for secret patterns in staged files
Write-Host "`n[2/6] Scanning for exposed secrets..." -ForegroundColor Yellow
$secrets = git diff --cached | Select-String -Pattern "sk_live_|pk_live_|AKIA|password\s*=\s*['\`"][^'`"]{5}|secret\s*=\s*['\`"][^'`"]{5}"
if ($secrets) {
    Write-Host "  ❌ DANGER: Potential secrets found!" -ForegroundColor Red
    Write-Host "  Review these lines carefully:" -ForegroundColor Red
    $secrets | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
    $issues++
} else {
    Write-Host "  ✅ No obvious secrets detected" -ForegroundColor Green
}

# Check 3: Check for node_modules
Write-Host "`n[3/6] Checking for node_modules..." -ForegroundColor Yellow
$nodeModules = git status --short | Select-String "node_modules"
if ($nodeModules) {
    Write-Host "  ❌ WARNING: node_modules detected!" -ForegroundColor Red
    $issues++
} else {
    Write-Host "  ✅ node_modules not in staging" -ForegroundColor Green
}

# Check 4: Check for .next build
Write-Host "`n[4/6] Checking for build artifacts..." -ForegroundColor Yellow
$buildFiles = git status --short | Select-String "\.next/|/out/|__pycache__|\.pyc"
if ($buildFiles) {
    Write-Host "  ❌ WARNING: Build artifacts detected!" -ForegroundColor Red
    $issues++
} else {
    Write-Host "  ✅ No build artifacts in staging" -ForegroundColor Green
}

# Check 5: Verify .gitignore exists
Write-Host "`n[5/6] Checking .gitignore files..." -ForegroundColor Yellow
if ((Test-Path "pin-frontend/.gitignore") -and (Test-Path "pin-backend/.gitignore")) {
    Write-Host "  ✅ .gitignore files present" -ForegroundColor Green
} else {
    Write-Host "  ❌ WARNING: .gitignore missing!" -ForegroundColor Red
    $issues++
}

# Check 6: Show what will be pushed
Write-Host "`n[6/6] Files to be committed:" -ForegroundColor Yellow
$stagedFiles = git diff --cached --name-only
if ($stagedFiles) {
    $stagedFiles | ForEach-Object { Write-Host "  $_" -ForegroundColor Cyan }
} else {
    Write-Host "  (No files staged)" -ForegroundColor Gray
}

# Final verdict
Write-Host "`n========================================" -ForegroundColor Cyan
if ($issues -eq 0) {
    Write-Host "✅ SAFE TO PUSH" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan
    Write-Host "No security issues detected." -ForegroundColor Green
    Write-Host "Review the staged files above and proceed with:" -ForegroundColor White
    Write-Host "  git commit -m 'your message'" -ForegroundColor Cyan
    Write-Host "  git push origin main`n" -ForegroundColor Cyan
} else {
    Write-Host "❌ NOT SAFE TO PUSH" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Cyan
    Write-Host "Found $issues potential security issue(s)." -ForegroundColor Red
    Write-Host "Fix these issues before pushing!`n" -ForegroundColor Red
    exit 1
}
