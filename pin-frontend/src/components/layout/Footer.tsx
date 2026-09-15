"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

/* ─── Social SVG icons ───────────────────────────────── */
const FacebookIcon  = () => <svg viewBox="0 0 24 24" style={{ width: "0.875rem", height: "0.875rem", fill: "currentColor" }} aria-hidden="true"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>;
const TwitterIcon   = () => <svg viewBox="0 0 24 24" style={{ width: "0.875rem", height: "0.875rem", fill: "currentColor" }} aria-hidden="true"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" style={{ width: "0.875rem", height: "0.875rem", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }} aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const LinkedinIcon  = () => <svg viewBox="0 0 24 24" style={{ width: "0.875rem", height: "0.875rem", fill: "currentColor" }} aria-hidden="true"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;

/* ─── Nav data ─────────────────────────────────────────── */
const programmes = [
  { label: "ICAN",            href: "/courses/ican" },
  { label: "ACCA",            href: "/courses/acca" },
  { label: "CITN",            href: "/courses/citn" },
  { label: "ATS",             href: "/courses/ats" },
  { label: "CISA",            href: "/courses/cisa" },
  { label: "Diploma in IFRS", href: "/courses/ifrs-diploma" },
  { label: "All Programmes",  href: "/courses" },
];

const corporateLinks = [
  { label: "Business Advisory",       href: "/corporate" },
  { label: "Taxation",                href: "/corporate" },
  { label: "Financial Statements",    href: "/corporate" },
  { label: "Corporate Training",      href: "/corporate#training" },
  { label: "Book a Consultation",     href: "/contact?service=consultancy" },
];

const portals = [
  { label: "Student Portal",  href: "/portal/student" },
  { label: "Client Portal",   href: "/portal/client" },
  { label: "Training Portal", href: "/portal/training" },
  { label: "Make a Payment",  href: "/payment" },
  { label: "Create Account",  href: "/portal/register" },
];

const company = [
  { label: "About PIN Associate", href: "/about" },
  { label: "Leadership Team",     href: "/about#team" },
  { label: "Contact Us",          href: "/contact" },
  { label: "Apply for Tutoring",  href: "/apply" },
  { label: "FAQs",                href: "/#faq" },
];

const socials = [
  { Icon: FacebookIcon,  href: "#", label: "Facebook" },
  { Icon: TwitterIcon,   href: "#", label: "Twitter / X" },
  { Icon: InstagramIcon, href: "#", label: "Instagram" },
  { Icon: LinkedinIcon,  href: "#", label: "LinkedIn" },
];

/* ─── Link column ──────────────────────────────────────── */
function Col({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.6875rem",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          marginBottom: "1.25rem",
        }}
      >
        {heading}
      </p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", transition: "color 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--ink)", color: "rgba(255,255,255,0.6)" }}>

      {/* ── CTA band ──────────────────────────── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="content-container py-14">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.2,
                  marginBottom: "0.5rem",
                }}
              >
                Ready to start your journey with PIN?
              </h3>
              <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.45)" }}>
                5,000+ professionals qualified with our help since 2009.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link href="/apply" className="btn btn-primary" style={{ height: "2.75rem", fontSize: "0.875rem" }}>
                Register for Tutoring <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact?service=consultancy"
                className="btn"
                style={{
                  height: "2.75rem", fontSize: "0.875rem",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.7)",
                  borderRadius: "2px",
                }}
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main body ────────────────────────── */}
      <div className="content-container py-16">

        {/* Brand row */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 mb-14 pb-14" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>

          {/* Logo + description */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <Image
                src="/images/pin-logo.png"
                alt="PIN Associate"
                width={28}
                height={28}
                className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: "0.01em",
                }}
              >
                PIN Associate
              </span>
            </Link>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
              Nigeria&apos;s trusted professional exam tutoring and business consultancy firm.
              ICAN · ACCA · CITN · ATS · CISA · IFRS since 2009.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "2rem", height: "2rem",
                    color: "rgba(255,255,255,0.35)",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "Address", value: SITE_CONFIG.contact.address },
              { label: "Phone",   value: SITE_CONFIG.contact.phone,   href: `tel:${SITE_CONFIG.contact.phone.replace(/\s/g, "")}` },
              { label: "Email",   value: SITE_CONFIG.contact.email,   href: `mailto:${SITE_CONFIG.contact.email}` },
              { label: "Hours",   value: SITE_CONFIG.contact.hours },
            ].map(({ label, value, href }: { label: string; value: string; href?: string }) => (
              <div key={label}>
                <p
                  style={{
                    fontSize: "0.6875rem", fontWeight: 500,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.25)",
                    marginBottom: "0.2rem",
                  }}
                >
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", transition: "color 0.2s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {value}
                  </a>
                ) : (
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>{value}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          <Col heading="Programmes"        links={programmes} />
          <Col heading="Corporate"         links={corporateLinks} />
          <Col heading="Portals"           links={portals} />
          <Col heading="Company"           links={company} />
        </div>
      </div>

      {/* ── Legal bar ────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="content-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} PIN Associate (Pass It Now Associates). All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Use",   href: "/terms" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", transition: "color 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
