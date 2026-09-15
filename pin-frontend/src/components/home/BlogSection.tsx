"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ─── Data — unchanged ───────────────────────────────── */
const posts = [
  {
    slug: "ican-nov-dec-2026-examination-tips",
    category: "Exam Strategy",
    title: "ICAN NOV 2026: Strategies That Separate Pass Students From the Rest",
    excerpt:
      "After coaching thousands of ICAN candidates, our tutors have identified the consistent habits and approaches that produce first-time passes. Here is what the data shows.",
    readTime: "8 min",
    date: "July 3, 2026",
    image: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784423645/IMG-20260718-WA0036_ae3icf.jpg",
  },
  {
    slug: "acca-strategic-professional-guide-2026",
    category: "ACCA",
    title: "A Practical Guide to the ACCA Strategic Professional Level in 2026",
    excerpt:
      "The Strategic Professional level is where many ACCA candidates stall. This guide breaks down SBL, SBR, and the optional papers with a clear study framework.",
    readTime: "11 min",
    date: "June 28, 2026",
    image: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784621055/Guide-to-ACCA-applied-skills_vwlr2j.png",
  },
  {
    slug: "ifrs-vs-nigerian-gaap-key-differences",
    category: "Accounting",
    title: "IFRS vs Nigerian GAAP: The Key Differences Every Accountant Must Know",
    excerpt:
      "As Nigerian companies increasingly adopt IFRS, understanding the practical differences between standards has become essential for finance professionals.",
    readTime: "9 min",
    date: "June 15, 2026",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  },
  {
    slug: "career-paths-after-ican-qualification",
    category: "Career",
    title: "What Comes After ICAN? Six Career Paths for Newly Qualified Chartered Accountants",
    excerpt:
      "Passing your ICAN exams opens a wide range of professional pathways. We explore the most rewarding career options for newly qualified accountants in Nigeria.",
    readTime: "7 min",
    date: "June 3, 2026",
    image: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784621564/qualified-accountant_gpu0ev.jpg",
  },
];

export default function BlogSection() {
  const [featured, ...secondary] = posts;

  return (
    <section
      style={{ backgroundColor: "var(--surface)", paddingTop: "6rem", paddingBottom: "7rem" }}
    >
      <div className="content-container">

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="brand-rule" />
              <span className="eyebrow" style={{ marginBottom: "1rem" }}>Blog &amp; Insights</span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "clamp(1.875rem, 3.5vw, 3rem)",
                  lineHeight: 1.15,
                  color: "var(--ink)",
                }}
              >
                Knowledge That Helps
                <br />
                <em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>
                  You Pass and Grow
                </em>
              </h2>
            </div>
            <Link href="/blog" className="btn btn-outline flex-shrink-0">
              All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Editorial layout: large featured (60%) + secondary list (40%) */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-0" style={{ borderTop: "1px solid var(--rule)" }}>

          {/* Featured — large image + full excerpt */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            style={{ borderRight: "1px solid var(--rule)", paddingRight: "3rem", paddingTop: "2.5rem" }}
          >
            <Link href={`/blog/${featured.slug}`} className="group block">
              {/* Image */}
              <div className="img-wrap mb-6" style={{ aspectRatio: "16/9" }}>
                <img
                  src={featured.image}
                  alt={featured.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-4">
                <span className="eyebrow">{featured.category}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>
                  {featured.date} · {featured.readTime} read
                </span>
              </div>

              {/* Title */}
              <h3
                className="group-hover:text-[var(--navy)] transition-colors"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "clamp(1.375rem, 2vw, 1.875rem)",
                  lineHeight: 1.2,
                  color: "var(--ink)",
                  marginBottom: "0.875rem",
                  transition: "color 0.2s ease",
                }}
              >
                {featured.title}
              </h3>

              {/* Excerpt */}
              <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "var(--ink-muted)", marginBottom: "1.5rem" }}>
                {featured.excerpt}
              </p>

              {/* Read arrow */}
              <div className="flex items-center gap-2" style={{ color: "var(--navy)" }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {/* Secondary — border-separated list with small thumbnails */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{ paddingLeft: "3rem" }}
          >
            {secondary.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex gap-4 py-6 transition-opacity hover:opacity-80"
                style={{
                  borderBottom: i < secondary.length - 1 ? "1px solid var(--rule)" : "none",
                  marginTop: i === 0 ? "2.5rem" : 0,
                }}
              >
                {/* Thumbnail */}
                <div
                  className="img-wrap flex-shrink-0"
                  style={{ width: "5rem", height: "5rem" }}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <span className="eyebrow" style={{ marginBottom: "0.4rem" }}>{post.category}</span>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "1rem",
                      lineHeight: 1.3,
                      color: "var(--ink)",
                      marginBottom: "0.4rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.title}
                  </p>
                  <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>
                    {post.date} · {post.readTime} read
                  </span>
                </div>
              </Link>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
