"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, FileText, ArrowRight, CheckCircle2, Clock, AlertCircle, Activity } from "lucide-react";
import { apiFetch, getStoredUser } from "@/lib/auth";

interface EngagementSummary {
  id: string;
  title: string;
  service_type_display: string;
  status: string;
  status_display: string;
  deliverable_count: number;
  start_date: string;
  expected_completion: string;
  updated_at: string;
}

const statusStyle: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  ACTIVE:    { bg: "var(--navy-50)", text: "var(--navy)",  icon: Activity },
  ON_HOLD:   { bg: "#FEF3C7", text: "#92600A",  icon: Clock },
  COMPLETED: { bg: "var(--navy-50)", text: "var(--navy-dark)",  icon: CheckCircle2 },
  CANCELLED: { bg: "#FEF2F2", text: "#DC2626",  icon: AlertCircle },
};

export default function ClientDashboard() {
  const router = useRouter();
  const user   = getStoredUser();
  const [engagements, setEngagements] = useState<EngagementSummary[]>([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    if (!user) { router.replace("/portal/login?redirect=/portal/client"); return; }
    apiFetch<EngagementSummary[]>("/api/clients/me/engagements/")
      .then((d) => setEngagements(Array.isArray(d) ? d : []))
      .catch(() => setEngagements([]))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const active    = engagements.filter((e) => e.status === "ACTIVE").length;
  const completed = engagements.filter((e) => e.status === "COMPLETED").length;
  const totalDocs = engagements.reduce((s, e) => s + e.deliverable_count, 0);

  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="max-w-4xl">
      <div className="mb-7">
        <h1 className="font-heading font-extrabold text-[var(--navy-dark)] text-2xl">
          Welcome back{user ? `, ${user.first_name}` : ""}
        </h1>
        <p className="text-[var(--ink-muted)] text-sm mt-1">Your engagement overview and deliverables.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: "Active Engagements",  value: loading ? "…" : String(active),    color: "var(--navy)", bg: "var(--navy-50)",  icon: Activity },
          { label: "Completed",           value: loading ? "…" : String(completed), color: "var(--navy)", bg: "var(--surface)",  icon: CheckCircle2 },
          { label: "Documents Available", value: loading ? "…" : String(totalDocs), color: "var(--navy-dark)", bg: "var(--surface)",  icon: FileText },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-[var(--rule)] p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--ink-faint)] uppercase tracking-wider">{label}</p>
              <p className="font-heading font-extrabold text-[var(--ink)] text-2xl leading-none mt-1 tabular-nums">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4 mb-7">
        {[
          { label: "My Profile",    href: "/portal/client/profile",      icon: Briefcase },
          { label: "Deliverables",  href: "/portal/client/deliverables", icon: FileText },
        ].map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between p-5 bg-white rounded-2xl border border-[var(--rule)]
                       hover:border-[var(--navy-100)] hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--surface)] flex items-center justify-center">
                <Icon className="w-4 h-4 text-[var(--navy-dark)]" />
              </div>
              <span className="text-sm font-semibold text-[var(--ink-muted)] group-hover:text-[var(--navy-dark)] transition-colors">{label}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--ink-faint)] group-hover:text-[var(--navy-dark)] group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>

      {/* Engagements list */}
      <div className="bg-white rounded-2xl border border-[var(--rule)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--rule)]">
          <h2 className="font-heading font-bold text-[var(--navy-dark)] text-base">Your Engagements</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[var(--ink-faint)] text-sm">Loading engagements…</div>
        ) : engagements.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-10 h-10 text-[var(--rule)] mx-auto mb-3" />
            <p className="text-sm font-medium text-[var(--ink-faint)]">No engagements on record yet.</p>
            <p className="text-xs text-[var(--ink-faint)] mt-1">Contact us to start a new engagement.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--rule)]">
            {engagements.map((e) => {
              const s = statusStyle[e.status] ?? { bg: "var(--rule)", text: "var(--ink-muted)", icon: Clock };
              const Icon = s.icon;
              return (
                <Link
                  key={e.id}
                  href={`/portal/client/deliverables?engagement=${e.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4
                             hover:bg-[var(--surface)] transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--navy-dark)] transition-colors truncate">
                      {e.title}
                    </p>
                    <p className="text-xs text-[var(--ink-faint)] mt-0.5">
                      {e.service_type_display}
                      {e.expected_completion && ` · Due ${fmtDate(e.expected_completion)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {e.deliverable_count > 0 && (
                      <span className="text-xs font-semibold text-[var(--navy-dark)] bg-[var(--navy-50)] px-2.5 py-1 rounded-full">
                        {e.deliverable_count} doc{e.deliverable_count !== 1 ? "s" : ""}
                      </span>
                    )}
                    <span
                      className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: s.bg, color: s.text }}
                    >
                      <Icon className="w-3 h-3" />
                      {e.status_display}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[var(--ink-faint)] group-hover:text-[var(--navy-dark)] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
