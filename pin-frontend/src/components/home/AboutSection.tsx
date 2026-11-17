"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ─── Content — unchanged ────────────────────────────── */
const pillars = [
  {
    title: "Exam-Intelligent Teaching",
    body: "We teach how examiners think not just what the syllabus says. Every class is built around how to score maximum marks.",
  },
  {
    title: "Practitioner-Led Faculty",
    body: "Every tutor is an active finance, tax, or audit professional. Real practice experience comes into every session.",
  },
  {
    title: "Structured Learning Paths",
    body: "Clear progression from Foundation through Professional levels, with continuous assessment and mock exams at every stage.",
  },
  {
    title: "Flexible & Accessible",
    body: "Weekday, weekend, and fully online classes designed for students and working professionals alike.",
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

export default function AboutSection() {
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "var(--surface)", paddingTop: "6rem", paddingBottom: "7rem" }}
    >
      <div className="content-container">

        {/* ── Asymmetric grid: [1fr 1.6fr] ────────── */}
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20 items-start">

          {/* Left — section header + CTAs (sticky on large screens) */}
          <motion.div
            className="lg:sticky lg:top-28"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            <span className="brand-rule" />
            <span className="eyebrow" style={{ marginBottom: "1rem" }}>About PIN Associate</span>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                lineHeight: 1.15,
                color: "var(--ink)",
                marginBottom: "1.5rem",
              }}
            >
              Nigeria&rsquo;s Trusted
              <br />
              <em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>
                Professional Examination
              </em>
              <br />
              Tuition Provider.
            </h2>

            <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--ink-muted)", marginBottom: "0.85rem" }}>
              Founded in 2009, PIN Associate known as Pass It Now Associates has
              become one of Nigeria&rsquo;s most respected professional examination
              tuition organisations.
            </p>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--ink-muted)", marginBottom: "2.5rem" }}>
              Our teaching philosophy is rooted in exam intelligence: understanding not
              just the curriculum, but how examiners think, what they test, and how
              to score maximum marks under pressure.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/about" className="btn btn-primary">
                Our Full Story <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/about#team" className="btn btn-outline">
                Meet the Tutors
              </Link>
            </div>

            {/* Founding year accent */}
            <div
              className="mt-10 flex items-end gap-4"
              style={{ borderTop: "1px solid var(--rule)", paddingTop: "1.5rem" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "3.5rem",
                  lineHeight: 1,
                  color: "var(--navy)",
                }}
              >
                16+
              </span>
              <span style={{ fontSize: "0.8125rem", color: "var(--ink-muted)", lineHeight: 1.4, paddingBottom: "0.4rem" }}>
                Years of<br />Excellence
              </span>
            </div>
          </motion.div>

          {/* Right — image + differentiator list */}
          <div>
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
              className="img-wrap mb-10"
              style={{ aspectRatio: "16/10" }}
            >
              <img
                src="https://res.cloudinary.com/yaovkmpi/image/upload/v1793970460/PIN_Associates_Courtyard_Team_Portrait_d0f9ez.png"
                alt="PIN Associate professional class in session"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
              />
            </motion.div>

            {/* Differentiator list — no icon-circles */}
            <motion.ul
              className="space-y-0"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {pillars.map(({ title, body }, i) => (
                <motion.li
                  key={title}
                  variants={itemVariants}
                  className="flex gap-6 py-5"
                  style={{
                    borderTop: i === 0 ? "1px solid var(--rule)" : "1px solid var(--rule)",
                    borderBottom: i === pillars.length - 1 ? "1px solid var(--rule)" : "none",
                  }}
                >
                  {/* Number */}
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "1.375rem",
                      color: "var(--navy)",
                      flexShrink: 0,
                      lineHeight: 1.1,
                      marginTop: "0.1rem",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.9375rem",
                        fontWeight: 500,
                        color: "var(--ink)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {title}
                    </p>
                    <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--ink-muted)" }}>
                      {body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>

        </div>
      </div>
    </section>
  );
}
