"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Download } from "lucide-react";
import { apiDownload, apiFetch } from "@/lib/auth";

type FinanceSummary = {
  confirmed_income_minor: number;
  expenses_minor: number;
  net_recorded_minor: number;
  pending_payments: number;
  new_students: number;
};
type Student = { id: string; email: string; first_name: string; last_name: string; created_at: string };
type Payment = { id: string; student_id: string; reference: string; amount_minor: number; installment_number: number | null; currency: string; status: string; created_at: string };
type Expense = { id: string; reference: string; category: string; payee: string | null; description: string; amount_minor: number; currency: string; expense_date: string };
type ExamBody = "ICAN" | "ACCA" | "CITN" | "CISA" | "ATS";
type FeePlan = { id: string; code: string; name: string; exam_body: ExamBody | null; cohort_name: string | null; cohort_starts_on: string | null; cohort_ends_on: string | null; amount_minor: number; currency: string; is_active: boolean };
const examBodies: ExamBody[] = ["ICAN", "ACCA", "CITN", "CISA", "ATS"];

const emptySummary: FinanceSummary = {
  confirmed_income_minor: 0, expenses_minor: 0,
  net_recorded_minor: 0, pending_payments: 0, new_students: 0,
};

function naira(minor: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(minor / 100);
}

function dateLabel(value: string) {
  return new Date(value).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminOperationsOverview() {
  const [summary, setSummary] = useState(emptySummary);
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [feePlans, setFeePlans] = useState<FeePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [exportingPayments, setExportingPayments] = useState(false);
  const [feeForm, setFeeForm] = useState({ code: "", name: "", exam_body: "" as ExamBody | "", cohort_name: "", cohort_starts_on: "", cohort_ends_on: "", description: "", amount: "" });
  const [classificationSelections, setClassificationSelections] = useState<Record<string, ExamBody>>({});
  const [expenseForm, setExpenseForm] = useState({ category: "", payee: "", description: "", amount: "", expense_date: new Date().toISOString().slice(0, 10) });

  const loadData = useCallback(async () => {
    setError("");
    try {
      const [finance, studentRows, paymentRows, expenseRows, planRows] = await Promise.all([
        apiFetch<FinanceSummary>("/api/v1/admin/finance/summary"),
        apiFetch<Student[]>("/api/v1/admin/students?limit=50"),
        apiFetch<Payment[]>("/api/v1/admin/payments?limit=50"),
        apiFetch<Expense[]>("/api/v1/admin/expenses?limit=50"),
        apiFetch<FeePlan[]>("/api/v1/admin/fee-plans"),
      ]);
      setSummary(finance);
      setStudents(studentRows);
      setPayments(paymentRows);
      setExpenses(expenseRows);
      setFeePlans(planRows);
    } catch {
      setError("Could not load the admin records. Check your session and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const createFeePlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiFetch("/api/v1/admin/fee-plans", {
        method: "POST",
        body: JSON.stringify({
          code: feeForm.code,
          name: feeForm.name,
          exam_body: feeForm.exam_body,
          cohort_name: feeForm.cohort_name,
          cohort_starts_on: feeForm.cohort_starts_on,
          cohort_ends_on: feeForm.cohort_ends_on,
          description: feeForm.description || null,
          amount_minor: Math.round(Number(feeForm.amount) * 100),
          currency: "NGN",
        }),
      });
      setFeeForm({ code: "", name: "", exam_body: "", cohort_name: "", cohort_starts_on: "", cohort_ends_on: "", description: "", amount: "" });
      await loadData();
    } catch {
      setError("Could not save the fee plan. Check the code is unique and the fee is valid.");
    } finally {
      setSaving(false);
    }
  };

  const classifyFeePlan = async (plan: FeePlan) => {
    const exam_body = classificationSelections[plan.id];
    if (!exam_body) return;
    setSaving(true);
    setError("");
    try {
      await apiFetch(`/api/v1/admin/fee-plans/${plan.id}/exam-body`, {
        method: "PATCH",
        body: JSON.stringify({ exam_body }),
      });
      await loadData();
    } catch {
      setError("Could not classify the fee plan. Create a separate plan if it belongs to more than one exam body.");
    } finally {
      setSaving(false);
    }
  };

  const recordExpense = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiFetch("/api/v1/admin/expenses", {
        method: "POST",
        body: JSON.stringify({
          ...expenseForm,
          payee: expenseForm.payee || null,
          amount_minor: Math.round(Number(expenseForm.amount) * 100),
          currency: "NGN",
        }),
      });
      setExpenseForm({ category: "", payee: "", description: "", amount: "", expense_date: new Date().toISOString().slice(0, 10) });
      await loadData();
    } catch {
      setError("Could not record the expense. Check the amount and required fields.");
    } finally {
      setSaving(false);
    }
  };

  const exportPayments = async () => {
    setExportingPayments(true);
    setError("");
    try {
      await apiDownload("/api/v1/admin/payments/export.xlsx", "pin-associates-payment-ledger.xlsx");
    } catch {
      setError("Could not export the payment ledger. Check your admin session and try again.");
    } finally {
      setExportingPayments(false);
    }
  };

  const nameById = new Map(students.map(student => [student.id, `${student.first_name} ${student.last_name}`]));
  const cards = [
    ["Confirmed income", naira(summary.confirmed_income_minor)],
    ["Recorded expenses", naira(summary.expenses_minor)],
    ["Net recorded", naira(summary.net_recorded_minor)],
    ["New students (30 days)", String(summary.new_students)],
    ["Pending payments", String(summary.pending_payments)],
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>Student & Finance Overview</h1>
        <p style={{ color: "var(--ink-muted)" }}>Recent student signups, verified payments, and recorded expenses.</p>
      </header>
      {error && <p role="alert" className="p-4 rounded-xl" style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}>{error}</p>}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" aria-label="Finance summary">
        {cards.map(([label, value]) => <article key={label} className="p-5 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}>
          <p className="text-sm mb-2" style={{ color: "var(--ink-muted)" }}>{label}</p>
          <p className="text-2xl font-bold" style={{ color: "var(--ink)" }}>{loading ? "…" : value}</p>
        </article>)}
      </section>

      <section className="grid xl:grid-cols-2 gap-6">
        <article className="p-6 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>New student signups</h2>
          {students.slice(0, 8).map(student => <div key={student.id} className="flex justify-between gap-4 py-3 border-t" style={{ borderColor: "var(--rule)" }}>
            <div><p className="font-medium" style={{ color: "var(--ink)" }}>{student.first_name} {student.last_name}</p><p className="text-sm" style={{ color: "var(--ink-muted)" }}>{student.email}</p></div>
            <time className="text-sm whitespace-nowrap" style={{ color: "var(--ink-muted)" }}>{dateLabel(student.created_at)}</time>
          </div>)}
          {!loading && students.length === 0 && <p style={{ color: "var(--ink-muted)" }}>No student accounts yet.</p>}
        </article>
        <article className="p-6 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold" style={{ color: "var(--ink)" }}>Incoming payments</h2>
            <button type="button" onClick={() => void exportPayments()} disabled={exportingPayments} className="btn btn-primary inline-flex items-center gap-2 disabled:opacity-60">
              <Download className="h-4 w-4" />{exportingPayments ? "Preparing Excel…" : "Download all as Excel"}
            </button>
          </div>
          {payments.slice(0, 8).map(payment => <div key={payment.id} className="flex justify-between gap-4 py-3 border-t" style={{ borderColor: "var(--rule)" }}>
            <div><p className="font-medium" style={{ color: "var(--ink)" }}>{nameById.get(payment.student_id) ?? payment.student_id}</p><p className="text-sm" style={{ color: "var(--ink-muted)" }}>{payment.installment_number ? `Payment ${payment.installment_number} of 2 · ` : "Full payment · "}{payment.reference} · {payment.status}</p></div>
            <strong className="whitespace-nowrap" style={{ color: "var(--ink)" }}>{naira(payment.amount_minor)}</strong>
          </div>)}
          {!loading && payments.length === 0 && <p style={{ color: "var(--ink-muted)" }}>No payment attempts yet.</p>}
        </article>
      </section>

      <section className="grid xl:grid-cols-2 gap-6">
        <article className="p-6 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>Recorded expenses</h2>
          {expenses.slice(0, 8).map(expense => <div key={expense.id} className="flex justify-between gap-4 py-3 border-t" style={{ borderColor: "var(--rule)" }}>
            <div><p className="font-medium" style={{ color: "var(--ink)" }}>{expense.category} · {expense.description}</p><p className="text-sm" style={{ color: "var(--ink-muted)" }}>{expense.payee ?? "No payee recorded"}</p></div>
            <strong className="whitespace-nowrap" style={{ color: "var(--ink)" }}>{naira(expense.amount_minor)}</strong>
          </div>)}
          {!loading && expenses.length === 0 && <p style={{ color: "var(--ink-muted)" }}>No expenses recorded.</p>}
        </article>
      </section>

      <section className="grid xl:grid-cols-2 gap-6">
        <form onSubmit={createFeePlan} className="p-6 rounded-xl border space-y-3" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}>
          <h2 className="text-xl font-bold" style={{ color: "var(--ink)" }}>Create a course cohort</h2>
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Create a separately priced course run. Set dates that fit the program; the portal does not assume a fixed cohort length or exam diet.</p>
          <input required maxLength={80} placeholder="Unique code (for example, ICAN-PRO-2026)" value={feeForm.code} onChange={event => setFeeForm({ ...feeForm, code: event.target.value })} className="form-input w-full" />
          <input required maxLength={180} placeholder="Course or level (for example, ICAN Professional)" value={feeForm.name} onChange={event => setFeeForm({ ...feeForm, name: event.target.value })} className="form-input w-full" />
          <label className="block text-sm font-medium" style={{ color: "var(--ink)" }}>Exam body
            <select required value={feeForm.exam_body} onChange={event => setFeeForm({ ...feeForm, exam_body: event.target.value as ExamBody })} className="form-input mt-1 w-full">
              <option value="">Choose ICAN, ACCA, CITN, CISA, or ATS</option>
              {examBodies.map(body => <option key={body} value={body}>{body}</option>)}
            </select>
          </label>
          <input required maxLength={120} placeholder="Cohort / intake / diet preparation label" value={feeForm.cohort_name} onChange={event => setFeeForm({ ...feeForm, cohort_name: event.target.value })} className="form-input w-full" />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium" style={{ color: "var(--ink)" }}>Cohort starts on<input required type="date" value={feeForm.cohort_starts_on} onChange={event => setFeeForm({ ...feeForm, cohort_starts_on: event.target.value })} className="form-input mt-1 w-full" /></label>
            <label className="block text-sm font-medium" style={{ color: "var(--ink)" }}>Cohort ends on<input required type="date" min={feeForm.cohort_starts_on || undefined} value={feeForm.cohort_ends_on} onChange={event => setFeeForm({ ...feeForm, cohort_ends_on: event.target.value })} className="form-input mt-1 w-full" /></label>
          </div>
          <input maxLength={2000} placeholder="Description (optional)" value={feeForm.description} onChange={event => setFeeForm({ ...feeForm, description: event.target.value })} className="form-input w-full" />
          <input required type="number" min="1" step="0.01" placeholder="Total fee in naira" value={feeForm.amount} onChange={event => setFeeForm({ ...feeForm, amount: event.target.value })} className="form-input w-full" />
          <button disabled={saving} className="btn btn-primary">{saving ? "Saving…" : "Publish course cohort"}</button>
          <ul className="text-sm space-y-2" style={{ color: "var(--ink-muted)" }}>{feePlans.slice(0, 10).map(plan => <li key={plan.id} className="rounded-lg border p-3" style={{ borderColor: "var(--rule)" }}>
            <div>{plan.exam_body ? <strong>{plan.exam_body} · </strong> : <strong>Needs exam body · </strong>}{plan.name} · {plan.cohort_name ?? "Legacy cohort"} — {naira(plan.amount_minor)}</div>
            {plan.cohort_starts_on && plan.cohort_ends_on && <p className="mt-1 text-xs">{dateLabel(plan.cohort_starts_on)} – {dateLabel(plan.cohort_ends_on)}</p>}
            {plan.exam_body ? <p className="mt-1 text-xs">New classes for this cohort will only be visible to students with a confirmed payment for this course cohort.</p> : <div className="mt-2 flex flex-wrap items-center gap-2">
              <select aria-label={`Choose exam body for ${plan.name}`} value={classificationSelections[plan.id] ?? ""} onChange={event => setClassificationSelections({ ...classificationSelections, [plan.id]: event.target.value as ExamBody })} className="form-input">
                <option value="">Choose exam body</option>{examBodies.map(body => <option key={body} value={body}>{body}</option>)}
              </select>
              <button type="button" disabled={saving || !classificationSelections[plan.id]} onClick={() => void classifyFeePlan(plan)} className="btn btn-primary">Assign course</button>
              <p className="basis-full text-xs">Classify a legacy fee plan only if everyone who paid it belongs to that exam body. Otherwise, create separate fee plans.</p>
            </div>}
          </li>)}</ul>
        </form>
        <form onSubmit={recordExpense} className="p-6 rounded-xl border space-y-3" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}>
          <h2 className="text-xl font-bold" style={{ color: "var(--ink)" }}>Record an expense</h2>
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>This records an expense for reporting; it does not send money.</p>
          <input required maxLength={80} placeholder="Category" value={expenseForm.category} onChange={event => setExpenseForm({ ...expenseForm, category: event.target.value })} className="form-input w-full" />
          <input maxLength={180} placeholder="Payee (optional)" value={expenseForm.payee} onChange={event => setExpenseForm({ ...expenseForm, payee: event.target.value })} className="form-input w-full" />
          <input required maxLength={2000} placeholder="Description" value={expenseForm.description} onChange={event => setExpenseForm({ ...expenseForm, description: event.target.value })} className="form-input w-full" />
          <input required type="number" min="1" step="0.01" placeholder="Amount in naira" value={expenseForm.amount} onChange={event => setExpenseForm({ ...expenseForm, amount: event.target.value })} className="form-input w-full" />
          <input required type="date" value={expenseForm.expense_date} onChange={event => setExpenseForm({ ...expenseForm, expense_date: event.target.value })} className="form-input w-full" />
          <button disabled={saving} className="btn btn-primary">{saving ? "Saving…" : "Record expense"}</button>
        </form>
      </section>
    </div>
  );
}
