"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Slide = { id: number; src: string; alt: string };

interface PageHeroProps {
  label?: string;
  title: string;
  description: string;
  slides: Slide[];
  children?: React.ReactNode;
}

export default function PageHero({
  label,
  title,
  description,
  slides,
  children,
}: PageHeroProps) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => setIdx(((i % slides.length) + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => goTo(idx + 1), 6000);
    return () => { if (timer.current) clearInterval(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, idx]);

  return (
    <section
      className="relative w-full overflow-hidden flex items-center"
      style={{ minHeight: "clamp(480px, 62vh, 680px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background carousel ──────────────────── */}
      <div className="absolute inset-0" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div
            key={slides[idx].id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            <img
              src={slides[idx].src}
              alt={slides[idx].alt}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center",
              }}
              loading="eager"
              decoding="async"
            />
          </motion.div>
        </AnimatePresence>

        {/* Restrained overlay — enough for legibility, not a heavy gradient */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(18, 24, 20, 0.60)" }}
        />
        {/* Bottom fade into --bg */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(18,24,20,0.45), transparent)" }}
        />
      </div>

      {/* ── Content ──────────────────────────────── */}
      <div className="content-container relative z-10 text-center py-24 lg:py-28">
        {label && (
          <div className="flex items-center justify-center gap-3 mb-6">
            <span
              style={{
                display: "block",
                width: "2.5rem",
                height: "1px",
                backgroundColor: "var(--gold-light)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--gold-light)",
              }}
            >
              {label}
            </span>
            <span
              style={{
                display: "block",
                width: "2.5rem",
                height: "1px",
                backgroundColor: "var(--gold-light)",
              }}
            />
          </div>
        )}

        {/* Serif heading, weight 500 */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            color: "#fff",
            marginBottom: "1.25rem",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.65)",
            maxWidth: "38rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {description}
        </p>

        {children && <div className="mt-8">{children}</div>}
      </div>

      {/* ── Pagination dots ───────────────────────── */}
      {slides.length > 1 && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5"
          role="tablist"
          aria-label="Slide indicators"
        >
          {slides.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === idx}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              style={{
                width: i === idx ? "2rem" : "0.375rem",
                height: "2px",
                backgroundColor: i === idx ? "var(--gold-light)" : "rgba(255,255,255,0.35)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Bottom wave — transitions into --bg ──── */}
      <div className="absolute bottom-0 left-0 right-0 z-10" aria-hidden="true">
        <svg viewBox="0 0 1440 40" fill="none" className="w-full" preserveAspectRatio="none">
          <path d="M0 40 L0 20 Q720 0 1440 20 L1440 40 Z" fill="var(--bg)" />
        </svg>
      </div>
    </section>
  );
}
