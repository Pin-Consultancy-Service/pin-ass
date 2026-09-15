"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { teamMembers } from "@/data/team";

/* ─── Single team member card ────────────────────────── */
function TeamMemberCard({ member, index }: { member: (typeof teamMembers)[0]; index: number }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = member.image && !imgFailed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
    >
      {/* Photo / initials — no card shadow, no rounded corners, just a clean square */}
      <div className="img-wrap mb-5" style={{ aspectRatio: "3/4", backgroundColor: "var(--surface)" }}>
        {showImage ? (
          <img
            src={member.image}
            alt={member.name}
            onError={() => setImgFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }}
          />
        ) : (
          <div
            className="w-full h-full flex items-end p-5"
            style={{ backgroundColor: "var(--surface)" }}
          >
            {/* Large initials, bottom-left */}
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(3rem, 6vw, 5rem)",
                color: "var(--rule)",
                lineHeight: 1,
              }}
            >
              {member.initials}
            </span>
          </div>
        )}
      </div>

      {/* Name + role — no overlay, clean below image */}
      <div
        style={{ borderLeft: "2px solid var(--navy)", paddingLeft: "0.875rem" }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "1.125rem",
            color: "var(--ink)",
            lineHeight: 1.2,
            marginBottom: "0.25rem",
          }}
        >
          {member.name}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            marginBottom: "0.5rem",
          }}
        >
          {member.role}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--navy)",
          }}
        >
          {member.quals}
        </p>
      </div>

      {/* Bio */}
      <p
        className="mt-3"
        style={{
          fontSize: "0.8125rem",
          lineHeight: 1.65,
          color: "var(--ink-faint)",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {member.bio}
      </p>
    </motion.div>
  );
}

export default function TeamSection() {
  return (
    <section
      id="team"
      style={{ backgroundColor: "var(--surface)", paddingTop: "7rem", paddingBottom: "6rem" }}
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
            <span className="eyebrow" style={{ marginBottom: "1rem" }}>Leadership</span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(1.875rem, 3.5vw, 3rem)",
                lineHeight: 1.15,
                color: "var(--ink)",
              }}
            >
              The People Behind
              <br />
              <em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>PIN Associate</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <Link href="/about#team" className="btn btn-outline flex-shrink-0">
              Full Team <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* 4-col grid, clean squares, no shadow cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {teamMembers.map((member, i) => (
            <TeamMemberCard key={member.id} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
