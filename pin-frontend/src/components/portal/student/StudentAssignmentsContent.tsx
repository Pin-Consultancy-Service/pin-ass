"use client";

import { useState } from "react";
import { 
  Calendar, Clock, FileText, Upload, Download, CheckCircle, AlertCircle, 
  Eye, Edit3, Send, Paperclip, User, Star
} from "lucide-react";

// TODO: Replace with real assignments from PIN Associate
const mockAssignments = [
  {
    id: 1,
    subject: "Financial Accounting",
    title: "Ratio Analysis Case Study",
    description: "Analyze the financial performance of ABC Ltd using ratio analysis. Include liquidity ratios, profitability ratios, and efficiency ratios. Provide recommendations based on your findings.",
    instructor: "Dr. Adebayo Johnson",
    dueDate: "2024-02-15T23:59:00",
    submittedDate: null,
    status: "pending",
    type: "report",
    maxScore: 100,
    score: null,
    attachments: [
      { name: "ABC_Ltd_Financial_Statements.pdf", size: "245KB" },
      { name: "Assignment_Guidelines.pdf", size: "120KB" }
    ],
    submissionType: ["file", "text"],
    priority: "high"
  },
  {
    id: 2,
    subject: "Taxation",
    title: "Personal Income Tax Calculation",
    description: "Calculate personal income tax for various scenarios including employment income, business income, and investment income. Show all workings and cite relevant tax laws.",
    instructor: "Prof. Fatima Bello",
    dueDate: "2024-02-20T23:59:00",
    submittedDate: "2024-02-18T14:30:00",
    status: "submitted",
    type: "calculation",
    maxScore: 75,
    score: null,
    attachments: [
      { name: "Tax_Scenarios.pdf", size: "180KB" }
    ],
    submissionType: ["file"],
    priority: "medium"
  },
  {
    id: 3,
    subject: "Advanced Audit",
    title: "Audit Planning Memo",
    description: "Prepare an audit planning memorandum for a manufacturing company. Include risk assessment, materiality calculations, and audit strategy.",
    instructor: "CA. Samuel Okafor",
    dueDate: "2024-02-25T23:59:00",
    submittedDate: "2024-02-22T16:45:00",
    status: "graded",
    type: "memo",
    maxScore: 80,
    score: 74,
    feedback: "Well structured audit plan. Good risk identification but materiality calculations need more detail. See comments on submitted document.",
    attachments: [
      { name: "Company_Background.pdf", size: "320KB" },
      { name: "Audit_Planning_Template.docx", size: "95KB" }
    ],
    submissionType: ["file", "text"],
    priority: "medium"
  },
  {
    id: 4,
    subject: "Corporate Reporting",
    title: "Consolidated Financial Statements",
    description: "Prepare consolidated financial statements for a parent company and its subsidiaries. Include all necessary eliminations and adjustments.",
    instructor: "Dr. Aisha Mohammed",
    dueDate: "2024-03-01T23:59:00",
    submittedDate: null,
    status: "pending",
    type: "financial_statement",
    maxScore: 120,
    score: null,
    attachments: [
      { name: "Parent_Company_FS.xlsx", size: "450KB" },
      { name: "Subsidiary_A_FS.xlsx", size: "280KB" },
      { name: "Subsidiary_B_FS.xlsx", size: "310KB" }
    ],
    submissionType: ["file"],
    priority: "high"
  },
  {
    id: 5,
    subject: "Financial Management",
    title: "Investment Appraisal Project",
    description: "Evaluate three investment proposals using NPV, IRR, and payback period methods. Recommend the best option with justification.",
    instructor: "Prof. Ibrahim Yusuf",
    dueDate: "2024-03-05T23:59:00",
    submittedDate: null,
    status: "overdue",
    type: "analysis",
    maxScore: 90,
    score: null,
    attachments: [
      { name: "Investment_Proposals.pdf", size: "200KB" }
    ],
    submissionType: ["file", "text"],
    priority: "urgent"
  }
];

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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return '#DC2626';
    case 'high':
      return 'var(--gold-dark)';
    case 'medium':
      return 'var(--navy)';
    default:
      return 'var(--ink-muted)';
  }
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

  const statuses = ["all", "pending", "submitted", "graded", "overdue"];
  const filteredAssignments = selectedStatus === "all" 
    ? mockAssignments 
    : mockAssignments.filter(assignment => {
        if (selectedStatus === "overdue") {
          return new Date() > new Date(assignment.dueDate) && assignment.status === 'pending';
        }
        return assignment.status === selectedStatus;
      });

  const pendingCount = mockAssignments.filter(a => a.status === 'pending').length;
  const submittedCount = mockAssignments.filter(a => a.status === 'submitted').length;
  const gradedCount = mockAssignments.filter(a => a.status === 'graded').length;
  const overdueCount = mockAssignments.filter(a => 
    new Date() > new Date(a.dueDate) && a.status === 'pending'
  ).length;

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
              style={{ backgroundColor: '#DC2626' }}
            >
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {overdueCount}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Overdue
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
                    style={{ backgroundColor: getPriorityColor(assignment.priority) }}
                  />
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
                      {assignment.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
                      <span className="font-medium" style={{ color: 'var(--navy)' }}>
                        {assignment.subject}
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
                {assignment.score !== null && (
                  <div className="text-right">
                    <div 
                      className="text-2xl font-bold"
                      style={{ 
                        color: assignment.score >= (assignment.maxScore * 0.8) ? 'var(--navy)' : 
                               assignment.score >= (assignment.maxScore * 0.6) ? 'var(--gold-dark)' : 
                               '#DC2626',
                        fontFamily: 'var(--font-display)' 
                      }}
                    >
                      {assignment.score}/{assignment.maxScore}
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className="w-3 h-3"
                          style={{ 
                            color: i < Math.round((assignment.score / assignment.maxScore) * 5) ? 'var(--gold)' : 'var(--rule)',
                            fill: i < Math.round((assignment.score / assignment.maxScore) * 5) ? 'var(--gold)' : 'none'
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
                <span>{assignment.maxScore} points</span>
              </div>
              {assignment.attachments.length > 0 && (
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  <span>{assignment.attachments.length} attachment{assignment.attachments.length > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Attachments */}
            {assignment.attachments.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-muted)' }}>
                  Instructor Attachments:
                </p>
                <div className="flex flex-wrap gap-2">
                  {assignment.attachments.map((attachment, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:shadow-md"
                      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)' }}
                    >
                      <Download className="w-4 h-4" style={{ color: 'var(--navy)' }} />
                      <span className="text-xs font-medium" style={{ color: 'var(--ink)' }}>
                        {attachment.name}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                        ({attachment.size})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                  {assignment.submissionType.includes('file') && (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all hover:shadow-md">
                      <Upload className="w-4 h-4" style={{ color: 'var(--navy)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                        Upload File
                      </span>
                    </button>
                  )}
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