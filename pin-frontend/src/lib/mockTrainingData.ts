// Mock data for Training/Instructor Portal

export interface TrainingClass {
  id: string;
  title: string;
  course: string;
  programme: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  type: 'in-person' | 'online' | 'hybrid';
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  studentsEnrolled: number;
  maxCapacity: number;
  meetingLink?: string;
}

export interface TrainingEnrollment {
  id: string;
  programmeName: string;
  customProgrammeName?: string;
  organisation: string;
  mode: 'weekday' | 'weekend' | 'online' | 'corporate';
  modeDisplay: string;
  startDate: string;
  endDate: string;
  venue: string;
  status: 'pending' | 'confirmed' | 'attended' | 'cancelled';
  statusDisplay: string;
  certificateIssued: boolean;
  completionPercentage: number;
  totalFees: number;
  amountPaid: number;
  balance: number;
}

export interface TrainingMaterial {
  id: string;
  title: string;
  course: string;
  programme: string;
  uploadedBy: string;
  uploadDate: string;
  type: 'pdf' | 'video' | 'slides' | 'document';
  fileSize: string;
  downloadUrl: string;
}

export interface StudentProgress {
  id: string;
  studentName: string;
  email: string;
  course: string;
  attendance: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  averageScore: number;
  status: 'active' | 'inactive' | 'completed';
}

// Mock Training Classes (for instructors)
export const mockTrainingClasses: TrainingClass[] = [
  {
    id: 'TC001',
    title: 'Financial Accounting Fundamentals',
    course: 'Financial Accounting',
    programme: 'ICAN Foundation',
    date: '2024-07-15',
    startTime: '09:00',
    endTime: '12:00',
    venue: 'PIN Training Centre, Lagos',
    type: 'in-person',
    status: 'upcoming',
    studentsEnrolled: 28,
    maxCapacity: 35,
  },
  {
    id: 'TC002',
    title: 'Advanced Taxation Workshop',
    course: 'Taxation',
    programme: 'ICAN Professional',
    date: '2024-07-16',
    startTime: '14:00',
    endTime: '17:00',
    venue: 'Online via Zoom',
    type: 'online',
    status: 'upcoming',
    studentsEnrolled: 45,
    maxCapacity: 50,
    meetingLink: 'https://zoom.us/j/123456789',
  },
  {
    id: 'TC003',
    title: 'Corporate Finance Essentials',
    course: 'Corporate Finance',
    programme: 'Corporate Training',
    date: '2024-07-10',
    startTime: '10:00',
    endTime: '16:00',
    venue: 'Client Office, Victoria Island',
    type: 'in-person',
    status: 'completed',
    studentsEnrolled: 15,
    maxCapacity: 20,
  },
  {
    id: 'TC004',
    title: 'Internal Audit Standards',
    course: 'Auditing',
    programme: 'ICAN Professional',
    date: '2024-07-12',
    startTime: '09:00',
    endTime: '13:00',
    venue: 'PIN Training Centre, Abuja',
    type: 'hybrid',
    status: 'completed',
    studentsEnrolled: 32,
    maxCapacity: 40,
    meetingLink: 'https://meet.google.com/abc-defg-hij',
  },
];

// Mock Enrollments (for corporate training participants)
export const mockEnrollments: TrainingEnrollment[] = [
  {
    id: 'EN001',
    programmeName: 'ICAN Professional Level',
    organisation: 'Individual',
    mode: 'weekend',
    modeDisplay: 'Weekend Classes',
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    venue: 'PIN Training Centre, Lagos',
    status: 'confirmed',
    statusDisplay: 'Confirmed',
    certificateIssued: false,
    completionPercentage: 65,
    totalFees: 850000,
    amountPaid: 600000,
    balance: 250000,
  },
  {
    id: 'EN002',
    programmeName: 'Financial Management for Executives',
    customProgrammeName: 'Executive Finance Program',
    organisation: 'ABC Corporation Ltd',
    mode: 'corporate',
    modeDisplay: 'Corporate Training',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    venue: 'ABC Corp HQ, Victoria Island',
    status: 'attended',
    statusDisplay: 'Attended',
    certificateIssued: true,
    completionPercentage: 100,
    totalFees: 500000,
    amountPaid: 500000,
    balance: 0,
  },
  {
    id: 'EN003',
    programmeName: 'IFRS Certification Course',
    organisation: 'XYZ Financial Services',
    mode: 'online',
    modeDisplay: 'Online Learning',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    venue: 'Online Platform',
    status: 'confirmed',
    statusDisplay: 'In Progress',
    certificateIssued: false,
    completionPercentage: 45,
    totalFees: 350000,
    amountPaid: 350000,
    balance: 0,
  },
];

// Mock Training Materials
export const mockTrainingMaterials: TrainingMaterial[] = [
  {
    id: 'MAT001',
    title: 'Introduction to Financial Accounting',
    course: 'Financial Accounting',
    programme: 'ICAN Foundation',
    uploadedBy: 'Dr. Adebayo Johnson',
    uploadDate: '2024-07-01',
    type: 'pdf',
    fileSize: '2.5 MB',
    downloadUrl: '#',
  },
  {
    id: 'MAT002',
    title: 'Taxation Case Studies',
    course: 'Taxation',
    programme: 'ICAN Professional',
    uploadedBy: 'Mrs. Ngozi Okafor',
    uploadDate: '2024-07-05',
    type: 'pdf',
    fileSize: '4.1 MB',
    downloadUrl: '#',
  },
  {
    id: 'MAT003',
    title: 'Corporate Finance Lecture Recording',
    course: 'Corporate Finance',
    programme: 'Corporate Training',
    uploadedBy: 'Prof. Emeka Nwosu',
    uploadDate: '2024-06-28',
    type: 'video',
    fileSize: '156 MB',
    downloadUrl: '#',
  },
  {
    id: 'MAT004',
    title: 'Audit Standards Presentation',
    course: 'Auditing',
    programme: 'ICAN Professional',
    uploadedBy: 'Dr. Adebayo Johnson',
    uploadDate: '2024-07-03',
    type: 'slides',
    fileSize: '8.3 MB',
    downloadUrl: '#',
  },
];

// Mock Student Progress (for instructors)
export const mockStudentProgress: StudentProgress[] = [
  {
    id: 'SP001',
    studentName: 'Chioma Adeleke',
    email: 'chioma.adeleke@email.com',
    course: 'Financial Accounting',
    attendance: 95,
    assignmentsSubmitted: 8,
    totalAssignments: 10,
    averageScore: 87,
    status: 'active',
  },
  {
    id: 'SP002',
    studentName: 'Tunde Bakare',
    email: 'tunde.bakare@email.com',
    course: 'Taxation',
    attendance: 88,
    assignmentsSubmitted: 7,
    totalAssignments: 10,
    averageScore: 76,
    status: 'active',
  },
  {
    id: 'SP003',
    studentName: 'Amina Mohammed',
    email: 'amina.mohammed@email.com',
    course: 'Corporate Finance',
    attendance: 100,
    assignmentsSubmitted: 10,
    totalAssignments: 10,
    averageScore: 92,
    status: 'completed',
  },
  {
    id: 'SP004',
    studentName: 'Oluwaseun Peters',
    email: 'seun.peters@email.com',
    course: 'Auditing',
    attendance: 72,
    assignmentsSubmitted: 5,
    totalAssignments: 10,
    averageScore: 65,
    status: 'active',
  },
];

// Statistics
export const getTrainingStats = () => {
  const totalClasses = mockTrainingClasses.length;
  const upcomingClasses = mockTrainingClasses.filter(c => c.status === 'upcoming').length;
  const completedClasses = mockTrainingClasses.filter(c => c.status === 'completed').length;
  const totalStudents = mockStudentProgress.length;
  const activeStudents = mockStudentProgress.filter(s => s.status === 'active').length;
  const averageAttendance = Math.round(
    mockStudentProgress.reduce((sum, s) => sum + s.attendance, 0) / mockStudentProgress.length
  );
  const averageScore = Math.round(
    mockStudentProgress.reduce((sum, s) => sum + s.averageScore, 0) / mockStudentProgress.length
  );

  return {
    totalClasses,
    upcomingClasses,
    completedClasses,
    totalStudents,
    activeStudents,
    averageAttendance,
    averageScore,
  };
};

export const getEnrollmentStats = () => {
  const totalEnrollments = mockEnrollments.length;
  const activeEnrollments = mockEnrollments.filter(e => e.status === 'confirmed').length;
  const certificatesEarned = mockEnrollments.filter(e => e.certificateIssued).length;
  const totalFees = mockEnrollments.reduce((sum, e) => sum + e.totalFees, 0);
  const totalPaid = mockEnrollments.reduce((sum, e) => sum + e.amountPaid, 0);
  const totalBalance = mockEnrollments.reduce((sum, e) => sum + e.balance, 0);

  return {
    totalEnrollments,
    activeEnrollments,
    certificatesEarned,
    totalFees,
    totalPaid,
    totalBalance,
  };
};
