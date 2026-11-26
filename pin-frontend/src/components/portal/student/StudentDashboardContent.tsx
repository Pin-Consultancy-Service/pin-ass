"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Users } from "lucide-react";
import { apiFetch, getStoredUser } from "@/lib/auth";
import { staggerContainer, staggerItem, viewportOptions } from "@/lib/animations";

interface FeeBalance {
  fee_plan_id: string;
  fee_plan_name: string;
  cohort_name: string | null;
  total_minor: number;
  paid_minor: number;
  pending_minor: number;
  balance_minor: number;
  confirmed_payment_count: number;
  payment_pending: boolean;
  currency: string;
}
interface ClassSummary { id: string; exam_body: string; course_name: string; cohort: string; topic: string; subject: string; scheduled_at: string; duration_minutes: number; status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED"; }

const unavailable = "This information will appear when the learning activity APIs are connected.";

export default function StudentDashboardContent() {
  const router = useRouter();
  const user = getStoredUser();
  const [feeBalances, setFeeBalances] = useState<FeeBalance[] | null>(null);
  const [financeError, setFinanceError] = useState(false);
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [classesError, setClassesError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/portal/login?redirect=/portal/student");
      return;
    }

    const refreshClasses = () => apiFetch<ClassSummary[]>("/api/v1/students/me/classes")
      .then(result => { setClasses(Array.isArray(result) ? result : []); setClassesError(false); })
      .catch(() => setClassesError(true));
    const scheduleInterval = window.setInterval(() => { void refreshClasses(); }, 60_000);

    Promise.all([
      apiFetch<FeeBalance[]>("/api/v1/students/me/fee-balances")
        .then(balances => setFeeBalances(Array.isArray(balances) ? balances : null))
        .catch(() => { setFinanceError(true); setFeeBalances(null); }),
      refreshClasses(),
    ]).finally(() => setLoading(false));
    return () => window.clearInterval(scheduleInterval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const plans = feeBalances ?? [];
  const totalFeesMinor = plans.reduce((sum, plan) => sum + plan.total_minor, 0);
  const totalPaidMinor = plans.reduce((sum, plan) => sum + plan.paid_minor, 0);
  const outstandingMinor = plans.reduce((sum, plan) => sum + plan.balance_minor, 0);
  const formatNaira = (minor: number) => `₦${(minor / 100).toLocaleString("en-NG")}`;
  const financeValue = (minor: number) => loading ? "…" : financeError ? "Unavailable" : formatNaira(minor);
  const scheduledNow = classes
    .filter(session => session.status === "SCHEDULED" || session.status === "LIVE")
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    .slice(0, 3);
  const recentCompleted = classes
    .filter(session => session.status === "COMPLETED" && Date.now() - new Date(session.scheduled_at).getTime() <= 7 * 24 * 60 * 60 * 1000)
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
    .slice(0, Math.max(0, 3 - scheduledNow.length));
  const schedule = [...scheduledNow, ...recentCompleted];
  const classTime = (value: string) => new Date(value).toLocaleString("en-NG", {
    weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos",
  });

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold mb-2" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
          Welcome back{user?.first_name ? `, ${user.first_name}` : ""}
        </h1>
        <p className="text-sm md:text-base" style={{ color: "var(--ink-muted)" }}>
          Your account and payment overview
        </p>
      </div>

      {financeError && (
        <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Finance information could not be loaded. Refresh the page or sign in again.
        </p>
      )}

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOptions}
      >
        <motion.section 
          variants={staggerItem}
          className="p-4 md:p-6 rounded-2xl md:rounded-3xl border" 
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}
        >
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <h2 className="font-bold text-lg" style={{ color: "var(--ink)" }}>Your Enrollments</h2>
              <p className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>Fee plans selected for your account</p>
            </div>
            <CheckCircle2 className="w-5 h-5" style={{ color: "var(--navy)" }} />
          </div>
          {loading ? <p className="text-sm">Loading enrollments…</p> : financeError ? (
            <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Enrollment information is unavailable.</p>
          ) : plans.length ? (
            <ul className="space-y-3">
              {plans.map(plan => (
                <li key={plan.fee_plan_id} className="rounded-xl p-3" style={{ backgroundColor: "var(--navy-50)" }}>
                  <p className="font-semibold text-sm" style={{ color: "var(--ink)" }}>{plan.fee_plan_name} · {plan.cohort_name ?? "Legacy cohort"}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--ink-muted)" }}>
                    {plan.confirmed_payment_count === 0 ? "No confirmed payments" : `${plan.confirmed_payment_count} confirmed payment${plan.confirmed_payment_count === 1 ? "" : "s"}`}
                    {plan.payment_pending ? " · Payment pending" : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm" style={{ color: "var(--ink-muted)" }}>No fee plan selected yet. Available plans are listed on Fees &amp; Payments.</p>
          )}
          <Link href="/portal/student/fees" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--navy)" }}>
            View Fees &amp; Payments <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.section>

        <motion.section 
          variants={staggerItem}
          className="p-4 md:p-6 rounded-2xl border" 
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}
        >
          <h2 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>Your Finances</h2>
          <p className="text-sm mb-5" style={{ color: "var(--ink-muted)" }}>Confirmed payments and remaining fees</p>
          <p className="text-3xl font-bold mb-1" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>{financeValue(outstandingMinor)}</p>
          <p className="text-xs mb-5 font-semibold tracking-wider" style={{ color: "var(--ink-muted)" }}>OUTSTANDING BALANCE</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 rounded-xl text-white" style={{ backgroundColor: "var(--navy)" }}>
              <p className="text-xs opacity-80">TOTAL FEES</p><p className="font-bold mt-1">{financeValue(totalFeesMinor)}</p>
            </div>
            <div className="p-3 rounded-xl text-white" style={{ backgroundColor: "var(--gold)" }}>
              <p className="text-xs opacity-80">TOTAL PAID</p><p className="font-bold mt-1">{financeValue(totalPaidMinor)}</p>
            </div>
          </div>
          <Link href="/portal/student/fees" className="block rounded-xl py-3 px-4 text-center font-semibold text-white" style={{ backgroundColor: "var(--navy)" }}>
            View Full Financial Details
          </Link>
        </motion.section>

        <motion.section 
          variants={staggerItem}
          className="p-4 md:p-6 rounded-2xl border" 
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}
        >
          <div className="flex items-center gap-2 mb-2"><CalendarDays className="w-5 h-5" style={{ color: "var(--navy)" }} /><h2 className="font-semibold" style={{ color: "var(--ink)" }}>Weekly Schedule</h2></div>
          {loading ? <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Loading schedule…</p> : classesError ? <p role="alert" className="text-sm" style={{ color: "#B91C1C" }}>Schedule is unavailable.</p> : schedule.length ? (
            <ul className="mt-4 space-y-3">{schedule.map(session => <li key={session.id} className="rounded-xl p-3" style={{ backgroundColor: "var(--navy-50)" }}><p className="text-xs font-bold mb-1" style={{ color: "var(--gold-dark)" }}>{session.exam_body} · {session.course_name} · {session.cohort}</p><p className="font-semibold text-sm" style={{ color: "var(--ink)" }}>{session.topic}</p><p className="mt-1 text-xs" style={{ color: "var(--ink-muted)" }}>{session.subject} · {classTime(session.scheduled_at)} · {session.duration_minutes} min</p><p className="mt-1 text-xs font-semibold" style={{ color: session.status === "LIVE" ? "#B91C1C" : "var(--navy)" }}>{session.status === "LIVE" ? "Live now" : session.status === "COMPLETED" ? "Recently completed" : "Upcoming"}</p></li>)}</ul>
          ) : <p className="text-sm" style={{ color: "var(--ink-muted)" }}>No upcoming classes are scheduled for your paid programmes.</p>}
          <Link href="/portal/student/classes" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--navy)" }}>
            Go to Classes <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.section>

        <motion.section 
          variants={staggerItem}
          className="md:col-span-2 p-4 md:p-6 rounded-2xl border" 
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}
        >
          <div className="flex items-center gap-2 mb-2"><Clock3 className="w-5 h-5" style={{ color: "var(--navy)" }} /><h2 className="font-semibold" style={{ color: "var(--ink)" }}>Learning Activity</h2></div>
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>{unavailable}</p>
        </motion.section>

        <motion.section 
          variants={staggerItem}
          className="p-4 md:p-6 rounded-2xl border" 
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}
        >
          <h2 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>Today's Workplan</h2>
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Assignments will appear here when assignment data is available.</p>
          <Link href="/portal/student/assignments" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--navy)" }}>
            View Assignments <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.section>

        <motion.section 
          variants={staggerItem}
          className="md:col-span-3 p-4 md:p-6 rounded-2xl border" 
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}
        >
          <div className="flex items-center gap-2 mb-2"><Users className="w-5 h-5" style={{ color: "var(--navy)" }} /><h2 className="font-semibold" style={{ color: "var(--ink)" }}>Your Coursemates</h2></div>
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Classmate information will appear when student class enrollments are available.</p>
        </motion.section>
      </motion.div>
    </div>
  );
}
