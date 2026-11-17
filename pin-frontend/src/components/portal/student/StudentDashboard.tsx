"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, BookOpen, User, ArrowRight, TrendingDown, CheckCircle2, Clock } from "lucide-react";
import { apiFetch, getStoredUser } from "@/lib/auth";

interface FeeBalance { total_minor: number; paid_minor: number; balance_minor: number; }
interface Profile { registration_number: string; programme_display: string; diet: string; study_mode_display: string; date_enrolled: string; }

export default function StudentDashboard() {
  const router  = useRouter();
  const user    = getStoredUser();
  const [feeBalances, setFeeBalances] = useState<FeeBalance[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.replace("/portal/login?redirect=/portal/student"); return; }
    Promise.all([
      apiFetch<FeeBalance[]>("/api/v1/students/me/fee-balances").catch(() => []),
      apiFetch<Profile>("/api/students/me/profile/").catch(() => null),
    ]).then(([balances, p]) => { setFeeBalances(Array.isArray(balances) ? balances : []); setProfile(p); }).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (v: string | undefined) =>
    v ? `₦${Number(v).toLocaleString()}` : "—";
  const totalFees = feeBalances.reduce((sum, item) => sum + item.total_minor, 0) / 100;
  const totalPaid = feeBalances.reduce((sum, item) => sum + item.paid_minor, 0) / 100;
  const balanceDue = feeBalances.reduce((sum, item) => sum + item.balance_minor, 0) / 100;

  return (
    <div className="max-w-4xl">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-heading font-extrabold text-[var(--navy)] text-2xl leading-tight">
          Welcome back{user ? `, ${user.first_name}` : ""}
        </h1>
        <p className="text-[var(--ink-muted)] text-sm mt-1">
          {profile?.programme_display
            ? `${profile.programme_display} · ${profile.diet || "Current Diet"}`
            : "Your student portal overview"}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Fees Due",
            value: loading ? "…" : fmt(String(totalFees)),
            icon: TrendingDown,
            color: "var(--navy)",
            bg: "var(--navy-50)",
          },
          {
            label: "Total Paid",
            value: loading ? "…" : fmt(String(totalPaid)),
            icon: CheckCircle2,
            color: "var(--navy)",
            bg: "var(--surface)",
          },
          {
            label: "Balance Due",
            value: loading ? "…" : fmt(String(balanceDue)),
            icon: CreditCard,
            color: balanceDue > 0 ? "#DC2626" : "var(--navy)",
            bg:    balanceDue > 0 ? "#FEF2F2" : "var(--surface)",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-[var(--rule)] p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--ink-faint)] uppercase tracking-wider">{label}</p>
              <p className="font-heading font-extrabold text-[var(--ink)] text-xl leading-none mt-1 tabular-nums">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "View My Profile",       href: "/portal/student/profile",   icon: User,       color: "var(--navy)" },
          { label: "Fee History",           href: "/portal/student/fees",      icon: CreditCard, color: "var(--navy-dark)" },
          { label: "Download Materials",    href: "/portal/student/materials", icon: BookOpen,   color: "var(--navy)" },
        ].map(({ label, href, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between p-5 bg-white rounded-2xl border border-[var(--rule)]
                       hover:border-[var(--navy-100)] hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--surface)] flex items-center justify-center">
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-sm font-semibold text-[var(--ink-muted)] group-hover:text-[var(--navy)] transition-colors">{label}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--ink-faint)] group-hover:text-[var(--navy)] group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>

      {/* Profile snapshot */}
      {profile && (
        <div className="bg-white rounded-2xl border border-[var(--rule)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-[var(--navy)] text-base">Enrollment Details</h2>
            <Link href="/portal/student/profile" className="text-xs font-semibold text-[var(--navy)] hover:text-[var(--navy-dark)] transition-colors">
              Edit →
            </Link>
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { dt: "Reg. Number",  dd: profile.registration_number || "Pending" },
              { dt: "Programme",    dd: profile.programme_display },
              { dt: "Diet",         dd: profile.diet || "—" },
              { dt: "Study Mode",   dd: profile.study_mode_display },
            ].map(({ dt, dd }) => (
              <div key={dt} className="p-3 bg-[var(--surface)] rounded-xl">
                <dt className="text-[10px] font-bold text-[var(--ink-faint)] uppercase tracking-wider">{dt}</dt>
                <dd className="text-sm font-semibold text-[var(--ink)] mt-1">{dd}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Make payment CTA */}
      {balanceDue > 0 && (
        <div className="mt-6 flex items-center justify-between p-5 bg-[#FFFBEB] rounded-2xl border border-[#FDE68A]">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#92600A]" />
            <div>
              <p className="text-sm font-bold text-[#92600A]">Outstanding balance: {fmt(String(balanceDue))}</p>
              <p className="text-xs text-[#92600A]/70 mt-0.5">Pay online or by bank transfer.</p>
            </div>
          </div>
          <Link
            href="/payment?category=student"
            className="flex-shrink-0 text-sm font-bold text-white bg-[#F4C430] px-5 py-2.5
                       rounded-xl hover:bg-[#D4A820] transition-colors"
          >
            Pay Now
          </Link>
        </div>
      )}
    </div>
  );
}
