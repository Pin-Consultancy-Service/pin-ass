// Mock study materials data - TODO: Replace with API call to /api/students/me/materials

export interface MaterialFile {
  id: string;
  name: string;
  type: 'pdf' | 'pptx' | 'docx' | 'xlsx' | 'video' | 'link';
  size: string;
  uploadedDate: string;
  downloadUrl: string;
  thumbnail?: string;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  courseName: string;
  subject: string;
  week: number;
  topic: string;
  description?: string;
  instructor: string;
  uploadedDate: string;
  files: MaterialFile[];
}

export const mockMaterials: CourseMaterial[] = [
  {
    id: "MAT001",
    courseId: "FIN_ACC_001",
    courseName: "Financial Accounting",
    subject: "Financial Accounting",
    week: 1,
    topic: "Introduction to Financial Statements",
    description: "Basic concepts of financial accounting and statement preparation",
    instructor: "Dr. Adebayo Johnson",
    uploadedDate: "2026-09-15",
    files: [
      {
        id: "FILE001",
        name: "Week_1_Introduction_Slides.pdf",
        type: "pdf",
        size: "2.4 MB",
        uploadedDate: "2026-09-15",
        downloadUrl: "#"
      },
      {
        id: "FILE002",
        name: "Financial_Statements_Notes.docx",
        type: "docx",
        size: "890 KB",
        uploadedDate: "2026-09-15",
        downloadUrl: "#"
      },
      {
        id: "FILE003",
        name: "Practice_Exercises_Week1.pdf",
        type: "pdf",
        size: "1.1 MB",
        uploadedDate: "2026-09-15",
        downloadUrl: "#"
      }
    ]
  },
  {
    id: "MAT002",
    courseId: "FIN_ACC_001",
    courseName: "Financial Accounting",
    subject: "Financial Accounting",
    week: 2,
    topic: "Balance Sheet Preparation",
    description: "Understanding and preparing balance sheets",
    instructor: "Dr. Adebayo Johnson",
    uploadedDate: "2026-09-22",
    files: [
      {
        id: "FILE004",
        name: "Week_2_Balance_Sheet_Slides.pdf",
        type: "pdf",
        size: "3.2 MB",
        uploadedDate: "2026-09-22",
        downloadUrl: "#"
      },
      {
        id: "FILE005",
        name: "Balance_Sheet_Examples.xlsx",
        type: "xlsx",
        size: "450 KB",
        uploadedDate: "2026-09-22",
        downloadUrl: "#"
      }
    ]
  },
  {
    id: "MAT003",
    courseId: "FIN_ACC_001",
    courseName: "Financial Accounting",
    subject: "Financial Accounting",
    week: 5,
    topic: "Consolidation of Financial Statements",
    description: "Advanced consolidation techniques",
    instructor: "Anthony Babatunde",
    uploadedDate: "2026-10-15",
    files: [
      {
        id: "FILE006",
        name: "Week_5_Consolidation_Slides.pdf",
        type: "pdf",
        size: "2.8 MB",
        uploadedDate: "2026-10-15",
        downloadUrl: "#"
      },
      {
        id: "FILE007",
        name: "Consolidation_Workbook.xlsx",
        type: "xlsx",
        size: "1.5 MB",
        uploadedDate: "2026-10-15",
        downloadUrl: "#"
      }
    ]
  },
  {
    id: "MAT004",
    courseId: "TAX_001",
    courseName: "Taxation",
    subject: "Taxation",
    week: 1,
    topic: "Introduction to Nigerian Tax System",
    description: "Overview of taxation in Nigeria",
    instructor: "Prof. Fatima Bello",
    uploadedDate: "2026-09-20",
    files: [
      {
        id: "FILE008",
        name: "Taxation_Week1_Overview.pdf",
        type: "pdf",
        size: "1.9 MB",
        uploadedDate: "2026-09-20",
        downloadUrl: "#"
      },
      {
        id: "FILE009",
        name: "Tax_Laws_Summary.docx",
        type: "docx",
        size: "650 KB",
        uploadedDate: "2026-09-20",
        downloadUrl: "#"
      }
    ]
  },
  {
    id: "MAT005",
    courseId: "TAX_001",
    courseName: "Taxation",
    subject: "Taxation",
    week: 2,
    topic: "Personal Income Tax - PAYE System",
    description: "Understanding PAYE calculations and compliance",
    instructor: "Prof. Fatima Bello",
    uploadedDate: "2026-10-08",
    files: [
      {
        id: "FILE010",
        name: "PAYE_System_Slides.pdf",
        type: "pdf",
        size: "2.1 MB",
        uploadedDate: "2026-10-08",
        downloadUrl: "#"
      },
      {
        id: "FILE011",
        name: "PAYE_Calculation_Examples.xlsx",
        type: "xlsx",
        size: "850 KB",
        uploadedDate: "2026-10-08",
        downloadUrl: "#"
      },
      {
        id: "FILE012",
        name: "Tax_Tables_2024.pdf",
        type: "pdf",
        size: "450 KB",
        uploadedDate: "2026-10-08",
        downloadUrl: "#"
      }
    ]
  },
  {
    id: "MAT006",
    courseId: "AUD_001",
    courseName: "Auditing",
    subject: "Auditing",
    week: 1,
    topic: "Introduction to Auditing",
    description: "Fundamentals of auditing principles",
    instructor: "Dr. Aisha Mohammed",
    uploadedDate: "2026-09-25",
    files: [
      {
        id: "FILE013",
        name: "Auditing_Intro_Slides.pdf",
        type: "pdf",
        size: "2.3 MB",
        uploadedDate: "2026-09-25",
        downloadUrl: "#"
      },
      {
        id: "FILE014",
        name: "Audit_Framework_Guide.pdf",
        type: "pdf",
        size: "1.8 MB",
        uploadedDate: "2026-09-25",
        downloadUrl: "#"
      }
    ]
  }
];

// Utility functions
export function getMaterialsBySubject(subject?: string) {
  if (!subject) return mockMaterials;
  return mockMaterials.filter(m => m.subject === subject);
}

export function getMaterialsByWeek(week: number) {
  return mockMaterials.filter(m => m.week === week);
}

export function getUniqueSubjects() {
  return Array.from(new Set(mockMaterials.map(m => m.subject)));
}

export function getTotalFiles() {
  return mockMaterials.reduce((total, material) => total + material.files.length, 0);
}

export function getFileIcon(type: MaterialFile['type']) {
  const icons = {
    pdf: '📄',
    pptx: '📊',
    docx: '📝',
    xlsx: '📈',
    video: '🎥',
    link: '🔗'
  };
  return icons[type] || '📎';
}

export function formatFileSize(size: string) {
  return size;
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
