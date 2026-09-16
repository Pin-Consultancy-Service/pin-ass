"use client";

import { startTransition, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";

/* ─── Programme submenu data ─────────────────────────── */
const programmes = [
  { label: "ICAN",            href: "/courses/ican",         desc: "Institute of Chartered Accountants of Nigeria" },
  { label: "ACCA",            href: "/courses/acca",         desc: "Association of Chartered Certified Accountants" },
  { label: "CITN",            href: "/courses/citn",         desc: "Chartered Institute of Taxation of Nigeria" },
  { label: "ATS",             href: "/courses/ats",          desc: "Accounting Technicians Scheme West Africa" },
  { label: "CISA",            href: "/courses/cisa",         desc: "Certified Information Systems Auditor" },
  { label: "Diploma in IFRS", href: "/courses/ifrs-diploma", desc: "International Financial Reporting Standards" },
];

const navLinks = [
  { label: "About",    href: "/about" },
  { label: "Students", href: "/courses",           dropdown: true },
  { label: "Clients",  href: "/corporate" },
  { label: "Training", href: "/corporate#training" },
  { label: "Payment",  href: "/payment" },
  { label: "Contact",  href: "/contact" },
];

const portalLinks = [
  { label: "Student Portal",  href: "/portal/student" },
  { label: "Client Portal",   href: "/portal/client" },
  { label: "Training Portal", href: "/portal/training" },
];

/* Scroll threshold before nav solidifies */
const SCROLL_THRESHOLD = 48;

export default function Navbar() {
  const [scrolled,          setScrolled]          = useState(false);
  const [mobileOpen,        setMobileOpen]         = useState(false);
  const [studentsOpen,      setStudentsOpen]       = useState(false);
  const [portalOpen,        setPortalOpen]         = useState(false);
  const [mobileStudentsOpen,setMobileStudentsOpen] = useState(false);
  const pathname    = usePathname();
  const studentsRef = useRef<HTMLLIElement>(null);
  const portalRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    startTransition(() => {
      setMobileOpen(false);
      setStudentsOpen(false);
      setPortalOpen(false);
    });
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (studentsRef.current && !studentsRef.current.contains(e.target as Node))
        setStudentsOpen(false);
      if (portalRef.current && !portalRef.current.contains(e.target as Node))
        setPortalOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /* Resolved colour tokens — always passed as style={{ color }} so Tailwind
     build-time scanning is not required for these dynamic values. */
  const navTextColor   = scrolled ? "var(--ink)"       : "#ffffff";
  const navMutedColor  = scrolled ? "var(--ink-muted)" : "rgba(255,255,255,0.55)";
  const navHoverColor  = scrolled ? "var(--gold-dark)"  : "rgba(255,255,255,0.75)";
  const navActiveColor = scrolled ? "var(--gold-dark)"  : "var(--gold)";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={
          scrolled
            ? {
                backgroundColor: "rgba(250,249,246,0.96)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderBottom: "1px solid var(--rule)",
              }
            : { backgroundColor: "transparent" }
        }
      >
        <nav className="content-container flex items-center justify-between h-16 lg:h-[68px]">

          {/* ── Wordmark / Logo ───────────────────── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <Image
              src="/images/pin-logo.png"
              alt="PIN Associate"
              width={36}
              height={36}
              className="object-contain"
            />
            {/* Serif wordmark */}
            <div className="leading-none">
              <span
                className="block transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "1.125rem",
                  letterSpacing: "0.01em",
                  color: scrolled ? "var(--ink)" : "#fff",
                }}
              >
                PIN Associate
              </span>
              <span
                className="block transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: scrolled ? "var(--ink-faint)" : "rgba(255,255,255,0.5)",
                }}
              >
                Pass It Now
              </span>
            </div>
          </Link>

          {/* ── Desktop links ─────────────────────── */}
          <ul className="hidden lg:flex items-center gap-0">
            {navLinks.map((link) =>
              link.dropdown ? (
                <li key={link.label} ref={studentsRef} className="relative">
                  <button
                    onClick={() => setStudentsOpen((o) => !o)}
                    className="flex items-center gap-1 px-4 py-2 text-sm transition-colors duration-200"
                    style={{
                      color: isActive(link.href) ? navActiveColor : navTextColor,
                      fontWeight: isActive(link.href) ? 500 : 400,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = navHoverColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = isActive(link.href) ? navActiveColor : navTextColor)}
                    aria-expanded={studentsOpen}
                    aria-haspopup="true"
                  >
                    {link.label}
                    <ChevronDown
                      className={cn("w-3.5 h-3.5 transition-transform duration-200", studentsOpen && "rotate-180")}
                    />
                  </button>

                  {studentsOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[520px] bg-white overflow-hidden z-50"
                      style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
                    >
                      <div className="p-4">
                        <p
                          className="pb-3 mb-2 eyebrow"
                          style={{ borderBottom: "1px solid var(--rule)" }}
                        >
                          Examination Programmes
                        </p>
                        <div className="grid grid-cols-2 gap-0.5">
                          {programmes.map((p) => (
                            <Link
                              key={p.href}
                              href={p.href}
                              className="flex flex-col gap-0.5 px-3 py-2.5 transition-colors duration-150 hover:bg-[var(--surface)]"
                            >
                              <span
                                style={{
                                  fontFamily: "var(--font-display)",
                                  fontWeight: 500,
                                  fontSize: "0.9375rem",
                                  color: "var(--ink)",
                                }}
                              >
                                {p.label}
                              </span>
                              <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>
                                {p.desc}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <div style={{ borderTop: "1px solid var(--rule)", marginTop: "0.75rem", paddingTop: "0.75rem" }}>
                          <Link
                            href="/courses"
                            className="eyebrow hover:text-[var(--navy-dark)] transition-colors"
                          >
                            View all programmes &amp; fees →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ) : (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="px-4 py-2 text-sm transition-colors duration-200 block"
                    style={{
                      color: isActive(link.href) ? navActiveColor : navTextColor,
                      fontWeight: isActive(link.href) ? 500 : 400,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = navHoverColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = isActive(link.href) ? navActiveColor : navTextColor)}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* ── Desktop CTA ───────────────────────── */}
          <div className="hidden lg:flex items-center gap-3" ref={portalRef}>
            {/* Portal login dropdown */}
            <div className="relative">
              <button
                onClick={() => setPortalOpen((o) => !o)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm transition-colors duration-200"
                style={{ color: navTextColor, background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = navHoverColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = navTextColor)}
                aria-expanded={portalOpen}
              >
                <LogIn className="w-3.5 h-3.5" />
                Portal
                <ChevronDown className={cn("w-3 h-3 transition-transform", portalOpen && "rotate-180")} />
              </button>

              {portalOpen && (
                <div
                  className="absolute top-full right-0 mt-1 w-44 bg-white z-50"
                  style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
                >
                  <div className="py-1.5">
                    {portalLinks.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        className="block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--surface)]"
                        style={{ color: "var(--ink)" }}
                      >
                        {p.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: "1px solid var(--rule)", margin: "0.25rem 0" }} />
                    <Link
                      href="/portal/register"
                      className="block px-4 py-2 eyebrow hover:text-[var(--navy-dark)] transition-colors"
                    >
                      Create an account →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Primary CTA green fill when scrolled, white ghost over hero */}
            {scrolled ? (
              <Link href="/portal/login" className="btn btn-primary" style={{ height: "2.375rem", fontSize: "0.8125rem" }}>
                Apply Now
              </Link>
            ) : (
              <Link
                href="/portal/login"
                className="btn"
                style={{
                  height: "2.375rem",
                  fontSize: "0.8125rem",
                  backgroundColor: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  color: "#ffffff",
                  borderRadius: "2px",
                }}
              >
                Apply Now
              </Link>
            )}
          </div>

          {/* ── Mobile toggle ─────────────────────── */}
          <button
            className="lg:hidden p-2 transition-colors"
            style={{ color: navTextColor, background: "none", border: "none", cursor: "pointer" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* ── Mobile drawer ─────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute top-0 right-0 w-[85vw] max-w-sm h-full overflow-y-auto flex flex-col"
            style={{ backgroundColor: "var(--bg)" }}
          >
            {/* Drawer header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid var(--rule)" }}
            >
              <div className="flex items-center gap-2.5">
                <Image src="/images/pin-logo.png" alt="PIN Associate" width={30} height={30} className="object-contain" />
                <span
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1rem", color: "var(--ink)" }}
                >
                  PIN Associate
                </span>
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ color: "var(--ink-muted)" }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer nav */}
            <nav className="flex-1 px-4 py-4 space-y-0.5">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <button
                      onClick={() => setMobileStudentsOpen((o) => !o)}
                      className="w-full flex items-center justify-between px-3 py-3 text-sm transition-colors hover:bg-[var(--surface)]"
                      style={{ color: "var(--ink)" }}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={cn("w-4 h-4 transition-transform", mobileStudentsOpen && "rotate-180")} style={{ color: "var(--ink-faint)" }} />
                    </button>
                    {mobileStudentsOpen && (
                      <div className="ml-4 border-l" style={{ borderColor: "var(--rule)" }}>
                        {programmes.map((p) => (
                          <Link
                            key={p.href}
                            href={p.href}
                            className="block px-4 py-2.5 text-sm hover:bg-[var(--surface)] transition-colors"
                            style={{ color: "var(--ink-muted)" }}
                          >
                            {p.label}
                          </Link>
                        ))}
                        <Link
                          href="/courses"
                          className="block px-4 py-2.5 eyebrow hover:text-[var(--navy-dark)] transition-colors"
                        >
                          All programmes →
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex px-3 py-3 text-sm transition-colors hover:bg-[var(--surface)]"
                    style={{
                      color: isActive(link.href) ? "var(--navy)" : "var(--ink)",
                      fontWeight: isActive(link.href) ? 500 : 400,
                    }}
                  >
                    {link.label}
                  </Link>
                )
              )}

              {/* Portal links */}
              <div className="pt-4 mt-4" style={{ borderTop: "1px solid var(--rule)" }}>
                <p className="eyebrow px-3 pb-2">Portal Login</p>
                {portalLinks.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="flex px-3 py-2.5 text-sm transition-colors hover:bg-[var(--surface)]"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Drawer footer */}
            <div className="p-4 space-y-2.5" style={{ borderTop: "1px solid var(--rule)" }}>
              <Link href="/portal/register" className="btn btn-primary w-full justify-center">
                Apply Now
              </Link>
              <Link
                href="/portal/login"
                className="btn btn-outline w-full justify-center"
              >
                Sign In to Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
