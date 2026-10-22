"use client";

import { useState, useEffect } from "react";
import { 
  FileCheck, Filter, Edit, CheckCircle, Clock, Award
} from "lucide-react";
import { mockStudentProgress, type StudentProgress } from "@/lib/mockTrainingData";

interface Assignment {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  course: string;
  title: string;
  submissionDate: string;
  status: 'pending' | 'graded';
  score: number | null;
}

export default function InstructorGradingContent() {
  const [mounted, setMounted] = useState(false);
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'graded'>('all');
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate mock assignments from student progress
  const mockAssignments: Assignment[] = mockStudentProgress.flatMap(student => 
    Array.from({ length: student.assignmentsSubmitted }, (_, i) => ({
      id: `${student.id}-A${i + 1}`,
      studentId: student.id,
      studentName: student.studentName,
      email: student.email,
      course: student.course,
      title: `Assignment ${i + 1}`,
      submissionDate: '2024-07-0' + ((i % 9) + 1),
      status: i < student.assignmentsSubmitted - 1 ? 'graded' as const : 'pending' as const,
      score: i < student.assignmentsSubmitted - 1 ? Math.round(student.averageScore + (i % 3 - 1) * 5) : null,
    }))
  );

  // Get unique courses
  const courses = ['all', ...Array.from(new Set(mockStudentProgress.map(s => s.course)))];

  // Filter assignments
  const filteredAssignments = mockAssignments.filter(assignment => {
    const courseMatch = filterCourse === 'all' || assignment.course === filterCourse;
    const statusMatch = filterStatus === 'all' || assignment.status === filterStatus;
    return courseMatch && statusMatch;
  });

  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString("en-NG", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    }) : "—";

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#16A34A'; // Green
    if (score >= 50) return '#D97706'; // Amber
    return '#DC2626'; // Red
  };

  const openGradeModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowGradeModal(true);
  };

  // Calculate stats
  const totalSubmissions = mockAssignments.length;
  const pendingReview = mockAssignments.filter(a => a.status === 'pending').length;
  const gradedCount = mockAssignments.filter(a => a.status === 'graded').length;
  const gradedScores = mockAssignments.filter(a => a.score !== null).map(a => a.score!);
  const averageScore = gradedScores.length > 0 
    ? Math.round(gradedScores.reduce((sum, score) => sum + score, 0) / gradedScores.length)
    : 0;

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
          >
            Grading
          </h1>
          <p style={{ color: 'var(--ink-muted)' }}>
            Review and grade student assignment submissions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Submissions', value: totalSubmissions, color: 'var(--navy)' },
          { label: 'Pending Review', value: pendingReview, color: '#D97706' },
          { label: 'Graded', value: gradedCount, color: '#16A34A' },
          { label: 'Average Score', value: `${averageScore}%`, color: 'var(--gold-dark)' },
        ].map((stat, index) => (
          <div 
            key={index}
            className="p-4 rounded-xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <p 
              className="text-3xl font-bold mb-1"
              style={{ color: stat.color, fontFamily: 'var(--font-display)' }}
            >
              {stat.value}
            </p>
            <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Course Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>Course:</span>
          <div className="flex gap-2 flex-wrap">
            {courses.map((course) => (
              <button
                key={course}
                onClick={() => setFilterCourse(course)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize"
                style={{
                  backgroundColor: filterCourse === course ? 'var(--navy)' : 'var(--surface)',
                  color: filterCourse === course ? 'white' : 'var(--ink-muted)',
                  border: '1px solid var(--rule)'
                }}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>Status:</span>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'graded'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize"
                style={{
                  backgroundColor: filterStatus === status ? 'var(--navy)' : 'var(--surface)',
                  color: filterStatus === status ? 'white' : 'var(--ink-muted)',
                  border: '1px solid var(--rule)'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div 
            className="p-12 text-center rounded-2xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <FileCheck className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--rule)' }} />
            <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
              No assignments found
            </p>
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
              {filterCourse === 'all' && filterStatus === 'all'
                ? 'No assignments have been submitted yet' 
                : 'No assignments match the selected filters'}
            </p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-6 rounded-2xl border transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Student Info */}
                  <div className="mb-3">
                    <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--ink)' }}>
                      {assignment.studentName}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                      {assignment.email}
                    </p>
                  </div>

                  {/* Assignment Info */}
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--ink)' }}>
                        {assignment.title}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                        {assignment.course}
                      </p>
                    </div>
                    <div className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                      <strong style={{ color: 'var(--ink)' }}>Submitted:</strong> {mounted && fmtDate(assignment.submissionDate)}
                    </div>
                  </div>

                  {/* Status and Score */}
                  <div className="flex flex-wrap items-center gap-3">
                    {assignment.status === 'pending' ? (
                      <span 
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
                      >
                        <Clock className="w-3 h-3" />
                        Pending Review
                      </span>
                    ) : (
                      <>
                        <span 
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                          style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}
                        >
                          <CheckCircle className="w-3 h-3" />
                          Graded
                        </span>
                        {assignment.score !== null && (
                          <span 
                            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold"
                            style={{ 
                              backgroundColor: 'var(--gold-50)', 
                              color: getScoreColor(assignment.score) 
                            }}
                          >
                            <Award className="w-4 h-4" />
                            {assignment.score}/100
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {assignment.status === 'pending' ? (
                    <button
                      onClick={() => openGradeModal(assignment)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md"
                      style={{ backgroundColor: 'var(--navy)', color: 'white' }}
                    >
                      <FileCheck className="w-4 h-4" />
                      Grade
                    </button>
                  ) : (
                    <button
                      onClick={() => openGradeModal(assignment)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md"
                      style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)' }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Grade
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Grade Modal */}
      {showGradeModal && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div 
            className="w-full max-w-2xl rounded-2xl p-6"
            style={{ backgroundColor: 'var(--bg)' }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ink)' }}>
              {selectedAssignment.status === 'pending' ? 'Grade Assignment' : 'Edit Grade'}
            </h2>
            
            <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--surface)' }}>
              <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                {selectedAssignment.studentName}
              </p>
              <p className="text-sm mb-2" style={{ color: 'var(--ink-muted)' }}>
                {selectedAssignment.title} • {selectedAssignment.course}
              </p>
              {selectedAssignment.score !== null && (
                <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                  Current Score: <strong style={{ color: 'var(--ink)' }}>{selectedAssignment.score}/100</strong>
                </p>
              )}
            </div>

            <div className="mb-4">
              <label 
                className="block text-sm font-semibold mb-2"
                style={{ color: 'var(--ink)' }}
              >
                Score (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                defaultValue={selectedAssignment.score || ''}
                className="w-full px-4 py-2 rounded-xl border"
                style={{ 
                  backgroundColor: 'var(--surface)', 
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)'
                }}
                placeholder="Enter score"
              />
            </div>

            <p className="text-sm mb-4" style={{ color: 'var(--ink-muted)' }}>
              Feature coming soon! This will allow you to grade and provide feedback on assignments.
            </p>

            <button
              onClick={() => {
                setShowGradeModal(false);
                setSelectedAssignment(null);
              }}
              className="px-4 py-2 rounded-xl font-semibold"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
