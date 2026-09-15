"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Copy, CheckCircle2, AlertCircle, ArrowRight, Lock, ShieldCheck, Building2 } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

type Category = "student" | "client" | "training";

const categories: {
  id: Category;
  label: string;
  description: string;
  items: { name: string; amount: string; ref?: string }[];
}[] = [
  {
    id: "student",
    label: "Pay as a Student",
    description: "Tuition fees for ICAN, ACCA, CITN, ATS, CISA, and Diploma in IFRS programmes.",
    items: [
      { name: "ICAN Foundation",            amount: "85000",  ref: "TUT-ICAN-FDN" },
      { name: "ICAN Skills",                amount: "95000",  ref: "TUT-ICAN-SKL" },
      { name: "ICAN Professional",          amount: "110000", ref: "TUT-ICAN-PRO" },
      { name: "ACCA Applied Knowledge",     amount: "95000",  ref: "TUT-ACCA-APK" },
      { name: "ACCA Applied Skills",        amount: "105000", ref: "TUT-ACCA-APS" },
      { name: "ACCA Strategic Professional",amount: "115000", ref: "TUT-ACCA-SP" },
      { name: "CITN Qualifying",            amount: "90000",  ref: "TUT-CITN-QLF" },
      { name: "CITN Professional",          amount: "100000", ref: "TUT-CITN-PRO" },
      { name: "ATS",                        amount: "65000",  ref: "TUT-ATS" },
      { name: "CISA",                       amount: "120000", ref: "TUT-CISA" },
      { name: "Certificate in IFRS",        amount: "80000",  ref: "TUT-IFRS-CERT" },
      { name: "Diploma in IFRS",            amount: "120000", ref: "TUT-IFRS-DIP" },
    ],
  },
  {
    id: "client",
    label: "Pay as a Client",
    description: "Payments for business advisory, tax, financial statements, audit, and consultancy engagements.",
    items: [
      { name: "Business Advisory Engagement", amount: "", ref: "CONS-ADV" },
      { name: "Tax Advisory & FIRS Filing",   amount: "", ref: "CONS-TAX" },
      { name: "Financial Statement Prep",     amount: "", ref: "CONS-FIN" },
      { name: "Audit Support Engagement",     amount: "", ref: "CONS-AUD" },
      { name: "Asset Review & Valuation",     amount: "", ref: "CONS-AST" },
      { name: "Regulatory Compliance Review", amount: "", ref: "CONS-REG" },
      { name: "Custom Engagement",            amount: "", ref: "CONS-CUST" },
    ],
  },
  {
    id: "training",
    label: "Pay for Training",
    description: "Corporate training programme fees for organisations and individuals.",
    items: [
      { name: "Financial Intelligence (1 day)",  amount: "", ref: "TRN-FIN1" },
      { name: "Financial Intelligence (2 days)", amount: "", ref: "TRN-FIN2" },
      { name: "Tax Updates & Compliance",        amount: "", ref: "TRN-TAX" },
      { name: "IFRS Fundamentals (1 day)",       amount: "", ref: "TRN-IFRS1" },
      { name: "IFRS Fundamentals (3 days)",      amount: "", ref: "TRN-IFRS3" },
      { name: "Finance Team Development",        amount: "", ref: "TRN-TEAM" },
      { name: "Strategy & Business Planning",    amount: "", ref: "TRN-STRAT" },
      { name: "Custom Programme",                amount: "", ref: "TRN-CUST" },
    ],
  },
];

/* ─── Bank transfer ──────────────────────────────────── */
function BankDetails({ category }: { category: Category }) {
  const d = SITE_CONFIG.bankAccounts[category];
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(null), 2000); });
  };
  return (
    <div className="mt-6" style={{ borderTop: "1px solid var(--rule)", paddingTop: "1.5rem" }}>
      <p style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "1rem" }}>Bank Transfer Details</p>
      <div className="space-y-3">
        {[{ label: "Bank Name", value: d.bankName, key: "bank" }, { label: "Account Name", value: d.accountName, key: "name" }, { label: "Account Number", value: d.accountNumber, key: "number" }].map(({ label, value, key }) => (
          <div key={key} className="flex items-center justify-between gap-4" style={{ borderBottom: "1px solid var(--rule)", paddingBottom: "0.75rem" }}>
            <div>
              <p style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "0.15rem" }}>{label}</p>
              <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--ink)" }}>{value}</p>
            </div>
            <button
              onClick={() => copy(value, key)}
              style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", fontWeight: 500, color: copied === key ? "var(--navy)" : "var(--ink-muted)", background: "none", border: "none", cursor: "pointer" }}
            >
              {copied === key ? <><CheckCircle2 className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-3 flex items-start gap-1.5" style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        After transferring, send your receipt to {SITE_CONFIG.contact.email} with your name and service reference.
      </p>
    </div>
  );
}

/* ─── Paystack ───────────────────────────────────────── */
declare global { interface Window { PaystackPop?: { setup: (cfg: object) => { openIframe: () => void } }; } }

function PaystackButton({ email, amountKobo, reference, onSuccess, disabled, label }: { email: string; amountKobo: number; reference: string; onSuccess: (ref: string) => void; disabled: boolean; label: string; }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (document.getElementById("paystack-script")) { setReady(true); return; }
    const s = document.createElement("script");
    s.id = "paystack-script"; s.src = "https://js.paystack.co/v1/inline.js";
    s.onload = () => setReady(true);
    document.body.appendChild(s);
  }, []);
  const handlePay = () => {
    if (!ready || !window.PaystackPop) return;
    window.PaystackPop.setup({ key: SITE_CONFIG.paystackPublicKey || "pk_test_PLACEHOLDER", email, amount: amountKobo, ref: `${reference}-${Date.now()}`, currency: "NGN", channels: ["card", "bank", "ussd", "bank_transfer"], onClose: () => {}, callback: (r: { reference: string }) => onSuccess(r.reference) }).openIframe();
  };
  return (
    <button
      onClick={handlePay}
      disabled={disabled || !ready}
      className="btn btn-primary w-full justify-center"
      style={{ height: "3rem", fontSize: "0.9375rem" }}
    >
      <CreditCard className="w-4 h-4" />
      {label}
    </button>
  );
}

export default function PaymentPageContent() {
  const searchParams  = useSearchParams();
  const initialCat    = (searchParams.get("category") as Category) ?? "student";
  const [activeCat,   setActiveCat]    = useState<Category>(["student","client","training"].includes(initialCat) ? initialCat : "student");
  const [selected,    setSelected]     = useState("");
  const [customAmt,   setCustomAmt]    = useState("");
  const [email,       setEmail]        = useState("");
  const [name,        setName]         = useState("");
  const [paySuccess,  setPaySuccess]   = useState<string | null>(null);

  const cat        = categories.find((c) => c.id === activeCat)!;
  const item       = cat.items.find((i) => i.name === selected);
  const amtNaira   = item?.amount ? Number(item.amount) : (customAmt ? Number(customAmt) : 0);
  const amtKobo    = amtNaira * 100;
  const canPay     = !!email && !!name && amtNaira > 0 && !!selected;

  useEffect(() => { setSelected(""); setCustomAmt(""); setPaySuccess(null); }, [activeCat]);

  const steps = [
    { n: "01", t: "Select your programme or service",  b: "Choose from the list below." },
    { n: "02", t: "Pay online or by bank transfer",    b: "Paystack for instant confirmation, or use the bank details shown." },
    { n: "03", t: "Receive confirmation",              b: "Online payments confirmed immediately. Bank transfers confirmed within one business day." },
    { n: "04", t: "Access your portal",                b: "Once confirmed, your payment history updates in your student or client portal." },
  ];

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
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-light)" }}>Payments</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)", color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>
            Secure Payment Portal
          </h1>
          <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "rgba(255,255,255,0.5)", maxWidth: "30rem" }}>
            Pay for tutoring, consultancy, or corporate training — online via Paystack or by bank transfer.
          </p>
          <div className="flex items-center gap-2 mt-4" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
            <Lock className="w-3 h-3" />
            <span>Secured by Paystack · 256-bit SSL encryption</span>
          </div>
        </div>
      </div>

      {/* ── Category tabs ────────────────────────── */}
      <div
        className="sticky z-40"
        style={{ backgroundColor: "var(--bg)", borderBottom: "1px solid var(--rule)", top: "0" }}
      >
        <div className="content-container flex overflow-x-auto">
          {categories.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveCat(id)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                padding: "1rem 1.25rem",
                border: "none",
                borderBottom: activeCat === id ? "2px solid var(--navy)" : "2px solid transparent",
                backgroundColor: "transparent",
                color: activeCat === id ? "var(--navy)" : "var(--ink-muted)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.2s ease, border-color 0.2s ease",
                marginBottom: "-1px",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Form ─────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--bg)", paddingTop: "5rem", paddingBottom: "7rem" }}>
        <div className="content-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCat}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-[1fr_380px] gap-12 items-start"
            >
              {/* Left — form */}
              <div>
                {/* Category description */}
                <div className="mb-7" style={{ borderBottom: "1px solid var(--rule)", paddingBottom: "1.5rem" }}>
                  <span className="eyebrow" style={{ marginBottom: "0.5rem" }}>{cat.label}</span>
                  <p style={{ fontSize: "0.9rem", color: "var(--ink-muted)" }}>{cat.description}</p>
                </div>

                {paySuccess ? (
                  <div className="py-8 flex flex-col items-start gap-4">
                    <div style={{ width: "3rem", height: "3rem", backgroundColor: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CheckCircle2 style={{ color: "var(--navy)", width: "1.5rem", height: "1.5rem" }} />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.75rem", color: "var(--ink)" }}>Payment Successful</h3>
                    <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--ink-muted)" }}>
                      Reference: <strong style={{ color: "var(--navy)", fontWeight: 500 }}>{paySuccess}</strong>. Confirmation sent to {email}.
                    </p>
                    <button
                      onClick={() => { setPaySuccess(null); setSelected(""); setCustomAmt(""); setEmail(""); setName(""); }}
                      className="btn-ghost" style={{ marginTop: "0.5rem" }}
                    >
                      Make Another Payment →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Name + email */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="pay-name" className="form-label">Full Name *</label>
                        <input id="pay-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="form-input" />
                      </div>
                      <div>
                        <label htmlFor="pay-email" className="form-label">Email Address *</label>
                        <input id="pay-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="form-input" />
                      </div>
                    </div>

                    {/* Programme selection — editorial row list */}
                    <div>
                      <p className="form-label mb-3">{activeCat === "student" ? "Programme *" : "Service *"}</p>
                      <div style={{ borderTop: "1px solid var(--rule)" }}>
                        {cat.items.map((itm) => (
                          <label
                            key={itm.ref}
                            className="flex items-center justify-between py-3.5 cursor-pointer"
                            style={{ borderBottom: "1px solid var(--rule)" }}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="programme"
                                value={itm.name}
                                checked={selected === itm.name}
                                onChange={() => { setSelected(itm.name); setCustomAmt(""); }}
                                style={{ accentColor: "var(--navy)", width: "1rem", height: "1rem", flexShrink: 0 }}
                              />
                              <span style={{ fontSize: "0.9375rem", color: "var(--ink)" }}>{itm.name}</span>
                            </div>
                            {itm.amount ? (
                              <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.125rem", color: "var(--navy)", flexShrink: 0 }}>
                                ₦{Number(itm.amount).toLocaleString()}
                              </span>
                            ) : (
                              <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)", flexShrink: 0 }}>Amount on invoice</span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Custom amount for consultancy/training */}
                    {selected && !item?.amount && (
                      <div>
                        <label htmlFor="pay-amount" className="form-label">
                          Amount (₦) * <span style={{ fontWeight: 400, color: "var(--ink-faint)" }}>— as per your invoice</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ink-muted)" }}>₦</span>
                          <input id="pay-amount" type="number" min="1000" step="500" value={customAmt} onChange={(e) => setCustomAmt(e.target.value)} placeholder="Enter amount from your invoice" className="form-input" style={{ paddingLeft: "2rem" }} />
                        </div>
                      </div>
                    )}

                    {/* Pay button */}
                    <div className="pt-2">
                      <PaystackButton
                        email={email} amountKobo={amtKobo}
                        reference={item?.ref ?? `${activeCat.toUpperCase()}-CUST`}
                        onSuccess={(ref) => setPaySuccess(ref)}
                        disabled={!canPay}
                        label={`Pay ${amtNaira > 0 ? `₦${amtNaira.toLocaleString()}` : ""} via Paystack`}
                      />
                      <p className="mt-2 flex items-center justify-center gap-1.5" style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Card · Bank · USSD · Bank Transfer — all via Paystack
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1" style={{ height: "1px", backgroundColor: "var(--rule)" }} />
                      <span style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)" }}>or pay by bank transfer</span>
                      <div className="flex-1" style={{ height: "1px", backgroundColor: "var(--rule)" }} />
                    </div>

                    <BankDetails category={activeCat} />
                  </div>
                )}
              </div>

              {/* Right — how it works + help */}
              <div className="space-y-8">
                {/* Steps */}
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "1.25rem" }}>How Payment Works</p>
                  <div>
                    {steps.map(({ n, t, b }, i) => (
                      <div key={n} className="flex gap-5 py-5" style={{ borderTop: i === 0 ? "1px solid var(--rule)" : "none", borderBottom: "1px solid var(--rule)" }}>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.25rem", color: "var(--navy)", flexShrink: 0, lineHeight: 1 }}>{n}</span>
                        <div>
                          <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.2rem" }}>{t}</p>
                          <p style={{ fontSize: "0.8125rem", lineHeight: 1.55, color: "var(--ink-muted)" }}>{b}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Help */}
                <div style={{ backgroundColor: "var(--surface)", padding: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.4rem" }}>Need help with your payment?</p>
                  <p style={{ fontSize: "0.8125rem", lineHeight: 1.55, color: "var(--ink-muted)", marginBottom: "1rem" }}>Contact us by WhatsApp or email — include your name, service, and amount.</p>
                  <div className="space-y-2">
                    <a href={SITE_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", fontWeight: 500, color: "#25D366" }}>
                      <svg viewBox="0 0 24 24" style={{ width: "1rem", height: "1rem", fill: "currentColor", flexShrink: 0 }} aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.12 1.523 5.851L.063 23.75l6.093-1.437A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.373l-.36-.213-3.617.853.895-3.508-.233-.37A9.793 9.793 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z"/>
                      </svg>
                      Chat on WhatsApp
                    </a>
                    <a href={`mailto:${SITE_CONFIG.contact.email}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", fontWeight: 500, color: "var(--navy)" }}>
                      <ArrowRight className="w-3.5 h-3.5" />
                      {SITE_CONFIG.contact.email}
                    </a>
                  </div>
                </div>

                {/* Security */}
                <div className="flex items-start gap-3" style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--navy)" }} />
                  <p>All online payments are processed securely by <strong style={{ color: "var(--ink)", fontWeight: 500 }}>Paystack</strong>, a PCI-DSS Level 1 certified processor. PIN Associate does not store your card details.</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
