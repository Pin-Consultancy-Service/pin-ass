"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  CreditCard, CheckCircle2, Clock, AlertCircle, ArrowRight, 
  Receipt, DollarSign, Wallet, Calendar,
  FileText, Eye, RefreshCw, Plus, Filter, Download
} from "lucide-react";
import { apiDownload, apiFetch, getStoredUser } from "@/lib/auth";

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
  code: string;
  name: string;
  exam_body: "ICAN" | "ACCA" | "CITN" | "CISA" | "ATS" | null;
  cohort_name: string | null;
  cohort_starts_on: string | null;
  cohort_ends_on: string | null;
  amount: string;
  description: string;
  is_paid: boolean;
  total_minor: number;
  paid_minor: number;
  balance_minor: number;
  pending_minor: number;
  payment_pending: boolean;
  pending_payment_option: "FULL" | "INSTALLMENT" | null;
  confirmed_payment_count: number;
}

interface ApiPayment {
  id: string;
  fee_plan_id: string;
  reference: string;
  amount_minor: number;
  installment_number: number | null;
  currency: string;
  status: "PENDING" | "CONFIRMED" | "FAILED";
  paid_at: string | null;
  created_at: string;
}

interface ApiFeePlan {
  id: string;
  code: string;
  name: string;
  exam_body: "ICAN" | "ACCA" | "CITN" | "CISA" | "ATS" | null;
  cohort_name: string | null;
  cohort_starts_on: string | null;
  cohort_ends_on: string | null;
  amount_minor: number;
  description: string | null;
  currency: string;
  is_active: boolean;
}

interface ApiBalance { fee_plan_id: string; balance_minor: number; paid_minor: number; pending_minor: number; confirmed_payment_count: number; payment_pending: boolean; pending_payment_option: "FULL" | "INSTALLMENT" | null; }

const statusStyle: Record<string, { bg: string; text: string; icon: any }> = {
  CONFIRMED: { bg: "var(--navy-50)", text: "var(--navy-dark)", icon: CheckCircle2 },
  PENDING:   { bg: "#FEF3C7", text: "#92600A", icon: Clock },
  FAILED:    { bg: "#FEF2F2", text: "#DC2626", icon: AlertCircle },
};
export default function StudentFeesPageEnhanced() {
  const router  = useRouter();
  const user    = getStoredUser();
  const [records,  setRecords]  = useState<FeeRecord[]>([]);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [receiptLoading, setReceiptLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [paymentOptions, setPaymentOptions] = useState<Record<string, "FULL" | "INSTALLMENT">>({});
  const [paymentError, setPaymentError] = useState("");
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    if (!user) { router.replace("/portal/login?redirect=/portal/student/fees"); return; }
    Promise.all([
      apiFetch<ApiFeePlan[]>("/api/v1/students/me/fee-plans"),
      apiFetch<ApiPayment[]>("/api/v1/students/me/payments"),
      apiFetch<ApiBalance[]>("/api/v1/students/me/fee-balances"),
    ]).then(([plans, payments, balances]) => {
      const safePayments = Array.isArray(payments) ? payments : [];
      setRecords(safePayments.map(payment => ({
        id: payment.id,
        amount: String(payment.amount_minor / 100),
        description: `${plans.find(plan => plan.id === payment.fee_plan_id)?.name ?? "Student fee payment"}${plans.find(plan => plan.id === payment.fee_plan_id)?.cohort_name ? ` · ${plans.find(plan => plan.id === payment.fee_plan_id)?.cohort_name}` : ""}${payment.installment_number ? ` · Payment ${payment.installment_number} of 2` : ""}`,
        method_display: "Paystack",
        status: payment.status,
        status_display: payment.status === "CONFIRMED" ? "Confirmed" : payment.status === "FAILED" ? "Failed" : "Pending",
        paystack_reference: payment.reference,
        paid_at: payment.paid_at ?? "",
        created_at: payment.created_at,
      })));
      setPaymentPlans((Array.isArray(plans) ? plans : []).map(plan => ({
        id: plan.id,
        code: plan.code,
        name: plan.name,
        exam_body: plan.exam_body,
        cohort_name: plan.cohort_name,
        cohort_starts_on: plan.cohort_starts_on,
        cohort_ends_on: plan.cohort_ends_on,
        amount: String(plan.amount_minor / 100),
        description: plan.description ?? "",
        total_minor: plan.amount_minor,
        paid_minor: balances.find(balance => balance.fee_plan_id === plan.id)?.paid_minor ?? 0,
        balance_minor: balances.find(balance => balance.fee_plan_id === plan.id)?.balance_minor ?? plan.amount_minor,
        pending_minor: balances.find(balance => balance.fee_plan_id === plan.id)?.pending_minor ?? 0,
        payment_pending: balances.find(balance => balance.fee_plan_id === plan.id)?.payment_pending ?? false,
        pending_payment_option: balances.find(balance => balance.fee_plan_id === plan.id)?.pending_payment_option ?? null,
        confirmed_payment_count: balances.find(balance => balance.fee_plan_id === plan.id)?.confirmed_payment_count ?? 0,
        is_paid: (balances.find(balance => balance.fee_plan_id === plan.id)?.paid_minor ?? 0) >= plan.amount_minor,
      })));
    }).catch(() => setLoadError("Financial information could not be loaded. Please refresh the page."))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (v: string | undefined) =>
    v ? `₦${Number(v).toLocaleString()}` : "—";

  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—";

  // Initialize Paystack payment
  const initializePayment = async (planId: string, paymentOption: "FULL" | "INSTALLMENT") => {
    try {
      setPaymentError("");
      setPaymentLoading(planId);
      
      // Call backend to initialize payment
      const response = await apiFetch<{ authorization_url: string; reference: string }>("/api/v1/payments/initialize", {
        method: 'POST',
        body: JSON.stringify({
          fee_plan_id: planId,
          payment_option: paymentOption,
          idempotency_key: crypto.randomUUID(),
        })
      });

      if (response.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = response.authorization_url;
      }
    } catch (error) {
      const apiError = error as { status?: number };
      if (apiError.status === 503) {
        setPaymentError("Paystack test mode is not configured yet. Add your Paystack test secret to the backend .env file, then restart the API.");
      } else if (apiError.status === 422) {
        setPaymentError("This payment option is not available for the current fee balance. Refresh the page and try again.");
      } else if (apiError.status === 409) {
        setPaymentError("A payment is already in progress or this fee has reached its two-payment limit. Check your payment history or refresh the page.");
      } else {
        setPaymentError("Payment could not be started. Please try again shortly.");
      }
    } finally {
      setPaymentLoading(null);
    }
  };

  const downloadReceipt = async (recordId: string) => {
    try {
      setPaymentError("");
      setReceiptLoading(recordId);
      await apiDownload(`/api/v1/students/me/payments/${recordId}/receipt`, `PIN-Associates-Receipt-${recordId}.pdf`);
    } catch {
      setPaymentError("The receipt could not be downloaded. Only confirmed payments have receipts.");
    } finally {
      setReceiptLoading(null);
    }
  };
  const filteredRecords = records.filter(record => 
    filterStatus === "all" || record.status.toLowerCase() === filterStatus.toLowerCase()
  );

  const totalPaid = records
    .filter(record => record.status === 'CONFIRMED')
    .reduce((sum, record) => sum + Number(record.amount), 0);

  const pendingAmount = records
    .filter(record => record.status === "PENDING")
    .reduce((sum, record) => sum + Number(record.amount), 0);

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
      {loadError && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</p>}
      {paymentError && <p role="alert" className="mb-6 rounded-xl border p-4 text-sm" style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA", color: "#B91C1C" }}>{paymentError}</p>}
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
                Fee Plans
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {loading ? "..." : paymentPlans.length}
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
                Pending Payments
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
                These payment attempts are awaiting provider confirmation. Check your history for updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Published course fees and payment choices */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--ink)' }}>
            Courses &amp; Fees
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
            Choose a course, select full payment or pay in two parts, then continue securely to Paystack.
          </p>
        </div>

        <div className="space-y-4">
          {!loading && paymentPlans.length === 0 && (
            <div className="rounded-2xl border p-6 text-sm" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)', color: 'var(--ink-muted)' }}>
              No courses are currently open for payment. Please check back later or contact the administrator.
            </div>
          )}
          {paymentPlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border p-5 transition-all hover:shadow-lg sm:p-6"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-muted)' }}>
                      {plan.exam_body ?? 'Course'} · {plan.cohort_name ?? 'Legacy cohort'}
                    </p>
                    {plan.is_paid && <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: 'var(--navy-50)', color: 'var(--navy)' }}>PAID</span>}
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--ink)' }}>{plan.name}</h3>
                  {plan.description && <p className="mt-1 text-sm" style={{ color: 'var(--ink-muted)' }}>{plan.description}</p>}
                  {plan.cohort_starts_on && plan.cohort_ends_on && <p className="mt-1 text-sm" style={{ color: 'var(--ink-muted)' }}>Cohort runs {fmtDate(plan.cohort_starts_on)} – {fmtDate(plan.cohort_ends_on)}</p>}
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
                    <span><strong style={{ color: 'var(--ink)' }}>Course fee:</strong> {fmt(plan.amount)}</span>
                    <span><strong style={{ color: 'var(--ink)' }}>Paid:</strong> {fmt(String(plan.paid_minor / 100))}</span>
                    <span><strong style={{ color: 'var(--ink)' }}>Outstanding:</strong> {fmt(String(plan.balance_minor / 100))}</span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 lg:w-72">
                  {!plan.is_paid && !plan.payment_pending && plan.confirmed_payment_count === 0 && (
                    <fieldset className="space-y-2">
                      <legend className="mb-2 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Choose payment option</legend>
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm" style={{ borderColor: paymentOptions[plan.id] !== 'INSTALLMENT' ? 'var(--navy)' : 'var(--rule)', color: 'var(--ink)' }}>
                        <input type="radio" name={`payment-option-${plan.id}`} value="FULL" checked={(paymentOptions[plan.id] ?? 'FULL') === 'FULL'} onChange={() => setPaymentOptions({ ...paymentOptions, [plan.id]: 'FULL' })} />
                        <span><strong>Pay in full</strong><br /><span style={{ color: 'var(--ink-muted)' }}>{fmt(plan.amount)} today</span></span>
                      </label>
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm" style={{ borderColor: paymentOptions[plan.id] === 'INSTALLMENT' ? 'var(--navy)' : 'var(--rule)', color: 'var(--ink)' }}>
                        <input type="radio" name={`payment-option-${plan.id}`} value="INSTALLMENT" checked={paymentOptions[plan.id] === 'INSTALLMENT'} onChange={() => setPaymentOptions({ ...paymentOptions, [plan.id]: 'INSTALLMENT' })} />
                        <span><strong>Pay in 2 parts</strong><br /><span style={{ color: 'var(--ink-muted)' }}>{fmt(String(Math.ceil(plan.total_minor / 2) / 100))} today, balance later</span></span>
                      </label>
                    </fieldset>
                  )}
                  {plan.payment_pending && <p className="text-sm" style={{ color: '#92600A' }}>A {plan.pending_payment_option === 'INSTALLMENT' ? 'part payment' : 'full payment'} of {fmt(String(plan.pending_minor / 100))} is awaiting Paystack confirmation.</p>}
                  {!plan.is_paid && !plan.payment_pending && plan.confirmed_payment_count === 1 && <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Second and final payment due: <strong>{fmt(String(plan.balance_minor / 100))}</strong></p>}
                  {!plan.is_paid && !plan.payment_pending && plan.confirmed_payment_count >= 2 && <p className="text-sm" style={{ color: '#B91C1C' }}>The two allowed payments are complete. Contact the administrator about your remaining balance.</p>}
                  {!plan.is_paid && (
                    <button
                      onClick={() => initializePayment(plan.id, plan.payment_pending ? plan.pending_payment_option ?? 'FULL' : plan.confirmed_payment_count === 0 ? paymentOptions[plan.id] ?? 'FULL' : 'INSTALLMENT')}
                      disabled={paymentLoading === plan.id || plan.confirmed_payment_count >= 2}
                      className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ backgroundColor: 'var(--navy)' }}
                    >
                      {paymentLoading === plan.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                      {plan.payment_pending ? 'Resume Paystack checkout' : plan.confirmed_payment_count === 1 ? 'Pay second part' : 'Continue to payment'}
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
                          {record.status === "CONFIRMED" && (
                            <button
                              type="button"
                              onClick={() => void downloadReceipt(record.id)}
                              disabled={receiptLoading === record.id}
                              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold disabled:opacity-60"
                              style={{ color: "var(--navy)" }}
                            >
                              <Download className="h-4 w-4" />
                              {receiptLoading === record.id ? "Preparing…" : "Download receipt"}
                            </button>
                          )}
                        </div>

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
