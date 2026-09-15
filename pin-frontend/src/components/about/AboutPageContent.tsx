"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { teamMembers } from "@/data/team";
import { useState } from "react";

/* ─── Hero slides — unchanged ────────────────────────── */
const heroSlides = [
  { id: 1, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784484978/wmremove-transformed_1_1_el1lye.jpg",  alt: "PIN Associate team in session" },
  { id: 2, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784488319/pexels-rdne-7821702_1_1_xq4cuh.jpg", alt: "Professional training environment" },
  { id: 3, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784481889/wmremove-transformed_3_ujyrty.jpg",  alt: "PIN Associate consultation" },
];

/* ─── Timeline — unchanged ───────────────────────────── */
const timeline = [
  { year: "2009", title: "Founded",                  body: "PIN Associate was established with a clear mission: to give every determined professional a structured, expert path to qualification. The first cohort of ICAN students sat their exams that same year." },
  { year: "2012", title: "Expanded to ACCA",          body: "Recognising the growing demand for internationally recognised credentials, PIN launched its ACCA programme — the first step towards becoming a multi-qualification practice." },
  { year: "2015", title: "Corporate Division Launched",body: "PIN's business and financial consultancy arm was established, extending our expertise from individual exam prep to organisational advisory, tax planning, and financial reporting for corporate clients." },
  { year: "2018", title: "Online Learning Platform",  body: "To serve working professionals across Nigeria, PIN launched its live online classes and recorded session library, making expert tuition accessible regardless of location." },
  { year: "2021", title: "5,000 Graduates",           body: "A defining milestone — the 5,000th student qualifies under PIN's guidance. Alumni now work at EY, KPMG, Deloitte, GTBank, First Bank, NNPC and leading Nigerian organisations." },
  { year: "2024", title: "Three Service Lines",       body: "Today PIN Associate operates three distinct but complementary practices: professional examination tutoring, business and financial consultancy, and corporate training — one firm, three paths to professional excellence." },
];

/* ─── Values — unchanged ─────────────────────────────── */
const values = [
  { title: "Exam Intelligence",      body: "We teach how examiners think, not just what the syllabus says. Every class targets maximum marks." },
  { title: "Practitioner-Led",       body: "Every tutor and consultant is an active professional. Real practice experience informs every session." },
  { title: "Accountability",         body: "Small class sizes, continuous assessment, and mock exams at every stage. No student falls through the cracks." },
  { title: "Structured Progression", body: "Clear, stage-by-stage pathways from entry level through professional qualification — for students and organisations alike." },
  { title: "Accessible Excellence",  body: "Weekday, weekend, and fully online formats designed for students in employment and clients across Nigeria." },
  { title: "Proven Results",         body: "87% first-attempt pass rate across all programmes. Our results speak to our method, not our marketing." },
];

/* ─── Service lines — unchanged ──────────────────────── */
const serviceLines = [
  { title: "ICAN / ACCA Professional Tutoring",    desc: "Structured tuition for ICAN, ACCA, CITN, ATS, CISA, and Diploma in IFRS across all levels. Weekday, weekend, and online formats.", href: "/courses",            cta: "View All Programmes" },
  { title: "Business & Financial Consultancy",     desc: "Advisory, taxation, financial statements, audits, and asset review — tailored engagements for SMEs, corporations, and government agencies.", href: "/corporate",          cta: "Book a Consultation" },
  { title: "Corporate Training",                   desc: "Financial intelligence and strategy programmes delivered to organisations. Bespoke content, certified delivery, measurable outcomes.", href: "/corporate#training", cta: "Enquire About Training" },
];

/* ─── Team portrait ──────────────────────────────────── */
function TeamPortrait({ member }: { member: (typeof teamMembers)[0] }) {
  const [failed, setFailed] = useState(false);
  return (
    <div>
      <div className="img-wrap mb-4" style={{ aspectRatio: "3/4", backgroundColor: "var(--surface)" }}>
        {member.image && !failed ? (
          <img
            src={member.image}
            alt={member.name}
            onError={() => setFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }}
          />
        ) : (
          <div className="w-full h-full flex items-end p-5" style={{ backgroundColor: "var(--surface)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(3rem, 5vw, 4.5rem)", color: "var(--rule)", lineHeight: 1 }}>
              {member.initials}
            </span>
          </div>
        )}
      </div>
      <div style={{ borderLeft: "2px solid var(--navy)", paddingLeft: "0.875rem" }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.125rem", color: "var(--ink)", lineHeight: 1.2, marginBottom: "0.2rem" }}>{member.name}</p>
        <p style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: "0.3rem" }}>{member.role}</p>
        <p style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--navy)" }}>{member.quals}</p>
      </div>
    </div>
  );
}

const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } };
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function AboutPageContent() {
  return (
    <>
      <PageHero
        label="About PIN Associate"
        title="Nigeria's Trusted Professional Development Firm"
        description="Founded in 2009, PIN Associate has spent 16 years building the careers of Nigeria's most successful finance and accounting professionals."
        slides={heroSlides}
      >
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <Link href="/apply" className="btn btn-primary">
            Register for Tutoring <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="btn"
            style={{ backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: "2px" }}
          >
            Contact Our Team
          </Link>
        </div>
      </PageHero>

      {/* ── Founding story ───────────────────────── */}
      <section style={{ backgroundColor: "var(--bg)", paddingTop: "6rem", paddingBottom: "7rem" }}>
        <div className="content-container">
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20 items-start">

            {/* Left — sticky header */}
            <motion.div
              className="lg:sticky lg:top-28"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
            >
              <span className="brand-rule" />
              <span className="eyebrow" style={{ marginBottom: "1rem" }}>Our Story</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.875rem, 3vw, 2.75rem)", lineHeight: 1.15, color: "var(--ink)", marginBottom: "1.25rem" }}>
                Pass It Now — A Name That
                <br /><em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>Carries a Promise</em>
              </h2>
              <div className="space-y-4" style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--ink-muted)" }}>
                <p>PIN stands for <strong style={{ color: "var(--ink)", fontWeight: 500 }}>Pass It Now</strong> — a name that captures exactly what we commit to every student and client. Founded in 2009 by Olalekan Olorunsogo, the firm began with a single conviction: that the right preparation, delivered by the right people, produces results.</p>
                <p>Sixteen years later, that conviction has produced over 5,000 qualified professionals, an 87% first-attempt pass rate across nine programmes, and a consultancy practice serving organisations from SMEs to some of Nigeria's most recognised corporations.</p>
                <p>Our teaching philosophy has never changed — we prepare students for how examiners award marks, not just how the syllabus reads.</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/apply" className="btn btn-primary">Register for Tutoring <ArrowRight className="w-4 h-4" /></Link>
                <Link href="/contact" className="btn btn-outline">Contact Us</Link>
              </div>
            </motion.div>

            {/* Right — image + key stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div className="img-wrap mb-8" style={{ aspectRatio: "16/10" }}>
                <img
                  src="https://res.cloudinary.com/yaovkmpi/image/upload/v1784423630/IMG-20260716-WA0007_r0isob.jpg"
                  alt="PIN Associate founding story"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
                />
              </div>
              <div className="grid grid-cols-3 gap-0" style={{ borderTop: "1px solid var(--rule)" }}>
                {[{ v: "2009", l: "Founded" }, { v: "5,000+", l: "Graduates" }, { v: "87%", l: "Pass Rate" }].map(({ v, l }, i) => (
                  <div key={l} className="py-6 text-center" style={{ borderRight: i < 2 ? "1px solid var(--rule)" : "none" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--navy)", lineHeight: 1 }}>{v}</p>
                    <p style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: "0.35rem" }}>{l}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────── */}
      <section style={{ backgroundColor: "var(--surface)", paddingTop: "7rem", paddingBottom: "6rem" }}>
        <div className="content-container">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            <span className="brand-rule" />
            <span className="eyebrow" style={{ marginBottom: "1rem" }}>Our Journey</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.875rem, 3.5vw, 3rem)", lineHeight: 1.15, color: "var(--ink)", maxWidth: "28rem" }}>
              16 Years of <em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>Building Excellence</em>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                variants={itemVariants}
                className="flex gap-8 py-7"
                style={{ borderTop: "1px solid var(--rule)", borderBottom: i === timeline.length - 1 ? "1px solid var(--rule)" : "none" }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.375rem", color: "var(--navy)", flexShrink: 0, lineHeight: 1, marginTop: "0.15rem", minWidth: "3.5rem" }}>
                  {item.year}
                </span>
                <div className="flex-1" style={{ borderLeft: "1px solid var(--rule)", paddingLeft: "2rem" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.4rem" }}>{item.title}</p>
                  <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "var(--ink-muted)" }}>{item.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────── */}
      <section style={{ backgroundColor: "var(--bg)", paddingTop: "6rem", paddingBottom: "7rem" }}>
        <div className="content-container">
          <div className="grid lg:grid-cols-[1fr_1.8fr] gap-14 lg:gap-20 items-start">
            <motion.div
              className="lg:sticky lg:top-28"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
            >
              <span className="brand-rule" />
              <span className="eyebrow" style={{ marginBottom: "1rem" }}>Our Values</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.875rem, 3vw, 2.75rem)", lineHeight: 1.15, color: "var(--ink)" }}>
                What Guides Every
                <br /><em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>Programme We Deliver</em>
              </h2>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid sm:grid-cols-2 gap-0"
            >
              {values.map(({ title, body }, i) => (
                <motion.div
                  key={title}
                  variants={itemVariants}
                  className="py-7 pr-8"
                  style={{ borderBottom: "1px solid var(--rule)", borderRight: i % 2 === 0 ? "1px solid var(--rule)" : "none" }}
                >
                  <div className="flex items-baseline gap-3 mb-2.5">
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "0.9375rem", color: "var(--navy)", flexShrink: 0 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--ink)" }}>{title}</p>
                  </div>
                  <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "var(--ink-muted)", paddingLeft: "2rem" }}>{body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Management team ──────────────────────── */}
      <section id="team" style={{ backgroundColor: "var(--surface)", paddingTop: "7rem", paddingBottom: "6rem" }}>
        <div className="content-container">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            <span className="brand-rule" />
            <span className="eyebrow" style={{ marginBottom: "1rem" }}>Leadership</span>
            <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end">
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.875rem, 3.5vw, 3rem)", lineHeight: 1.15, color: "var(--ink)" }}>
                The People Behind
                <br /><em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>PIN Associate</em>
              </h2>
            </div>
            <p className="mt-4" style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--ink-muted)", maxWidth: "36rem" }}>
              Our management team brings together deep examination knowledge, professional practice, and organisational expertise. Every person who leads at PIN has done the work they teach and advise on.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
              >
                <TeamPortrait member={member} />
              </motion.div>
            ))}
          </div>
          <p className="mt-8 text-center" style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>
            * Team photos and full credentials are placeholders pending supply by PIN Associate.
          </p>
        </div>
      </section>

      {/* ── Three service lines ───────────────────── */}
      <section style={{ backgroundColor: "var(--bg)", paddingTop: "6rem", paddingBottom: "7rem" }}>
        <div className="content-container">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            <span className="brand-rule" />
            <span className="eyebrow" style={{ marginBottom: "1rem" }}>What We Do</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.875rem, 3.5vw, 3rem)", lineHeight: 1.15, color: "var(--ink)" }}>
              Three Practices,
              <br /><em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>One Standard of Excellence</em>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {serviceLines.map(({ title, desc, href, cta }, i) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="flex gap-6 py-7"
                style={{ borderTop: "1px solid var(--rule)", borderBottom: i === serviceLines.length - 1 ? "1px solid var(--rule)" : "none" }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.375rem", color: "var(--navy)", flexShrink: 0, lineHeight: 1, marginTop: "0.15rem" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.25rem", color: "var(--ink)", marginBottom: "0.4rem" }}>{title}</p>
                  <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "var(--ink-muted)", marginBottom: "1rem" }}>{desc}</p>
                  <Link href={href} className="btn-ghost flex items-center gap-1.5">
                    {cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────── */}
      <section style={{ backgroundColor: "var(--navy)" }}>
        <div className="content-container py-14">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", color: "#fff", lineHeight: 1.2, marginBottom: "0.5rem" }}>
                Ready to start your journey with PIN?
              </h2>
              <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)" }}>
                Join 5,000+ professionals who qualified with PIN Associate.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link href="/apply" className="btn" style={{ backgroundColor: "#fff", color: "var(--navy)", borderRadius: "2px", height: "2.75rem", fontWeight: 500 }}>
                Register for Tutoring <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn" style={{ backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", borderRadius: "2px", height: "2.75rem" }}>
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
