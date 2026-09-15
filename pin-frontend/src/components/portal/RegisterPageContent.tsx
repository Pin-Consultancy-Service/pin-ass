"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { register, googleAuth, portalHomeForRole } from "@/lib/auth";
import GoogleSignInButton from "./GoogleSignInButton";

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
  const [done,      setDone]      = useState(false);

  /* Email + password registration */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== password2) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await register({
        email, password, password2,
        first_name: firstName,
        last_name:  lastName,
        phone_number: phone,
        role,
      });
      setDone(true);
    } catch (err) {
      const apiErr = err as { body?: Record<string, string[]> | { detail?: string } };
      const body = apiErr?.body;
      if (!body) {
        setError("Registration failed. Please check your details and try again.");
      } else if ("detail" in body) {
        setError((body as { detail?: string }).detail ?? "An error occurred.");
      } else {
        const msgs = Object.entries(body as Record<string, string[]>)
          .flatMap(([k, v]) => v.map((m) => `${k}: ${m}`));
        setError(msgs.join(" · "));
      }
    } finally {
      setLoading(false);
    }
  };

  /* Google sign-up — creates account with selected role */
  const handleGoogleCredential = async (credential: string) => {
    setError("");
    setLoading(true);
    try {
      const { user, created } = await googleAuth(credential, role);
      if (created) {
        /* New account — take them straight to their portal */
        router.replace(portalHomeForRole(user.role));
      } else {
        /* Existing account — also redirect (effectively a login) */
        router.replace(portalHomeForRole(user.role));
      }
    } catch (err) {
      const apiErr = err as { body?: { detail?: string } };
      setError(
        apiErr?.body?.detail ??
        "Google sign-up failed. Please try again or register with email."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── Success state ────────────────────────────────── */
  if (done) {
    return (
      <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-[var(--navy-50)] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-[var(--navy)]" />
          </div>
          <h1 className="font-heading font-extrabold text-[var(--navy)] text-2xl mb-3">Account Created</h1>
          <p className="text-[var(--ink-muted)] text-base leading-relaxed mb-6">
            Your account has been created. Sign in with your email and password.
          </p>
          <Link
            href="/portal/login"
            className="inline-flex items-center gap-2 bg-[var(--navy)] text-white font-bold
                       text-sm px-8 py-4 rounded-xl hover:bg-[var(--navy-dark)] transition-colors shadow-sm"
          >
            Sign In to Your Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-5">
            <div className="bg-[var(--navy-50)] rounded-xl p-2">
              <Image src="/images/pin-logo.png" alt="PIN Associate" width={36} height={36} className="object-contain" />
            </div>
            <div className="text-left leading-none">
              <span className="block font-heading font-bold text-[var(--navy)] text-lg">PIN Associate</span>
              <span className="block text-[10px] font-medium text-[var(--ink-muted)] tracking-widest uppercase">Create Account</span>
            </div>
          </Link>
          <h1 className="font-heading font-extrabold text-[var(--navy)] text-2xl">
            Register for portal access
          </h1>
          <p className="text-[var(--ink-muted)] text-sm mt-2">
            For students, consultancy clients, and training participants.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[var(--rule)] shadow-sm p-8">

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-[#FEF2F2] rounded-xl border border-[#FECACA] mb-6">
              <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#DC2626]">{error}</p>
            </div>
          )}

          {/* Account type — shown above Google button so the role is captured */}
          <div className="mb-5">
            <p className="form-label">Account Type *</p>
            <div className="grid grid-cols-2 gap-3 mt-1">
              {roleOptions.map(({ id, label, desc }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    role === id
                      ? "border-[var(--navy)] bg-[var(--navy-50)]"
                      : "border-[var(--rule)] hover:border-[var(--navy-100)]"
                  }`}
                >
                  <p className={`text-sm font-bold mb-0.5 ${role === id ? "text-[var(--navy)]" : "text-[var(--ink)]"}`}>
                    {label}
                  </p>
                  <p className="text-[11px] text-[var(--ink-muted)] leading-snug">{desc}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--ink-faint)] mt-2">
              Training participants: select Student and choose your programme after login.
            </p>
          </div>

          {/* Google sign-up */}
          <div className="mb-5">
            <GoogleSignInButton
              onCredential={handleGoogleCredential}
              label="Sign up with Google"
              disabled={loading}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[var(--rule)]" />
            <span className="text-xs font-semibold text-[var(--ink-faint)] uppercase tracking-wider">or register with email</span>
            <div className="flex-1 h-px bg-[var(--rule)]" />
          </div>

          {/* Email / password form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first" className="form-label">First Name *</label>
                <input id="first" type="text" required value={firstName}
                       onChange={(e) => setFirstName(e.target.value)}
                       placeholder="First name" className="form-input" />
              </div>
              <div>
                <label htmlFor="last" className="form-label">Last Name *</label>
                <input id="last" type="text" required value={lastName}
                       onChange={(e) => setLastName(e.target.value)}
                       placeholder="Last name" className="form-input" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-email" className="form-label">Email Address *</label>
                <input id="reg-email" type="email" required value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="your@email.com" className="form-input"
                       autoComplete="email" />
              </div>
              <div>
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input id="phone" type="tel" value={phone}
                       onChange={(e) => setPhone(e.target.value)}
                       placeholder="+234 800 000 0000" className="form-input" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="pw" className="form-label">Password *</label>
                <div className="relative">
                  <input id="pw" type={showPw ? "text" : "password"} required
                         value={password} onChange={(e) => setPassword(e.target.value)}
                         placeholder="Min 8 characters"
                         className="form-input pr-10"
                         autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPw((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--ink-muted)]"
                          aria-label={showPw ? "Hide" : "Show"}>
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="pw2" className="form-label">Confirm Password *</label>
                <input id="pw2" type="password" required
                       value={password2} onChange={(e) => setPassword2(e.target.value)}
                       placeholder="Repeat password"
                       className="form-input"
                       autoComplete="new-password" />
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
                : <UserPlus className="w-4 h-4" />}
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--ink-muted)] mt-6">
            Already have an account?{" "}
            <Link href="/portal/login"
                  className="font-semibold text-[var(--navy)] hover:text-[var(--navy-dark)] transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[var(--ink-faint)] mt-6">
          <Link href="/" className="hover:text-[var(--ink-muted)] transition-colors">
            ← Back to PIN Associate website
          </Link>
        </p>
      </div>
    </div>
  );
}
