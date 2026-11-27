"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

/* ── Service Lines Slide Data ────────────────────────── */
const serviceSlides = [
  {
    id: 1,
    label: "PROFESSIONAL EXAMINATION TUTORING",
    headline: {
      regular: "Pass Your Professional",
      emphasis: "Exams With Confidence."
    },
    description: "PIN Associates helps students and professionals pass ICAN, ACCA, CITN, CISA, and ATS exams on their first attempt with expert tutors and structured programmes.",
    cta: {
      primary: { text: "Sign Up", href: "/portal/register" },
      secondary: { text: "Explore Courses", href: "/courses" }
    },
    background: {
      src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1793970460/PIN_Associates_Courtyard_Team_Portrait_d0f9ez.png",
      alt: "Professional examination preparation"
    } 
  },
  {
    id: 2,
    label: "BUSINESS & FINANCIAL CONSULTING", 
    headline: {
      regular: "Expert Guidance For Every",
      emphasis: "Business Decision."
    },
    description: "PIN Associates provides businesses with expert advisory, taxation, financial statement preparation, audits, and asset review helping you make confident, well-informed decisions.", // TODO: Refine wording with client
    cta: {
      primary: { text: "Get Started", href: "/contact?service=consultancy" },
      secondary: { text: "Explore Consulting", href: "/corporate" }
    },
    background: {
      // TODO: Needs business/consulting-appropriate image (office setting, financial documents, professional meeting)
      src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784488319/pexels-rdne-7821702_1_1_xq4cuh.jpg", // Placeholder
      alt: "Business and financial consulting"
    }  
  },
  {
    id: 3,
    label: "CORPORATE TRAINING PROGRAMMES",
    headline: {
      regular: "Building Stronger Teams",
      emphasis: "Through Practical Training."
    },
    description: "Our corporate training programmes are designed to sharpen skills and drive real, measurable results for your organization.", // TODO: Refine wording with client
    cta: {
      primary: { text: "Get Started", href: "/contact?service=training" },
      secondary: { text: "Explore Training", href: "/corporate#training" }
    },
    background: {
      // TODO: Needs training/workshop-appropriate image
      src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1793970782/Young_Team_Smiling_at_PIN_Associates_usxxwl.png", // Placeholder
      alt: "Corporate training programmes"
    }
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      serviceSlides.map(
        (slide) =>
          new Promise<void>((resolve) => {
            const image = new window.Image();
            image.src = slide.background.src;

            const finish = () => {
              image.decode?.().catch(() => {}).finally(resolve);
            };

            if (image.complete) {
              finish();
            } else {
              image.onload = finish;
              image.onerror = () => resolve();
            }
          })
      )
    ).then(() => {
      if (!cancelled) setImagesReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const goToSlide = useCallback((index: number) => {
    const newIndex = ((index % serviceSlides.length) + serviceSlides.length) % serviceSlides.length;
    setCurrentSlide(newIndex);
  }, []);

  // Auto-advance functionality
  useEffect(() => {
    if (paused || !imagesReady) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % serviceSlides.length);
    }, 4000); // 4 seconds for smooth experience

    return () => clearInterval(timer);
  }, [paused, imagesReady]);

  // Pause/resume on hover
  const handleMouseEnter = useCallback(() => setPaused(true), []);
  const handleMouseLeave = useCallback(() => setPaused(false), []);

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ 
        minHeight: "100svh",
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fixed background stack: images crossfade without moving the viewport */}
      <div className="absolute inset-0 overflow-hidden bg-[#020408]" aria-hidden="true">
        {serviceSlides.map((slide, index) => (
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ zIndex: index === currentSlide ? 1 : 0 }}
          >
            <Image
              src={slide.background.src}
              alt=""
              fill
              priority={index === 0}
              loading="eager"
              quality={85}
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "rgba(2, 4, 8, 0.55)" }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(0, 0, 0, 0.06), transparent)",
              }}
            />
          </motion.div>
        ))}
      </div>
      {/* ── Carousel arrows — desktop only ───────── */}
      <button
        onClick={() => goToSlide(currentSlide - 1)}
        aria-label="Previous slide"
        className="absolute hidden lg:flex left-8 top-1/2 -translate-y-1/2 z-20
                   w-9 h-9 items-center justify-center
                   border border-white/20 text-white/70
                   hover:border-white hover:text-white transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => goToSlide(currentSlide + 1)}
        aria-label="Next slide"
        className="absolute hidden lg:flex right-8 top-1/2 -translate-y-1/2 z-20
                   w-9 h-9 items-center justify-center
                   border border-white/20 text-white/70
                   hover:border-white hover:text-white transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* ── Fixed text content layer with smooth transitions ── */}
      <div 
        className="content-container relative z-10 flex items-center" 
        style={{ 
          minHeight: "100svh",
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      >
        <div className="w-full py-32 lg:py-23" style={{ maxWidth: "42rem" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ 
                opacity: 0, 
                transform: "translate3d(0, 20px, 0)"
              }}
              animate={{ 
                opacity: 1, 
                transform: "translate3d(0, 0, 0)"
              }}
              exit={{ 
                opacity: 0, 
                transform: "translate3d(0, -20px, 0)"
              }}
              transition={{ 
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
              className="flex flex-col"
            >
              {/* Eyebrow Label */}
              <div className="mb-6 flex items-center gap-3">
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
                  {serviceSlides[currentSlide].label}
                </span>
              </div>

              {/* Headline */}
             <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(3.25rem, 7vw, 6.5rem)",
                lineHeight: "clamp(0.73, 0.1, 0.30)", // <--- Responsive Line Height
                letterSpacing: "-0.015em",
                color: "#fff",
                marginBottom: "1.75rem",
              }}
              >
              {serviceSlides[currentSlide].headline.regular}<br />
              <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>
                {serviceSlides[currentSlide].headline.emphasis}
              </em>
            </h1>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1.0625rem",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.70)",
                  maxWidth: "36rem",
                  marginBottom: "2.75rem",
                }}
              >
                {serviceSlides[currentSlide].description}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href={serviceSlides[currentSlide].cta.primary.href}
                  className="btn btn-primary"
                  style={{ height: "3.125rem", padding: "0 2.25rem", fontSize: "0.9375rem" }}
                >
                  {serviceSlides[currentSlide].cta.primary.text}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={serviceSlides[currentSlide].cta.secondary.href}
                  className="btn"
                  style={{
                    height: "3.125rem", padding: "0 2rem", fontSize: "0.9375rem",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    borderRadius: "2px",
                  }}
                >
                  {serviceSlides[currentSlide].cta.secondary.text}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {serviceSlides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === currentSlide ? "2rem" : "0.375rem",
              height: "2px",
              backgroundColor: i === currentSlide ? "var(--gold-light)" : "rgba(255,255,255,0.35)",
              border: "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </section>
  );
}
