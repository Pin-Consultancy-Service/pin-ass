"use client";

import { useState } from "react";
import { 
  Users, Search, Filter, Mail, Award, TrendingUp, TrendingDown,
  CheckCircle, XCircle, Clock
} from "lucide-react";
import { mockStudentProgress, type StudentProgress } from "@/lib/mockTrainingData";

export default function InstructorStudentsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'completed'>('all');

  const courses = ['all', ...Array.from(new Set(mockStudentProgress.map(s => s.course)))];

  const filteredStudents = mockStudentProgress.filter(student => {
    const matchesSearch = 
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = filterCourse === 'all' || student.course === filterCourse;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const stats = {
    total: mockStudentProgress.length,
    active: mockStudentProgress.filter(s => s.status === 'active').length,
    completed: mockStudentProgress.filter(s => s.status === 'completed').length,
    avgScore: Math.round(
      mockStudentProgress.reduce((sum, s) => sum + s.averageScore, 0) / mockStudentProgress.length
    ),
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#16A34A';
    if (score >= 60) return 'var(--gold-dark)';
    return '#DC2626';
  };

  const getStatusBadge = (status: StudentProgress['status']) => {
    const config = {
      active: { bg: '#DCFCE7', color: '#16A34A', label: 'Active' },
      inactive: { bg: '#FEE2E2', color: '#DC2626', label: 'Inactive' },
      completed: { bg: 'var(--gold-50)', color: 'var(--gold-dark)', label: 'Completed' },
    };
    const { bg, color, label } = config[status];
    
    return (
      <span 
        className="px-3 py-1 rounded-full text-xs font-bold"
        style={{ backgroundColor: bg, color }}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
        >
          Students
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Track student performance and engagement across all courses
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Students', value: stats.total, color: 'var(--navy)', icon: Users },
          { label: 'Active', value: stats.active, color: '#16A34A', icon: CheckCircle },
          { label: 'Completed', value: stats.completed, color: 'var(--gold-dark)', icon: Award },
          { label: 'Avg Score', value: `${stats.avgScore}%`, color: '#2563EB', icon: TrendingUp },
        ].map((stat, index) => (
          <div 
            key={index}
            className="p-4 rounded-xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                {stat.label}
              </p>
            </div>
            <p 
              className="text-2xl font-bold"
              style={{ color: stat.color, fontFamily: 'var(--font-display)' }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" 
            style={{ color: 'var(--ink-faint)' }}
          />
          <input
            type="search"
            placeholder="Search students by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-11 w-full"
          />
        </div>

        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="form-input md:w-48"
        >
          {courses.map((course) => (
            <option key={course} value={course}>
              {course === 'all' ? 'All Courses' : course}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="form-input md:w-48"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Students List */}
      <div 
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
      >
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--rule)' }} />
            <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
              No students found
            </p>
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--bg)' }}>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                    Course
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                    Attendance
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                    Assignments
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                    Avg Score
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--rule)' }}>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="transition-colors hover:bg-opacity-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: 'var(--navy)' }}
                        >
                          {student.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                            {student.studentName}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm" style={{ color: 'var(--ink)' }}>
                        {student.course}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <p 
                          className="text-lg font-bold"
                          style={{ 
                            color: student.attendance >= 90 ? '#16A34A' : 
                                   student.attendance >= 75 ? 'var(--gold-dark)' : '#DC2626',
                            fontFamily: 'var(--font-display)'
                          }}
                        >
                          {student.attendance}%
                        </p>
                        <div 
                          className="h-1 rounded-full overflow-hidden"
                          style={{ width: '60px', backgroundColor: 'var(--rule)' }}
                        >
                          <div 
                            className="h-full transition-all"
                            style={{ 
                              width: `${student.attendance}%`,
                              backgroundColor: student.attendance >= 90 ? '#16A34A' : 
                                            student.attendance >= 75 ? 'var(--gold-dark)' : '#DC2626'
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                        {student.assignmentsSubmitted} / {student.totalAssignments}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p 
                        className="text-xl font-bold"
                        style={{ 
                          color: getScoreColor(student.averageScore),
                          fontFamily: 'var(--font-display)'
                        }}
                      >
                        {student.averageScore}%
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 rounded-lg transition-all hover:shadow-md"
                          style={{ backgroundColor: 'var(--bg)' }}
                          title="Send email"
                        >
                          <Mail className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
                        </button>
                        <button
                          className="p-2 rounded-lg transition-all hover:shadow-md"
                          style={{ backgroundColor: 'var(--navy-50)' }}
                          title="View details"
                        >
                          <Award className="w-4 h-4" style={{ color: 'var(--navy)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
