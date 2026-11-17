"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";

/* ─── Data — unchanged ───────────────────────────────── */
const heroSlides = [
  { id: 1, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784488319/pexels-rdne-7821702_1_1_xq4cuh.jpg", alt: "Business professionals in meeting" },
  { id: 2, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1793970460/PIN_Associates_Courtyard_Team_Portrait_d0f9ez.png",                           alt: "Corporate training session" },
  { id: 3, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784481889/wmremove-transformed_3_ujyrty.jpg",  alt: "Financial consultancy work" },
];

const consultancyServices = [
  { title: "Business Advisory",       body: "Strategic planning, business modelling, and feasibility studies to guide key organisational decisions. We work with SMEs, growing businesses, and established corporations.", deliverables: ["Strategic plans", "Business models", "Feasibility reports"] },
  { title: "Taxation",                body: "Corporate tax planning, FIRS compliance, transfer pricing documentation, and tax dispute resolution. We ensure your organisation's tax position is defensible and optimised.", deliverables: ["Tax computations", "FIRS filings", "Transfer pricing reports"] },
  { title: "Financial Statements",    body: "Preparation of IFRS-compliant financial statements for entities of all sizes statutory accounts, management accounts, and consolidated group reporting.", deliverables: ["Statutory accounts", "Management accounts", "Group consolidations"] },
  { title: "Audit Support",           body: "Pre-audit preparation, internal audit reviews, and working paper support to ensure your organisation enters the audit process in the strongest possible position.", deliverables: ["Audit files", "Internal review reports", "Control assessments"] },
  { title: "Asset Review",            body: "Valuation and review of business assets fixed assets, financial instruments, and intangibles for financial reporting, transaction, or regulatory purposes.", deliverables: ["Asset schedules", "Valuation reports", "Impairment reviews"] },
  { title: "Regulatory Compliance",   body: "Ensuring your organisation meets requirements from FIRS, SEC, CBN, CAC, and sector-specific bodies. We identify gaps and implement remediation before regulators do.", deliverables: ["Compliance gap analysis", "Remediation plans", "Regulatory filings"] },
];

const trainingProgrammes = [
  { title: "Financial Intelligence for Executives", audience: "Senior management & board members", duration: "1–2 days",         body: "Reading financial statements, understanding key ratios, and making finance-informed decisions without requiring an accounting background." },
  { title: "Tax Updates & Compliance",              audience: "Finance teams & tax professionals",  duration: "Half-day to 1 day", body: "Current FIRS regulations, new tax laws, and practical compliance requirements delivered by active tax practitioners." },
  { title: "IFRS Fundamentals & Updates",           audience: "Accountants & finance staff",        duration: "1–3 days",         body: "Core IFRS standards, recent amendments, and practical application to your entity's financial reporting environment." },
  { title: "Finance Team Development",              audience: "Finance departments",                duration: "3–5 days",         body: "Structured upskilling programme covering financial reporting, budgeting, internal controls, and professional ethics." },
  { title: "Strategy & Business Planning",          audience: "Management & strategy teams",        duration: "1–2 days",         body: "Business modelling, scenario planning, and strategy communication frameworks for teams developing or reviewing organisational plans." },
  { title: "Custom Programmes",                     audience: "Any organisation",                   duration: "Bespoke",          body: "We design and deliver programmes tailored to your sector, team size, and specific learning objectives. Contact us for a proposal." },
];

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

const process = [
  { n: "01", title: "Initial Enquiry", body: "You contact us with your challenge or objective. We respond within one business day with an initial discussion." },
  { n: "02", title: "Scoping Call",    body: "We hold a focused call to understand your organisation's specific needs, timelines, and desired outcomes." },
  { n: "03", title: "Proposal",        body: "We deliver a tailored written proposal scope of work, fee structure, timeline, and deliverables within 48 hours." },
  { n: "04", title: "Engagement",      body: "Upon agreement, we begin work. You receive a named relationship manager and clear communication throughout." },
  { n: "05", title: "Delivery",        body: "We deliver the agreed outputs with a debrief and Q&A session." },
  { n: "06", title: "Aftercare",       body: "We remain available for follow-up questions and to support implementation of our recommendations." },
];

function ClientLogo({ name, favicon }: { name: string; favicon: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-6 py-2 mx-1" style={{ borderRight: "1px solid var(--rule)" }}>
      <div style={{ width: 22, height: 22, flexShrink: 0 }}>
        {!failed
          ? <img src={favicon} alt={name} width={22} height={22} className="object-contain" onError={() => setFailed(true)} />
          : <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--ink-muted)" }}>{initials}</span>}
      </div>
      <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--ink-faint)", whiteSpace: "nowrap" }}>{name}</span>
    </div>
  );
}

const itemVariants     = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } };
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

export default function CorporatePageContent() {
  const triple = [...clients, ...clients, ...clients];

  return (
    <>
      <PageHero
        label="Corporate Services"
        title="Consultancy & Training That Delivers Results"
        description="Business and financial advisory, taxation, financial statements, audits, and bespoke corporate training delivered by practitioners, not generalists."
        slides={heroSlides}
      >
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <Link href="/contact?service=consultancy" className="btn btn-primary">
            Book a Consultation <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="#training" className="btn" style={{ backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: "2px" }}>
            Enquire About Training
          </Link>
        </div>
      </PageHero>

      {/* ── Intro band ─────────────────────────── */}
      <section style={{ backgroundColor: "var(--bg)", borderBottom: "1px solid var(--rule)" }}>
        <div className="content-container py-14">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-start">
            <div style={{ maxWidth: "36rem" }}>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--ink-muted)", marginBottom: "0.75rem" }}>
                PIN Associate works with Nigerian organisations from growing SMEs to listed corporations and government agencies to solve real financial challenges, meet regulatory obligations, and develop the professional capability of their teams.
              </p>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--ink-muted)" }}>
                Our consultants are active practitioners. The people who advise your organisation today are the same people handling engagements across multiple sectors meaning our advice is current, practical, and tested.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-0 flex-shrink-0" style={{ borderTop: "1px solid var(--rule)", minWidth: "240px" }}>
              {[{ v: "50+", l: "Organisations" }, { v: "16+", l: "Years Practice" }, { v: "500+", l: "Staff Trained" }, { v: "48h", l: "Proposal" }].map(({ v, l }, i) => (
                <div key={l} className="py-5 text-center" style={{ borderBottom: "1px solid var(--rule)", borderRight: i % 2 === 0 ? "1px solid var(--rule)" : "none" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.875rem", color: "var(--navy)", lineHeight: 1 }}>{v}</p>
                  <p style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: "0.2rem" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Client logos ─────────────────────────── */}
      <div
        className="py-5 overflow-hidden"
        style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--rule)", maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
      >
        <div className="flex items-center w-max animate-scroll-left">
          <span className="flex-shrink-0 px-8 whitespace-nowrap" style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", borderRight: "1px solid var(--rule)" }}>
            Organisations we have worked with
          </span>
          {triple.map((c, i) => <ClientLogo key={`${c.name}-${i}`} {...c} />)}
        </div>
      </div>

      {/* ── Consultancy services ──────────────────── */}
      <section style={{ backgroundColor: "var(--bg)", paddingTop: "6rem", paddingBottom: "7rem" }}>
        <div className="content-container">
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-14 lg:gap-20 items-start">

            <motion.div
              className="lg:sticky lg:top-28"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
            >
              <span className="brand-rule" />
              <span className="eyebrow" style={{ marginBottom: "1rem" }}>Consultancy Practice</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.875rem, 3vw, 2.75rem)", lineHeight: 1.15, color: "var(--ink)", marginBottom: "1.5rem" }}>
                Business &amp; Financial
                <br /><em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>Advisory Services</em>
              </h2>
              <Link href="/contact?service=consultancy" className="btn btn-primary">
                Book a Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              {consultancyServices.map(({ title, body, deliverables }, i) => (
                <motion.div key={title} variants={itemVariants} className="py-7" style={{ borderTop: "1px solid var(--rule)", borderBottom: i === consultancyServices.length - 1 ? "1px solid var(--rule)" : "none" }}>
                  <div className="flex gap-5">
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1rem", color: "var(--navy)", flexShrink: 0, lineHeight: 1, marginTop: "0.2rem" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.4rem" }}>{title}</p>
                      <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "var(--ink-muted)", marginBottom: "0.75rem" }}>{body}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {deliverables.map((d) => (
                          <span key={d} style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--navy)" }}>
                            · {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Corporate training ───────────────────── */}
      <section id="training" style={{ backgroundColor: "var(--surface)", paddingTop: "7rem", paddingBottom: "6rem" }}>
        <div className="content-container">
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-14 lg:gap-20 items-start">

            <motion.div
              className="lg:sticky lg:top-28"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
            >
              <span className="brand-rule" />
              <span className="eyebrow" style={{ marginBottom: "1rem" }}>Corporate Training</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.875rem, 3vw, 2.75rem)", lineHeight: 1.15, color: "var(--ink)", marginBottom: "1.25rem" }}>
                Develop Your Team&apos;s
                <br /><em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>Financial Capability</em>
              </h2>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "var(--ink-muted)", marginBottom: "1.5rem" }}>
                All programmes are designed by practitioners and delivered in-person or online. Each participant receives a certificate of completion.
              </p>
              <Link href="/contact?service=training" className="btn btn-primary">
                Enquire About Training <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              {trainingProgrammes.map(({ title, audience, duration, body }, i) => (
                <motion.div key={title} variants={itemVariants} className="py-7" style={{ borderTop: "1px solid var(--rule)", borderBottom: i === trainingProgrammes.length - 1 ? "1px solid var(--rule)" : "none" }}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--ink)" }}>{title}</p>
                    <span style={{ flexShrink: 0, fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--navy)" }}>{duration}</span>
                  </div>
                  <p style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "0.5rem" }}>For: {audience}</p>
                  <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "var(--ink-muted)" }}>{body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Engagement process ───────────────────── */}
      <section style={{ backgroundColor: "var(--bg)", paddingTop: "6rem", paddingBottom: "7rem" }}>
        <div className="content-container">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            <span className="brand-rule" />
            <span className="eyebrow" style={{ marginBottom: "1rem" }}>How We Work</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.875rem, 3.5vw, 3rem)", lineHeight: 1.15, color: "var(--ink)" }}>
              A Clear, Predictable
              <br /><em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>Engagement Process</em>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0" style={{ borderTop: "1px solid var(--rule)", borderLeft: "1px solid var(--rule)" }}>
            {process.map(({ n, title, body }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                className="p-8"
                style={{ borderRight: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "2.5rem", color: "var(--navy)", lineHeight: 1, display: "block", marginBottom: "0.875rem" }}>{n}</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.4rem" }}>{title}</p>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "var(--ink-muted)" }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────── */}
      <section style={{ backgroundColor: "var(--navy)" }}>
        <div className="content-container py-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", color: "#fff", lineHeight: 1.2, marginBottom: "0.5rem" }}>
                Ready to work with PIN Associate?
              </h2>
              <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)" }}>
                We provide tailored proposals within 48 hours.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link href="/contact?service=consultancy" className="btn" style={{ backgroundColor: "#fff", color: "var(--navy)", borderRadius: "2px", height: "2.75rem" }}>
                Book a Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact?service=training" className="btn" style={{ backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", borderRadius: "2px", height: "2.75rem" }}>
                Enquire About Training
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes corp-scroll { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
        `}</style>
      </section>
    </>
  );
}
