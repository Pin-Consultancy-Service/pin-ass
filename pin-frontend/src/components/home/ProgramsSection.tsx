"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ─── Data — content unchanged ───────────────────────── */
const programs = [
  {
    id: "ican",
    title: "ICAN",
    fullName: "Institute of Chartered Accountants of Nigeria",
    overview: "Comprehensive tuition across all levels Foundation, Skills, and Professional. Nigeria's most respected accounting qualification.",
    duration: "12–36 months",
    levels: ["Foundation", "Skills", "Professional"],
    badge: "Most Popular",
    href: "/courses/ican",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552599/ican-logo_tg9meu.jpg",
  },
  {
    id: "acca",
    title: "ACCA",
    fullName: "Association of Chartered Certified Accountants",
    overview: "Globally recognised. We prepare you for Applied Knowledge, Applied Skills, and Strategic Professional levels.",
    duration: "18–48 months",
    levels: ["Applied Knowledge", "Applied Skills", "Strategic Professional"],
    badge: "International",
    href: "/courses/acca",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552629/ACCA_logo.svg_osfbx1.webp",
  },
  {
    id: "citn",
    title: "CITN",
    fullName: "Chartered Institute of Taxation of Nigeria",
    overview: "Nigeria's premier tax qualification. Qualifying and Professional levels taught by active tax practitioners.",
    duration: "12–24 months",
    levels: ["Qualifying", "Professional"],
    badge: "Tax Focused",
    href: "/courses/citn",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552741/CITN-logo_rqc5j5.jpg",
  },
  {
    id: "ats",
    title: "ATS",
    fullName: "Accounting Technicians Scheme West Africa",
    overview: "The accessible entry point into professional accounting. Ideal for OND holders and school leavers.",
    duration: "6–18 months",
    levels: ["Foundation", "Intermediate", "Final"],
    badge: "Entry Level",
    href: "/courses/ats",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784553799/ATSWB-logo_pkmnpp.jpg",
  },
  {
    id: "cisa",
    title: "CISA",
    fullName: "Certified Information Systems Auditor",
    overview: "IT governance and information systems audit. ISACA-recognised certification for audit and IT professionals.",
    duration: "6–12 months",
    levels: ["Single Level"],
    badge: "IT Audit",
    href: "/courses/cisa",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552746/CISA-logo_emfhdi.png",
  },
  {
    id: "ifrs-diploma",
    title: "Diploma in IFRS",
    fullName: "International Financial Reporting Standards",
    overview: "ACCA-accredited diploma for accountants requiring international reporting expertise. Certificate or full Diploma.",
    duration: "3–6 months",
    levels: ["Certificate in IFRS", "Diploma in IFRS"],
    badge: "ACCA Accredited",
    href: "/courses/ifrs-diploma",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552753/ifrs-logo_ellqno.svg",
  },
  {
    id: "corporate",
    title: "Corporate Training",
    fullName: "Tailored Workforce Development",
    overview: "Custom programmes for organisations: accounting, tax, financial management, and regulatory compliance for your team.",
    duration: "Flexible",
    levels: ["Customised"],
    badge: "For Organisations",
    href: "/corporate",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552599/ican-logo_tg9meu.jpg",
  },
  {
    id: "consulting",
    title: "Business Consulting",
    fullName: "Strategic Advisory Services",
    overview: "Financial advisory, business strategy, tax consulting, and regulatory compliance for SMEs and corporates.",
    duration: "Ongoing",
    levels: ["Advisory"],
    badge: "Advisory",
    href: "/courses/consulting",
    icon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552599/ican-logo_tg9meu.jpg",
  },
];

/* ─── Single programme row ───────────────────────────── */
function ProgramRow({
  prog,
  index,
}: {
  prog: (typeof programs)[0];
  index: number;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
    >
      <Link
        href={prog.href}
        className="group flex items-start gap-6 py-7 transition-colors"
        style={{ borderTop: "1px solid var(--rule)" }}
      >
        {/* Logo */}
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: "3rem",
            height: "3rem",
            border: "1px solid var(--rule)",
            backgroundColor: "var(--bg)",
          }}
        >
          {!imgFailed ? (
            <img
              src={prog.icon}
              alt={prog.title}
              width={32}
              height={32}
              className="object-contain"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "1rem",
                color: "var(--navy)",
              }}
            >
              {prog.title.slice(0, 2)}
            </span>
          )}
        </div>

        {/* Content — asymmetric 3-col: title / overview / meta */}
        <div className="flex-1 grid lg:grid-cols-[160px_1fr_180px] gap-4 lg:gap-8 items-start">

          {/* Title column */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "1.25rem",
                color: "var(--ink)",
                lineHeight: 1.2,
                marginBottom: "0.25rem",
              }}
              className="group-hover:text-[var(--navy)] transition-colors"
            >
              {prog.title}
            </p>
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-faint)",
              }}
            >
              {prog.badge}
            </p>
          </div>

          {/* Overview */}
          <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "var(--ink-muted)" }}>
            {prog.fullName}  {prog.overview}
          </p>

          {/* Meta */}
          <div className="flex lg:flex-col lg:items-end items-center gap-3 lg:gap-1.5">
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink-faint)",
              }}
            >
              {prog.duration}
            </span>
            <div className="flex items-center gap-1.5" style={{ color: "var(--navy)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 500 }}>Explore</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProgramsSection() {
  return (
    <section
      style={{ backgroundColor: "var(--bg)", paddingTop: "6rem", paddingBottom: "7rem" }}
    >
      <div className="content-container">

        {/* Section header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <span className="brand-rule" />
          <span className="eyebrow" style={{ marginBottom: "1rem" }}>Our Programmes</span>

          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(1.875rem, 3.5vw, 3rem)",
                lineHeight: 1.15,
                color: "var(--ink)",
              }}
            >
              Professional Qualifications
              <br />
              <em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>
                We Prepare You For
              </em>
            </h2>
            <Link href="/courses" className="btn btn-outline flex-shrink-0">
              All Programmes &amp; Fees
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Editorial row list — not a card grid */}
        <div>
          {programs.map((prog, i) => (
            <ProgramRow key={prog.id} prog={prog} index={i} />
          ))}
          {/* Final bottom border */}
          <div style={{ borderBottom: "1px solid var(--rule)" }} />
        </div>

      </div>
    </section>
  );
}
