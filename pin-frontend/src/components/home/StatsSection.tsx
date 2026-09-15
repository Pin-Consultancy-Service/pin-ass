"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";

/* ─── Data — unchanged ───────────────────────────────── */
const stats = [
  { value: 5000, suffix: "+", label: "Students Trained",        desc: "Since our founding in 2009" },
  { value: 87,   suffix: "%", label: "First-Attempt Pass Rate", desc: "Across all programmes" },
  { value: 9,    suffix: "",  label: "Programmes Offered",      desc: "From ATS to CISA" },
  { value: 15,   suffix: "+", label: "Expert Tutors",           desc: "Active industry practitioners" },
];

const bodies = [
  { abbr: "ICAN",  name: "Inst. of Chartered Accountants of Nigeria",    favicon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552586/ican-logo_idp3as.jpg" },
  { abbr: "ACCA",  name: "Association of Chartered Certified Accountants",favicon: "https://www.accaglobal.com/favicon.ico" },
  { abbr: "CITN",  name: "Chartered Institute of Taxation of Nigeria",    favicon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784552741/CITN-logo_rqc5j5.jpg" },
  { abbr: "ISACA", name: "Information Systems Audit & Control Assoc.",    favicon: "https://www.isaca.org/favicon.ico" },
  { abbr: "ATS",   name: "Accounting Technicians Scheme West Africa",     favicon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784553799/ATSWB-logo_pkmnpp.jpg" },
  { abbr: "IASB",  name: "International Accounting Standards Board",      favicon: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784553575/IASB-logo_bpx3wt.webp" },
];

/* ─── CountUp ─────────────────────────────────────────── */
function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const step  = target / (1600 / 16);
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(cur));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Logo pill (scrolling trust bar) ───────────────── */
function LogoPill({ abbr, name, favicon }: (typeof bodies)[0]) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="flex-shrink-0 flex items-center gap-3 px-6 py-2 mx-1"
      style={{ borderRight: "1px solid var(--rule)" }}
    >
      <div
        className="w-7 h-7 flex items-center justify-center flex-shrink-0"
        style={{ background: "none" }}
      >
        {!failed ? (
          <img
            src={favicon}
            alt={abbr}
            width={22}
            height={22}
            className="object-contain"
            onError={() => setFailed(true)}
          />
        ) : (
          <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--ink-muted)" }}>
            {abbr.slice(0, 2)}
          </span>
        )}
      </div>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          fontWeight: 500,
          color: "var(--ink-faint)",
          whiteSpace: "nowrap",
        }}
      >
        {abbr}
      </span>
    </div>
  );
}

export default function StatsSection() {
  const tripleStats  = [...stats,  ...stats,  ...stats];
  const triplebodies = [...bodies, ...bodies, ...bodies];

  return (
    <section style={{ backgroundColor: "var(--bg)", borderBottom: "1px solid var(--rule)" }}>

      {/* ── Main: editorial 2-col layout ─────────── */}
      <div className="content-container py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-start">

          {/* Left — short editorial sentence */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            <span className="brand-rule" />
            <span className="eyebrow" style={{ marginBottom: "1rem" }}>By the Numbers</span>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(1.625rem, 3vw, 2.5rem)",
                lineHeight: 1.25,
                color: "var(--ink)",
                maxWidth: "22rem",
              }}
            >
              Sixteen years of results that speak for themselves.
            </p>
            <p
              className="mt-5"
              style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--ink-muted)", maxWidth: "22rem" }}
            >
              Our track record is built on exam-intelligent teaching, small class
              sizes, and tutors who are active professionals — not career academics.
            </p>
          </motion.div>

          {/* Right — 2×2 stat grid */}
          <motion.div
            className="grid grid-cols-2 gap-px"
            style={{ backgroundColor: "var(--rule)" }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            {stats.map(({ value, suffix, label, desc }) => (
              <div
                key={label}
                className="flex flex-col justify-center px-8 py-10"
                style={{
                  backgroundColor: "var(--bg)",
                  borderLeft: "2px solid var(--navy)",
                }}
              >
                {/* Numeral */}
                <div
                  className="tabular-nums leading-none mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
                    color: "var(--ink)",
                  }}
                >
                  <CountUp target={value} suffix="" />
                  <span style={{ color: "var(--navy)" }}>{suffix}</span>
                </div>

                {/* Label */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--ink-faint)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {label}
                </p>

                {/* Desc */}
                <p style={{ fontSize: "0.8125rem", color: "var(--ink-faint)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* ── Trust bar — scrolling professional bodies ─── */}
      <div
        className="py-5 overflow-hidden"
        style={{
          borderTop: "1px solid var(--rule)",
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex items-center w-max animate-scroll-left">
          <span
            className="flex-shrink-0 px-8 whitespace-nowrap"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-faint)",
              borderRight: "1px solid var(--rule)",
            }}
          >
            Graduates certified by
          </span>
          {triplebodies.map((b, i) => (
            <LogoPill key={`b-${i}`} {...b} />
          ))}
        </div>
      </div>
    </section>
  );
}
