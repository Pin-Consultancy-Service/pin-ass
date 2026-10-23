# Admin CRM Dashboard Enhancement

Built a modern admin portal with scrollable sidebar, SVG-based analytics charts, CRUD modals for student/instructor/class management, and glassmorphic design. The implementation uses pure SVG for charts (no external libraries), integrates modal forms with validation, and applies CSS variable-based dark mode support. Sidebar overflow is fixed, charts render with gradients and hover states, and mobile responsiveness follows the established pattern.

**Watch for:** Modal accessibility gaps (**confirmed**) — no focus trap or ARIA roles; AddInstructorModal button is wired but stub-only (**confirmed**); DonutChart transform-origin breaks in Safari (**likely**); BaseModal backdrop click event fires on content click in nested scenarios (**possible**).

**Verdict**: NEEDS_CHANGES

---

## High-level view

The sidebar fix adds explicit height constraints and scrollbar styling, addressing the overflow issue on smaller screens. All 10 navigation items are now reachable on desktop and mobile, though custom scrollbar styles are Windows-only and ignored on macOS/iOS.

Three chart components (LineChart, AreaChart, BarChart) render valid SVG with gradient fills, hover tooltips, and responsive viewBox sizing. They animate on mount, use CSS variables for theming, and integrate with mock data generators that aggregate enrollments and payments. A fourth chart (DonutChart) exists but is unused — the dashboard calls BarChart for programme breakdown instead of the planned donut visualization.

CRUD modals follow a BaseModal wrapper pattern with glassmorphic backdrop blur and ESC-key dismissal. AddStudentModal and CreateClassModal are fully wired with validation and success callbacks. AddInstructorModal renders but the "Add Instructor" button in AdminInstructorsContent.tsx (line 48) does not open it — the button exists as a stub with no onClick handler.

Glassmorphism is applied to stat cards with gradient backgrounds, hover scale effects, and overlay transitions. The design matches the plan's specifications for border-radius, padding, and color palette. Dark mode support is complete via CSS variables, though no dark mode audit was performed to verify all new components in practice.

Mobile responsiveness follows the existing desktop-hidden / mobile-visible pattern for tables and cards. Modals do not switch to full-screen on mobile as planned — BaseModal uses fixed width classes that respect md: breakpoints but do not fill the viewport on small devices.

---

<details>
<summary>Issues (8)</summary>

1. **AddInstructorModal not wired** — AdminInstructorsContent.tsx line 48 renders an "Add Instructor" button with no onClick handler. The modal component exists but is never opened. Wire it using the same pattern as AddStudentModal in AdminStudentsContent.tsx lines 11, 42, 220-227.

2. **DonutChart created but unused** — Dashboard calls BarChart for programme breakdown instead of DonutChart. Either integrate DonutChart or remove the file to avoid dead code.

3. **Modal accessibility gaps** — BaseModal lacks focus trap (focus can tab outside the modal), no role="dialog", no aria-labelledby linking title to modal, no initial focus management. Add these for screen reader and keyboard navigation compliance.

4. **BaseModal backdrop click event fires on content** — Clicking modal content triggers onClose if click bubbles to backdrop div. Add stopPropagation to modal content div or check event.target === event.currentTarget in backdrop onClick.

5. **DonutChart transform-origin breaks in Safari** — Line 47 uses `transformOrigin: 'center'` in style object, which Safari may not parse correctly for SVG elements. Move transform-origin to CSS class or remove hover scale effect for donut segments.

6. **Mobile modal not full-screen** — BaseModal uses `w-full md:w-[600px]` which respects md breakpoint but does not force full-screen on mobile. On small devices, modal has horizontal padding from parent `.p-4` class. Change to `w-full h-full md:w-[600px] md:h-auto md:rounded-2xl` and remove padding on mobile.

7. **No loading or error states in modals** — AddStudentModal, AddInstructorModal, CreateClassModal have isSubmitting state but no error handling. Forms silently succeed after 1s timeout with no error path. Add try/catch blocks and error state display even in mock implementation.

8. **Sidebar scrollbar not visible on macOS/iOS** — AdminDashboardLayout.tsx line 250 uses `scrollbarWidth: 'thin'` which is Firefox-only. WebKit devices show no scrollbar. Add `-webkit-scrollbar` styles or rely on default overflow-y-auto behavior.

</details>

---

<details>
<summary>Details</summary>

## Sidebar scroll fix and cross-browser scrollbar gap

The sidebar uses `height: calc(100vh - 80px)` (line 247) instead of top/bottom positioning, giving the container a defined height for overflow-y-auto. Desktop sidebar (lines 241-265) wraps navigation in `flex-1 overflow-y-auto` with `scrollbarWidth: thin`. Mobile sidebar (lines 171-220) uses `max-height: calc(100vh - 80px)` (line 193).

Custom scrollbar styling (`scrollbarWidth: thin`) only affects Firefox. WebKit browsers ignore it and show default scrollbars, meaning the "thin" design intent is not universal on macOS/iOS. To target WebKit, add `::-webkit-scrollbar` styles in globals.css.

## SVG chart components without external dependencies

LineChart (lines 20-70) maps data points to SVG path commands, fills the area with a linear gradient, and displays tooltips on hover (lines 117-135). Grid lines (lines 46-56) and Y-axis labels (lines 92-106) provide scale context. AreaChart follows the same pattern with gradient-only fill. BarChart supports horizontal/vertical modes (lines 36-83, 86-171) with hover opacity effects that highlight individual bars.

All charts use CSS variables for colors (dark mode compatible), responsive viewBox sizing, and maxHeight constraints. No chart libraries imported.

DonutChart calculates segment angles and renders SVG arcs (lines 29-45) with a legend, but the dashboard uses BarChart for programme breakdown (AdminDashboardContent.tsx line 239) instead, leaving DonutChart unused.

## CRUD modals and accessibility gaps

BaseModal provides backdrop blur (line 55), ESC-key dismissal (lines 21-23), body overflow lock (lines 26-28), and size variants (lines 45-50). Focus can tab outside the modal and screen readers don't announce it as a dialog — missing `role="dialog"`, `aria-labelledby`, `aria-modal="true"`, and focus trap.

AddStudentModal validates required fields and email (lines 25-38), shows errors below inputs (lines 102, 113, 124, 148), and integrates with AdminStudentsContent (lines 11, 42, 220-227). CreateClassModal has multi-field validation (lines 25-35) but is not wired to AdminClassesContent.tsx line 63. AddInstructorModal is complete but AdminInstructorsContent.tsx line 48 renders the button with no onClick handler.

## Glassmorphism design and unwired header buttons

Stat cards (lines 97-191) use gradient overlays that transition to 5% opacity on hover, with scale-to-1.02 effects and color-coded gradient icons. Page header (lines 48-84) has navy gradient background with radial gold overlay. Header action buttons (lines 63-82) are not wired — they're static UI elements.

## Chart data disconnected from enrollment records

Data generators (mockAdminData.ts lines 294-326) return hardcoded arrays instead of aggregating mockEnrollments by month/week as planned (plan lines 213-225). The dashboard displays static 7-month revenue, 8-week enrollment counts, and programme breakdown with no tie to actual enrollment data. Future API integration would replace these generators entirely.

## Mobile modal not full-screen as planned

Tables use `hidden md:block` / `md:hidden` pattern for desktop/mobile views. BaseModal uses `w-full md:w-[600px]` (lines 45-50), which respects breakpoints but keeps 16px horizontal padding from parent `.p-4` (line 53) on mobile, plus 10vh top/bottom margins from max-h-[90vh]. For true full-screen mobile, use `w-full h-full md:w-[600px] md:h-auto` and conditionally apply rounded corners.

## Dark mode not visually audited

All components use CSS variables (`var(--bg)`, `var(--surface)`, `var(--ink)`, etc.) that switch when `data-theme="dark"` is applied (line 60). Theme toggle (lines 70-76, 157-163) persists to localStorage. Charts reference CSS variables in fill/stroke, so gradients adapt automatically. No visual audit performed — hardcoded colors in chart labels or borders could remain.



## Missing wiring and stub error handling

AddInstructorModal is never opened — AdminInstructorsContent.tsx line 48 button has no onClick. CreateClassModal exists but AdminClassesContent.tsx line 63 button is unwired. AdminFinancesContent.tsx lines 89-104 shows "Analytics coming soon" placeholder instead of charts.

Modal error handling is stub-only: all three modals use setTimeout success simulation (AddStudentModal.tsx lines 44-49) with no error path. Validate functions return boolean but don't surface API-level errors (duplicate email, server failure).

## Build status unknown

No build_note file exists (.agents/tasks/admin-crm-build-note.md returns 404). Build status, TypeScript errors, ESLint warnings, and runtime console errors are unverified. The plan's success criteria (lines 466-478) require "Build succeeds" and "No console errors," but these cannot be confirmed from code review alone.

</details>

---

## File map

<details>
<summary>Files changed (14)</summary>

**Layout and routing:**
- `src/components/admin/AdminDashboardLayout.tsx` — Fixed sidebar overflow with explicit height, added scrollbar styling
- `src/app/admin/dashboard/page.tsx` — Admin dashboard route entry point

**Dashboard and content pages:**
- `src/components/admin/AdminDashboardContent.tsx` — Main dashboard with stat cards, charts, activity feed, integrated SVG charts
- `src/components/admin/AdminStudentsContent.tsx` — Student management table with Add Student modal integration
- `src/components/admin/AdminInstructorsContent.tsx` — Instructor table with expandable rows, Add button stub
- `src/components/admin/AdminClassesContent.tsx` — Class cards grid with filters, Schedule button stub
- `src/components/admin/AdminFinancesContent.tsx` — Financial table with payment status tracking, placeholder chart section

**Chart components:**
- `src/components/admin/charts/LineChart.tsx` — SVG line chart with gradient area fill, hover tooltips, grid lines
- `src/components/admin/charts/AreaChart.tsx` — SVG area chart with gradient fill, used for enrollment growth
- `src/components/admin/charts/BarChart.tsx` — SVG bar chart with horizontal/vertical modes, hover highlighting
- `src/components/admin/charts/DonutChart.tsx` — SVG donut chart with legend, created but unused

**Modal components:**
- `src/components/admin/modals/BaseModal.tsx` — Modal wrapper with backdrop blur, ESC key handler, size variants
- `src/components/admin/modals/AddStudentModal.tsx` — Student registration form with validation, wired to AdminStudentsContent
- `src/components/admin/modals/AddInstructorModal.tsx` — Instructor form with specialization field, not wired to page
- `src/components/admin/modals/CreateClassModal.tsx` — Multi-field class scheduling form, not wired to page

**Data layer:**
- `src/lib/mockAdminData.ts` — Mock data structures, chart data generators, system stats calculator

Full diff: `git diff main src/components/admin src/lib/mockAdminData.ts`

</details>
