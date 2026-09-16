"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  CreditCard, CheckCircle2, Clock, AlertCircle, ArrowRight, 
  Download, Receipt, DollarSign, Wallet, Calendar, 
  FileText, Eye, RefreshCw, Plus, Filter
} from "lucide-react";
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
  receipt_url?: string;
}

interface PaymentPlan {
  id: string;
  name: string;
  amount: string;
  description: string;
  due_date: string;
  is_paid: boolean;
  installments?: number;
}

// TODO: Replace with real Paystack public key
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_xxxxxxxxxxxxx";

const statusStyle: Record<string, { bg: string; text: string; icon: any }> = {
  CONFIRMED: { bg: "var(--navy-50)", text: "var(--navy-dark)", icon: CheckCircle2 },
  PENDING:   { bg: "#FEF3C7", text: "#92600A", icon: Clock },
  FAILED:    { bg: "#FEF2F2", text: "#DC2626", icon: AlertCircle },
  REFUNDED:  { bg: "var(--navy-50)", text: "var(--navy)", icon: RefreshCw },
};
// Mock payment plans data - replace with API call
const mockPaymentPlans: PaymentPlan[] = [
  {
    id: "1",
    name: "ICAN Professional Level - Full Payment",
    amount: "450000",
    description: "Complete course fee for ICAN Professional Level program",
    due_date: "2024-02-01",
    is_paid: false
  },
  {
    id: "2", 
    name: "ICAN Professional Level - 1st Installment",
    amount: "150000",
    description: "First installment (1 of 3) for ICAN Professional Level",
    due_date: "2024-01-15",
    is_paid: true,
    installments: 3
  },
  {
    id: "3",
    name: "ICAN Professional Level - 2nd Installment", 
    amount: "150000",
    description: "Second installment (2 of 3) for ICAN Professional Level",
    due_date: "2024-02-15",
    is_paid: false,
    installments: 3
  }
];

export default function StudentFeesPageEnhanced() {
  const router  = useRouter();
  const user    = getStoredUser();
  const [balance,  setBalance]  = useState<Balance | null>(null);
  const [records,  setRecords]  = useState<FeeRecord[]>([]);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>(mockPaymentPlans);
  const [loading,  setLoading]  = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
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

  // Initialize Paystack payment
  const initializePayment = async (planId: string, amount: string, description: string) => {
    try {
      setPaymentLoading(planId);
      
      // Call backend to initialize payment
      const response = await apiFetch<{ authorization_url: string; reference: string }>('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user?.email,
          amount: Number(amount) * 100, // Paystack expects amount in kobo
          currency: 'NGN',
          plan_id: planId,
          description: description
        })
      });

      if (response.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = response.authorization_url;
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Payment initialization failed. Please try again.');
    } finally {
      setPaymentLoading(null);
    }
  };
  // Download receipt
  const downloadReceipt = async (recordId: string) => {
    try {
      const response = await fetch(`/api/receipts/${recordId}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PIN_Associate_Receipt_${recordId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Receipt download failed:', error);
    }
  };

  const filteredRecords = records.filter(record => 
    filterStatus === "all" || record.status.toLowerCase() === filterStatus.toLowerCase()
  );

  const totalPaid = records
    .filter(record => record.status === 'CONFIRMED')
    .reduce((sum, record) => sum + Number(record.amount), 0);

  const pendingAmount = paymentPlans
    .filter(plan => !plan.is_paid)
    .reduce((sum, plan) => sum + Number(plan.amount), 0);

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
        >
          Finance & Payments
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Manage your fees, make payments, and track your financial history
        </p>
      </div>
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div 
          className="p-6 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>
                Total Fees
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {loading ? "..." : fmt(balance?.total_fees_due)}
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-6 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--gold)' }}
            >
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>
                Paid Amount
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {loading ? "..." : `₦${totalPaid.toLocaleString()}`}
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-6 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: pendingAmount > 0 ? '#DC2626' : 'var(--navy-dark)' }}
            >
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>
                Balance Due
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {loading ? "..." : `₦${pendingAmount.toLocaleString()}`}
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-6 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--navy-dark)' }}
            >
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>
                Receipts
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {records.filter(r => r.status === 'CONFIRMED').length}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Outstanding Balance Alert */}
      {pendingAmount > 0 && (
        <div 
          className="p-6 rounded-2xl border-l-4 mb-8"
          style={{ 
            backgroundColor: '#FEF3C7', 
            borderColor: '#F59E0B',
            borderLeft: '4px solid #F59E0B'
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#F59E0B' }}
              >
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: '#92600A' }}>
                  Outstanding Balance: ₦{pendingAmount.toLocaleString()}
                </h3>
                <p className="text-sm mt-1" style={{ color: '#92600A' }}>
                  You have pending payments. Complete your payments to continue accessing all features.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Plans Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--ink)' }}>
            Payment Plans
          </h2>
        </div>

        <div className="space-y-4">
          {paymentPlans.map((plan) => (
            <div
              key={plan.id}
              className="p-6 rounded-2xl border transition-all hover:shadow-lg"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: 'var(--rule)',
                opacity: plan.is_paid ? 0.7 : 1
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
                      {plan.name}
                    </h3>
                    {plan.is_paid && (
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: 'var(--navy-50)', color: 'var(--navy)' }}
                      >
                        PAID
                      </span>
                    )}
                    {plan.installments && (
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: 'var(--gold-50)', color: 'var(--gold-dark)' }}
                      >
                        Installment Plan
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'var(--ink-muted)' }}>
                    {plan.description}
                  </p>
                  <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--ink-muted)' }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {fmtDate(plan.due_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{fmt(plan.amount)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                      {fmt(plan.amount)}
                    </p>
                  </div>
                  
                  {!plan.is_paid && (
                    <button
                      onClick={() => initializePayment(plan.id, plan.amount, plan.description)}
                      disabled={paymentLoading === plan.id}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: 'var(--navy)' }}
                    >
                      {paymentLoading === plan.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Payment History Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--ink)' }}>
            Payment History
          </h2>
          
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border text-sm"
              style={{ borderColor: 'var(--rule)', color: 'var(--ink)' }}
            >
              <option value="all">All Payments</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div 
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          {loading ? (
            <div className="p-12 text-center" style={{ color: 'var(--ink-muted)' }}>
              Loading payment history...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <Receipt className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--rule)' }} />
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--ink-muted)' }}>
                No payments found
              </p>
              <p className="text-sm" style={{ color: 'var(--ink-faint)' }}>
                {filterStatus === "all" ? "You haven't made any payments yet" : `No ${filterStatus} payments found`}
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--rule)' }}>
              {filteredRecords.map((record) => {
                const statusInfo = statusStyle[record.status] ?? statusStyle.PENDING;
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={record.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
                            {record.description}
                          </h3>
                          <div 
                            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                            style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {record.status_display}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--ink-muted)' }}>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <span>{record.method_display}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{fmtDate(record.paid_at || record.created_at)}</span>
                          </div>
                          {record.paystack_reference && (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span>Ref: {record.paystack_reference}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                            {fmt(record.amount)}
                          </p>
                        </div>

                        {record.status === 'CONFIRMED' && (
                          <button
                            onClick={() => downloadReceipt(record.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-all hover:shadow-md"
                            style={{ borderColor: 'var(--rule)', color: 'var(--ink-muted)' }}
                            title="Download Receipt"
                          >
                            <Download className="w-4 h-4" />
                            Receipt
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}