"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

/* ─── Service tabs ───────────────────────────────────── */
const serviceTypes = [
  { id: "tutoring",    label: "ICAN / ACCA Tutoring" },
  { id: "consultancy", label: "Business Consultancy" },
  { id: "training",    label: "Corporate Training" },
  { id: "other",       label: "Other Enquiry" },
] as const;

type ServiceKey = (typeof serviceTypes)[number]["id"];

const enquiryOptions: Record<ServiceKey, string[]> = {
  tutoring:    ["ICAN Programme", "ACCA Programme", "CITN Programme", "ATS Programme", "CISA Programme", "Diploma in IFRS", "Payment / Fees", "Other"],
  consultancy: ["Business Advisory", "Taxation", "Financial Statements", "Audit Support", "Asset Review", "Regulatory Compliance", "General Enquiry"],
  training:    ["Financial Intelligence", "Tax Updates", "IFRS Training", "Finance Team Development", "Custom Programme", "General Enquiry"],
  other:       ["General Enquiry", "Feedback", "Partnership", "Media"],
};

interface FormState {
  name: string; email: string; phone: string;
  organisation: string; enquiry: string; message: string;
}
const emptyForm: FormState = { name: "", email: "", phone: "", organisation: "", enquiry: "", message: "" };

/* ─── Contact info ───────────────────────────────────── */
const contactItems = [
  { icon: MapPin, label: "Address", value: SITE_CONFIG.contact.address, href: "https://maps.google.com/?q=Victoria+Island+Lagos" },
  { icon: Phone,  label: "Phone",   value: SITE_CONFIG.contact.phone,   href: `tel:${SITE_CONFIG.contact.phone.replace(/\s/g, "")}` },
  { icon: Mail,   label: "Email",   value: SITE_CONFIG.contact.email,   href: `mailto:${SITE_CONFIG.contact.email}` },
  { icon: Clock,  label: "Hours",   value: SITE_CONFIG.contact.hours,   href: undefined },
];

function ContactFormWithParams() {
  const searchParams = useSearchParams();
  const [activeService, setActiveService] = useState<ServiceKey>("tutoring");
  
  useEffect(() => {
    try {
      const s = searchParams.get("service") as ServiceKey | null;
      if (s && serviceTypes.some((t) => t.id === s)) setActiveService(s);
    } catch (error) {
      // Handle case where searchParams are not available during build
    }
  }, [searchParams]);

  return <ContactFormContent activeService={activeService} setActiveService={setActiveService} />;
}

function ContactFormContent({ activeService, setActiveService }: { 
  activeService: ServiceKey; 
  setActiveService: (service: ServiceKey) => void; 
}) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setForm((f) => ({ ...f, enquiry: "" }));
  }, [activeService]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      {/* Service tabs */}
      <div className="flex flex-wrap gap-0 mb-8" style={{ borderBottom: "1px solid var(--rule)" }}>
        {serviceTypes.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveService(id)}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              padding: "0.75rem 1.25rem",
              border: "none",
              borderBottom: activeService === id ? "2px solid var(--navy)" : "2px solid transparent",
              backgroundColor: "transparent",
              color: activeService === id ? "var(--navy)" : "var(--ink-muted)",
              cursor: "pointer",
              transition: "color 0.2s ease, border-color 0.2s ease",
              marginBottom: "-1px",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="form-label">Full Name *</label>
              <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="e.g. Adaeze Okonkwo" className="form-input" />
            </div>
            <div>
              <label htmlFor="email" className="form-label">Email Address *</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" className="form-input" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+234 800 000 0000" className="form-input" />
            </div>
            <div>
              <label htmlFor="organisation" className="form-label">
                {activeService === "tutoring" ? "Institution / Employer" : "Organisation Name"}
              </label>
              <input id="organisation" name="organisation" type="text" value={form.organisation} onChange={handleChange} placeholder="Your organisation" className="form-input" />
            </div>
          </div>
          <div>
            <label htmlFor="enquiry" className="form-label">Specific Enquiry *</label>
            <select id="enquiry" name="enquiry" required value={form.enquiry} onChange={handleChange} className="form-input">
              <option value="">Select an area…</option>
              {enquiryOptions[activeService].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="message" className="form-label">Your Message *</label>
            <textarea
              id="message" name="message" required rows={5}
              value={form.message} onChange={handleChange}
              placeholder={
                activeService === "tutoring"    ? "Tell us which programme you're interested in and any questions…"
                : activeService === "consultancy" ? "Describe your organisation's challenge or requirement…"
                : activeService === "training"   ? "Tell us about your team and training objectives…"
                : "Tell us how we can help you…"
              }
              className="form-input resize-none"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: "3rem", paddingLeft: "2rem", paddingRight: "2rem" }}>
            Send Enquiry <Send className="w-4 h-4" />
          </button>
          <p style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>
            We respond to all enquiries within one business day. For urgent matters, use WhatsApp.
          </p>
        </form>
      ) : (
        <div className="py-10 flex flex-col items-start gap-4">
          <div style={{ width: "3rem", height: "3rem", backgroundColor: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 style={{ color: "var(--navy)", width: "1.5rem", height: "1.5rem" }} />
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.75rem", color: "var(--ink)" }}>Enquiry Received</h3>
          <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--ink-muted)", maxWidth: "28rem" }}>
            Thank you{form.name ? `, ${form.name.split(" ")[0]}` : ""}. A member of our team will respond within one business day.
          </p>
          <button
            onClick={() => { setSent(false); setForm(emptyForm); }}
            className="btn-ghost"
            style={{ marginTop: "0.5rem" }}
          >
            Send Another Enquiry →
          </button>
        </div>
      )}
    </>
  );
}

export default function ContactPageContent() {
  return (
    <>
      {/* ── Page header ──────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--ink)", paddingTop: "7rem", paddingBottom: "5rem" }}
      >
        <div className="content-container relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <span style={{ display: "block", width: "2.5rem", height: "1px", backgroundColor: "var(--gold-light)" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-light)" }}>
              Get in Touch
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)", color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>
            How Can We Help You?
          </h1>
          <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "rgba(255,255,255,0.55)", maxWidth: "32rem" }}>
            Choose your area of interest below. Our team responds to all enquiries within one business day.
          </p>
        </div>
      </div>

      {/* ── Main ─────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--bg)", paddingTop: "6rem", paddingBottom: "7rem" }}>
        <div className="content-container">
          <div className="grid lg:grid-cols-[320px_1fr] gap-12 lg:gap-16 items-start">

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
                    style={{ borderTop: i === 0 ? "1px solid var(--rule)" : "none", borderBottom: "1px solid var(--rule)" }}
                  >
                    <Icon className="flex-shrink-0 mt-0.5" style={{ width: "1rem", height: "1rem", color: "var(--navy)" }} strokeWidth={1.75} />
                    <div>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "0.2rem" }}>{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          style={{ fontSize: "0.9rem", color: "var(--ink)", transition: "color 0.2s ease" }}
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
                style={{ color: "#25D366", fontSize: "0.875rem", fontWeight: 500 }}
              >
                <svg viewBox="0 0 24 24" style={{ width: "1rem", height: "1rem", fill: "currentColor", flexShrink: 0 }} aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.12 1.523 5.851L.063 23.75l6.093-1.437A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.213-3.617.853.895-3.508-.233-.37A9.793 9.793 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <Suspense fallback={<div className="p-8 text-center">Loading form...</div>}>
                <ContactFormWithParams />
              </Suspense>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}