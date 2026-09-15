"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ─── Steps data — content unchanged ─────────────────── */
const steps = [
  {
    step: "01",
    title: "Discover Your Programme",
    body: "Browse our range of professional qualifications and find the right fit for your background, goals, and career stage.",
  },
  {
    step: "02",
    title: "Register & Enrol",
    body: "Complete your application online or in person. Our admissions team guides you through every step of the process.",
  },
  {
    step: "03",
    title: "Attend Classes",
    body: "Join scheduled sessions weekday, weekend, or online. All students receive study packs and access to recorded sessions.",
  },
  {
    step: "04",
    title: "Practice with CBT",
    body: "Use our exam simulator to practice under real exam conditions, analyse your performance, and target weak areas before the big day.",
  },
  {
    step: "05",
    title: "Sit Your Exam",
    body: "Walk in prepared. Our exam-intelligence approach means you know how marks are awarded and how to maximise your score under pressure.",
  },
  {
    step: "06",
    title: "Qualify & Progress",
    body: "Receive your professional designation and join thousands of PIN graduates working across Nigeria and internationally.",
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

export default function LearningJourneySection() {
  return (
    <section
      style={{ backgroundColor: "var(--bg)", paddingTop: "6rem", paddingBottom: "7rem" }}
    >
      <div className="content-container">

        {/* Header */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            <span className="brand-rule" />
            <span className="eyebrow" style={{ marginBottom: "1rem" }}>The Journey</span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(1.875rem, 3.5vw, 3rem)",
                lineHeight: 1.15,
                color: "var(--ink)",
              }}
            >
              From Enrolment
              <em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>
                {" "}to Qualification
              </em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <Link href="/apply" className="btn btn-primary flex-shrink-0">
              Start Your Journey <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Steps — numbered editorial list, no colored cards */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {steps.map(({ step, title, body }, i) => (
            <motion.div
              key={step}
              variants={itemVariants}
              className="px-0 py-8 pr-8"
              style={{
                borderTop: "1px solid var(--rule)",
                borderRight: (i + 1) % 3 !== 0 && i !== steps.length - 1 ? "1px solid var(--rule)" : "none",
              }}
            >
              {/* Step number */}
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "2.5rem",
                  color: "var(--navy)",
                  lineHeight: 1,
                  marginBottom: "1rem",
                }}
              >
                {step}
              </span>

              {/* Title */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: "var(--ink)",
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </p>

              {/* Body */}
              <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "var(--ink-muted)" }}>
                {body}
              </p>
            </motion.div>
          ))}
        </motion.div>
        {/* Bottom border */}
        <div style={{ borderBottom: "1px solid var(--rule)" }} />
      </div>
    </section>
  );
}
