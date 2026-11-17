"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, ArrowRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";

const programmes = [
  "ICAN — Foundation Level",
  "ICAN — Skills Level",
  "ICAN — Professional Level",
  "ACCA — Applied Knowledge",
  "ACCA — Applied Skills",
  "ACCA — Strategic Professional",
  "CITN — Qualifying Examination",
  "CITN — Professional Examination",
  "ATS",
  "CISA",
  "Diploma in IFRS",
  "Corporate Training",
  "Business Consulting",
];

const studyModes = [
  "Weekday (Mornings)",
  "Weekday (Evenings)",
  "Weekend",
  "Online Only",
  "Hybrid (Online + In-person)",
];

const steps = [
  {
    n: "01",
    title: "Submit Application",
    body: "Complete and submit this form. Our admissions team reviews every application within one business day.",
  },
  {
    n: "02",
    title: "Advisor Contact",
    body: "An admissions advisor will contact you to discuss your background, goals, and the right programme entry point.",
  },
  {
    n: "03",
    title: "Enrolment & Payment",
    body: "Receive your enrolment confirmation, payment details, and class schedule. Payment plans are available.",
  },
  {
    n: "04",
    title: "Begin Classes",
    body: "Receive your study materials and join your first class. Your journey to certification begins.",
  },
];

/* Reusable labelled field wrapper */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-semibold text-[#343A40]">
        {label}
        {required && <span className="text-[#1E3A8A] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

/* Consistent input style — no overlapping icon */
const inputCls =
  "w-full px-4 py-3 bg-white border border-[#DEE2E6] rounded-xl text-sm text-[#222222] " +
  "placeholder-[#ADB5BD] focus:outline-none focus:border-[#1E3A8A] " +
  "focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all duration-150";

export default function ApplyPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    programme: "",
    mode: "",
    qualification: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <PageHero
          title="Apply to PIN Consultancy"
          description="Complete this form and our admissions team will be in touch within one business day to guide you through the registration process."
          slides={[
            {
              id: 1,
              src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1793970460/PIN_Associates_Courtyard_Team_Portrait_d0f9ez.png",
              alt: "University students studying together",
            },
            {
              id: 2,
              src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1793970782/Young_Team_Smiling_at_PIN_Associates_usxxwl.png",
              alt: "Professional accounting class",
            },
            {
              id: 3,
              src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784613463/8_xzeshb.png",
              alt: "Corporate learning session",
            },
          ]}
        />

        <section className="section-py bg-white">
          <div className="container-pin">
            <div className="grid lg:grid-cols-[1fr_1.8fr] gap-10 lg:gap-14">

              {/* ── Left — process steps ── */}
              <div className="lg:sticky lg:top-28 self-start">
                <h2 className="font-heading font-bold text-[#222222] text-xl mb-7">
                  What Happens Next
                </h2>

                <div className="space-y-6">
                  {steps.map(({ n, title, body }) => (
                    <div key={n} className="flex items-start gap-4">
                      <div
                        className="w-9 h-9 bg-[#1E3A8A] rounded-xl flex items-center
                                   justify-center text-white font-bold text-xs flex-shrink-0"
                      >
                        {n}
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-[#222222] text-sm mb-1">
                          {title}
                        </h3>
                        <p className="text-[#6C757D] text-sm leading-relaxed">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-5 bg-[#FFFBEB] rounded-2xl border border-[#FDE68A]">
                  <p className="font-heading font-bold text-[#92600A] text-sm mb-1.5">
                    💡 Not sure which programme?
                  </p>
                  <p className="text-[#92600A] text-xs leading-relaxed">
                    Tell us your background in the message field and our advisor will
                    recommend the right programme and entry point for you.
                  </p>
                </div>
              </div>

              {/* ── Right — form ── */}
              <div>
                {!sent ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSent(true);
                    }}
                    className="bg-[#F8F9FA] rounded-3xl border border-[#E9ECEF] p-5 sm:p-8 space-y-5"
                  >
                    {/* Row 1 — First / Last name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="First Name" required>
                        <input
                          name="firstName"
                          type="text"
                          required
                          autoComplete="given-name"
                          value={form.firstName}
                          onChange={handleChange}
                          placeholder="Your first name"
                          className={inputCls}
                        />
                      </Field>

                      <Field label="Last Name" required>
                        <input
                          name="lastName"
                          type="text"
                          required
                          autoComplete="family-name"
                          value={form.lastName}
                          onChange={handleChange}
                          placeholder="Your last name"
                          className={inputCls}
                        />
                      </Field>
                    </div>

                    {/* Row 2 — Email / Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Email Address" required>
                        <input
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className={inputCls}
                        />
                      </Field>

                      <Field label="Phone Number" required>
                        <input
                          name="phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+234 800 000 0000"
                          className={inputCls}
                        />
                      </Field>
                    </div>

                    {/* Row 3 — Programme */}
                    <Field label="Programme of Interest" required>
                      <select
                        name="programme"
                        required
                        value={form.programme}
                        onChange={handleChange}
                        className={inputCls}
                      >
                        <option value="">Select a programme…</option>
                        {programmes.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </Field>

                    {/* Row 4 — Study mode / Qualification */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Preferred Study Mode" required>
                        <select
                          name="mode"
                          required
                          value={form.mode}
                          onChange={handleChange}
                          className={inputCls}
                        >
                          <option value="">Select mode…</option>
                          {studyModes.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Highest Qualification">
                        <input
                          name="qualification"
                          type="text"
                          autoComplete="off"
                          value={form.qualification}
                          onChange={handleChange}
                          placeholder="e.g. B.Sc. Accounting"
                          className={inputCls}
                        />
                      </Field>
                    </div>

                    {/* Row 5 — Message */}
                    <Field label="Additional Information">
                      <textarea
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about yourself, your goals, or any questions you have…"
                        className={`${inputCls} resize-none`}
                      />
                    </Field>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2
                                 bg-[#1E3A8A] text-white font-semibold text-sm
                                 px-8 py-4 rounded-xl hover:bg-[#152D6E]
                                 transition-colors shadow-sm"
                    >
                      Submit Application
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <p className="text-xs text-[#ADB5BD] text-center">
                      We will contact you within one business day. Your information is
                      kept confidential.
                    </p>
                  </form>
                ) : (
                  /* Success state */
                  <div
                    className="bg-[#F8F9FA] rounded-3xl border border-[#E9ECEF]
                                p-10 sm:p-12 flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center mb-5">
                      <CheckCircle2 className="w-8 h-8 text-[#16A34A]" />
                    </div>
                    <h3 className="font-heading font-bold text-[#222222] text-2xl mb-3">
                      Application Received
                    </h3>
                    <p className="text-[#6C757D] text-sm leading-relaxed max-w-sm mb-6">
                      Thank you, {form.firstName}. Your application has been submitted.
                      An admissions advisor will contact you at{" "}
                      <span className="font-medium text-[#1E3A8A]">{form.email}</span>{" "}
                      within one business day.
                    </p>
                    <button
                      onClick={() => {
                        setSent(false);
                        setForm({
                          firstName: "",
                          lastName: "",
                          email: "",
                          phone: "",
                          programme: "",
                          mode: "",
                          qualification: "",
                          message: "",
                        });
                      }}
                      className="text-sm font-semibold text-[#1E3A8A] hover:text-[#152D6E] transition-colors"
                    >
                      Submit Another Application
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
