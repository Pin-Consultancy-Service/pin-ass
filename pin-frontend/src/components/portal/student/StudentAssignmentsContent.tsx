"use client";

import { useState } from "react";
import { 
  Calendar, Clock, FileText, Upload, Download, CheckCircle, AlertCircle, 
  Eye, Edit3, Send, Paperclip, User, Star
} from "lucide-react";
import { mockAssignments as allAssignments } from "@/lib/mockAssignmentsData";
import { DEMO_MODE } from "@/lib/auth";

const getStatusBadge = (status: string, dueDate: string) => {
  const isOverdue = new Date() > new Date(dueDate) && status === 'pending';
  
  if (isOverdue) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" 
           style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
        <AlertCircle className="w-3 h-3" />
        Overdue
      </div>
    );
  }

  switch (status) {
    case 'submitted':
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
             style={{ backgroundColor: 'var(--gold-50)', color: 'var(--gold-dark)' }}>
          <Clock className="w-3 h-3" />
          Awaiting Grade
        </div>
      );
    case 'graded':
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
             style={{ backgroundColor: 'var(--navy-50)', color: 'var(--navy)' }}>
          <CheckCircle className="w-3 h-3" />
          Graded
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
             style={{ backgroundColor: 'var(--surface)', color: 'var(--ink-muted)' }}>
          <Edit3 className="w-3 h-3" />
          Pending
        </div>
      );
  }
};

const getPriorityColor = (priority?: string) => {
  // We don't use priority in our mock data, so return a default color
  return 'var(--navy)';
};

const formatDueDate = (dueDate: string) => {
  const date = new Date(dueDate);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
};

export default function StudentAssignmentsContent() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);

  // Use mock data from our centralized mock file
  const mockAssignments = allAssignments;

  const statuses = ["all", "pending", "submitted", "graded"];
  
  const filteredAssignments = selectedStatus === "all" 
    ? mockAssignments 
    : mockAssignments.filter(assignment => assignment.status === selectedStatus);

  const pendingCount = mockAssignments.filter(a => a.status === 'pending').length;
  const submittedCount = mockAssignments.filter(a => a.status === 'submitted').length;
  const gradedCount = mockAssignments.filter(a => a.status === 'graded').length;
  
  // Calculate average score for graded assignments
  const gradedAssignments = mockAssignments.filter(a => a.status === 'graded' && a.score !== undefined);
  const averageScore = gradedAssignments.length > 0
    ? Math.round(gradedAssignments.reduce((sum, a) => sum + (a.score || 0), 0) / gradedAssignments.length)
    : 0;

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
        >
          Assignments
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          View assignment details, submit your work, and track your progress
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--ink-muted)' }}
            >
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {pendingCount}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Pending
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--gold)' }}
            >
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {submittedCount}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Submitted
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {gradedCount}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Graded
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#16A34A' }}
            >
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {averageScore}%
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Average Score
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-md capitalize"
              style={{
                backgroundColor: selectedStatus === status ? 'var(--navy)' : 'var(--surface)',
                color: selectedStatus === status ? 'white' : 'var(--ink-muted)',
                border: '1px solid var(--rule)'
              }}
            >
              {status === "all" ? "All Assignments" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="p-6 rounded-2xl border transition-all hover:shadow-lg"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            {/* Assignment Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-1 h-8 rounded-full"
                    style={{ backgroundColor: getPriorityColor() }}
                  />
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
                      {assignment.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
                      <span className="font-medium" style={{ color: 'var(--navy)' }}>
                        {assignment.courseName}
                      </span>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{assignment.instructor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {assignment.score !== undefined && assignment.score !== null && (
                  <div className="text-right">
                    <div 
                      className="text-2xl font-bold"
                      style={{ 
                        color: assignment.score >= 80 ? 'var(--navy)' : 
                               assignment.score >= 60 ? 'var(--gold-dark)' : 
                               '#DC2626',
                        fontFamily: 'var(--font-display)' 
                      }}
                    >
                      {assignment.score}%
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className="w-3 h-3"
                          style={{ 
                            color: i < Math.round(((assignment.score ?? 0) / 100) * 5) ? 'var(--gold)' : 'var(--rule)',
                            fill: i < Math.round(((assignment.score ?? 0) / 100) * 5) ? 'var(--gold)' : 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {getStatusBadge(assignment.status, assignment.dueDate)}
              </div>
            </div>

            {/* Assignment Description */}
            <p className="mb-4 leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
              {assignment.description}
            </p>

            {/* Due Date and Details */}
            <div className="flex items-center gap-6 mb-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className={new Date() > new Date(assignment.dueDate) && assignment.status === 'pending' ? 'text-red-600 font-semibold' : ''}>
                  {formatDueDate(assignment.dueDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Assignment</span>
              </div>
            </div>

            {/* Attachments - Remove this section since our mock data doesn't include attachments */}

            {/* Feedback (for graded assignments) */}
            {assignment.feedback && (
              <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--navy-50)', border: '1px solid var(--navy-100)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--navy)' }}>
                  Instructor Feedback:
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
                  {assignment.feedback}
                </p>
              </div>
            )}

            {/* Submission Section */}
            {assignment.status === 'pending' && (
              <div className="border-t pt-4" style={{ borderColor: 'var(--rule)' }}>
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--ink-muted)' }}>
                  Submit Assignment:
                </p>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all hover:shadow-md">
                    <Upload className="w-4 h-4" style={{ color: 'var(--navy)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                      Upload File
                    </span>
                  </button>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white transition-all hover:shadow-md hover:scale-[1.02]"
                    style={{ backgroundColor: 'var(--navy)' }}
                  >
                    <Send className="w-4 h-4" />
                    Submit Assignment
                  </button>
                </div>
              </div>
            )}

            {/* Submitted Date (for submitted assignments) */}
            {assignment.submittedDate && (
              <div className="border-t pt-4" style={{ borderColor: 'var(--rule)' }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                    Submitted on {new Date(assignment.submittedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <button className="flex items-center gap-2 px-3 py-1 rounded-lg border transition-all hover:shadow-md text-xs">
                    <Eye className="w-3 h-3" />
                    View Submission
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}