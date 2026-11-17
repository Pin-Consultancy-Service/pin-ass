"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { apiFetch, getStoredUser } from "@/lib/auth";

interface Balance {
  total_fees_due: string;
  total_paid: string;
  balance_due: string;
  updated_at: string;
  notes: string;
}

interface FeeRecord {
  id: string;
  amount: string;
  description: string;
  method_display: string;
  status: string;
  status_display: string;
  paystack_reference: string;
  paid_at: string;
  created_at: string;
}

const statusStyle: Record<string, { bg: string; text: string }> = {
  CONFIRMED: { bg: "var(--navy-50)", text: "var(--navy-dark)" },
  PENDING:   { bg: "#FEF3C7", text: "#92600A" },
  FAILED:    { bg: "#FEF2F2", text: "#DC2626" },
};

export default function StudentFeesPage() {
  const router  = useRouter();
  const user    = getStoredUser();
  const [balance,  setBalance]  = useState<Balance | null>(null);
  const [records,  setRecords]  = useState<FeeRecord[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!user) { router.replace("/portal/login?redirect=/portal/student/fees"); return; }
    Promise.all([
      apiFetch<Balance>("/api/students/me/balance/").catch(() => null),
      apiFetch<FeeRecord[]>("/api/students/me/fees/").catch(() => []),
    ]).then(([b, r]) => {
      setBalance(b);
      setRecords(Array.isArray(r) ? r : []);
    }).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (v: string | undefined) =>
    v ? `₦${Number(v).toLocaleString()}` : "—";

  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="max-w-3xl">
      <div className="mb-7">
        <h1 className="font-heading font-extrabold text-[var(--navy)] text-2xl">Fees &amp; Payments</h1>
        <p className="text-[var(--ink-muted)] text-sm mt-1">Your current balance and payment history.</p>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
        {[
          { label: "Total Fees Due",  value: fmt(balance?.total_fees_due), color: "var(--navy)", bg: "var(--navy-50)",  icon: CreditCard },
          { label: "Total Paid",      value: fmt(balance?.total_paid),     color: "var(--navy)", bg: "var(--surface)",  icon: CheckCircle2 },
          { label: "Balance Due",     value: fmt(balance?.balance_due),
            color: Number(balance?.balance_due ?? 0) > 0 ? "#DC2626" : "var(--navy)",
            bg:    Number(balance?.balance_due ?? 0) > 0 ? "#FEF2F2" : "var(--surface)",
            icon:  AlertCircle },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-[var(--rule)] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-xs font-bold text-[var(--ink-faint)] uppercase tracking-wider">{label}</span>
            </div>
            <p className="font-heading font-extrabold text-[var(--ink)] text-2xl tabular-nums">
              {loading ? "…" : value}
            </p>
          </div>
        ))}
      </div>

      {/* Outstanding balance CTA */}
      {!loading && Number(balance?.balance_due ?? 0) > 0 && (
        <div className="flex items-center justify-between p-5 bg-[#FFFBEB] rounded-2xl border border-[#FDE68A] mb-7">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#92600A]" />
            <div>
              <p className="text-sm font-bold text-[#92600A]">You have an outstanding balance of {fmt(balance?.balance_due)}</p>
              <p className="text-xs text-[#92600A]/70 mt-0.5">Pay securely online or by bank transfer.</p>
            </div>
          </div>
          <Link
            href="/payment?category=student"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-bold
                       text-[var(--navy-dark)] bg-[#F4C430] px-5 py-2.5 rounded-xl
                       hover:bg-[#D4A820] transition-colors whitespace-nowrap"
          >
            Pay Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Staff notes */}
      {balance?.notes && (
        <div className="p-4 bg-[var(--navy-50)] rounded-xl border border-[var(--navy-100)] mb-7 text-sm text-[var(--navy)]">
          <span className="font-semibold">Note from PIN: </span>{balance.notes}
        </div>
      )}

      {/* Payment history table */}
      <div className="bg-white rounded-2xl border border-[var(--rule)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--rule)]">
          <h2 className="font-heading font-bold text-[var(--navy)] text-base">Payment History</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[var(--ink-faint)] text-sm">Loading payment history…</div>
        ) : records.length === 0 ? (
          <div className="p-10 text-center">
            <CreditCard className="w-10 h-10 text-[var(--rule)] mx-auto mb-3" />
            <p className="text-sm font-medium text-[var(--ink-faint)]">No confirmed payments on record yet.</p>
            <Link href="/payment?category=student" className="text-sm font-semibold text-[var(--navy)] mt-2 inline-block hover:underline">
              Make a payment →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[var(--rule)]">
            {records.map((r) => {
              const s = statusStyle[r.status] ?? { bg: "var(--rule)", text: "var(--ink-muted)" };
              return (
                <div key={r.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--ink)] truncate">{r.description}</p>
                    <p className="text-xs text-[var(--ink-faint)] mt-0.5">
                      {r.method_display} · {fmtDate(r.paid_at || r.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: s.bg, color: s.text }}
                    >
                      {r.status_display}
                    </span>
                    <span className="font-heading font-bold text-[var(--navy)] tabular-nums">
                      {fmt(r.amount)}
                    </span>
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
