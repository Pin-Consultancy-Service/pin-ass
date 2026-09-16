"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Eye, EyeOff, LogIn, AlertCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { login, getStoredUser, portalHomeForRole } from "@/lib/auth";
import GoogleAuthButton from "@/components/ui/GoogleAuthButton";

/* ── Background slide data from hero section ──────────────────────────── */
const bgSlides = [
  { id: 1, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784613464/Blue_Futuristic_Technology_LinkedIn_Background_Photo_3_l4mhqd.png", alt: "Professional success and graduation" },
  { id: 2, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784557870/Purple_Abstract_Graphic_Design_LinkedIn_Article_Cover_Image_1_lle3mb.png", alt: "Professional accounting training" },
  { id: 3, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784484978/wmremove-transformed_1_1_el1lye.jpg", alt: "Corporate learning environment" },
  { id: 4, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784613463/7_czosms.png", alt: "Academic achievement" },
  { id: 5, src: "https://res.cloudinary.com/yaovkmpi/image/upload/v1784614901/Blue_Futuristic_Technology_LinkedIn_Background_Photo_2_1_xubyb5.png", alt: "Professional development" },
];

export default function LoginPageContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams?.get("redirect") ?? "";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  // Carousel state
  const [bgIdx,  setBgIdx]  = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo   = useCallback((i: number) => setBgIdx(((i % bgSlides.length) + bgSlides.length) % bgSlides.length), []);
  const bgNext = useCallback(() => goTo(bgIdx + 1), [bgIdx, goTo]);

  /* If already logged in, redirect straight to their portal */
  useEffect(() => {
    const user = getStoredUser();
    if (user) router.replace(redirectTo || portalHomeForRole(user.role));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Carousel auto-advance */
  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(bgNext, 5000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [paused, bgNext]);

  /* Email + password login */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await login(email, password);
      router.replace(redirectTo || portalHomeForRole(user.role));
    } catch (err) {
      const apiErr = err as { body?: { detail?: string } };
      setError(
        apiErr?.body?.detail ?? "Invalid email or password. Please try again."
      );
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
              className="mb-6 text-white/85"
              
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.5rem",
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              Professional Excellence,
              <br />
              <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>
                Achieved Together
              </em>
            </h1>
            <p 
              className="text-white/85 text-lg leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Join thousands of successful professionals who trust PIN Associate for their examination success and career advancement.
            </p>
            
            {/* Key stats/features */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ color: "var(--gold-light)", fontFamily: "var(--font-display)" }}
                >
                  87%
                </div>
                <div className="text-white/70 text-sm">First-time Pass Rate</div>
              </div>
              <div className="text-center">
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ color: "var(--gold-light)", fontFamily: "var(--font-display)" }}
                >
                  5000+
                </div>
                <div className="text-white/70 text-sm">Graduates</div>
              </div>
              <div className="text-center">
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ color: "var(--gold-light)", fontFamily: "var(--font-display)" }}
                >
                  15+
                </div>
                <div className="text-white/70 text-sm">Years Excellence</div>
              </div>
            </div>
            
            {/* Progress dots - now functional carousel indicators */}
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
      <div 
        className="flex-1 lg:w-1/2 flex items-center justify-center p-8"
        style={{ backgroundColor: "var(--bg)" }}
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
              Welcome back
            </h2>
            <p style={{ color: "var(--ink-muted)", fontSize: "0.9375rem" }}>
              Already have an account?{" "}
              <Link 
                href="/portal/register"
                className="font-medium transition-colors"
                style={{ color: "var(--gold-dark)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--navy)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--gold-dark)"}
              >
                Create one
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                id="email" 
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
            </div>

            <div className="relative">
              <input
                id="password" 
                type={showPw ? "text" : "password"} 
                required
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-4 pr-12 transition-all duration-200"
                autoComplete="current-password"
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
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-right">
              <Link 
                href="/portal/forgot-password"
                className="text-sm transition-colors"
                style={{ color: "var(--gold-dark)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--navy)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--gold-dark)"}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 text-white font-medium text-sm transition-all duration-200 disabled:opacity-60"
              style={{
                backgroundColor: "var(--gold)",
                borderRadius: "12px",
                border: "none",
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
                <LogIn className="w-4 h-4" />
              )}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--rule)" }} />
            <span 
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--ink-faint)" }}
            >
              Or continue with
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--rule)" }} />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <GoogleAuthButton action="signin" />
          </div>
        </div>
      </div>
    </div>
  );
}