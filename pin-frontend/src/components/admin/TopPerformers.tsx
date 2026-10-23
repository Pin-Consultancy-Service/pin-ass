"use client";

import { Trophy, GraduationCap, Award } from "lucide-react";
import { mockEnrollments, mockAdminClasses, mockSystemUsers } from "@/lib/mockAdminData";

export default function TopPerformers() {
  // Get top 3 students by progress
  const topStudents = mockEnrollments
    .filter(e => e.status === "confirmed" || e.status === "completed")
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3)
    .map((enrollment, index) => ({
      ...enrollment,
      rank: index + 1,
    }));

  // Get top 2 instructors by class count
  const instructorClassCount = mockAdminClasses.reduce((acc, cls) => {
    acc[cls.instructorId] = (acc[cls.instructorId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topInstructors = Object.entries(instructorClassCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([instructorId, classCount], index) => {
      const instructor = mockSystemUsers.find(u => u.id === instructorId);
      return {
        id: instructorId,
        name: instructor ? `${instructor.first_name} ${instructor.last_name}` : "Unknown",
        classCount,
        rank: index + 1,
      };
    });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-4 h-4" style={{ color: "var(--gold-dark)" }} />;
    if (rank === 2) return <Trophy className="w-4 h-4" style={{ color: "var(--ink-muted)" }} />;
    return <Trophy className="w-4 h-4" style={{ color: "var(--ink-muted)" }} />;
  };

  return (
    <div
      className="rounded-xl border p-5"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--rule)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5" style={{ color: "var(--gold)" }} />
        <h3 className="font-bold text-lg" style={{ color: "var(--ink)" }}>
          Top Performers
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <div>
          <h4
            className="text-xs font-semibold mb-3 uppercase tracking-wide"
            style={{ color: "var(--ink-muted)" }}
          >
            Top Students
          </h4>
          <div className="space-y-3">
            {topStudents.map((student) => (
              <div
                key={student.id}
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: "var(--bg)",
                  borderColor: "var(--rule)",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-shrink-0">{getRankIcon(student.rank)}</div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: "var(--navy)" }}
                  >
                    {student.studentName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--ink)" }}>
                      {student.studentName}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--ink-muted)" }}>
                      {student.programmeName}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "var(--ink-muted)" }}>Progress</span>
                    <span className="font-bold" style={{ color: "var(--ink)" }}>
                      {student.progress}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--rule)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${student.progress}%`,
                        background: "linear-gradient(90deg, var(--gold) 0%, var(--gold-dark) 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Instructors */}
        <div>
          <h4
            className="text-xs font-semibold mb-3 uppercase tracking-wide"
            style={{ color: "var(--ink-muted)" }}
          >
            Most Active Instructors
          </h4>
          <div className="space-y-3">
            {topInstructors.map((instructor) => (
              <div
                key={instructor.id}
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: "var(--bg)",
                  borderColor: "var(--rule)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0">{getRankIcon(instructor.rank)}</div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: "var(--gold-dark)" }}
                  >
                    {instructor.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--ink)" }}>
                      {instructor.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
                      Instructor
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" style={{ color: "var(--ink-muted)" }} />
                    <span className="text-xs" style={{ color: "var(--ink-muted)" }}>
                      Classes this month
                    </span>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{ backgroundColor: "var(--navy-50)", color: "var(--navy)" }}
                  >
                    {instructor.classCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
