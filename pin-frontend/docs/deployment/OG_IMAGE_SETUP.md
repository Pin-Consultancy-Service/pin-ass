# Open Graph Image Setup Guide

## Problem
When sharing your website link on WhatsApp, Twitter, LinkedIn, or Facebook, only text appears without your logo/image.

## Solution
You need a **1200x630px Open Graph (OG) image** that will display when your link is shared.

## Quick Fix Option 1: Use Canva (Recommended)

### Step 1: Create the Image in Canva
1. Go to [Canva.com](https://www.canva.com)
2. Search for "Facebook Post" template (automatically 1200x630px)
3. Create a design with:
   - **Background**: Navy blue gradient (#1a365d to #2c5282)
   - **Logo**: Upload your PIN logo (make it prominent)
   - **Text**: 
     - Main: "PIN Consultancy Services"
     - Subtitle: "Professional Exam Tutoring Nigeria"
   - **Stats**: "5,000+ Graduates | 87% Pass Rate | Since 2009"
   - **Courses**: "ICAN • ACCA • CITN • CISA • ATS • IFRS"
   - **Badge**: "Nigeria's #1 Exam Prep Center" (gold background)

### Step 2: Download and Add to Project
1. Download as PNG (high quality)
2. Rename to `og-image.png`
3. Place in `pin-frontend/public/` folder
4. Update `layout.tsx` to use static image (see code below)

## Quick Fix Option 2: Use Figma

1. Create 1200x630px frame
2. Design with same elements as Canva option
3. Export as PNG
4. Add to `public/og-image.png`

## Quick Fix Option 3: Use Online OG Image Generator

Visit: https://www.opengraph.xyz/
- Enter your site details
- Upload logo
- Generate and download
- Save as `public/og-image.png`

## Update Code to Use Static Image

Replace the metadata in `src/app/layout.tsx`:

```typescript
openGraph: {
  type: "website",
  locale: "en_NG",
  url: "https://pinconsultancyservices.com",
  siteName: "PIN Consultancy Services",
  title: "PIN Consultancy Services | #1 ICAN, ACCA, CITN Exam Tutoring in Nigeria",
  description:
    "Nigeria's most trusted professional exam preparation center since 2009. 5,000+ graduates, 87% first-attempt pass rate.",
  images: [
    { 
      url: "/og-image.png",  // Static image in public folder
      width: 1200, 
      height: 630, 
      alt: "PIN Consultancy Services - Professional Exam Tutoring Nigeria",
      type: "image/png",
    }
  ],
},
twitter: {
  card: "summary_large_image",
  title: "PIN Consultancy Services | Professional Exam Tutoring Nigeria",
  description: "5,000+ graduates. 87% pass rate. Expert ICAN, ACCA, CITN tutoring.",
  images: ["/og-image.png"],  // Same static image
  creator: "@PINConsultancy",
  site: "@PINConsultancy",
},
```

## OG Image Design Specifications

**Dimensions**: 1200 x 630 pixels (required)  
**Format**: PNG or JPG  
**File Size**: Under 1MB (ideally under 500KB)  
**Safe Zone**: Keep important content within 1200x600px (avoid edges)

**Design Elements to Include**:
1. ✅ Your PIN logo (prominent placement)
2. ✅ Company name: "PIN Consultancy Services"
3. ✅ Tagline: "Professional Exam Tutoring Nigeria"
4. ✅ Key stats: "5,000+ Graduates | 87% Pass Rate"
5. ✅ Courses offered: ICAN, ACCA, CITN, etc.
6. ✅ Brand colors (navy blue, white, gold accent)

## Testing After Deployment

### Test on WhatsApp
1. Share your link: `https://www.pinconsultancyservices.com`
2. Wait 2-3 seconds for preview to load
3. You should see your OG image with logo

### Test on Facebook
1. Go to [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your URL
3. Click "Scrape Again" to clear cache
4. Preview should show your OG image

### Test on Twitter/X
1. Go to [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter your URL
3. Preview should show your image

### Test on LinkedIn
1. Go to [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
2. Enter your URL
3. Clear cache if needed

## Current Implementation

I've created dynamic OG images using Next.js `opengraph-image.tsx` and `twitter-image.tsx`.

**Files Created**:
- `src/app/opengraph-image.tsx` - Generates OG image dynamically
- `src/app/twitter-image.tsx` - Generates Twitter card image dynamically

**Pros**: Automatically updates when you change text  
**Cons**: Slower build times, can't use custom logo directly

## Recommended: Switch to Static Image

For better performance and control:

1. **Create the image** using Canva/Figma
2. **Delete** `src/app/opengraph-image.tsx` and `src/app/twitter-image.tsx`
3. **Add** `public/og-image.png` (your designed image)
4. **Update** `layout.tsx` metadata to point to `/og-image.png`

This approach:
- ✅ Faster builds
- ✅ Better quality (you design it exactly as you want)
- ✅ Can use your actual logo
- ✅ Easier to update (just replace the PNG file)

## Example OG Image Layout

```
┌─────────────────────────────────────────────────────────┐
│  [PIN LOGO]  PIN Consultancy Services                   │
│              Professional Exam Tutoring Nigeria         │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ 5,000+   │  │   87%    │  │   2009   │             │
│  │Graduates │  │Pass Rate │  │Established│            │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│  ICAN • ACCA • CITN • CISA • ATS • IFRS                │
│                                                          │
│                   [Nigeria's #1 Exam Prep Center]      │
└─────────────────────────────────────────────────────────┘
      (1200px wide x 630px tall)
```

## Deployment Notes

After adding/updating the OG image:

1. **Build the project**: `npm run build`
2. **Deploy to Vercel/production**
3. **Clear social media caches** (use debugger tools above)
4. **Test link sharing** on WhatsApp, Twitter, Facebook

## Common Issues

**Q: Image not showing after deployment?**  
A: Clear the cache on Facebook/Twitter debuggers

**Q: Old image still showing?**  
A: Social platforms cache images for 7-30 days. Use their debugger tools to force refresh.

**Q: Image looks blurry?**  
A: Ensure you're using 1200x630px at 72 DPI minimum

**Q: Different image on different platforms?**  
A: Each platform caches separately. Clear all platform caches.

## Resources

- [Canva OG Image Templates](https://www.canva.com/create/open-graph-images/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Open Graph Generator](https://www.opengraph.xyz/)

---

**Priority**: HIGH - This directly impacts how professional your links look when shared  
**Effort**: 15-30 minutes to create a good OG image  
**Impact**: Massive improvement in link sharing appearance
