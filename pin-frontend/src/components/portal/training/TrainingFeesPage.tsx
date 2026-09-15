"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, ArrowRight, CheckCircle2 } from "lucide-react";
import { apiFetch, getStoredUser } from "@/lib/auth";

interface Payment {
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
  REFUNDED:  { bg: "var(--navy-50)", text: "var(--navy)" },
};

export default function TrainingFeesPage() {
  const router = useRouter();
  const user   = getStoredUser();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!user) { router.replace("/portal/login?redirect=/portal/training/fees"); return; }
    apiFetch<Payment[]>("/api/training/me/payments/")
      .then((p) => setPayments(Array.isArray(p) ? p : []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (v: string) => `₦${Number(v).toLocaleString()}`;
  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="max-w-2xl">
      <div className="mb-7">
        <h1 className="font-heading font-extrabold text-[var(--navy)] text-2xl">Payment Status</h1>
        <p className="text-[var(--ink-muted)] text-sm mt-1">Payment history for your training programmes.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--rule)] overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-[var(--rule)]">
          <h2 className="font-heading font-bold text-[var(--navy)] text-base">Payment History</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[var(--ink-faint)] text-sm">Loading…</div>
        ) : payments.length === 0 ? (
          <div className="p-10 text-center">
            <CreditCard className="w-10 h-10 text-[var(--rule)] mx-auto mb-3" />
            <p className="text-sm font-medium text-[var(--ink-faint)]">No payment records found.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--rule)]">
            {payments.map((p) => {
              const s = statusStyle[p.status] ?? { bg: "var(--rule)", text: "var(--ink-muted)" };
              return (
                <div key={p.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--ink)] truncate">{p.description}</p>
                    <p className="text-xs text-[var(--ink-faint)] mt-0.5">
                      {p.method_display} · {fmtDate(p.paid_at || p.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: s.bg, color: s.text }}
                    >
                      {p.status_display}
                    </span>
                    <span className="font-heading font-bold text-[var(--navy)] tabular-nums">{fmt(p.amount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Link
        href="/payment?category=training"
        className="inline-flex items-center gap-2 bg-[var(--navy)] text-white font-bold
                   text-sm px-7 py-3.5 rounded-xl hover:bg-[var(--navy-dark)] transition-colors shadow-sm"
      >
        Make a Payment <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
