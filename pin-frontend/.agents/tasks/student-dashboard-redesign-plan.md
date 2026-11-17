# Implementation Plan: Student Dashboard UI Redesign

## Project Context

- **Next.js Version**: 16.3.4 (uses Tailwind CSS 4 with @tailwindcss/postcss, no separate config file)
- **Current fonts**: Cormorant Garamond (display) and Inter (body) loaded in root layout
- **Current styling**: CSS variables system (--navy, --gold, --surface, etc.) + inline styles
- **Current structure**: DashboardLayout wraps all student pages with sidebar + header
- **Student pages**: dashboard, classes, assignments, practice, profile, fees, materials, support
- **Key constraint**: Preserve ALL existing functionality, API calls, state management, business logic — styling only

## Implementation Plan

### Phase 1: Foundation (Design Tokens & Hooks)

- [ ] 1. **Create design tokens file** (`src/lib/designTokens.ts`)
      A typed utility exporting all design system tokens referenced in the brief: layout dimensions (sidebar widths, header height), dark/light mode color palettes (cardBg, cardBorder, pillBg, textPrimary, textSecondary, textMuted, etc.), typography scales (Syne/Lexend font sizes and weights), button styles (primary green, secondary, danger), badge colors, accent colors, and gradient definitions.
      Files: src/lib/designTokens.ts
      Verify: `npm run build` — no TypeScript errors; the export list matches all tokens used in the spec.

- [ ] 2. **Create useTheme hook** (`src/hooks/useTheme.ts`)
      A client-side hook reading localStorage key "theme" on mount ("dark" or "light"), listening to the custom browser event 'themeToggle' with detail.isDarkMode, and exporting { isDark, toggleTheme }. toggleTheme dispatches themeToggle and writes to localStorage. Must be "use client" component.
      Files: src/hooks/useTheme.ts
      Verify: Create a test file that imports the hook, verifies it reads/writes localStorage, and can be called to dispatch the event without errors.

### Phase 2: Typography & Fonts

- [ ] 3. **Update root layout for Google Fonts** (`src/app/layout.tsx`)
      Replace the existing Cormorant Garamond + Inter link with a new link loading "Lexend" (400, 500, 600, 700) and "Syne" (400, 500, 600, 700, 800) from Google Fonts. Set CSS custom properties --font-lexend and --font-syne in the <head> <style> block, scoped to :root. Ensure font-display=swap for performance.
      Files: src/app/layout.tsx
      Verify: Open DevTools, confirm fonts load from fonts.googleapis.com; check that --font-lexend and --font-syne are defined in the computed styles; npm run build succeeds.

- [ ] 4. **Update globals.css for Tailwind font config**
      Add @theme inline rules for --font-lexend and --font-syne pointing to their CSS variables. Extend the existing Tailwind @theme block so that font-[lexend] and font-[syne] resolve correctly when used in Tailwind classes (e.g., text-[15px] font-[lexend]).
      Files: src/app/globals.css (update @theme inline block)
      Verify: `npm run build` — no Tailwind warnings about unknown font families; inspect a component using font-[lexend] in DevTools and confirm the Lexend typeface is applied.

### Phase 3: Sidebar Component

- [ ] 5. **Create StudentSidebar component** (`src/components/portal/student/StudentSidebar.tsx`)
      A "use client" component using useTheme hook. Renders:
      - Fixed positioning: position fixed, left-0, top-0, full height, w-64 on desktop, collapsible to w-20
      - Collapse toggle button: w-6 h-6 circular at -right-3 top-8, bg #008751, shows ChevronLeft when expanded / ChevronRight when collapsed; state managed via localStorage key "sidebarCollapsed" and custom browser event 'sidebarToggle' 
      - Dark mode: background image (https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80) + gradient overlay (linear-gradient(160deg, rgba(0,40,20,0.97) 0%, rgba(0,60,30,0.95) 40%, rgba(0,80,40,0.90) 70%, rgba(0,55,25,0.96) 100%))
      - Light mode: solid white background
      - Brand section: logo (30x30px) + "MindBridge" Syne bold 16px + "Student Portal" 11px muted text, p-6 top section
      - User card: rounded-[14px] p-4, avatar 36x36px circle bg #008751 with initials, name (14px Syne bold), role (12px muted), "Active/Online" pill with green pulse dot
      - Nav items: rounded-[12px] pills; 32x32px icon square (rounded-[9px]) + label text
        * ACTIVE: bg rgba(0,135,81,0.12) light / rgba(0,135,81,0.30) dark, border 1px rgba(0,135,81,0.35), icon bg #008751 white icon, label #004d2e light / #fff dark, left accent bar 3px w h-[18px] yellow-400 at -left-2.5
        * IDLE: icon bg rgba(0,0,0,0.05) light / rgba(255,255,255,0.07) dark, icon color rgba(0,0,0,0.50) light / rgba(255,255,255,0.55) dark, label color rgba(0,0,0,0.65) light / rgba(255,255,255,0.70) dark
        * HOVER: bg rgba(0,0,0,0.05) light / rgba(255,255,255,0.07) dark
        * Collapsed tooltip: floating label to the right on hover
      - Section labels: text-[10px] font-bold uppercase tracking-[0.12em], color rgba(0,0,0,0.30) light / rgba(255,255,255,0.28) dark
      - Nav badges (unread counts): text-[10px] font-bold px-[6px] py-[2px] rounded-full
      - Dark mode toggle (mobile only): pill shape with two 28x28 circle buttons, active side gets bg #008751 light or bg-white/15 dark
      - Sign-out button at bottom: icon + "Sign out", hover state rgba(239,68,68,0.10) bg + #f87171 text, icon bg rgba(239,68,68,0.12)
      - Mobile (off-canvas): -translate-x-full by default, ChevronRight/ChevronLeft hamburger at top-left opens/closes with black/40 backdrop overlay, closes on route change (useRouter hook to listen to route)
      Accept props: activeTab (string), collapsed (boolean), onToggle (function). Dispatch sidebarToggle events when collapse/expand buttons are clicked.
      Files: src/components/portal/student/StudentSidebar.tsx
      Verify: `npm run build` — no errors; render the component in isolation with mock props and inspect DOM for: fixed positioning, correct colors in light/dark modes, gradient background visible in dark mode, pill-shaped nav items with accent bars, collapse toggle button present and positioned correctly.

### Phase 4: Header Component

- [ ] 6. **Create StudentHeader component** (`src/components/portal/student/StudentHeader.tsx`)
      A "use client" component using useTheme hook and getStoredUser from auth library. Renders:
      - Fixed positioning: sticky top-0 z-50, h-[4.79rem], backdrop-blur-md
      - Dark mode: same photo background + gradient overlay as sidebar
      - Light mode: solid white background
      - Left side:
        * Greeting h2: 18px Syne bold with time-of-day emoji (☀️ 5am–12pm / 🌤️ 12pm–5pm / 🌙 5pm–5am) + user's first name
        * Subtitle: 13px muted text with today's date (formatted en-NG locale) + "Yaba College of Technology"
      - Right side controls (all in pill shapes):
        * pillBg: rgba(0,0,0,0.05) light / rgba(255,255,255,0.08) dark
        * pillBorder: 1px solid rgba(0,0,0,0.10) light / 1px solid rgba(255,255,255,0.12) dark
        * pillHover: hover:bg-black/[0.07] light / hover:bg-white/[0.14] dark
        * Desktop search bar: rounded-full, search icon + "Search resources…" placeholder + ⌘K kbd badge; hides on mobile
        * Mobile search toggle: 36x36px rounded-full button; hidden on desktop
        * Wellbeing/status pill: green pulse dot + status label ("Active" in green tints)
        * Notification bell: 36x36px rounded-full, red dot badge top-right with notification count; click opens dropdown panel (300px wide, rounded-2xl, shadow-xl) listing unread conversations with avatar + name + snippet; reuses ClassNotifications component logic
        * Sun/Moon dark mode toggle (visible on sm+ screens): same pill shape as sidebar, dispatches themeToggle event on click
        * Vertical divider: 1px w-px h-[24px] separator
        * Profile chip: rounded-full, avatar 30x30px circle bg #008751 with initials + first name + ChevronDown icon; on click opens dropdown with profile link, back-to-website link, sign-out button
      - Mobile layout (< lg breakpoint): compresses controls, hides search bar and toggles, shows hamburger for sidebar
      Accept props: user (getStoredUser shape), notificationCount (number), onNotificationClick (function). Call getStoredUser internally.
      Files: src/components/portal/student/StudentHeader.tsx
      Verify: `npm run build` — no errors; render with mock user data; verify greeting displays correct emoji based on current time; check pill styling matches the color tokens; confirm notification bell and profile dropdown render correctly; inspect on mobile breakpoint and verify layout compresses as expected.

### Phase 5: Layout Wrapper

- [ ] 7. **Create StudentLayout wrapper** (`src/components/portal/student/StudentLayout.tsx`)
      A "use client" component that composes StudentSidebar, StudentHeader, and children. Renders:
      - Page background gradient (full viewport):
        * LIGHT: linear-gradient(160deg, #ffffff 0%, #f3f4f6 60%, #ffffff 100%)
        * DARK: linear-gradient(160deg, #001a0e 0%, #002814 50%, #001a0e 100%)
      - Content area with overlay:
        * LIGHT: rgba(255,255,255,0.6)
        * DARK: rgba(0,30,15,0.55)
      - Main content area adjusts margin-left based on sidebar collapsed state (listens to sidebarToggle event): ml-64 when expanded, ml-20 when collapsed
      - Sticky header sits inside the content offset wrapper (moves WITH content, not behind sidebar)
      - AI support chatbot at bottom-right corner
      - Reuse existing ClassNotifications notification system
      Manage sidebar collapsed state via useState and localStorage; listen to sidebarToggle and themeToggle events and update state accordingly.
      Accept props: children (React.ReactNode), user (optional). 
      Files: src/components/portal/student/StudentLayout.tsx
      Verify: `npm run build` — no errors; render with children; verify gradient background displays in light/dark modes; check content area margin adjusts when sidebar collapses (click toggle button); confirm header stays sticky and moves with content.

### Phase 6: Update DashboardLayout Integration

- [ ] 8. **Modify DashboardLayout** (`src/components/portal/DashboardLayout.tsx`)
      Update the existing component to check the user's role: if role === 'student', render StudentLayout wrapping children instead of the current layout. All non-student roles (admin, staff, etc.) continue using the existing layout unchanged. Preserve all existing functionality: access checks, payment notices, mobile menu state, theme toggle, logout handler, all auth flows. The StudentLayout becomes the new student-specific UI; the old layout stays for other roles.
      Files: src/components/portal/DashboardLayout.tsx
      Verify: `npm run build` — no errors; render DashboardLayout with a student user and verify StudentLayout is used; render with non-student user and verify old layout is used; confirm all access checks and payment flow still work; test theme toggle, logout, mobile menu still functional.

### Phase 7: Restyle StudentDashboardContent

- [ ] 9. **Update StudentDashboardContent styling** (`src/components/portal/student/StudentDashboardContent.tsx`)
      Restyle with new design tokens (NO logic changes):
      - Page heading: text-[26px] font-bold tracking-tight font-[syne]
      - Card styling: rounded-2xl p-6, cardBg + cardBorder, hover:shadow-md transition
      - Stat cards with 4px top accent bar (rounded-t-2xl, colored bg from tokens)
      - Stat numbers: text-[42px] font-bold font-[syne]
      - Card section headings: text-[17px] font-semibold font-[syne]
      - Body/label text: text-[15px] font-[lexend]
      - Muted text: textMuted color token
      - Dividers inside cards: cardBorder color
      - Links: primary green color #008751
      - Table cells: text-[15px] font-semibold font-[lexend] for primary, text-[14px] font-[lexend] for secondary
      - Buttons: primary (h-11 px-5 rounded-xl bg #008751 text white hover:bg #005c38)
      - Replace all inline style colors with design tokens (from designTokens.ts)
      - Preserve all JSX structure, data fetching, state, API calls, payment access checks, schedule filtering, fee calculations
      Files: src/components/portal/student/StudentDashboardContent.tsx
      Verify: `npm run build` — no errors; npm run dev and navigate to /portal/student; verify all cards render with new typography and colors; confirm all data (fees, schedule, enrollments) displays correctly; test dark mode toggle; inspect in DevTools and confirm font-[syne] and font-[lexend] classes are applied.

### Phase 8: Restyle Other Student Pages

- [ ] 10. **Update all other student page components** (styling only)
      Restyle the following components with the same design tokens and typography rules as item 9:
      - src/components/portal/student/StudentClassesContent.tsx
      - src/components/portal/student/StudentAssignmentsContent.tsx (if exists)
      - src/components/portal/student/StudentProfileContent.tsx (or similar)
      - src/components/portal/student/StudentFeesPageEnhanced.tsx
      - src/components/portal/student/StudentMaterialsContent.tsx (if exists)
      - src/components/portal/student/StudentPracticeContent.tsx (if exists)
      - src/components/portal/student/StudentSupportContent.tsx
      Apply the same token-based styling, typography, card/badge/button styles, dark mode color tokens. Preserve all business logic, data fetching, forms, state management, API calls. Update inline style colors to use design tokens. Add font-[syne] and font-[lexend] classes where appropriate.
      Files: (List each file being modified in the student components folder)
      Verify: `npm run build` — no errors; npm run dev and navigate to each student page (/portal/student/classes, /portal/student/fees, /portal/student/profile, etc.); confirm all data displays correctly with new styling; test dark mode toggle on each page; verify all forms, buttons, tables render with new tokens and typography; confirm no data loss or functional changes.

### Phase 9: Integration & Verification

- [ ] 11. **Full build and test verification**
      Run the complete build and manual testing suite:
      - `npm run build` — must complete without errors or warnings
      - `npm run dev` — start dev server
      - Navigate to /portal/student (dashboard) — verify layout with new sidebar, header, gradient background, new typography
      - Test sidebar collapse toggle on desktop — verify ml-64 / ml-20 switching
      - Test dark mode toggle on header — verify gradient, card colors, typography contrast in dark mode
      - Navigate to all student pages (classes, fees, assignments, profile, materials, practice, support) — verify new styling applied, all data displays, all forms work, no broken links
      - Test mobile layout on all pages — verify off-canvas sidebar, hamburger toggle, responsive design
      - Test logout and payment access checks still work
      - Verify no API calls changed, no business logic altered
      - Inspect DevTools to confirm font-[syne] and font-[lexend] classes resolve to Google Fonts
      - Check localStorage for "theme" and "sidebarCollapsed" keys after toggling
      Files: (integration verification, no new files)
      Verify: All above tests pass; npm run build output shows no errors; git diff shows only CSS/styling/typography changes, no logic or API changes; no console errors or warnings during dev session.

---

## Design System Reference (Embedded)

### Colors & Tokens
- **Primary green**: #008751 (active states, primary buttons, accent)
- **Dark green**: #1a5c2a, #005c38 (button hover, dark accents)
- **Yellow accent**: #facc15 (sidebar active indicator)
- **Gradient banner**: linear-gradient(120deg, #1a5c2a 0%, #008751 60%, #005c38 100%)

### Card & UI Tokens (Light / Dark)
- **cardBg**: #ffffff light / rgba(255,255,255,0.06) dark
- **cardBorder**: rgba(0,0,0,0.07) light / rgba(255,255,255,0.10) dark
- **textPrimary**: #111827 light / #ffffff dark
- **textSecondary**: #374151 light / rgba(255,255,255,0.65) dark
- **textMuted**: #9ca3af light / rgba(255,255,255,0.40) dark
- **divider**: rgba(0,0,0,0.06) light / rgba(255,255,255,0.07) dark
- **rowHover**: #f9fafb light / rgba(255,255,255,0.04) dark
- **inputBg**: #ffffff light / rgba(255,255,255,0.07) dark
- **inputBorder**: rgba(0,0,0,0.12) light / rgba(255,255,255,0.15) dark
- **barBg** (progress): #f3f4f6 light / rgba(255,255,255,0.10) dark

### Pill Token System (Header Controls)
- **pillBg**: rgba(0,0,0,0.05) light / rgba(255,255,255,0.08) dark
- **pillBorder**: 1px solid rgba(0,0,0,0.10) light / 1px solid rgba(255,255,255,0.12) dark
- **pillHover**: hover:bg-black/[0.07] light / hover:bg-white/[0.14] dark

### Typography
- **Font body**: Lexend (font-[lexend])
- **Font display**: Syne (font-[syne])
- **Page heading**: 26px bold tracking-tight Syne
- **Card heading**: 17px semibold Syne
- **Stat number**: 42px bold Syne
- **Body text**: 15px Lexend
- **Table primary**: 15px semibold Lexend
- **Table secondary**: 14px Lexend
- **Badge**: 13px semibold Lexend
- **Input**: 14–15px Lexend, h-[42px] min-height, rounded-xl px-4

### Layout
- **Sidebar**: w-64 desktop, collapsible to w-20; fixed left-0 top-0; collapse toggle at -right-3 top-8
- **Main content**: ml-64 expanded, ml-20 collapsed
- **Header**: sticky h-[4.79rem], backdrop-blur-md, sits inside content offset (moves with content)
- **Background gradient**: linear-gradient(160deg, #ffffff/#001a0e 0%, #f3f4f6/#002814 60%, #ffffff/#001a0e 100%)
- **Content overlay**: rgba(255,255,255,0.6) light / rgba(0,30,15,0.55) dark

---

## File Checklist

- [ ] src/lib/designTokens.ts (new)
- [ ] src/hooks/useTheme.ts (new)
- [ ] src/app/layout.tsx (update for Google Fonts)
- [ ] src/app/globals.css (update @theme for Tailwind fonts)
- [ ] src/components/portal/student/StudentSidebar.tsx (new)
- [ ] src/components/portal/student/StudentHeader.tsx (new)
- [ ] src/components/portal/student/StudentLayout.tsx (new)
- [ ] src/components/portal/DashboardLayout.tsx (modify for student role check)
- [ ] src/components/portal/student/StudentDashboardContent.tsx (restyle)
- [ ] src/components/portal/student/StudentClassesContent.tsx (restyle)
- [ ] src/components/portal/student/StudentFeesPageEnhanced.tsx (restyle)
- [ ] src/components/portal/student/StudentProfileContent.tsx (restyle, if exists)
- [ ] src/components/portal/student/StudentMaterialsContent.tsx (restyle, if exists)
- [ ] src/components/portal/student/StudentPracticeContent.tsx (restyle, if exists)
- [ ] src/components/portal/student/StudentSupportContent.tsx (restyle, if exists)
- [ ] src/components/portal/student/StudentAssignmentsContent.tsx (restyle, if exists)

---

## Notes for Implementer

1. **Next.js 16.3.4 with Tailwind CSS 4**: Uses @tailwindcss/postcss; no separate tailwind.config.js file. Font configuration happens via CSS custom properties in @theme inline blocks (see globals.css).

2. **Font Loading**: Use Google Fonts link in root layout's <head> <link> tag with font-display=swap. Define CSS variables --font-lexend and --font-syne. Reference them in Tailwind @theme block so font-[lexend] and font-[syne] classes work.

3. **Dark Mode**: Custom browser event 'themeToggle' with detail.isDarkMode; localStorage key "theme" ("dark" or "light"). useTheme hook handles this pattern. StudentLayout, StudentSidebar, StudentHeader must all use useTheme to read and listen for theme changes.

4. **Sidebar Collapse**: Custom browser event 'sidebarToggle' with detail.collapsed; localStorage key "sidebarCollapsed". StudentSidebar dispatches; StudentLayout listens and adjusts ml-64 / ml-20.

5. **Existing Auth/State**: getStoredUser() returns user object with first_name, last_name, role. Keep all auth checks, payment access logic, and API fetch patterns unchanged.

6. **StudentLayout is the integration point**: All student pages (currently wrapping with DashboardLayout) will continue to do so. DashboardLayout checks role and delegates to StudentLayout for students. No changes to page files needed.

7. **Preserve all existing**: DO NOT change any JSX structure in StudentDashboardContent or other page components except for style props and class names. All data fetching, state, calculations, validation, forms remain identical.
