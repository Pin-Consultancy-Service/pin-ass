"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, CreditCard, User, ArrowRight, CheckCircle2, Award, Clock } from "lucide-react";
import { apiFetch, getStoredUser } from "@/lib/auth";

interface Enrollment {
  id: string;
  programme_display: string;
  custom_programme_name: string;
  mode_display: string;
  organisation: string;
  training_date: string;
  training_end_date: string;
  venue: string;
  status: string;
  status_display: string;
  certificate_issued: boolean;
  payments: { id: string; amount: string; status: string; status_display: string }[];
}

const statusStyle: Record<string, { bg: string; text: string }> = {
  PENDING:   { bg: "#FEF3C7", text: "#92600A" },
  CONFIRMED: { bg: "var(--navy-50)", text: "var(--navy-dark)" },
  ATTENDED:  { bg: "var(--navy-50)", text: "var(--navy)" },
  CANCELLED: { bg: "#FEF2F2", text: "#DC2626" },
};

export default function TrainingDashboard() {
  const router = useRouter();
  const user   = getStoredUser();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    if (!user) { router.replace("/portal/login?redirect=/portal/training"); return; }
    apiFetch<Enrollment[]>("/api/training/me/enrollments/")
      .then((d) => setEnrollments(Array.isArray(d) ? d : []))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const latestEnrollment = enrollments[0];
  const confirmed = enrollments.filter((e) => e.status === "CONFIRMED" || e.status === "ATTENDED").length;

  return (
    <div className="max-w-3xl">
      <div className="mb-7">
        <h1 className="font-heading font-extrabold text-[var(--navy)] text-2xl">
          Welcome back{user ? `, ${user.first_name}` : ""}
        </h1>
        <p className="text-[var(--ink-muted)] text-sm mt-1">Your training programmes and progress.</p>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: "Enrolled",    value: loading ? "…" : String(enrollments.length), color: "var(--navy)", bg: "var(--surface)",  icon: BookOpen },
          { label: "Confirmed",   value: loading ? "…" : String(confirmed),           color: "var(--navy)", bg: "var(--navy-50)",  icon: CheckCircle2 },
          { label: "Certificates",value: loading ? "…" : String(enrollments.filter((e) => e.certificate_issued).length), color: "#92600A", bg: "#FFFBEB", icon: Award },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-[var(--rule)] p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--ink-faint)] uppercase tracking-wider">{label}</p>
              <p className="font-heading font-extrabold text-[var(--ink)] text-xl leading-none mt-0.5 tabular-nums">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: "My Profile",      href: "/portal/training/profile",   icon: User },
          { label: "Materials",       href: "/portal/training/materials", icon: BookOpen },
          { label: "Payment Status",  href: "/portal/training/fees",      icon: CreditCard },
        ].map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[var(--rule)]
                       hover:border-[var(--navy-100)] hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center">
                <Icon className="w-4 h-4 text-[var(--navy)]" />
              </div>
              <span className="text-xs font-semibold text-[var(--ink-muted)] group-hover:text-[var(--navy)] transition-colors">{label}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--ink-faint)] group-hover:text-[var(--navy)] group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>

      {/* Enrollments */}
      <div className="bg-white rounded-2xl border border-[var(--rule)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--rule)]">
          <h2 className="font-heading font-bold text-[var(--navy)] text-base">My Training Programmes</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[var(--ink-faint)] text-sm">Loading…</div>
        ) : enrollments.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-10 h-10 text-[var(--rule)] mx-auto mb-3" />
            <p className="text-sm font-medium text-[var(--ink-faint)]">No training enrollments yet.</p>
            <p className="text-xs text-[var(--ink-faint)] mt-1">Contact PIN Associate to enrol in a programme.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--rule)]">
            {enrollments.map((e) => {
              const s  = statusStyle[e.status] ?? { bg: "var(--rule)", text: "var(--ink-muted)" };
              const prog = e.custom_programme_name || e.programme_display;
              return (
                <div key={e.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--ink)] truncate">{prog}</p>
                      <p className="text-xs text-[var(--ink-faint)] mt-0.5">
                        {e.mode_display}
                        {e.training_date && ` · ${fmtDate(e.training_date)}`}
                        {e.training_end_date && ` – ${fmtDate(e.training_end_date)}`}
                        {e.venue && ` · ${e.venue}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {e.certificate_issued && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#92600A] bg-[#FFFBEB] px-2.5 py-1 rounded-full">
                          <Award className="w-2.5 h-2.5" /> Certified
                        </span>
                      )}
                      <span
                        className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: s.bg, color: s.text }}
                      >
                        {e.status_display}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
