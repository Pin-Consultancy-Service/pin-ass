"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BookOpen, CreditCard, User, ArrowRight, CheckCircle2, Award, Clock,
  Users, TrendingUp, Calendar, Video, MapPin, BarChart3, FileText
} from "lucide-react";
import { apiFetch, getStoredUser, DEMO_MODE } from "@/lib/auth";
import { 
  mockEnrollments, 
  mockTrainingClasses, 
  mockStudentProgress,
  getTrainingStats,
  getEnrollmentStats,
  type TrainingEnrollment 
} from "@/lib/mockTrainingData";

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
  CONFIRMED: { bg: "var(--navy-50)", text: "var(--ink)" },
  ATTENDED:  { bg: "var(--navy-50)", text: "var(--ink)" },
  CANCELLED: { bg: "#FEF2F2", text: "#DC2626" },
};

export default function TrainingDashboard() {
  const router = useRouter();
  const user = getStoredUser();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<'instructor' | 'participant'>('participant');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // In demo mode, use mock data
    if (DEMO_MODE) {
      setLoading(false);
      // Training portal is for participants only
      setUserRole('participant');
      return;
    }

    if (!user) { 
      router.replace("/portal/login?redirect=/portal/training"); 
      return; 
    }
    
    apiFetch<Enrollment[]>("/api/training/me/enrollments/")
      .then((d) => setEnrollments(Array.isArray(d) ? d : []))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const trainingStats = getTrainingStats();
  const enrollmentStats = getEnrollmentStats();
  
  // Get upcoming classes
  const upcomingClasses = mockTrainingClasses
    .filter(c => c.status === 'upcoming')
    .slice(0, 3);

  return (
    <div className="max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
          suppressHydrationWarning
        >
          {mounted ? `Welcome back${user ? `, ${user.first_name}` : ""}! 👋` : "Welcome back! 👋"}
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          {userRole === 'instructor' 
            ? 'Manage your classes and track student progress' 
            : 'Your training programs and learning progress'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {userRole === 'instructor' ? (
          // Instructor Stats
          <>
            <div 
              className="p-5 rounded-2xl border transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--navy-50)' }}
                >
                  <Calendar className="w-6 h-6" style={{ color: 'var(--navy)' }} />
                </div>
                <div>
                  <p 
                    className="text-3xl font-bold"
                    style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
                  >
                    {trainingStats.upcomingClasses}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    UPCOMING CLASSES
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="p-5 rounded-2xl border transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#DCFCE7' }}
                >
                  <Users className="w-6 h-6" style={{ color: '#16A34A' }} />
                </div>
                <div>
                  <p 
                    className="text-3xl font-bold"
                    style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
                  >
                    {trainingStats.activeStudents}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    ACTIVE STUDENTS
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="p-5 rounded-2xl border transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--gold-50)' }}
                >
                  <TrendingUp className="w-6 h-6" style={{ color: 'var(--gold-dark)' }} />
                </div>
                <div>
                  <p 
                    className="text-3xl font-bold"
                    style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
                  >
                    {trainingStats.averageScore}%
                  </p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    AVG. SCORE
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="p-5 rounded-2xl border transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#DBEAFE' }}
                >
                  <CheckCircle2 className="w-6 h-6" style={{ color: '#2563EB' }} />
                </div>
                <div>
                  <p 
                    className="text-3xl font-bold"
                    style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
                  >
                    {trainingStats.averageAttendance}%
                  </p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    ATTENDANCE
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Participant Stats
          <>
            <div 
              className="p-5 rounded-2xl border transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--navy-50)' }}
                >
                  <BookOpen className="w-6 h-6" style={{ color: 'var(--navy)' }} />
                </div>
                <div>
                  <p 
                    className="text-3xl font-bold"
                    style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
                  >
                    {enrollmentStats.totalEnrollments}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    ENROLLMENTS
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="p-5 rounded-2xl border transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#DCFCE7' }}
                >
                  <CheckCircle2 className="w-6 h-6" style={{ color: '#16A34A' }} />
                </div>
                <div>
                  <p 
                    className="text-3xl font-bold"
                    style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
                  >
                    {enrollmentStats.activeEnrollments}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    ACTIVE
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="p-5 rounded-2xl border transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--gold-50)' }}
                >
                  <Award className="w-6 h-6" style={{ color: 'var(--gold-dark)' }} />
                </div>
                <div>
                  <p 
                    className="text-3xl font-bold"
                    style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
                  >
                    {enrollmentStats.certificatesEarned}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    CERTIFICATES
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="p-5 rounded-2xl border transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#FEE2E2' }}
                >
                  <CreditCard className="w-6 h-6" style={{ color: '#DC2626' }} />
                </div>
                <div>
                  <p 
                    className="text-3xl font-bold"
                    style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
                  >
                    ₦{(enrollmentStats.totalBalance / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    BALANCE
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/portal/training/profile"
          className="flex items-center justify-between p-4 rounded-2xl border transition-all hover:shadow-md hover:scale-[1.02] group"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg)' }}
            >
              <User className="w-5 h-5" style={{ color: 'var(--navy)' }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              My Profile
            </span>
          </div>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: 'var(--ink-muted)' }} />
        </Link>

        <Link
          href="/portal/training/materials"
          className="flex items-center justify-between p-4 rounded-2xl border transition-all hover:shadow-md hover:scale-[1.02] group"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg)' }}
            >
              <FileText className="w-5 h-5" style={{ color: 'var(--navy)' }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              Materials
            </span>
          </div>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: 'var(--ink-muted)' }} />
        </Link>

        <Link
          href="/portal/training/fees"
          className="flex items-center justify-between p-4 rounded-2xl border transition-all hover:shadow-md hover:scale-[1.02] group"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg)' }}
            >
              <CreditCard className="w-5 h-5" style={{ color: 'var(--navy)' }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              {userRole === 'instructor' ? 'Analytics' : 'Payment Status'}
            </span>
          </div>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: 'var(--ink-muted)' }} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes / Enrollments */}
        <div 
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--rule)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
              {userRole === 'instructor' ? 'Upcoming Classes' : 'My Enrollments'}
            </h2>
          </div>

          <div className="divide-y" style={{ borderColor: 'var(--rule)' }}>
            {userRole === 'instructor' ? (
              upcomingClasses.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--rule)' }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--ink-faint)' }}>
                    No upcoming classes scheduled
                  </p>
                </div>
              ) : (
                upcomingClasses.map((cls) => (
                  <div key={cls.id} className="px-6 py-4 transition-colors hover:bg-opacity-50" style={{ backgroundColor: 'transparent' }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                          {cls.title}
                        </h3>
                        <p className="text-xs mb-2" style={{ color: 'var(--ink-muted)' }}>
                          {cls.course} • {cls.programme}
                        </p>
                        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--ink-faint)' }}>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {mounted && fmtDate(cls.date)} {cls.startTime} - {cls.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            {cls.type === 'online' ? (
                              <><Video className="w-3 h-3" /> Online</>
                            ) : (
                              <><MapPin className="w-3 h-3" /> {cls.type === 'hybrid' ? 'Hybrid' : 'In-Person'}</>
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {cls.studentsEnrolled}/{cls.maxCapacity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (
              mockEnrollments.length === 0 ? (
                <div className="p-12 text-center">
                  <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--rule)' }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--ink-faint)' }}>
                    No training enrollments yet
                  </p>
                </div>
              ) : (
                mockEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                          {enrollment.customProgrammeName || enrollment.programmeName}
                        </h3>
                        <p className="text-xs mb-2" style={{ color: 'var(--ink-muted)' }}>
                          {enrollment.organisation} • {enrollment.modeDisplay}
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <span 
                            className="px-2 py-1 rounded-full font-semibold"
                            style={{ 
                              backgroundColor: statusStyle[enrollment.status.toUpperCase()]?.bg || 'var(--rule)',
                              color: statusStyle[enrollment.status.toUpperCase()]?.text || 'var(--ink)'
                            }}
                          >
                            {enrollment.statusDisplay}
                          </span>
                          {enrollment.certificateIssued && (
                            <span 
                              className="px-2 py-1 rounded-full font-semibold flex items-center gap-1"
                              style={{ backgroundColor: 'var(--gold-50)', color: 'var(--gold-dark)' }}
                            >
                              <Award className="w-3 h-3" /> Certified
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold mb-1" style={{ color: 'var(--ink-muted)' }}>
                          Progress
                        </div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--navy)', fontFamily: 'var(--font-display)' }}>
                          {enrollment.completionPercentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* Student Performance / Payment Summary */}
        <div 
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--rule)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
              {userRole === 'instructor' ? 'Student Performance' : 'Payment Summary'}
            </h2>
          </div>

          <div className="p-6">
            {userRole === 'instructor' ? (
              <div className="space-y-4">
                {mockStudentProgress.slice(0, 4).map((student) => (
                  <div key={student.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: 'var(--navy)' }}
                      >
                        {student.studentName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                          {student.studentName}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                          {student.course}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: 'var(--navy)', fontFamily: 'var(--font-display)' }}>
                        {student.averageScore}%
                      </div>
                      <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                        {student.assignmentsSubmitted}/{student.totalAssignments} submitted
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--bg)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    Total Fees
                  </span>
                  <span className="text-lg font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                    ₦{enrollmentStats.totalFees.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--bg)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    Amount Paid
                  </span>
                  <span className="text-lg font-bold" style={{ color: '#16A34A', fontFamily: 'var(--font-display)' }}>
                    ₦{enrollmentStats.totalPaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#FEE2E2' }}>
                  <span className="text-sm font-semibold" style={{ color: '#DC2626' }}>
                    Outstanding Balance
                  </span>
                  <span className="text-lg font-bold" style={{ color: '#DC2626', fontFamily: 'var(--font-display)' }}>
                    ₦{enrollmentStats.totalBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
