"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, AlertCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { register, DEMO_MODE, TEST_MODE } from "@/lib/auth";
import GoogleAuthButton from "@/components/ui/GoogleAuthButton";
import { fadeIn } from "@/lib/animations";

/* ── Background slide data from hero section ──────────────────────────── */
const bgSlides = [
  { id: 1, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784613464/Blue_Futuristic_Technology_LinkedIn_Background_Photo_3_l4mhqd.png", alt: "Professional success and graduation" },
  { id: 2, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784557870/Purple_Abstract_Graphic_Design_LinkedIn_Article_Cover_Image_1_lle3mb.png", alt: "Professional accounting training" },
  { id: 3, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784484978/wmremove-transformed_1_1_el1lye.jpg", alt: "Corporate learning environment" },
  { id: 4, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784613463/7_czosms.png", alt: "Academic achievement" },
  { id: 5, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784614901/Blue_Futuristic_Technology_LinkedIn_Background_Photo_2_1_xubyb5.png", alt: "Professional development" },
];

type Role = "STUDENT" | "CLIENT";

const roleOptions: { id: Role; label: string; desc: string }[] = [
  { id: "STUDENT", label: "Student",            desc: "ICAN, ACCA, CITN, ATS, CISA, or IFRS programme" },
  { id: "CLIENT",  label: "Consultancy Client", desc: "Business advisory, tax, financials, or audit" },
];

export default function RegisterPageContent() {
  const router = useRouter();

  const [role,      setRole]      = useState<Role>("STUDENT");
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [password,  setPassword]  = useState("");
  const [password2, setPassword2] = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string>("");

  // Carousel state
  const [bgIdx,  setBgIdx]  = useState(1); // Start with second slide for variety
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo   = useCallback((i: number) => setBgIdx(((i % bgSlides.length) + bgSlides.length) % bgSlides.length), []);
  const bgNext = useCallback(() => goTo(bgIdx + 1), [bgIdx, goTo]);

  /* Carousel auto-advance */
  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(bgNext, 5000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [paused, bgNext]);

  /* Email + password registration */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // In TEST mode, minimal validation - just check passwords match
    if (TEST_MODE) {
      if (password !== password2) { 
        setError("Passwords do not match."); 
        return; 
      }
    } else {
      // Normal validation
      if (password !== password2) { 
        setError("Passwords do not match."); 
        return; 
      }
      if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
        setError("Use at least 8 characters with upper-case and lower-case letters, a number, and a symbol.");
        return;
      }
    }
    
    setLoading(true);
    
    try {
      // In TEST mode, accept any input and create a mock registration
      if (TEST_MODE) {
        // Simulate a brief loading state for realism
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.replace("/portal/login?registered=1");
        return;
      }

      // In demo mode, just redirect without actual registration
      if (DEMO_MODE) {
        // Simulate a brief loading state for realism
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.replace("/portal/login?registered=1");
        return;
      }

      await register({
        email, password, password2,
        first_name: firstName,
        last_name:  lastName,
        phone_number: phone,
        role,
      });
      router.replace("/portal/login?registered=1");
    } catch (err) {
      const apiErr = err as { body?: Record<string, unknown> };
      const body = apiErr?.body;
      if (!body) {
        setError("Registration failed. Please check your details and try again.");
      } else {
        const detail = body.detail;
        if (typeof detail === "string") {
          setError(detail);
          return;
        }
        const validationErrors = Array.isArray(detail)
          ? detail.map((item) => typeof item === "object" && item && "msg" in item ? String(item.msg) : String(item))
          : [];
        const msgs = validationErrors.length ? validationErrors : Object.entries(body)
          .flatMap(([k, v]) => Array.isArray(v) ? v.map((m) => `${k}: ${String(m)}`) : []);
        setError(msgs.join(" · "));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* Left Side - Brand & Background with Image Carousel */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
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
                  position: "absolute", 
                  inset: 0,
                  width: "100%", 
                  height: "100%",
                  objectFit: "cover", 
                  objectPosition: "center",
                }}
                loading="eager"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navy overlay for brand consistency and text readability */}
          <div 
            className="absolute inset-0 z-10"
            style={{ background: "rgba(30, 58, 138, 0.75)" }}
          />
        </div>
        
        {/* Logo */}
        <div className="absolute top-8 left-8 z-30">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/images/pin-logo.png" 
              alt="PIN Associate" 
              width={32} 
              height={32} 
              className="object-contain" 
            />
            <span 
              className="font-medium text-white"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
              }}
            >
              PIN Associate
            </span>
          </Link>
        </div>

        {/* Back Link */}
        <div className="absolute top-8 right-8 z-30">
          <Link 
            href="/"
            className="flex items-center gap-2 transition-all text-sm hover:opacity-80"
            style={{ 
              color: '#FFFFFF',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: '#FFFFFF' }} />
            Back to website
          </Link>
        </div>

        {/* Main Content */}
        <div className="absolute inset-0 flex items-center justify-center w-full px-12 z-20">
          <div className="text-center text-white max-w-lg">
            <h1 
              className="mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.5rem",
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              Building Futures,
              <br />
              <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>
                Creating Success
              </em>
            </h1>
            <p 
              className="text-white/85 text-lg leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Start your journey to professional certification with expert guidance, proven results, and a community of achievers.
            </p>
            
            {/* Benefits list */}
            <div className="text-left space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "var(--gold-light)" }}
                />
                <span className="text-white/80 text-sm">Expert tutors with industry experience</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "var(--gold-light)" }}
                />
                <span className="text-white/80 text-sm">Flexible study schedules that fit your lifestyle</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "var(--gold-light)" }}
                />
                <span className="text-white/80 text-sm">Comprehensive exam-focused resources</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "var(--gold-light)" }}
                />
                <span className="text-white/80 text-sm">Ongoing support throughout your journey</span>
              </div>
            </div>
            
            {/* Progress dots - functional carousel indicators */}
            <div className="flex justify-center gap-2">
              {bgSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="transition-all duration-300"
                  style={{
                    width: i === bgIdx ? "2rem" : "0.375rem",
                    height: "2px",
                    backgroundColor: i === bgIdx ? "var(--gold)" : "rgba(255,255,255,0.35)",
                    border: "none",
                    cursor: "pointer",
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <motion.div 
        className="flex-1 lg:w-1/2 flex items-center justify-center p-8"
        style={{ backgroundColor: "var(--bg)" }}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <Image 
                src="/images/pin-logo.png" 
                alt="PIN Associate" 
                width={36} 
                height={36} 
                className="object-contain" 
              />
              <span 
                className="font-medium"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.125rem",
                  color: "var(--ink)",
                }}
              >
                PIN Associate
              </span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 
              className="mb-2"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.875rem",
                fontWeight: 500,
                color: "var(--ink)",
              }}
            >
              Create an account
            </h2>
            <p style={{ color: "var(--ink-muted)", fontSize: "0.9375rem" }}>
              Already have an account?{" "}
              <Link 
                href="/portal/login"
                className="font-medium transition-colors"
                style={{ color: "var(--gold-dark)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--navy)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--gold-dark)"}
              >
                Log in
              </Link>
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div 
              className="flex items-start gap-3 p-4 mb-6"
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: "8px",
              }}
            >
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Account Type Selection */}
          {/* <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map(({ id, label, desc }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  className={`text-left p-4 transition-all duration-200 ${
                    role === id
                      ? "border-2"
                      : "border"
                  }`}
                  style={{
                    borderRadius: "12px",
                    borderColor: role === id ? "var(--gold)" : "rgba(30, 58, 138, 0.2)",
                    backgroundColor: role === id ? "rgba(244, 196, 48, 0.1)" : "rgba(30, 58, 138, 0.05)",
                  }}
                >
                  <p 
                    className={`font-medium mb-1 text-sm`}
                    style={{
                      color: role === id ? "var(--navy)" : "var(--ink)",
                    }}
                  >
                    {label}
                  </p>
                  <p 
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--ink-muted)",
                      lineHeight: 1.3,
                    }}
                  >
                    {desc}
                  </p>
                </button>
              ))}
            </div>
          </div> */}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                required 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="px-4 py-4 transition-all duration-200"
                style={{
                  backgroundColor: "rgba(30, 58, 138, 0.1)",
                  border: "1px solid rgba(30, 58, 138, 0.2)",
                  borderRadius: "12px",
                  fontSize: "0.9375rem",
                  color: "var(--ink)",
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = "rgba(30, 58, 138, 0.15)";
                  e.target.style.borderColor = "var(--gold)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(244, 196, 48, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = "rgba(30, 58, 138, 0.1)";
                  e.target.style.borderColor = "rgba(30, 58, 138, 0.2)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <input 
                type="text" 
                required 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="px-4 py-4 transition-all duration-200"
                style={{
                  backgroundColor: "rgba(30, 58, 138, 0.1)",
                  border: "1px solid rgba(30, 58, 138, 0.2)",
                  borderRadius: "12px",
                  fontSize: "0.9375rem",
                  color: "var(--ink)",
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = "rgba(30, 58, 138, 0.15)";
                  e.target.style.borderColor = "var(--gold)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(244, 196, 48, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = "rgba(30, 58, 138, 0.1)";
                  e.target.style.borderColor = "rgba(30, 58, 138, 0.2)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Email */}
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-4 transition-all duration-200"
              autoComplete="email"
              style={{
                backgroundColor: "rgba(30, 58, 138, 0.1)",
                border: "1px solid rgba(30, 58, 138, 0.2)",
                borderRadius: "12px",
                fontSize: "0.9375rem",
                color: "var(--ink)",
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = "rgba(30, 58, 138, 0.15)";
                e.target.style.borderColor = "var(--gold)";
                e.target.style.boxShadow = "0 0 0 3px rgba(244, 196, 48, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = "rgba(30, 58, 138, 0.1)";
                e.target.style.borderColor = "rgba(30, 58, 138, 0.2)";
                e.target.style.boxShadow = "none";
              }}
            />

            {/* Password */}
            <div className="relative">
              <input 
                type={showPw ? "text" : "password"} 
                required
                minLength={8}
                maxLength={128}
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-4 pr-12 transition-all duration-200"
                autoComplete="new-password"
                style={{
                  backgroundColor: "rgba(30, 58, 138, 0.1)",
                  border: "1px solid rgba(30, 58, 138, 0.2)",
                  borderRadius: "12px",
                  fontSize: "0.9375rem",
                  color: "var(--ink)",
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = "rgba(30, 58, 138, 0.15)";
                  e.target.style.borderColor = "var(--gold)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(244, 196, 48, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = "rgba(30, 58, 138, 0.1)";
                  e.target.style.borderColor = "rgba(30, 58, 138, 0.2)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPw ? "Hide" : "Show"}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password */}
            <input
              type={showPw ? "text" : "password"}
              required
              minLength={8}
              maxLength={128}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-4 py-4 transition-all duration-200"
              autoComplete="new-password"
              aria-label="Confirm your password"
              aria-invalid={Boolean(password2 && password !== password2)}
              style={{
                backgroundColor: "rgba(30, 58, 138, 0.1)",
                border: "1px solid rgba(30, 58, 138, 0.2)",
                borderRadius: "12px",
                fontSize: "0.9375rem",
                color: "var(--ink)",
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = "rgba(30, 58, 138, 0.15)";
                e.target.style.borderColor = "var(--gold)";
                e.target.style.boxShadow = "0 0 0 3px rgba(244, 196, 48, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = "rgba(30, 58, 138, 0.1)";
                e.target.style.borderColor = "rgba(30, 58, 138, 0.2)";
                e.target.style.boxShadow = "none";
              }}
            />
            {password2 && password !== password2 && (
              <p className="text-sm text-red-600" role="status">Passwords do not match yet.</p>
            )}

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 text-sm" style={{ color: "var(--ink-muted)" }}>
              <input 
                type="checkbox" 
                required
                className="w-4 h-4 mt-0.5 rounded"
                style={{ 
                  accentColor: "var(--gold)",
                }}
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="underline" style={{ color: "var(--gold-dark)" }}>
                  Terms & Conditions
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 text-white font-medium text-sm transition-all duration-200 disabled:opacity-60"
              style={{
                backgroundColor: "var(--gold)",
                borderRadius: "12px",
                border: "none",
                marginTop: "1.5rem",
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "var(--gold-dark)")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "var(--gold)")}
            >
              {loading ? (
                <span 
                  className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "var(--navy-dark)" }}
                />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--rule)" }} />
            <span 
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--ink-faint)" }}
            >
              Or register with
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--rule)" }} />
          </div>

          {/* Social Registration */}
          <div className="space-y-3">
            <GoogleAuthButton action="signup" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
