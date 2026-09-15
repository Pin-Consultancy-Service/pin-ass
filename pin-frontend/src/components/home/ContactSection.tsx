"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

/* ─── Contact info — from SITE_CONFIG ───────────────── */
const contactItems = [
  { icon: MapPin, label: "Address", value: SITE_CONFIG.contact.address, href: "https://maps.google.com/?q=Victoria+Island+Lagos" },
  { icon: Phone,  label: "Phone",   value: SITE_CONFIG.contact.phone,   href: `tel:${SITE_CONFIG.contact.phone.replace(/\s/g, "")}` },
  { icon: Mail,   label: "Email",   value: SITE_CONFIG.contact.email,   href: `mailto:${SITE_CONFIG.contact.email}` },
  { icon: Clock,  label: "Hours",   value: SITE_CONFIG.contact.hours,   href: undefined },
];

const inquiryTypes = [
  "Programme Enquiry",
  "Registration",
  "Corporate Training",
  "Business Consultancy",
  "Payment / Fees",
  "Other",
];

export default function ContactSection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section
      id="contact"
      style={{ backgroundColor: "var(--bg)", paddingTop: "6rem", paddingBottom: "7rem" }}
    >
      <div className="content-container">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <span className="brand-rule" />
          <span className="eyebrow" style={{ marginBottom: "1rem" }}>Contact Us</span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(1.875rem, 3.5vw, 3rem)",
              lineHeight: 1.15,
              color: "var(--ink)",
            }}
          >
            Get in Touch
            <br />
            <em style={{ fontStyle: "italic", color: "var(--ink-muted)" }}>With Our Team</em>
          </h2>
        </motion.div>

        {/* 2-col layout */}
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20 items-start">

          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            <div className="space-y-0">
              {contactItems.map(({ icon: Icon, label, value, href }, i) => (
                <div
                  key={label}
                  className="flex gap-4 py-5"
                  style={{
                    borderTop: i === 0 ? "1px solid var(--rule)" : "none",
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  <Icon
                    className="flex-shrink-0 mt-0.5"
                    style={{ width: "1rem", height: "1rem", color: "var(--navy)" }}
                    strokeWidth={1.75}
                  />
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.6875rem",
                        fontWeight: 500,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--ink-faint)",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--ink)",
                          transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navy)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
                      >
                        {value}
                      </a>
                    ) : (
                      <p style={{ fontSize: "0.9rem", color: "var(--ink)" }}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 mt-6"
              style={{ color: "var(--navy)", fontSize: "0.875rem", fontWeight: 500 }}
            >
              <svg viewBox="0 0 24 24" style={{ width: "1rem", height: "1rem", fill: "currentColor", flexShrink: 0 }} aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.12 1.523 5.851L.063 23.75l6.093-1.437A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.213-3.617.853.895-3.508-.233-.37A9.793 9.793 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </motion.div>

          {/* Right — contact form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="form-label">Full Name *</label>
                    <input
                      id="name" name="name" type="text" required
                      value={form.name} onChange={handleChange}
                      placeholder="e.g. Adaeze Okonkwo"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <input
                      id="email" name="email" type="email" required
                      value={form.email} onChange={handleChange}
                      placeholder="your@email.com"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      id="phone" name="phone" type="tel"
                      value={form.phone} onChange={handleChange}
                      placeholder="+234 800 000 0000"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="type" className="form-label">Enquiry Type *</label>
                    <select
                      id="type" name="type" required
                      value={form.type} onChange={handleChange}
                      className="form-input"
                    >
                      <option value="">Select type…</option>
                      {inquiryTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="form-label">Message *</label>
                  <textarea
                    id="message" name="message" required rows={5}
                    value={form.message} onChange={handleChange}
                    placeholder="Tell us how we can help…"
                    className="form-input resize-none"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: "3rem", paddingLeft: "2rem", paddingRight: "2rem" }}>
                  Send Message
                  <Send className="w-4 h-4" />
                </button>
                <p style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>
                  We typically respond within one business day.
                </p>
              </form>
            ) : (
              <div className="py-12 flex flex-col items-start gap-4">
                <div
                  className="flex items-center justify-center"
                  style={{ width: "3rem", height: "3rem", backgroundColor: "var(--surface)" }}
                >
                  <CheckCircle2 style={{ color: "var(--navy)", width: "1.5rem", height: "1.5rem" }} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "1.75rem",
                    color: "var(--ink)",
                  }}
                >
                  Message Received
                </h3>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--ink-muted)", maxWidth: "28rem" }}>
                  Thank you for reaching out. A member of our team will respond
                  to your enquiry within one business day.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", type: "", message: "" }); }}
                  className="btn-ghost mt-2"
                >
                  Send Another Message →
                </button>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
