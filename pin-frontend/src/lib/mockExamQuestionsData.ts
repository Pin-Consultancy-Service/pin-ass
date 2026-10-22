// Mock exam questions for practice interface

export interface MCQOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface ExamQuestion {
  id: string;
  section: 'A' | 'B' | 'C';
  questionNumber: number;
  type: 'mcq' | 'short_answer' | 'essay';
  text: string;
  marks: number;
  options?: MCQOption[]; // For MCQs only
  correctAnswer?: 'A' | 'B' | 'C' | 'D'; // For MCQs only
  explanation?: string;
  keyPoints?: string[]; // Expected points for short answer/essay
  wordLimit?: number;
}

export interface ExamAttempt {
  examId: string;
  startTime: Date;
  endTime?: Date;
  timeRemaining: number; // in seconds
  answers: Record<string, string>; // questionId -> answer
  markedForReview: Set<string>;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
}

// Sample ICAN Financial Accounting Exam
export const mockExamQuestions: ExamQuestion[] = [
  // Section A: Multiple Choice Questions (30 questions, 60 marks)
  {
    id: "Q001",
    section: "A",
    questionNumber: 1,
    type: "mcq",
    text: "Which of the following is NOT a component of working capital?",
    marks: 2,
    options: [
      { id: "A", text: "Inventory" },
      { id: "B", text: "Fixed Assets" },
      { id: "C", text: "Accounts Receivable" },
      { id: "D", text: "Accounts Payable" }
    ],
    correctAnswer: "B",
    explanation: "Fixed assets are long-term assets and are not part of working capital. Working capital consists of current assets minus current liabilities."
  },
  {
    id: "Q002",
    section: "A",
    questionNumber: 2,
    type: "mcq",
    text: "The accounting equation is represented as:",
    marks: 2,
    options: [
      { id: "A", text: "Assets = Liabilities + Equity" },
      { id: "B", text: "Assets = Liabilities - Equity" },
      { id: "C", text: "Assets + Liabilities = Equity" },
      { id: "D", text: "Assets - Equity = Liabilities" }
    ],
    correctAnswer: "A",
    explanation: "The fundamental accounting equation is Assets = Liabilities + Equity (or Owner's Capital)."
  },
  {
    id: "Q003",
    section: "A",
    questionNumber: 3,
    type: "mcq",
    text: "Depreciation is best described as:",
    marks: 2,
    options: [
      { id: "A", text: "A method of valuation" },
      { id: "B", text: "A source of funds" },
      { id: "C", text: "An allocation of cost" },
      { id: "D", text: "A reduction in market value" }
    ],
    correctAnswer: "C",
    explanation: "Depreciation is the systematic allocation of the cost of a fixed asset over its useful life."
  },
  {
    id: "Q004",
    section: "A",
    questionNumber: 4,
    type: "mcq",
    text: "Which method of inventory valuation gives the highest profit during inflation?",
    marks: 2,
    options: [
      { id: "A", text: "FIFO (First In First Out)" },
      { id: "B", text: "LIFO (Last In First Out)" },
      { id: "C", text: "Weighted Average" },
      { id: "D", text: "Specific Identification" }
    ],
    correctAnswer: "A",
    explanation: "During inflation, FIFO gives the highest profit because older, cheaper costs are matched against current higher revenues."
  },
  {
    id: "Q005",
    section: "A",
    questionNumber: 5,
    type: "mcq",
    text: "The current ratio is calculated as:",
    marks: 2,
    options: [
      { id: "A", text: "Current Assets ÷ Current Liabilities" },
      { id: "B", text: "Current Liabilities ÷ Current Assets" },
      { id: "C", text: "Total Assets ÷ Current Liabilities" },
      { id: "D", text: "Current Assets ÷ Total Liabilities" }
    ],
    correctAnswer: "A",
    explanation: "Current ratio = Current Assets ÷ Current Liabilities. It measures short-term liquidity."
  },
  {
    id: "Q006",
    section: "A",
    questionNumber: 6,
    type: "mcq",
    text: "Goodwill arises when:",
    marks: 2,
    options: [
      { id: "A", text: "A company makes consistent profits" },
      { id: "B", text: "Purchase consideration exceeds net assets value" },
      { id: "C", text: "Assets are revalued upwards" },
      { id: "D", text: "Reserves are created" }
    ],
    correctAnswer: "B",
    explanation: "Goodwill = Purchase Consideration - Fair Value of Net Assets Acquired. It represents the premium paid for intangible factors like reputation, customer base, etc."
  },
  {
    id: "Q007",
    section: "A",
    questionNumber: 7,
    type: "mcq",
    text: "Which of these is a non-current liability?",
    marks: 2,
    options: [
      { id: "A", text: "Bank overdraft" },
      { id: "B", text: "Trade payables" },
      { id: "C", text: "Debentures" },
      { id: "D", text: "Accrued expenses" }
    ],
    correctAnswer: "C",
    explanation: "Debentures are long-term debt instruments and are classified as non-current liabilities."
  },
  {
    id: "Q008",
    section: "A",
    questionNumber: 8,
    type: "mcq",
    text: "Revenue recognition principle states that revenue should be recognized when:",
    marks: 2,
    options: [
      { id: "A", text: "Cash is received" },
      { id: "B", text: "Goods are ordered" },
      { id: "C", text: "Goods are delivered and title passes" },
      { id: "D", text: "Invoice is prepared" }
    ],
    correctAnswer: "C",
    explanation: "Revenue is recognized when earned (goods delivered/services performed) and realizable (collection is reasonably assured)."
  },
  {
    id: "Q009",
    section: "A",
    questionNumber: 9,
    type: "mcq",
    text: "The matching principle requires that:",
    marks: 2,
    options: [
      { id: "A", text: "Assets equal liabilities plus equity" },
      { id: "B", text: "Expenses be matched with revenues of the period" },
      { id: "C", text: "All transactions be recorded in cash" },
      { id: "D", text: "Financial statements be prepared annually" }
    ],
    correctAnswer: "B",
    explanation: "The matching principle states that expenses should be recognized in the same period as the revenues they helped generate."
  },
  {
    id: "Q010",
    section: "A",
    questionNumber: 10,
    type: "mcq",
    text: "A provision is:",
    marks: 2,
    options: [
      { id: "A", text: "A definite liability of uncertain amount" },
      { id: "B", text: "A possible liability that may or may not occur" },
      { id: "C", text: "An asset set aside for future use" },
      { id: "D", text: "A reserve from profits" }
    ],
    correctAnswer: "A",
    explanation: "A provision is a liability of uncertain timing or amount. It is recognized when there is a present obligation, probable outflow, and reliable estimate."
  },

  // Section B: Short Answer Questions (5 questions, 40 marks total)
  {
    id: "Q011",
    section: "B",
    questionNumber: 11,
    type: "short_answer",
    text: "ABC Ltd has current assets of ₦500,000 and current liabilities of ₦200,000. Calculate the current ratio and explain what it indicates about the company's liquidity position.",
    marks: 8,
    wordLimit: 150,
    keyPoints: [
      "Current Ratio = Current Assets ÷ Current Liabilities",
      "Current Ratio = ₦500,000 ÷ ₦200,000 = 2.5:1",
      "A ratio of 2.5:1 indicates good liquidity",
      "Company can pay current liabilities 2.5 times from current assets",
      "Generally, ratio above 1.5 is considered healthy"
    ]
  },
  {
    id: "Q012",
    section: "B",
    questionNumber: 12,
    type: "short_answer",
    text: "Distinguish between capital expenditure and revenue expenditure with TWO examples each.",
    marks: 8,
    wordLimit: 150,
    keyPoints: [
      "Capital expenditure: Benefits multiple periods, adds to asset value",
      "Examples: Purchase of machinery, building construction",
      "Revenue expenditure: Benefits current period only, maintains assets",
      "Examples: Repairs and maintenance, electricity bills",
      "Capital exp. capitalized; Revenue exp. charged to P&L"
    ]
  },
  {
    id: "Q013",
    section: "B",
    questionNumber: 13,
    type: "short_answer",
    text: "List and briefly explain THREE qualities of good accounting information.",
    marks: 6,
    wordLimit: 120,
    keyPoints: [
      "Relevance: Information must be useful for decision-making",
      "Reliability: Information must be accurate and verifiable",
      "Comparability: Can be compared across periods and entities",
      "Other acceptable: Understandability, Timeliness, Completeness"
    ]
  },
  {
    id: "Q014",
    section: "B",
    questionNumber: 14,
    type: "short_answer",
    text: "Explain the concept of 'going concern' and its importance in financial reporting.",
    marks: 10,
    wordLimit: 200,
    keyPoints: [
      "Going concern assumes business will continue for foreseeable future",
      "Assets valued at cost, not liquidation value",
      "Depreciation charged systematically over useful life",
      "If not going concern, assets must be valued at net realizable value",
      "Management must assess going concern status annually"
    ]
  },
  {
    id: "Q015",
    section: "B",
    questionNumber: 15,
    type: "short_answer",
    text: "Prepare a bank reconciliation statement for XYZ Company given: Bank statement balance ₦50,000, Outstanding checks ₦8,000, Deposits in transit ₦12,000, Bank charges ₦500 not recorded.",
    marks: 8,
    wordLimit: 100,
    keyPoints: [
      "Bank statement balance: ₦50,000",
      "Add: Deposits in transit: ₦12,000",
      "Less: Outstanding checks: (₦8,000)",
      "Adjusted bank balance: ₦54,000",
      "Book balance needs adjustment for bank charges"
    ]
  }
];

// Function to get questions by section
export function getQuestionsBySection(section: 'A' | 'B' | 'C') {
  return mockExamQuestions.filter(q => q.section === section);
}

// Function to calculate score for MCQs
export function calculateMCQScore(answers: Record<string, string>): { score: number; total: number; breakdown: any[] } {
  const mcqQuestions = mockExamQuestions.filter(q => q.type === 'mcq');
  let score = 0;
  const breakdown = mcqQuestions.map(q => {
    const isCorrect = answers[q.id] === q.correctAnswer;
    if (isCorrect) score += q.marks;
    
    return {
      questionId: q.id,
      questionNumber: q.questionNumber,
      correct: isCorrect,
      userAnswer: answers[q.id],
      correctAnswer: q.correctAnswer,
      marks: isCorrect ? q.marks : 0,
      totalMarks: q.marks
    };
  });

  return {
    score,
    total: mcqQuestions.reduce((sum, q) => sum + q.marks, 0),
    breakdown
  };
}

// Get exam statistics
export function getExamStats() {
  const sectionA = mockExamQuestions.filter(q => q.section === 'A');
  const sectionB = mockExamQuestions.filter(q => q.section === 'B');
  
  return {
    totalQuestions: mockExamQuestions.length,
    sectionA: {
      count: sectionA.length,
      marks: sectionA.reduce((sum, q) => sum + q.marks, 0)
    },
    sectionB: {
      count: sectionB.length,
      marks: sectionB.reduce((sum, q) => sum + q.marks, 0)
    },
    totalMarks: mockExamQuestions.reduce((sum, q) => sum + q.marks, 0)
  };
}
