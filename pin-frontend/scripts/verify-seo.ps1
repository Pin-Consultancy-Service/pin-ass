# SEO Verification Script for PIN Consultancy Services
# Run this after deployment to verify all SEO elements are working

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "PIN Consultancy Services - SEO Verification" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$domain = "pinconsultancyservices.com"
$baseUrl = "https://$domain"

Write-Host "Checking SEO implementation for: $baseUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: robots.txt
Write-Host "[1/7] Checking robots.txt..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/robots.txt" -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ robots.txt found and accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ robots.txt not found or inaccessible" -ForegroundColor Red
}

# Test 2: sitemap.xml
Write-Host "[2/7] Checking sitemap.xml..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/sitemap.xml" -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ sitemap.xml found and accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ sitemap.xml not found or inaccessible" -ForegroundColor Red
}

# Test 3: manifest.json
Write-Host "[3/7] Checking manifest.json..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/manifest.json" -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ manifest.json found and accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ manifest.json not found (optional)" -ForegroundColor Yellow
}

# Test 4: Homepage accessibility
Write-Host "[4/7] Checking homepage..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Homepage accessible" -ForegroundColor Green
        
        # Check for meta tags
        if ($response.Content -match 'name="description"') {
            Write-Host "   ✅ Meta description found" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Meta description missing" -ForegroundColor Red
        }
        
        # Check for structured data
        if ($response.Content -match 'application/ld\+json') {
            Write-Host "   ✅ Structured data (JSON-LD) found" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Structured data missing" -ForegroundColor Red
        }
        
        # Check for Open Graph tags
        if ($response.Content -match 'property="og:') {
            Write-Host "   ✅ Open Graph tags found" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Open Graph tags missing" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "   ❌ Homepage not accessible" -ForegroundColor Red
}

# Test 5: Check SSL/HTTPS
Write-Host "[5/7] Checking HTTPS..." -ForegroundColor Green
if ($baseUrl -match "^https://") {
    Write-Host "   ✅ HTTPS enabled" -ForegroundColor Green
} else {
    Write-Host "   ❌ HTTPS not configured" -ForegroundColor Red
}

# Test 6: Favicon
Write-Host "[6/7] Checking favicon..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/images/pin-logo.png" -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Favicon found" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Favicon not found" -ForegroundColor Red
}

# Test 7: Mobile viewport
Write-Host "[7/7] Checking mobile viewport tag..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing -ErrorAction Stop
    if ($response.Content -match 'name="viewport"') {
        Write-Host "   ✅ Mobile viewport configured" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Mobile viewport missing" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Could not check viewport" -ForegroundColor Red
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Verification Complete!" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Submit sitemap to Google Search Console" -ForegroundColor White
Write-Host "2. Create Google Business Profile" -ForegroundColor White
Write-Host "3. Set up Google Analytics 4" -ForegroundColor White
Write-Host "4. Test mobile-friendliness: https://search.google.com/test/mobile-friendly" -ForegroundColor White
Write-Host "5. Test rich results: https://search.google.com/test/rich-results" -ForegroundColor White
Write-Host "6. Monitor rankings in Google Search Console" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see: SEO_QUICK_START.md" -ForegroundColor Cyan
Write-Host ""
