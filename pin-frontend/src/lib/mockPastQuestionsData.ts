// Mock past questions data - TODO: Replace with API call to /api/students/me/past-questions

export interface PastQuestionSet {
  id: string;
  subject: string;
  title: string;
  year: number;
  examBody: string; // ICAN, ACCA, etc.
  level: string; // Foundation, Skills, Professional, etc.
  questionsCount: number;
  duration: number; // in minutes
  totalMarks: number;
  attempts: number;
  bestScore?: number;
  lastAttemptedAt?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  topics: string[];
}

export const mockPastQuestions: PastQuestionSet[] = [
  {
    id: "PQ001",
    subject: "Financial Accounting",
    title: "ICAN Professional Level - May 2023",
    year: 2023,
    examBody: "ICAN",
    level: "Professional",
    questionsCount: 50,
    duration: 180,
    totalMarks: 100,
    attempts: 2,
    bestScore: 85,
    lastAttemptedAt: "2026-10-15",
    status: "completed",
    topics: ["Financial Statements", "Ratio Analysis", "Cash Flow", "Consolidation"]
  },
  {
    id: "PQ002",
    subject: "Auditing",
    title: "ICAN Professional Level - November 2022",
    year: 2022,
    examBody: "ICAN",
    level: "Professional",
    questionsCount: 40,
    duration: 150,
    totalMarks: 80,
    attempts: 1,
    bestScore: 72,
    lastAttemptedAt: "2026-10-10",
    status: "completed",
    topics: ["Internal Controls", "Risk Assessment", "Audit Planning", "Reporting"]
  },
  {
    id: "PQ003",
    subject: "Taxation",
    title: "ICAN Professional Level - May 2023",
    year: 2023,
    examBody: "ICAN",
    level: "Professional",
    questionsCount: 45,
    duration: 165,
    totalMarks: 100,
    attempts: 0,
    status: "not_started",
    topics: ["Personal Income Tax", "Corporate Tax", "VAT", "Capital Gains Tax"]
  },
  {
    id: "PQ004",
    subject: "Financial Management",
    title: "ICAN Skills Level - November 2022",
    year: 2022,
    examBody: "ICAN",
    level: "Skills",
    questionsCount: 35,
    duration: 120,
    totalMarks: 70,
    attempts: 0,
    status: "not_started",
    topics: ["Investment Appraisal", "Working Capital", "Risk Management", "Cost of Capital"]
  },
  {
    id: "PQ005",
    subject: "Corporate Reporting",
    title: "ICAN Professional Level - May 2022",
    year: 2022,
    examBody: "ICAN",
    level: "Professional",
    questionsCount: 60,
    duration: 210,
    totalMarks: 120,
    attempts: 1,
    bestScore: 78,
    lastAttemptedAt: "2026-10-08",
    status: "in_progress",
    topics: ["IFRS Standards", "Consolidated Statements", "Group Accounts", "Financial Instruments"]
  },
  {
    id: "PQ006",
    subject: "Management Accounting",
    title: "ICAN Skills Level - November 2023",
    year: 2023,
    examBody: "ICAN",
    level: "Skills",
    questionsCount: 42,
    duration: 150,
    totalMarks: 85,
    attempts: 3,
    bestScore: 91,
    lastAttemptedAt: "2026-10-12",
    status: "completed",
    topics: ["Budgeting", "Variance Analysis", "Costing", "Performance Measurement"]
  },
  {
    id: "PQ007",
    subject: "Financial Accounting",
    title: "ICAN Skills Level - May 2023",
    year: 2023,
    examBody: "ICAN",
    level: "Skills",
    questionsCount: 38,
    duration: 135,
    totalMarks: 75,
    attempts: 2,
    bestScore: 68,
    lastAttemptedAt: "2026-09-28",
    status: "completed",
    topics: ["Double Entry", "Trial Balance", "Adjustments", "Final Accounts"]
  },
  {
    id: "PQ008",
    subject: "Taxation",
    title: "ICAN Skills Level - November 2022",
    year: 2022,
    examBody: "ICAN",
    level: "Skills",
    questionsCount: 30,
    duration: 120,
    totalMarks: 60,
    attempts: 1,
    bestScore: 75,
    lastAttemptedAt: "2026-09-20",
    status: "completed",
    topics: ["PAYE", "Tax Relief", "Tax Returns", "Tax Administration"]
  }
];

// Utility functions
export function getQuestionsBySubject(subject?: string) {
  if (!subject || subject === "all") return mockPastQuestions;
  return mockPastQuestions.filter(q => q.subject === subject);
}

export function getQuestionsByLevel(level: string) {
  return mockPastQuestions.filter(q => q.level === level);
}

export function getQuestionsByStatus(status: string) {
  return mockPastQuestions.filter(q => q.status === status);
}

export function getUniqueSubjects() {
  return Array.from(new Set(mockPastQuestions.map(q => q.subject)));
}

export function getCompletedQuestions() {
  return mockPastQuestions.filter(q => q.status === 'completed');
}

export function getTotalQuestions() {
  return mockPastQuestions.reduce((sum, q) => sum + q.questionsCount, 0);
}

export function getAverageScore() {
  const completed = getCompletedQuestions();
  if (completed.length === 0) return 0;
  const totalScore = completed.reduce((sum, q) => sum + (q.bestScore || 0), 0);
  return Math.round(totalScore / completed.length);
}

export function getStatistics() {
  return {
    totalQuestions: getTotalQuestions(),
    completedSets: getCompletedQuestions().length,
    averageScore: getAverageScore(),
    availableSets: mockPastQuestions.length,
    inProgress: mockPastQuestions.filter(q => q.status === 'in_progress').length,
    notStarted: mockPastQuestions.filter(q => q.status === 'not_started').length
  };
}
