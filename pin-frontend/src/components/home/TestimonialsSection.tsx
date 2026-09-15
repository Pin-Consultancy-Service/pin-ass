"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Data — unchanged ───────────────────────────────── */
const testimonials = [
  {
    id: 1,
    name: "Adaeze Okonkwo",
    role: "Chartered Accountant, ICAN Fellow",
    company: "EY Nigeria",
    programme: "ICAN",
    result: "Passed Professional Level First Attempt",
    initials: "AO",
    color: "var(--navy)",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80",
    quote:
      "I had tried the ICAN professional level twice with another tuition provider. When I enrolled at PIN, everything changed. The tutors broke down complex topics with clinical precision. The mock exams alone were worth the entire tuition fee. I passed all three papers in one diet. PIN does exactly what it says you pass.",
    year: "2024",
  },
  {
    id: 2,
    name: "Emeka Nwosu",
    role: "Tax Manager",
    company: "KPMG Nigeria",
    programme: "CITN",
    result: "Passed with Distinction",
    initials: "EN",
    color: "var(--navy)",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
    quote:
      "The CITN programme at PIN is exceptionally well structured. The tax law lectures were the best I have attended detailed, practical, and directly exam-relevant. My tutor had actual tax practice experience which made a real difference. I passed with distinction and I credit PIN entirely.",
    year: "2024",
  },
  {
    id: 3,
    name: "Chisom Ejike",
    role: "ACCA Affiliate",
    company: "Deloitte Nigeria",
    programme: "ACCA",
    result: "All Strategic Level Papers Cleared",
    initials: "CE",
    color: "var(--navy)",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
    quote:
      "Balancing work and ACCA studies is genuinely difficult. PIN's weekend and evening classes were designed for people like me. The online resources especially the question bank and CBT practice tests were available whenever I needed them. The support from the tutors was consistent and personal.",
    year: "2023",
  },
  {
    id: 4,
    name: "Oluwafemi Adeleke",
    role: "Financial Controller",
    company: "Access Bank Plc",
    programme: "ICAN",
    result: "ICAN Fellow Fully Qualified",
    initials: "OA",
    color: "var(--navy)",
    image: "",
    quote:
      "I have been a student at PIN from ATS through to ICAN Fellowship. The consistency in quality, the approachability of tutors, and the structured resources have been remarkable across every level. PIN is genuinely invested in student success not just at exam time, but throughout the professional journey.",
    year: "2023",
  },
  {
    id: 5,
    name: "Ngozi Ibe",
    role: "IT Audit Specialist",
    company: "Zenith Bank Plc",
    programme: "CISA",
    result: "CISA Certified First Attempt",
    initials: "NI",
    color: "var(--navy)",
    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=600&q=80",
    quote:
      "The CISA programme content can be overwhelming without the right guidance. PIN's structured study plan and the quality of the practice tests ensured I arrived at the exam fully prepared. The tutor's industry experience in IT governance added real depth to every session.",
    year: "2024",
  },
];

/* ─── Portrait image with initials fallback ──────────── */
function Portrait({
  image,
  initials,
  color,
}: {
  image: string;
  initials: string;
  color: string;
}) {
  const [failed, setFailed] = useState(false);

  /* Reset failed state when the image URL changes (new testimonial) */
  useEffect(() => { setFailed(false); }, [image]);

  if (image && !failed) {
    return (
      <img
        src={image}
        alt={initials}
        onError={() => setFailed(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
        }}
      />
    );
  }

  /* Fallback — large display initials centred in the panel */
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "var(--surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(4rem, 8vw, 7rem)",
          color: color,
          opacity: 0.18,
          userSelect: "none",
          lineHeight: 1,
        }}
      >
        {initials}
      </span>
    </div>
  );
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t = testimonials[active];

  const go = useCallback(
    (i: number) =>
      setActive(((i % testimonials.length) + testimonials.length) % testimonials.length),
    [],
  );

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => go(active + 1), 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, active, go]);

  return (
    <section
      style={{ backgroundColor: "var(--surface)", paddingTop: "7rem", paddingBottom: "6rem" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="content-container">

        {/* ── Outer 2-col: header+controls | quote panel ── */}
        <div className="grid lg:grid-cols-[1fr_1.8fr] gap-14 lg:gap-20 items-start">

          {/* Left — sticky section header + navigation ──── */}
          <div className="lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
            >
              <span className="brand-rule" />
              <span className="eyebrow" style={{ marginBottom: "1rem" }}>Student Voices</span>

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
                What Our
                <br />
                <em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>
                  Graduates Say
                </em>
              </h2>

              <p
                style={{
                  fontSize: "0.875rem",
                  lineHeight: 1.65,
                  color: "var(--ink-muted)",
                  marginBottom: "2.5rem",
                }}
              >
                5,000+ professionals have qualified through PIN.
                These are their words.
              </p>

              {/* Prev / next */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => go(active - 1)}
                  aria-label="Previous testimonial"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "2.5rem", height: "2.5rem",
                    border: "1px solid var(--rule)",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    transition: "border-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ink)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--rule)")}
                >
                  <ChevronLeft className="w-4 h-4" style={{ color: "var(--ink)" }} />
                </button>

                <button
                  onClick={() => go(active + 1)}
                  aria-label="Next testimonial"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "2.5rem", height: "2.5rem",
                    border: "1px solid var(--rule)",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    transition: "border-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ink)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--rule)")}
                >
                  <ChevronRight className="w-4 h-4" style={{ color: "var(--ink)" }} />
                </button>

                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    color: "var(--ink-faint)",
                    marginLeft: "0.5rem",
                  }}
                >
                  {active + 1} / {testimonials.length}
                </span>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-1.5 mt-4">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    style={{
                      width: i === active ? "1.5rem" : "0.375rem",
                      height: "2px",
                      backgroundColor: i === active ? "var(--navy)" : "var(--rule)",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>

              {/* Thumbnail strip — all five portraits, small, clickable */}
              <div className="flex items-center gap-2 mt-8">
                {testimonials.map((item, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={item.id}
                      onClick={() => go(i)}
                      aria-label={`View ${item.name}'s testimonial`}
                      style={{
                        width: isActive ? "3rem" : "2.25rem",
                        height: isActive ? "3rem" : "2.25rem",
                        flexShrink: 0,
                        position: "relative",
                        overflow: "hidden",
                        border: isActive
                          ? "2px solid var(--navy)"
                          : "2px solid transparent",
                        outline: "none",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        backgroundColor: "var(--rule)",
                        padding: 0,
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center top",
                            filter: isActive ? "none" : "grayscale(60%)",
                            opacity: isActive ? 1 : 0.55,
                            transition: "filter 0.25s ease, opacity 0.25s ease",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-display)",
                            fontWeight: 500,
                            fontSize: "0.625rem",
                            color: "var(--ink-muted)",
                          }}
                        >
                          {item.initials}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right — quote panel: portrait + pull-quote side by side ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
            >
              {/*
                Inner grid:
                  mobile  → portrait on top (fixed height), quote below
                  desktop → portrait left (240px fixed width, full row height), quote right
                On desktop we let the portrait stretch to match the quote panel height —
                aspectRatio would fight items-stretch so we only use it on mobile.
              */}
              <div className="grid sm:grid-cols-[240px_1fr] gap-0 items-stretch">

                {/* ── Portrait ── */}
                {/* Mobile: aspect-ratio box. Desktop: full-height fill via alignSelf:stretch */}
                <div
                  className="portrait-panel"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    flexShrink: 0,
                    /* Mobile default: use a fixed height so the image shows properly */
                    height: "300px",
                  }}
                >
                  {/* Override height on sm+ to fill the row — inline media query via a style tag */}
                  <style>{`
                    @media (min-width: 640px) {
                      .portrait-panel {
                        height: 100% !important;
                        min-height: 420px;
                      }
                    }
                  `}</style>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`portrait-${t.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <Portrait
                        image={t.image}
                        initials={t.initials}
                        color={t.color}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Thin green left edge — visual anchor */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "3px",
                      backgroundColor: "var(--navy)",
                    }}
                  />
                </div>

                {/* ── Pull-quote ── */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "2rem 0 2rem 2rem",
                    borderLeft: "1px solid var(--rule)",
                    minHeight: "420px",
                  }}
                >
                  {/* Opening quote glyph */}
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                        fontSize: "5rem",
                        lineHeight: 0.75,
                        color: "var(--navy)",
                        opacity: 0.2,
                        marginBottom: "1.25rem",
                        userSelect: "none",
                      }}
                      aria-hidden="true"
                    >
                      &ldquo;
                    </div>

                    <blockquote
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                        fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                        lineHeight: 1.45,
                        color: "var(--ink)",
                        fontStyle: "italic",
                        margin: 0,
                      }}
                    >
                      {t.quote}
                    </blockquote>
                  </div>

                  {/* Attribution — name, role, outcome */}
                  <div
                    style={{
                      borderTop: "1px solid var(--rule)",
                      paddingTop: "1.25rem",
                      marginTop: "1.75rem",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.9375rem",
                        fontWeight: 500,
                        color: "var(--ink)",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--ink-muted)",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {t.role} · {t.company}
                    </p>

                    {/* Outcome pill */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "0.375rem",
                          height: "0.375rem",
                          borderRadius: "50%",
                          backgroundColor: "var(--navy)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.6875rem",
                          fontWeight: 500,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--navy)",
                        }}
                      >
                        {t.programme} · {t.result}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
