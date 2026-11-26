# PowerShell Script to Clean Up Before Deployment
# Run this before pushing to GitHub

Write-Host "🧹 Cleaning up for production deployment..." -ForegroundColor Cyan

# Step 1: Check for console.log statements
Write-Host "`n📝 Checking for console.log statements..." -ForegroundColor Yellow
$consoleLogsFound = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts" | 
    Select-String -Pattern "console\.(log|warn|error|debug)" -CaseSensitive

if ($consoleLogsFound) {
    Write-Host "⚠️  Found console statements in:" -ForegroundColor Red
    $consoleLogsFound | ForEach-Object { 
        Write-Host "   $($_.Path):$($_.LineNumber)" -ForegroundColor Yellow 
    }
    Write-Host "`n   Consider removing these for production" -ForegroundColor Yellow
} else {
    Write-Host "✅ No console.log statements found" -ForegroundColor Green
}

# Step 2: Check for TODO comments
Write-Host "`n📝 Checking for TODO comments..." -ForegroundColor Yellow
$todosFound = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts" | 
    Select-String -Pattern "TODO" -CaseSensitive

if ($todosFound) {
    Write-Host "📌 Found TODO comments in:" -ForegroundColor Cyan
    $todosFound | Select-Object -First 10 | ForEach-Object { 
        Write-Host "   $($_.Path):$($_.LineNumber)" -ForegroundColor Gray 
    }
    if ($todosFound.Count -gt 10) {
        Write-Host "   ... and $($todosFound.Count - 10) more" -ForegroundColor Gray
    }
}

# Step 3: Check for exposed passwords
Write-Host "`n🔒 Checking for exposed credentials..." -ForegroundColor Yellow
$patterns = @("PINadmin2026", "PINstudent2026", "sk_test_", "password\s*=\s*['\"]")
$foundCredentials = $false

foreach ($pattern in $patterns) {
    $found = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts" | 
        Select-String -Pattern $pattern -CaseSensitive
    
    if ($found) {
        $foundCredentials = $true
        Write-Host "🚨 CRITICAL: Found potential credentials matching: $pattern" -ForegroundColor Red
        $found | ForEach-Object { 
            Write-Host "   $($_.Path):$($_.LineNumber)" -ForegroundColor Red 
        }
    }
}

if (-not $foundCredentials) {
    Write-Host "✅ No exposed credentials found" -ForegroundColor Green
}

# Step 4: Check .env is not staged
Write-Host "`n🔒 Checking if .env files are ignored..." -ForegroundColor Yellow
$gitStatus = git status --short 2>$null
if ($gitStatus -match "\.env") {
    Write-Host "🚨 CRITICAL: .env file is staged for commit!" -ForegroundColor Red
    Write-Host "   Run: git reset .env" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env files are properly ignored" -ForegroundColor Green
}

# Step 5: Verify .gitignore
Write-Host "`n📝 Verifying .gitignore..." -ForegroundColor Yellow
$gitignoreContent = Get-Content ".gitignore" -Raw
if ($gitignoreContent -match "\.env") {
    Write-Host "✅ .gitignore properly excludes .env files" -ForegroundColor Green
} else {
    Write-Host "🚨 CRITICAL: .env not in .gitignore!" -ForegroundColor Red
}

# Step 6: Check for large files
Write-Host "`n📦 Checking for large files..." -ForegroundColor Yellow
$largeFiles = Get-ChildItem -Path "." -Recurse -File | 
    Where-Object { $_.Length -gt 5MB -and $_.FullName -notmatch "node_modules" } |
    Sort-Object Length -Descending |
    Select-Object -First 5

if ($largeFiles) {
    Write-Host "⚠️  Found large files:" -ForegroundColor Yellow
    $largeFiles | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        Write-Host "   $($_.Name) - ${sizeMB}MB" -ForegroundColor Gray
    }
}

# Summary
Write-Host "`n" + ("="*60) -ForegroundColor Cyan
Write-Host "✅ Cleanup check complete!" -ForegroundColor Green
Write-Host ("="*60) -ForegroundColor Cyan

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Fix any 🚨 CRITICAL issues above" -ForegroundColor White
Write-Host "2. Remove console.log statements" -ForegroundColor White
Write-Host "3. Review TODO comments" -ForegroundColor White
Write-Host "4. Run: npm run build" -ForegroundColor White
Write-Host "5. Test the build locally" -ForegroundColor White
Write-Host "6. Push to GitHub" -ForegroundColor White

Write-Host "`n"
