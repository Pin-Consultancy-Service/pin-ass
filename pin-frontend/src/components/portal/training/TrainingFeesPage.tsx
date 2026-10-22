"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, ArrowRight, CheckCircle2, Download, Receipt, AlertCircle } from "lucide-react";
import { apiFetch, getStoredUser, DEMO_MODE } from "@/lib/auth";
import { mockEnrollments } from "@/lib/mockTrainingData";

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
  CONFIRMED: { bg: "#DCFCE7", text: "#16A34A" },
  PENDING:   { bg: "#FEF3C7", text: "#92600A" },
  FAILED:    { bg: "#FEF2F2", text: "#DC2626" },
  REFUNDED:  { bg: "var(--navy-50)", text: "var(--navy)" },
};

export default function TrainingFeesPage() {
  const router = useRouter();
  const user   = getStoredUser();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) {
      setLoading(false);
      return;
    }

    if (!user) { 
      router.replace("/portal/login?redirect=/portal/training/fees"); 
      return; 
    }
    
    apiFetch<Payment[]>("/api/training/me/payments/")
      .then((p) => setPayments(Array.isArray(p) ? p : []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (v: string | number) => `₦${Number(v).toLocaleString()}`;
  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—";

  // Calculate totals from mock data
  const totalFees = mockEnrollments.reduce((sum, e) => sum + e.trainingFee, 0);
  const totalPaid = mockEnrollments.reduce((sum, e) => sum + e.amountPaid, 0);
  const totalBalance = totalFees - totalPaid;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
        >
          Payment Status
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Track your training programme payments and outstanding balances
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div 
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--navy-50)' }}
            >
              <Receipt className="w-5 h-5" style={{ color: 'var(--navy)' }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
              TOTAL FEES
            </span>
          </div>
          <p 
            className="text-2xl md:text-3xl font-bold"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
          >
            {fmt(totalFees)}
          </p>
        </div>

        <div 
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#DCFCE7' }}
            >
              <CheckCircle2 className="w-5 h-5" style={{ color: '#16A34A' }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
              AMOUNT PAID
            </span>
          </div>
          <p 
            className="text-2xl md:text-3xl font-bold"
            style={{ color: '#16A34A', fontFamily: 'var(--font-display)' }}
          >
            {fmt(totalPaid)}
          </p>
        </div>

        <div 
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <AlertCircle className="w-5 h-5" style={{ color: '#DC2626' }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#DC2626' }}>
              OUTSTANDING
            </span>
          </div>
          <p 
            className="text-2xl md:text-3xl font-bold"
            style={{ color: '#DC2626', fontFamily: 'var(--font-display)' }}
          >
            {fmt(totalBalance)}
          </p>
        </div>
      </div>

      {/* Payment Breakdown by Programme */}
      <div 
        className="rounded-2xl border overflow-hidden mb-6"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--rule)' }}>
          <h2 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
            Programme Payment Breakdown
          </h2>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--rule)' }}>
          {mockEnrollments.map((enrollment) => {
            const balance = enrollment.totalFees - enrollment.amountPaid;
            const paidPercentage = (enrollment.amountPaid / enrollment.totalFees) * 100;

            return (
              <div key={enrollment.id} className="px-6 py-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                      {enrollment.customProgrammeName || enrollment.programmeName}
                    </h3>
                    <p className="text-xs mb-2" style={{ color: 'var(--ink-muted)' }}>
                      {enrollment.organisation} • {enrollment.modeDisplay}
                    </p>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: balance === 0 ? '#DCFCE7' : '#FEF3C7',
                      color: balance === 0 ? '#16A34A' : '#92600A'
                    }}
                  >
                    {balance === 0 ? 'Paid in Full' : 'Balance Due'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--ink-muted)' }}>
                      Total Fee
                    </p>
                    <p className="text-lg font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                      {fmt(enrollment.totalFees)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--ink-muted)' }}>
                      Amount Paid
                    </p>
                    <p className="text-lg font-bold" style={{ color: '#16A34A', fontFamily: 'var(--font-display)' }}>
                      {fmt(enrollment.amountPaid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--ink-muted)' }}>
                      Balance
                    </p>
                    <p className="text-lg font-bold" style={{ color: '#DC2626', fontFamily: 'var(--font-display)' }}>
                      {fmt(balance)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--rule)' }}
                  >
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${paidPercentage}%`,
                        backgroundColor: paidPercentage === 100 ? '#16A34A' : 'var(--navy)'
                      }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>
                    {paidPercentage.toFixed(0)}% paid
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Make Payment Button */}
      {totalBalance > 0 && (
        <Link
          href="/payment?category=training"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--navy)', color: 'white' }}
        >
          Make a Payment <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
