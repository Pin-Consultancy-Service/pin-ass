# Implementation Plan: Add Scroll Animations to All Pages

## Project Context
- **Framework**: Next.js 15 with App Router
- **Animation Library**: Framer Motion v13.2.0 (already installed)
- **Build Command**: `npm run build`
- **Test Command**: `npm run dev` (verify animations in browser)

## Existing Animation Usage
- **HeroSection.tsx**: Already uses `motion` and `AnimatePresence` from framer-motion for carousel transitions
- **Multiple home sections**: Already use `motion.div`, `whileInView`, `variants`, and stagger animations (AboutSection, ProgramsSection, WhyChooseSection, LearningJourneySection, TeamSection, AchievementsSection, TestimonialsSection, FAQSection, RegistrationSection, ContactSection)
- **Footer.tsx**: Uses `AnimatePresence` and `motion.div` for background carousel
- **LoginPageContent.tsx & RegisterPageContent.tsx**: Use `AnimatePresence` and `motion.div` for background carousel
- **AboutPageContent.tsx**: Uses `motion.div` and animation variants throughout

**Key Finding**: Most components already have scroll animations implemented. The task is to ensure ALL components have consistent animations and add them to any missing ones.

---

## Implementation Steps

### Phase 1: Create Animation Utilities

- [ ] **1. Create animation variants utility file**
  - **What**: Create `src/lib/animations.ts` with reusable animation variants including fadeIn, fadeSlideUp, fadeSlideDown, staggerContainer, scaleIn, and support for `prefers-reduced-motion`
  - **Files**: 
    - Create: `src/lib/animations.ts`
  - **Details**: 
    - Export `fadeIn`, `fadeSlideUp`, `fadeSlideDown`, `fadeSlideLeft`, `fadeSlideRight` variants
    - Export `staggerContainer` with configurable stagger delay
    - Export `scaleIn` for zoom-style entrance
    - Each variant should respect `prefers-reduced-motion` by checking `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
    - When reduced motion is preferred, return `{ opacity: 1 }` instead of transform animations
  - **Verify**: TypeScript compiles without errors with `npm run build`

- [ ] **2. Create useScrollAnimation hook**
  - **What**: Create `src/hooks/useScrollAnimation.ts` custom hook that wraps common framer-motion viewport settings
  - **Files**: 
    - Create: `src/hooks/useScrollAnimation.ts`
  - **Details**: 
    - Export `useScrollAnimation()` hook that returns default viewport config: `{ once: true, margin: "-60px" }`
    - Export `useStaggerAnimation()` hook for container animations
    - Hook should be simple wrapper to ensure consistent viewport behavior across all components
  - **Verify**: TypeScript compiles without errors with `npm run build`

---

### Phase 2: Add Animations to Components Without Them

- [ ] **3. Add animations to CoursesPage (/app/courses/page.tsx)**
  - **What**: Wrap the PageHero section and each programme card in motion components with fadeSlideUp variants
  - **Files**: 
    - Modify: `src/app/courses/page.tsx`
  - **Details**: 
    - Add `"use client"` directive at top (required for framer-motion)
    - Import `motion` from "framer-motion" and animation variants from `@/lib/animations`
    - Wrap PageHero in `motion.div` with `initial={{ opacity: 0, y: 20 }}` and `animate={{ opacity: 1, y: 0 }}`
    - Convert the programmes list section wrapper to `motion.section`
    - Convert each programme card's outer `div` to `motion.div` with `initial="hidden"` `whileInView="visible"` `viewport={{ once: true, margin: "-60px" }}` using fadeSlideUp variant
    - Add stagger delay: each card gets `transition={{ duration: 0.55, delay: i * 0.08 }}`
  - **Verify**: Run `npm run dev`, navigate to `/courses`, scroll to verify smooth entrance animations on all programme cards

- [ ] **4. Add animations to ApplyPage (/app/apply/page.tsx)**
  - **What**: Add animations to the PageHero, process steps (left column), and form (right column)
  - **Files**: 
    - Modify: `src/app/apply/page.tsx`
  - **Details**: 
    - Already has `"use client"` directive
    - Import `motion` from "framer-motion" and animation variants from `@/lib/animations`
    - Wrap PageHero in `motion.div` with fadeIn animation
    - Wrap left column (process steps) in `motion.div` with fadeSlideLeft variant
    - Wrap right column (form) in `motion.div` with fadeSlideUp variant with delay: 0.2s
    - Each step in steps array should animate in with stagger: convert to `motion.div` with delay `i * 0.1`
  - **Verify**: Run `npm run dev`, navigate to `/apply`, verify left and right columns animate in smoothly

- [ ] **5. Add animations to CourseDetailPage (/app/courses/[slug]/page.tsx)**
  - **What**: Add animations to PageHero, overview section, curriculum section, FAQ section, and CTA banner
  - **Files**: 
    - Modify: `src/app/courses/[slug]/page.tsx`
  - **Details**: 
    - Add `"use client"` directive at top
    - Import `motion` from "framer-motion" and animation variants from `@/lib/animations`
    - Wrap PageHero in `motion.div` with fadeIn
    - Wrap overview section in `motion.section` with fadeSlideUp
    - Convert each curriculum level card to `motion.div` with stagger animation (delay `i * 0.1`)
    - Convert each FAQ item to `motion.div` with stagger animation (delay `i * 0.08`)
    - Wrap CTA banner in `motion.section` with fadeSlideUp
  - **Verify**: Run `npm run dev`, navigate to `/courses/ican`, scroll through page to verify all sections animate

- [ ] **6. Add animations to ContactPage components**
  - **What**: ContactPageContent is used in `/app/contact/page.tsx` - check if animations exist, add if missing
  - **Files**: 
    - Check: `src/components/contact/ContactPageContent.tsx` (file not read yet, check if exists)
    - Modify: If file exists and lacks animations, add motion wrappers
  - **Details**: 
    - If ContactPageContent.tsx exists: Add `"use client"`, import motion, wrap hero and form sections
    - If it uses a PageHero component, that should be animated
    - Contact form and contact info cards should have fadeSlideUp animations
  - **Verify**: Run `npm run dev`, navigate to `/contact`, verify animations appear

- [ ] **7. Verify CorporateSection has animations**
  - **What**: CorporateSection is imported in home page - verify it has scroll animations
  - **Files**: 
    - Check: `src/components/home/CorporateSection.tsx` (file not read yet)
    - Modify: If missing animations, add motion wrappers following pattern from other home sections
  - **Details**: 
    - File is imported in `src/app/page.tsx` as `<CorporateSection />`
    - If it exists and lacks animations, add `"use client"`, import motion
    - Follow the same pattern as other home sections: section header with fadeSlideUp, content with stagger
  - **Verify**: Run `npm run dev`, scroll through home page to CorporateSection, verify animations

---

### Phase 3: Enhance Portal Pages with Subtle Animations

- [ ] **8. Add animations to portal login and register pages**
  - **What**: LoginPageContent.tsx and RegisterPageContent.tsx already have background carousel animations, add subtle entrance animations to form elements
  - **Files**: 
    - Modify: `src/components/portal/LoginPageContent.tsx`
    - Modify: `src/components/portal/RegisterPageContent.tsx`
  - **Details**: 
    - Both files already use `motion` and `AnimatePresence`
    - Add subtle fadeIn animation to the form container (right side): wrap form in `motion.div` with `initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}`
    - Left side (brand panel) should have subtle fadeIn for text content
    - Keep carousel animations as-is (already implemented)
    - Ensure animations are smooth and don't interfere with existing carousel
  - **Verify**: Run `npm run dev`, navigate to `/portal/login` and `/portal/register`, verify form fades in smoothly without blocking interaction

- [ ] **9. Add animations to StudentDashboardContent**
  - **What**: Add subtle entrance animations to dashboard cards and sections
  - **Files**: 
    - Modify: `src/components/portal/student/StudentDashboardContent.tsx`
  - **Details**: 
    - Add `"use client"` if not present (already has it)
    - Import `motion` from "framer-motion" and fadeSlideUp variant from `@/lib/animations`
    - Convert each dashboard card (`<section>`) to `motion.section` with fadeSlideUp animation
    - Add stagger: each card gets `initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.08 }}`
    - Keep animations subtle - this is a functional dashboard, not a marketing page
  - **Verify**: Run `npm run dev`, login to student portal, verify dashboard cards animate in with subtle stagger

---

### Phase 4: Add Animations to Layout Components

- [ ] **10. Verify Navbar has scroll-triggered effects**
  - **What**: Check if Navbar.tsx has any scroll-based animations or needs enhancement
  - **Files**: 
    - Check: `src/components/layout/Navbar.tsx` (file read shows it's open in editor)
    - Modify: If needed, add subtle fadeIn animation on mount
  - **Details**: 
    - Navbar should have subtle entrance animation on page load
    - Consider adding background change on scroll (optional enhancement)
    - Keep performance in mind - navbar animations should not block rendering
  - **Verify**: Run `npm run dev`, load any page, verify navbar appears smoothly

- [ ] **11. Verify Footer animations are optimal**
  - **What**: Footer.tsx already has background carousel animations - verify they work well
  - **Files**: 
    - Review: `src/components/layout/Footer.tsx` (already read, has AnimatePresence)
  - **Details**: 
    - Footer already has background carousel using `AnimatePresence` and `motion.div`
    - Verify the carousel transitions are smooth (1.2s duration easeInOut)
    - Consider adding fadeSlideUp animation to footer content when it enters viewport
    - Wrap main content sections in `motion.div` with `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}`
  - **Verify**: Run `npm run dev`, scroll to footer on any page, verify smooth background transitions and content entrance

---

### Phase 5: Verify All Home Page Sections

**Note**: Most home sections already have animations implemented. This phase is verification-only.

- [ ] **12. Verify all home page section animations**
  - **What**: Review all home page sections to ensure consistent animation implementation
  - **Files**: 
    - Verify: All components in `src/components/home/` directory
  - **Details**: 
    - **Already animated** (confirmed by code review):
      - HeroSection.tsx ✓ (carousel with AnimatePresence)
      - AboutSection.tsx ✓ (motion with variants)
      - ProgramsSection.tsx ✓ (motion with whileInView)
      - WhyChooseSection.tsx ✓ (motion with variants and stagger)
      - LearningJourneySection.tsx ✓ (motion with variants and stagger)
      - TeamSection.tsx ✓ (motion with whileInView)
      - AchievementsSection.tsx ✓ (motion with variants and stagger)
      - TestimonialsSection.tsx ✓ (AnimatePresence with carousel)
      - FAQSection.tsx ✓ (AnimatePresence for accordion)
      - RegistrationSection.tsx ✓ (motion with variants and stagger)
      - ContactSection.tsx ✓ (motion with whileInView)
    - **Need to check**:
      - CorporateSection.tsx (not yet reviewed)
      - NewsletterSection.tsx (imported but not reviewed)
      - StatsSection.tsx (found in file search, not reviewed)
    - For any missing animations, follow the established pattern: section header with fadeSlideUp, content with stagger container
  - **Verify**: Run `npm run dev`, scroll through entire home page (`/`), verify all sections animate smoothly

---

### Phase 6: Accessibility & Performance

- [ ] **13. Implement prefers-reduced-motion support**
  - **What**: Ensure all animations respect user's motion preferences
  - **Files**: 
    - Modify: `src/lib/animations.ts` (created in step 1)
    - Review: All components using animations
  - **Details**: 
    - In `src/lib/animations.ts`, create a utility function `shouldReduceMotion()` that checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
    - Update all variant functions to call `shouldReduceMotion()` and return simple opacity animations when true
    - Example: `fadeSlideUp` becomes `{ opacity: 1, y: 0 }` instead of `{ opacity: 1, y: 0, transition: { ... } }` when motion should be reduced
    - Add a client-side hook `useReducedMotion()` that components can use
  - **Verify**: 
    1. Run `npm run build` to ensure no TypeScript errors
    2. Run `npm run dev`
    3. Open DevTools, enable "prefers-reduced-motion: reduce" in Rendering tab
    4. Reload page, verify animations are simplified (opacity only, no transforms)

- [ ] **14. Performance audit**
  - **What**: Ensure animations don't negatively impact performance
  - **Files**: 
    - Review: All pages with animations
  - **Details**: 
    - Test on multiple pages (home, courses, apply, about, portal)
    - Open Chrome DevTools Performance tab
    - Record a scroll through each page
    - Look for:
      - Frame drops (should stay above 50 FPS)
      - Long tasks (should be under 50ms)
      - Layout thrashing (minimize reflows)
    - If performance issues found:
      - Reduce stagger delay
      - Simplify animation variants
      - Use `will-change: transform, opacity` CSS hint for animated elements
  - **Verify**: 
    1. Run `npm run build && npm run start` (production mode)
    2. Use Chrome DevTools Lighthouse to audit performance
    3. Performance score should remain above 85
    4. Scroll performance should remain smooth on mobile viewport

---

## Summary of Files to Create

1. `src/lib/animations.ts` - Animation variants and utility functions
2. `src/hooks/useScrollAnimation.ts` - Custom hook for consistent viewport settings

## Summary of Files to Modify

1. `src/app/page.tsx` - Verify all home sections are imported and animated
2. `src/app/courses/page.tsx` - Add animations
3. `src/app/apply/page.tsx` - Add animations
4. `src/app/courses/[slug]/page.tsx` - Add animations
5. `src/app/contact/page.tsx` - Verify ContactPageContent is animated
6. `src/components/home/CorporateSection.tsx` - Verify/add animations
7. `src/components/home/NewsletterSection.tsx` - Verify/add animations
8. `src/components/home/StatsSection.tsx` - Verify/add animations (if exists)
9. `src/components/portal/LoginPageContent.tsx` - Enhance form animations
10. `src/components/portal/RegisterPageContent.tsx` - Enhance form animations
11. `src/components/portal/student/StudentDashboardContent.tsx` - Add dashboard animations
12. `src/components/layout/Navbar.tsx` - Verify/add entrance animation
13. `src/components/layout/Footer.tsx` - Enhance content animations
14. `src/components/about/AboutPageContent.tsx` - Already animated, verify completeness
15. Any other portal components (InstructorDashboard, AdminDashboard, etc.) - Add subtle animations

## Animation Patterns to Follow

### For Page/Section Headers
```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-60px" }}
  transition={{ duration: 0.55 }}
>
  {/* Header content */}
</motion.div>
```

### For Staggered Lists/Cards
```tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-60px" }}
>
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      variants={itemVariants}
      transition={{ delay: i * 0.08 }}
    >
      {/* Card content */}
    </motion.div>
  ))}
</motion.div>
```

### For Hero/PageHero Components
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  {/* Hero content */}
</motion.div>
```

## Verification Checklist

After completing all steps, verify the following:

- [ ] Home page: All sections animate smoothly on scroll
- [ ] Courses page: Programme cards animate in with stagger
- [ ] Course detail page: All sections have entrance animations
- [ ] Apply page: Form and process steps animate
- [ ] About page: Timeline and team sections animate (already implemented, verify)
- [ ] Contact page: Form and contact info animate
- [ ] Portal pages: Dashboard cards and login/register forms animate subtly
- [ ] Footer: Background carousel and content fade in smoothly
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Performance: No frame drops or layout thrashing
- [ ] Mobile: Animations work smoothly on mobile viewport
- [ ] TypeScript: `npm run build` completes without errors
- [ ] Accessibility: Keyboard navigation still works, focus indicators visible

## Notes

- **Existing Animations**: Many components already have animations via framer-motion. This plan focuses on ensuring consistency and adding animations where missing.
- **Performance**: Use `viewport={{ once: true }}` to prevent re-triggering animations on every scroll.
- **Accessibility**: Always respect `prefers-reduced-motion` user preference.
- **Stagger Timing**: Keep stagger delays small (0.05-0.1s) to avoid feeling sluggish.
- **Duration**: Most animations should be 0.4-0.6s for optimal feel.
- **Viewport Margin**: Use `-60px` margin to trigger animations slightly before element enters viewport for smoother UX.
