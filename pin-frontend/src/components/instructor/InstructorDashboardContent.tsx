"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, Users, TrendingUp, CheckCircle2, Clock, Video, MapPin, Award
} from "lucide-react";
import { 
  mockTrainingClasses, 
  mockStudentProgress,
  getTrainingStats
} from "@/lib/mockTrainingData";

export default function InstructorDashboardContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = getTrainingStats();
  
  const upcomingClasses = mockTrainingClasses
    .filter(c => c.status === 'upcoming')
    .slice(0, 3);

  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
        >
          Welcome back, Instructor! 👋
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Here's an overview of your classes and student performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
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
                {stats.upcomingClasses}
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
                {stats.activeStudents}
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
                {stats.averageScore}%
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
                {stats.averageAttendance}%
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                ATTENDANCE
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div 
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--rule)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
              Upcoming Classes
            </h2>
          </div>

          <div className="divide-y" style={{ borderColor: 'var(--rule)' }}>
            {upcomingClasses.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--rule)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--ink-faint)' }}>
                  No upcoming classes scheduled
                </p>
              </div>
            ) : (
              upcomingClasses.map((cls) => (
                <div key={cls.id} className="px-6 py-4">
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
            )}
          </div>
        </div>

        {/* Student Performance */}
        <div 
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--rule)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
              Top Performing Students
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {mockStudentProgress
                .sort((a, b) => b.averageScore - a.averageScore)
                .slice(0, 5)
                .map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: 'var(--navy)' }}
                        >
                          {student.studentName.charAt(0)}
                        </div>
                        {index < 3 && (
                          <div 
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: index === 0 ? 'var(--gold)' : index === 1 ? '#C0C0C0' : '#CD7F32' }}
                          >
                            {index + 1}
                          </div>
                        )}
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
          </div>
        </div>
      </div>
    </div>
  );
}
