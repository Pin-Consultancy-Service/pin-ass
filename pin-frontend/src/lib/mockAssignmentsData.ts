// Mock assignments data - TODO: Replace with API call to /api/students/me/assignments

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  submittedDate?: string;
  maxScore: number;
  score?: number;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  feedback?: string;
  attachments: AssignmentFile[];
  submissionFile?: string;
  instructor: string;
}

export interface AssignmentFile {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

export const mockAssignments: Assignment[] = [
  {
    id: "ASG001",
    courseId: "FIN_ACC_001",
    courseName: "Financial Accounting",
    subject: "Financial Accounting",
    title: "Week 5: Consolidation Practice Questions",
    description: "Complete exercises 1-10 on consolidated financial statements. Show all workings and prepare full consolidated balance sheet and income statement for the given scenarios.",
    dueDate: "2026-10-18",
    maxScore: 100,
    status: 'pending',
    attachments: [
      {
        id: "ATT001",
        name: "Week5_Assignment_Questions.pdf",
        type: "pdf",
        size: "1.2 MB",
        url: "#"
      },
      {
        id: "ATT002",
        name: "Consolidation_Template.xlsx",
        type: "xlsx",
        size: "450 KB",
        url: "#"
      }
    ],
    instructor: "Anthony Babatunde"
  },
  {
    id: "ASG002",
    courseId: "TAX_001",
    courseName: "Taxation",
    subject: "Taxation",
    title: "Case Study 2: PAYE Calculations",
    description: "Calculate PAYE for 5 different employee scenarios. Include all deductions and tax reliefs. Prepare monthly tax schedule.",
    dueDate: "2026-10-20",
    maxScore: 50,
    status: 'pending',
    attachments: [
      {
        id: "ATT003",
        name: "PAYE_Case_Study.pdf",
        type: "pdf",
        size: "890 KB",
        url: "#"
      }
    ],
    instructor: "Prof. Fatima Bello"
  },
  {
    id: "ASG003",
    courseId: "FIN_ACC_001",
    courseName: "Financial Accounting",
    subject: "Financial Accounting",
    title: "Week 3: Balance Sheet Analysis",
    description: "Analyze the provided balance sheets and prepare a comparative analysis report.",
    dueDate: "2026-10-05",
    submittedDate: "2026-10-04",
    maxScore: 100,
    score: 95,
    status: 'graded',
    feedback: "Excellent work! Your analysis was thorough and well-structured. Minor improvements needed in the cash flow section.",
    attachments: [
      {
        id: "ATT004",
        name: "Balance_Sheet_Assignment.pdf",
        type: "pdf",
        size: "750 KB",
        url: "#"
      }
    ],
    submissionFile: "John_Doe_Balance_Sheet_Analysis.pdf",
    instructor: "Dr. Adebayo Johnson"
  },
  {
    id: "ASG004",
    courseId: "TAX_001",
    courseName: "Taxation",
    subject: "Taxation",
    title: "Week 1: Tax System Overview",
    description: "Write a 2000-word essay on the Nigerian tax system structure and its evolution.",
    dueDate: "2026-10-01",
    submittedDate: "2026-09-30",
    maxScore: 50,
    score: 42,
    status: 'graded',
    feedback: "Good understanding of the topic. Include more references to recent tax reforms.",
    attachments: [
      {
        id: "ATT005",
        name: "Essay_Guidelines.pdf",
        type: "pdf",
        size: "350 KB",
        url: "#"
      }
    ],
    submissionFile: "John_Doe_Tax_Essay.docx",
    instructor: "Prof. Fatima Bello"
  },
  {
    id: "ASG005",
    courseId: "AUD_001",
    courseName: "Auditing",
    subject: "Auditing",
    title: "Week 2: Risk Assessment Exercise",
    description: "Complete the risk assessment matrix for the provided company scenario.",
    dueDate: "2026-10-22",
    maxScore: 75,
    status: 'pending',
    attachments: [
      {
        id: "ATT006",
        name: "Risk_Assessment_Template.xlsx",
        type: "xlsx",
        size: "650 KB",
        url: "#"
      },
      {
        id: "ATT007",
        name: "Company_Scenario.pdf",
        type: "pdf",
        size: "1.1 MB",
        url: "#"
      }
    ],
    instructor: "Dr. Aisha Mohammed"
  },
  {
    id: "ASG006",
    courseId: "FIN_ACC_001",
    courseName: "Financial Accounting",
    subject: "Financial Accounting",
    title: "Week 1: Introduction Quiz",
    description: "Multiple choice quiz on basic accounting principles.",
    dueDate: "2026-09-18",
    submittedDate: "2026-09-17",
    maxScore: 20,
    score: 18,
    status: 'graded',
    feedback: "Great score! Review depreciation methods for future assessments.",
    attachments: [],
    instructor: "Dr. Adebayo Johnson"
  }
];

// Utility functions
export function getAssignmentsByStatus(status?: Assignment['status']) {
  if (!status) return mockAssignments;
  return mockAssignments.filter(a => a.status === status);
}

export function getAssignmentsBySubject(subject?: string) {
  if (!subject) return mockAssignments;
  return mockAssignments.filter(a => a.subject === subject);
}

export function getPendingAssignments() {
  return mockAssignments.filter(a => a.status === 'pending');
}

export function getGradedAssignments() {
  return mockAssignments.filter(a => a.status === 'graded');
}

export function getOverdueAssignments() {
  const now = new Date();
  return mockAssignments.filter(a => 
    a.status === 'pending' && new Date(a.dueDate) < now
  );
}

export function getAverageScore() {
  const graded = getGradedAssignments();
  if (graded.length === 0) return 0;
  const total = graded.reduce((sum, a) => sum + (a.score || 0), 0);
  const maxTotal = graded.reduce((sum, a) => sum + a.maxScore, 0);
  return Math.round((total / maxTotal) * 100);
}

export function getSubmissionRate() {
  const total = mockAssignments.length;
  const submitted = mockAssignments.filter(a => 
    a.status === 'submitted' || a.status === 'graded'
  ).length;
  return Math.round((submitted / total) * 100);
}

export function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date();
}

export function getDaysUntilDue(dueDate: string) {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function getStatusColor(status: Assignment['status']) {
  const colors = {
    pending: { bg: '#FEF3C7', text: '#92600A', border: '#F59E0B' },
    submitted: { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' },
    graded: { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
    overdue: { bg: '#FEE2E2', text: '#991B1B', border: '#DC2626' }
  };
  return colors[status];
}

export function getUniqueSubjects() {
  return Array.from(new Set(mockAssignments.map(a => a.subject)));
}
