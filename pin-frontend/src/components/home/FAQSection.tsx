"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

/* ─── Data — unchanged ───────────────────────────────── */
const faqs = [
  {
    q: "Who can enrol in PIN's professional examination programmes?",
    a: "Our programmes are open to university students, polytechnic graduates, HND holders, degree holders, and working professionals. Entry requirements vary by programme ICAN Foundation requires a minimum of five O'Level credits, while ACCA Applied Knowledge has similar academic prerequisites. Our admissions team can advise you on the right entry point.",
  },
  {
    q: "Do you offer online classes or only in-person tuition?",
    a: "We offer both. Students can choose from weekday in-person classes, weekend intensive sessions, or live online classes conducted via our digital platform. All students regardless of mode have access to recorded sessions, study materials, and the CBT practice portal.",
  },
  {
    q: "What study materials are provided?",
    a: "All enrolled students receive comprehensive study packs including textbooks, past question compilations with detailed solutions, revision summaries, and access to the PIN digital study portal. Study materials are updated each diet to reflect current syllabi and examiner reports.",
  },
  {
    q: "How long does it take to complete the ICAN qualification?",
    a: "The ICAN qualification spans three levels: Foundation, Skills, and Professional. Each level typically takes two to three examination diets to complete. Full qualification can be achieved in three to five years depending on your study pace, prior exemptions, and examination performance.",
  },
  {
    q: "Can I sit ICAN exams while working full-time?",
    a: "Absolutely the majority of our students are working professionals. Our evening, weekend, and online class options are specifically designed to accommodate full-time employment. Many of our most successful graduates balanced demanding careers with their studies.",
  },
  {
    q: "Does PIN help with ICAN, ACCA, and CITN student registration?",
    a: "Yes. Our admissions team provides guidance on registering with ICAN, ACCA, and CITN as a student member, selecting exemptions, and understanding the examination structure. We do not register students on their behalf, but we make the process straightforward.",
  },
  {
    q: "Are instalment payment plans available?",
    a: "Yes. We offer flexible payment plans to make tuition accessible. Students can pay in instalments across the study period. Contact our admissions team to discuss the options available for your chosen programme.",
  },
  {
    q: "What makes PIN's pass rates so high?",
    a: "Our results are driven by exam-intelligent teaching, small class sizes, continuous assessment, and a culture of accountability. Tutors are active professionals who teach to the exam not just the curriculum. Mock examinations, question analysis sessions, and personalised feedback are core parts of every programme.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      style={{ backgroundColor: "var(--bg)", paddingTop: "6rem", paddingBottom: "7rem" }}
    >
      <div className="content-container">
        <div className="grid lg:grid-cols-[1fr_1.8fr] gap-14 lg:gap-20 items-start">

          {/* Left — sticky header */}
          <motion.div
            className="lg:sticky lg:top-28"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            <span className="brand-rule" />
            <span className="eyebrow" style={{ marginBottom: "1rem" }}>FAQ</span>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(1.875rem, 3vw, 2.75rem)",
                lineHeight: 1.15,
                color: "var(--ink)",
                marginBottom: "1.25rem",
              }}
            >
              Questions We
              <br />
              <em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>
                Hear Most Often
              </em>
            </h2>

            <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--ink-muted)", marginBottom: "2.5rem" }}>
              Everything you need to know before enrolling. Can&apos;t find your answer?
              Our team is happy to help.
            </p>

            {/* Contact prompt */}
            <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "1.5rem" }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.35rem" }}>
                Still have questions?
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)", marginBottom: "1.25rem" }}>
                Our advisors are available Monday to Friday 8am–6pm, Saturday 9am–3pm.
              </p>
              <Link href="/contact" className="btn btn-primary" style={{ height: "2.625rem", fontSize: "0.8125rem" }}>
                Contact Us
              </Link>
            </div>
          </motion.div>

          {/* Right — accordion, left-aligned editorial style */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  style={{ borderBottom: "1px solid var(--rule)" }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-start justify-between gap-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.9375rem",
                        fontWeight: isOpen ? 500 : 400,
                        color: isOpen ? "var(--ink)" : "var(--ink)",
                        lineHeight: 1.5,
                        transition: "color 0.2s ease",
                      }}
                    >
                      {faq.q}
                    </span>

                    {/* Plus / minus — small, no background */}
                    <span
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: isOpen ? "var(--navy)" : "var(--ink-muted)", transition: "color 0.2s ease" }}
                    >
                      {isOpen
                        ? <Minus className="w-4 h-4" />
                        : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <p
                          style={{
                            fontSize: "0.9rem",
                            lineHeight: 1.65,
                            color: "var(--ink-muted)",
                            paddingBottom: "1.5rem",
                            paddingRight: "2.5rem",
                          }}
                        >
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
