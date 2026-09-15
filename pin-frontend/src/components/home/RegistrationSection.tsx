"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ─── Data — unchanged ───────────────────────────────── */
const dietInfo = {
  diet: "November / December 2026",
  registrationDeadline: "31 October 2026",
  lecturesStart: "1 September 2026",
  examDates: "November – December 2026",
};

const programmes = [
  { name: "ICAN Foundation",         fee: "₦85,000" },
  { name: "ICAN Skills",             fee: "₦95,000" },
  { name: "ICAN Professional",       fee: "₦110,000" },
  { name: "ACCA Applied Knowledge",  fee: "₦95,000" },
  { name: "ACCA Applied Skills",     fee: "₦105,000" },
  { name: "CITN Qualifying",         fee: "₦90,000" },
  { name: "ATS",                     fee: "₦65,000" },
  { name: "Diploma in IFRS",         fee: "₦120,000" },
];

/* ─── 3 service-line CTAs ────────────────────────────── */
const serviceCtAs = [
  {
    id: "tutoring",
    label: "ICAN / ACCA Tutoring",
    headline: "Register for Tutoring",
    body: "Enrol in the upcoming examination diet. All levels, all programmes, all study modes.",
    href: "/apply?service=tutoring",
    cta: "Register for ICAN / ACCA Tutoring",
  },
  {
    id: "consultancy",
    label: "Business & Financial Consultancy",
    headline: "Book a Consultation",
    body: "Financial reporting, taxation, audits, asset review, and advisory tailored engagements.",
    href: "/contact?service=consultancy",
    cta: "Book a Consultation",
  },
  {
    id: "training",
    label: "Corporate Training",
    headline: "Enquire About Training",
    body: "Bespoke workforce development programmes for organisations, on-site or online.",
    href: "/contact?service=training",
    cta: "Enquire About Training",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export default function RegistrationSection() {
  return (
    <section
      id="register"
      style={{ backgroundColor: "var(--bg)", paddingTop: "6rem", paddingBottom: "7rem" }}
    >
      <div className="content-container">

        {/* Section header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <span className="brand-rule" />
          <span className="eyebrow" style={{ marginBottom: "1rem" }}>Get Started</span>
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
              How Can PIN Associate
              <br />
              <em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>Help You?</em>
            </h2>
          </div>
        </motion.div>

        {/* ── Three service CTAs — horizontal list, not card grid ── */}
        <motion.div
          className="grid lg:grid-cols-3 gap-0 mb-16"
          style={{ borderTop: "1px solid var(--rule)", borderLeft: "1px solid var(--rule)" }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {serviceCtAs.map((s) => (
            <motion.div
              key={s.id}
              variants={itemVariants}
              className="flex flex-col p-8"
              style={{ borderRight: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}
            >
              {/* Label */}
              <span className="eyebrow" style={{ marginBottom: "1.25rem" }}>{s.label}</span>

              {/* Heading */}
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "1.5rem",
                  color: "var(--ink)",
                  lineHeight: 1.2,
                  marginBottom: "0.75rem",
                }}
              >
                {s.headline}
              </p>

              {/* Body */}
              <p
                className="flex-1"
                style={{
                  fontSize: "0.875rem",
                  lineHeight: 1.65,
                  color: "var(--ink-muted)",
                  marginBottom: "2rem",
                }}
              >
                {s.body}
              </p>

              {/* CTA */}
              <Link
                href={s.href}
                className="btn btn-primary"
                style={{ alignSelf: "flex-start" }}
              >
                {s.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Exam diet info + fee table ────────── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left — diet announcement */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            {/* Status */}
            <div className="flex items-center gap-2 mb-6">
              <span
                style={{
                  display: "inline-block",
                  width: "0.5rem",
                  height: "0.5rem",
                  borderRadius: "50%",
                  backgroundColor: "var(--navy)",
                }}
              />
              <span className="eyebrow">Registration Now Open</span>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                lineHeight: 1.15,
                color: "var(--ink)",
                marginBottom: "0.75rem",
              }}
            >
              {dietInfo.diet} Diet
            </h3>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--ink-muted)", marginBottom: "2rem", maxWidth: "30rem" }}>
              Secure your place in the upcoming examination diet. Classes are already
              underway limited seats available. Early registration is strongly advised.
            </p>

            {/* Key dates */}
            <div className="space-y-3 mb-8">
              {[
                { label: "Lecture Start Date",    value: dietInfo.lecturesStart },
                { label: "Registration Deadline", value: dietInfo.registrationDeadline },
                { label: "Examination Period",    value: dietInfo.examDates },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3"
                  style={{ borderBottom: "1px solid var(--rule)" }}
                >
                  <span style={{ fontSize: "0.8125rem", color: "var(--ink-muted)" }}>{label}</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)" }}>{value}</span>
                </div>
              ))}
            </div>

            <Link href="/apply?service=tutoring" className="btn btn-primary">
              Register for ICAN / ACCA Tutoring
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right — fee table, editorial style */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
          </motion.div>

        </div>
      </div>
    </section>
  );
}
