"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ─── Content — unchanged ────────────────────────────── */
const features = [
  {
    title: "Experienced Tutors",
    body: "Every tutor at PIN is an active industry practitioner accountants, tax consultants, and auditors who understand what it takes to pass and to excel professionally.",
  },
  {
    title: "Flexible Learning Modes",
    body: "Choose what works for you: weekday classes, weekend intensives, or fully online. Our programme adapts to your schedule, not the other way around.",
  },
  {
    title: "Exam-Focused Curriculum",
    body: "Our materials are meticulously aligned to current examiner patterns. We teach you to understand questions, not just memorise answers.",
  },
  {
    title: "Comprehensive Study Resources",
    body: "Students receive textbooks, study guides, past questions with solutions, and access to our digital study portal at no extra cost.",
  },
  {
    title: "CBT Practice Tests",
    body: "Our Computer-Based Test simulator mirrors the real exam environment. Practice under timed conditions and track your readiness before exam day.",
  },
  {
    title: "Career Support",
    body: "Passing your exam is the beginning. Our career team helps connect students with recruiters, internship opportunities, and professional networks.",
  },
  {
    title: "Affordable Tuition Fees",
    body: "Professional education should not be out of reach. We offer competitive fees, flexible payment plans, and occasional scholarship opportunities.",
  },
  {
    title: "Personalised Support",
    body: "Small class sizes ensure every student receives personal attention. Our tutors are accessible during class, via messaging, and at revision sessions.",
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

export default function WhyChooseSection() {
  return (
    <section
      style={{ backgroundColor: "var(--surface)", paddingTop: "7rem", paddingBottom: "6rem" }}
    >
      <div className="content-container">
        <div className="grid lg:grid-cols-[1fr_1.8fr] gap-14 lg:gap-24 items-start">

          {/* Left — sticky header */}
          <motion.div
            className="lg:sticky lg:top-28"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            <span className="brand-rule" />
            <span className="eyebrow" style={{ marginBottom: "1rem" }}>Why Choose PIN</span>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                lineHeight: 1.15,
                color: "var(--ink)",
                marginBottom: "1.25rem",
              }}
            >
              What Makes PIN
              <br />
              <em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>
                Different from the Rest
              </em>
            </h2>

            <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--ink-muted)", marginBottom: "2rem" }}>
              We are not just a tuition centre. We are a professional examination
              partner invested in your success as much as you are.
            </p>

            <Link href="/about" className="btn-ghost flex items-center gap-2">
              Learn About Our Approach
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Right — prose list, no icons, no cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="grid sm:grid-cols-2 gap-0">
              {features.map(({ title, body }, i) => (
                <motion.div
                  key={title}
                  variants={itemVariants}
                  className="py-7 pr-8"
                  style={{
                    borderBottom: i < features.length - 2 ? "1px solid var(--rule)" : "none",
                    borderRight: i % 2 === 0 ? "1px solid var(--rule)" : "none",
                  }}
                >
                  {/* Number + title */}
                  <div className="flex items-baseline gap-3 mb-2.5">
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                        fontSize: "0.9375rem",
                        color: "var(--navy)",
                        flexShrink: 0,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.9375rem",
                        fontWeight: 500,
                        color: "var(--ink)",
                      }}
                    >
                      {title}
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                      color: "var(--ink-muted)",
                      paddingLeft: "2rem",
                    }}
                  >
                    {body}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
