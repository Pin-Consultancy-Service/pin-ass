"use client";

import { motion } from "framer-motion";
import { achievements, milestoneStats } from "@/data/achievements";

const categoryLabel = {
  award:       "Award",
  milestone:   "Milestone",
  recognition: "Recognition",
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export default function AchievementsSection() {
  return (
    <section
      id="achievements"
      style={{ backgroundColor: "var(--bg)", paddingTop: "6rem", paddingBottom: "7rem" }}
    >
      <div className="content-container">

        {/* ── Header ──────────────────────────────── */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <span className="brand-rule" />
          <span className="eyebrow" style={{ marginBottom: "1rem" }}>Awards &amp; Recognition</span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(1.875rem, 3.5vw, 3rem)",
              lineHeight: 1.15,
              color: "var(--ink)",
              maxWidth: "32rem",
            }}
          >
            A Track Record
            <br />
            <em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>
              Built Over 16 Years
            </em>
          </h2>
        </motion.div>

        {/* ── Asymmetric 2-col: stat column + achievement timeline ── */}
        <div className="grid lg:grid-cols-[260px_1fr] gap-14 lg:gap-20 items-start">

          {/* Left — milestone numerals */}
          <motion.div
            className="lg:sticky lg:top-28"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            <p
              className="mb-7"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink-faint)",
              }}
            >
              By the Numbers
            </p>
            <div className="space-y-7">
              {milestoneStats.map(({ value, label }) => (
                <div key={label} style={{ borderLeft: "2px solid var(--navy)", paddingLeft: "1rem" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "2.25rem",
                      color: "var(--ink)",
                      lineHeight: 1,
                      marginBottom: "0.2rem",
                    }}
                  >
                    {value}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.6875rem",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--ink-faint)",
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — achievement entries as a timeline list */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {achievements.map((item, i) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="flex gap-6 py-8"
                style={{ borderTop: i === 0 ? "1px solid var(--rule)" : "1px solid var(--rule)" }}
              >
                {/* Year */}
                <div className="flex-shrink-0 w-14 text-right">
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "1.125rem",
                      color: "var(--navy)",
                      lineHeight: 1,
                    }}
                  >
                    {item.year}
                  </span>
                </div>

                {/* Thin vertical rule */}
                <div
                  className="flex-shrink-0"
                  style={{ width: "1px", backgroundColor: "var(--rule)", alignSelf: "stretch" }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1.5">
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                        fontSize: "1.25rem",
                        color: "var(--ink)",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.title}
                    </p>
                    <span
                      style={{
                        flexShrink: 0,
                        fontFamily: "var(--font-body)",
                        fontSize: "0.6875rem",
                        fontWeight: 500,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--navy)",
                      }}
                    >
                      {categoryLabel[item.category]}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "var(--ink-muted)" }}>
                    {item.body}
                  </p>
                </div>
              </motion.div>
            ))}
            {/* Bottom rule */}
            <div style={{ borderBottom: "1px solid var(--rule)" }} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
