"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, ChevronLeft, ChevronRight } from "lucide-react";

/* ── Slide data — unchanged ──────────────────────────── */
const bgSlides = [
  { id: 1, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784613464/Blue_Futuristic_Technology_LinkedIn_Background_Photo_3_l4mhqd.png", alt: "Graduation and professional success" },
  { id: 2, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784557870/Purple_Abstract_Graphic_Design_LinkedIn_Article_Cover_Image_1_lle3mb.png", alt: "Professional accounting class" },
  // { id: 3, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784484978/wmremove-transformed_1_1_el1lye.jpg", alt: "Corporate learning session" },
  { id: 4, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784613463/7_czosms.png", alt: "Graduation and professional success" },
  { id: 5, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1789493220/Blue_Futuristic_Technology_zbrcih.png", alt: "Professionals reviewing documents" },
];

const stats = [
  { value: "5,000+", label: "Students Trained" },
  { value: "87%",    label: "First-Attempt Pass Rate" },
  { value: "15+",    label: "Expert Tutors" },
  { value: "2009",   label: "Established" },
];

export default function HeroSection() {
  const [bgIdx,  setBgIdx]  = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo   = useCallback((i: number) => setBgIdx(((i % bgSlides.length) + bgSlides.length) % bgSlides.length), []);
  const bgNext = useCallback(() => goTo(bgIdx + 1), [bgIdx, goTo]);
  const bgPrev = useCallback(() => goTo(bgIdx - 1), [bgIdx, goTo]);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(bgNext, 6000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [paused, bgNext]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background carousel ──────────────────── */}
      <div className="absolute inset-0" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div
            key={bgSlides[bgIdx].id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            <img
              src={bgSlides[bgIdx].src}
              alt={bgSlides[bgIdx].alt}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center",
              }}
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navy brand overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(30, 58, 138, 0.45)" }}
        />
        {/* Bottom vignette - navy fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(30,58,138,0.3), transparent)" }}
        />
      </div>

      {/* ── Carousel arrows — desktop only ───────── */}
      <button
        onClick={bgPrev}
        aria-label="Previous slide"
        className="absolute hidden lg:flex left-8 top-1/2 -translate-y-1/2 z-20
                   w-9 h-9 items-center justify-center
                   border border-white/20 text-white/70
                   hover:border-white hover:text-white transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={bgNext}
        aria-label="Next slide"
        className="absolute hidden lg:flex right-8 top-1/2 -translate-y-1/2 z-20
                   w-9 h-9 items-center justify-center
                   border border-white/20 text-white/70
                   hover:border-white hover:text-white transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {bgSlides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === bgIdx ? "2rem" : "0.375rem",
              height: "2px",
              backgroundColor: i === bgIdx ? "var(--gold-light)" : "rgba(255,255,255,0.35)",
              border: "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* ── Content — full-width, centred on desktop ── */}
      <div
        className="content-container relative z-10 flex items-center"
        style={{ minHeight: "100svh" }}
      >
        {/*
          Single-column layout now that the video card is removed.
          Max-width cap keeps the text from stretching uncomfortably wide
          on very large screens — 680px feels editorial and readable.
          Left-aligned on all sizes; centred copy would weaken the serif feel.
        */}
        <div className="w-full py-32 lg:py-28" style={{ maxWidth: "42rem" }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mb-6 flex items-center gap-3"
          >
            <span
              style={{ display: "block", width: "2.5rem", height: "1px", backgroundColor: "var(--gold-light)" }}
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
              Professional Examination Tutoring
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(3.25rem, 7vw, 6.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.015em",
              color: "#fff",
              marginBottom: "1.75rem",
            }}
          >
            Pass Your<br />
            Professional<br />
            <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>
              Exams With Confidence.
            </em>
          </motion.h1>

          {/* Sub-heading */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.0625rem",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.70)",
              maxWidth: "36rem",
              marginBottom: "2.75rem",
            }}
          >
            PIN Associate prepares students and working professionals to pass
            ICAN, ACCA, CITN, CISA, ATS, and IFRS exams on their{" "}
            <span style={{ color: "rgba(255,255,255,0.92)", fontWeight: 500 }}>first attempt</span>{" "}
           with expert tutors, structured programmes, and exam-focused resources.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/portal/register"
              className="btn btn-primary"
              style={{ height: "3.125rem", padding: "0 2.25rem", fontSize: "0.9375rem" }}
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/portal/register"
              className="btn"
              style={{
                height: "3.125rem", padding: "0 2rem", fontSize: "0.9375rem",
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                borderRadius: "2px",
              }}
            >
              Explore Courses
            </Link>
            <button
              className="flex items-center gap-2.5 transition-opacity hover:opacity-70"
              style={{
                background: "none", border: "none",
                color: "rgba(255,255,255,0.72)",
                cursor: "pointer", fontSize: "0.875rem",
              }}
            >
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
