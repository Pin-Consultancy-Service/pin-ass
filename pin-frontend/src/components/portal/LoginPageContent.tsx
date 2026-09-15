"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { login, googleAuth, getStoredUser, portalHomeForRole } from "@/lib/auth";
import GoogleSignInButton from "./GoogleSignInButton";

export default function LoginPageContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get("redirect") ?? "";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  /* If already logged in, redirect straight to their portal */
  useEffect(() => {
    const user = getStoredUser();
    if (user) router.replace(redirectTo || portalHomeForRole(user.role));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  /* Google sign-in */
  const handleGoogleCredential = async (credential: string) => {
    setError("");
    setLoading(true);
    try {
      const { user } = await googleAuth(credential);
      router.replace(redirectTo || portalHomeForRole(user.role));
    } catch (err) {
      const apiErr = err as { body?: { detail?: string } };
      setError(
        apiErr?.body?.detail ??
        "Google sign-in failed. Please try again or use email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-5">
            <div className="bg-[var(--navy-50)] rounded-xl p-2">
              <Image src="/images/pin-logo.png" alt="PIN Associate" width={36} height={36} className="object-contain" />
            </div>
            <div className="text-left leading-none">
              <span className="block font-heading font-bold text-[var(--navy)] text-lg">PIN Associate</span>
              <span className="block text-[10px] font-medium text-[var(--ink-muted)] tracking-widest uppercase">Portal Login</span>
            </div>
          </Link>
          <h1 className="font-heading font-extrabold text-[var(--navy)] text-2xl leading-tight">
            Sign in to your portal
          </h1>
          <p className="text-[var(--ink-muted)] text-sm mt-2">
            Students, clients, and training participants use the same login.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[var(--rule)] shadow-sm p-8">

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-[#FEF2F2] rounded-xl border border-[#FECACA] mb-6">
              <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#DC2626]">{error}</p>
            </div>
          )}

          {/* Google sign-in */}
          <div className="mb-5">
            <GoogleSignInButton onCredential={handleGoogleCredential} disabled={loading} />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[var(--rule)]" />
            <span className="text-xs font-semibold text-[var(--ink-faint)] uppercase tracking-wider">or sign in with email</span>
            <div className="flex-1 h-px bg-[var(--rule)]" />
          </div>

          {/* Email / password form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="form-input"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="form-label mb-0">Password</label>
                <Link href="/portal/forgot-password"
                      className="text-xs font-semibold text-[var(--navy)] hover:text-[var(--navy-dark)] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password" type={showPw ? "text" : "password"} required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="form-input pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--ink-muted)] transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2
                         bg-[var(--navy)] text-white font-bold text-sm
                         px-6 py-4 rounded-xl hover:bg-[var(--navy-dark)] transition-colors
                         shadow-sm disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <LogIn className="w-4 h-4" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--ink-muted)] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/portal/register"
                  className="font-semibold text-[var(--navy)] hover:text-[var(--navy-dark)] transition-colors">
              Register here
            </Link>
          </p>
        </div>

        {/* Default credentials notice — remove before going live */}
        <div className="mt-5 p-4 bg-[#FFFBEB] rounded-2xl border border-[#FDE68A]">
          <p className="text-[10px] font-bold text-[#92600A] uppercase tracking-wider mb-2">
            Development — Default Credentials
          </p>
          <div className="space-y-1.5 font-mono text-xs text-[#92600A]">
            <p><strong>Staff:</strong>   admin@pinassociate.com / PINadmin2026!</p>
            <p><strong>Student:</strong> student@pinassociate.com / PINstudent2026!</p>
            <p><strong>Client:</strong>  client@pinassociate.com / PINclient2026!</p>
          </div>
          <p className="text-[10px] text-[#92600A]/60 mt-2">
            Remove this panel before launching to production.
          </p>
        </div>

        <p className="text-center text-xs text-[var(--ink-faint)] mt-5">
          <Link href="/" className="hover:text-[var(--ink-muted)] transition-colors">
            ← Back to PIN Associate website
          </Link>
        </p>
      </div>
    </div>
  );
}
