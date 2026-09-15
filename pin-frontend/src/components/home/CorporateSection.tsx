"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ─── Services data — unchanged ──────────────────────── */
const services = [
  {
    title: "Business Advisory",
    body: "Strategic planning, financial modelling, and feasibility studies to guide key organisational decisions.",
  },
  {
    title: "Financial Consulting",
    body: "Advisory on financial reporting, IFRS compliance, internal controls, and management accounts.",
  },
  {
    title: "Tax Advisory",
    body: "Corporate tax planning, FIRS compliance, transfer pricing documentation, and dispute support.",
  },
  {
    title: "Business Strategy",
    body: "Financial modelling, feasibility studies, and strategic planning for SMEs and growing businesses.",
  },
  {
    title: "Regulatory Compliance",
    body: "Ensuring your organisation meets FIRS, SEC, CBN, and sector-specific regulatory requirements.",
  },
  {
    title: "Corporate Workshops",
    body: "Bespoke short-course workshops on IFRS updates, tax law changes, audit standards, and finance.",
  },
];

/* ─── Client logos — unchanged ───────────────────────── */
const clients = [
  { name: "Dangote Group",    favicon: "https://www.google.com/s2/favicons?domain=dangote.com&sz=64" },
  { name: "GTBank",           favicon: "https://www.google.com/s2/favicons?domain=gtbank.com&sz=64" },
  { name: "Nestlé Nigeria",   favicon: "https://www.google.com/s2/favicons?domain=nestle.com&sz=64" },
  { name: "MTN Nigeria",      favicon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784556331/mtn_itwx4q.jpg" },
  { name: "First Bank",       favicon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784556324/First-Bank-New-Logo_x7xfgu.png" },
  { name: "Flour Mills",      favicon: "https://www.google.com/s2/favicons?domain=fmnplc.com&sz=64" },
  { name: "Lagos State Govt", favicon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784556338/lagos-logo_kub7qs.png" },
  { name: "NNPC",             favicon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784556186/NNPC-Logo_c7frv9.jpg" },
];

function ClientLogo({ name, favicon }: { name: string; favicon: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-6 py-2 mx-1" style={{ borderRight: "1px solid var(--rule)" }}>
      <div style={{ width: 22, height: 22, flexShrink: 0 }}>
        {!failed ? (
          <img src={favicon} alt={name} width={22} height={22} className="object-contain" onError={() => setFailed(true)} />
        ) : (
          <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--ink-muted)" }}>{initials}</span>
        )}
      </div>
      <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--ink-faint)", whiteSpace: "nowrap" }}>{name}</span>
    </div>
  );
}

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } };

export default function CorporateSection() {
  const triple = [...clients, ...clients, ...clients];

  return (
    <section style={{ backgroundColor: "var(--surface)" }}>

      {/* ── Main body ─────────────────────────── */}
      <div className="content-container py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-14 lg:gap-20 items-start">

          {/* Left — sticky header */}
          <motion.div
            className="lg:sticky lg:top-28"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            <span className="brand-rule" />
            <span className="eyebrow" style={{ marginBottom: "1rem" }}>Corporate Services</span>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(1.875rem, 3.5vw, 3rem)",
                lineHeight: 1.15,
                color: "var(--ink)",
                marginBottom: "1.25rem",
              }}
            >
              Professional Training &amp;
              <br />
              <em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>
                Advisory for Organisations
              </em>
            </h2>

            <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--ink-muted)", marginBottom: "1rem" }}>
              We partner with Nigerian corporations, government agencies, and SMEs to develop
              finance teams, ensure regulatory compliance, and deliver practical business
              advisory that drives measurable results.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-0 mt-8 mb-10" style={{ borderTop: "1px solid var(--rule)" }}>
              {[
                { v: "500+", l: "Staff Trained" },
                { v: "50+",  l: "Organisations Served" },
                { v: "16+",  l: "Years of Practice" },
                { v: "48h",  l: "Proposal Turnaround" },
              ].map(({ v, l }) => {
                /* Split "500+" → numeral "500" + suffix "+" (or "h", etc.) */
                const match  = v.match(/^([\d,]+)(.*)$/);
                const num    = match ? match[1] : v;
                const suffix = match ? match[2] : "";
                return (
                  <div
                    key={l}
                    className="py-5 pr-4"
                    style={{ borderBottom: "1px solid var(--rule)", borderRight: "1px solid var(--rule)" }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                        fontSize: "2rem",
                        lineHeight: 1,
                        marginBottom: "0.25rem",
                      }}
                    >
                      <span style={{ color: "var(--ink)" }}>{num}</span>
                      <span style={{ color: "var(--navy)" }}>{suffix}</span>
                    </p>
                    <p style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
                      {l}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact?service=consultancy" className="btn btn-primary">
                Book a Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact?service=training" className="btn btn-outline">
                Enquire About Training
              </Link>
            </div>
          </motion.div>

          {/* Right — services list, no card grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {services.map(({ title, body }, i) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="flex gap-6 py-6"
                style={{ borderTop: i === 0 ? "1px solid var(--rule)" : "none", borderBottom: "1px solid var(--rule)" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "1rem",
                    color: "var(--navy)",
                    flexShrink: 0,
                    lineHeight: 1.1,
                    marginTop: "0.1rem",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.4rem" }}>
                    {title}
                  </p>
                  <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "var(--ink-muted)" }}>
                    {body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* ── Client logos strip ─────────────────── */}
      <div
        className="py-5 overflow-hidden"
        style={{
          borderTop: "1px solid var(--rule)",
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex items-center w-max animate-scroll-left">
          <span
            className="flex-shrink-0 px-8 whitespace-nowrap"
            style={{
              fontSize: "0.6875rem", fontWeight: 500,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--ink-faint)", borderRight: "1px solid var(--rule)",
            }}
          >
            Organisations we have worked with
          </span>
          {triple.map((c, i) => <ClientLogo key={`${c.name}-${i}`} {...c} />)}
        </div>
      </div>

    </section>
  );
}
