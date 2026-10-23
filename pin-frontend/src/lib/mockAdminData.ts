// Mock data for Admin CRM Portal

export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
  last_login: string;
}

export interface SystemUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: 'student' | 'instructor' | 'admin';
  status: 'active' | 'inactive';
  date_joined: string;
  last_active?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  programme: string;
  duration: string;
  description: string;
  instructors: string[];
  studentsEnrolled: number;
  status: 'active' | 'archived';
}

export interface AdminClass {
  id: string;
  courseId: string;
  courseName: string;
  instructorId: string;
  instructorName: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  type: 'in-person' | 'online' | 'hybrid';
  capacity: number;
  enrolled: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  programmeId: string;
  programmeName: string;
  enrollmentDate: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  progress: number;
  totalFees: number;
  amountPaid: number;
  balance: number;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  programmeName: string;
  amount: number;
  paymentDate: string;
  method: 'cash' | 'transfer' | 'card' | 'cheque';
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  details: string;
}

export interface SystemStats {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalAdmins: number;
  activeUsers: number;
  totalRevenue: number;
  outstandingBalance: number;
  totalEnrollments: number;
  activeClasses: number;
  completedClasses: number;
  upcomingClasses: number;
  newUsersThisMonth: number;
  revenueThisMonth: number;
}

// Mock System Users
export const mockSystemUsers: SystemUser[] = [
  // Students
  { id: 'STU001', first_name: 'Chioma', last_name: 'Adeleke', email: 'chioma.adeleke@email.com', phone_number: '+234 803 456 7890', role: 'student', status: 'active', date_joined: '2024-01-15', last_active: '2024-07-14' },
  { id: 'STU002', first_name: 'Tunde', last_name: 'Bakare', email: 'tunde.bakare@email.com', phone_number: '+234 805 234 5678', role: 'student', status: 'active', date_joined: '2024-01-20', last_active: '2024-07-13' },
  { id: 'STU003', first_name: 'Amina', last_name: 'Mohammed', email: 'amina.mohammed@email.com', phone_number: '+234 807 345 6789', role: 'student', status: 'active', date_joined: '2024-02-01', last_active: '2024-07-14' },
  { id: 'STU004', first_name: 'Oluwaseun', last_name: 'Peters', email: 'seun.peters@email.com', phone_number: '+234 809 456 7890', role: 'student', status: 'active', date_joined: '2024-02-10', last_active: '2024-07-12' },
  { id: 'STU005', first_name: 'Blessing', last_name: 'Okonkwo', email: 'blessing.okonkwo@email.com', phone_number: '+234 810 567 8901', role: 'student', status: 'active', date_joined: '2024-02-15', last_active: '2024-07-14' },
  { id: 'STU006', first_name: 'Ibrahim', last_name: 'Yusuf', email: 'ibrahim.yusuf@email.com', phone_number: '+234 812 678 9012', role: 'student', status: 'inactive', date_joined: '2024-03-01', last_active: '2024-06-20' },
  { id: 'STU007', first_name: 'Chiamaka', last_name: 'Nwosu', email: 'chiamaka.nwosu@email.com', phone_number: '+234 813 789 0123', role: 'student', status: 'active', date_joined: '2024-03-05', last_active: '2024-07-14' },
  { id: 'STU008', first_name: 'Taiwo', last_name: 'Adeyemi', email: 'taiwo.adeyemi@email.com', phone_number: '+234 814 890 1234', role: 'student', status: 'active', date_joined: '2024-03-10', last_active: '2024-07-13' },
  { id: 'STU009', first_name: 'Fatima', last_name: 'Abubakar', email: 'fatima.abubakar@email.com', phone_number: '+234 815 901 2345', role: 'student', status: 'active', date_joined: '2024-03-15', last_active: '2024-07-14' },
  { id: 'STU010', first_name: 'Chinedu', last_name: 'Okafor', email: 'chinedu.okafor@email.com', phone_number: '+234 816 012 3456', role: 'student', status: 'active', date_joined: '2024-04-01', last_active: '2024-07-14' },
  { id: 'STU011', first_name: 'Aisha', last_name: 'Hassan', email: 'aisha.hassan@email.com', phone_number: '+234 817 123 4567', role: 'student', status: 'active', date_joined: '2024-04-10', last_active: '2024-07-13' },
  { id: 'STU012', first_name: 'Emeka', last_name: 'Eze', email: 'emeka.eze@email.com', phone_number: '+234 818 234 5678', role: 'student', status: 'inactive', date_joined: '2024-04-15', last_active: '2024-06-25' },
  { id: 'STU013', first_name: 'Ngozi', last_name: 'Okoro', email: 'ngozi.okoro@email.com', phone_number: '+234 819 345 6789', role: 'student', status: 'active', date_joined: '2024-05-01', last_active: '2024-07-14' },
  { id: 'STU014', first_name: 'Yusuf', last_name: 'Ibrahim', email: 'yusuf.ibrahim@email.com', phone_number: '+234 820 456 7890', role: 'student', status: 'active', date_joined: '2024-05-10', last_active: '2024-07-12' },

  // Instructors
  { id: 'INS001', first_name: 'Adebayo', last_name: 'Johnson', email: 'adebayo.johnson@pinassociate.com', phone_number: '+234 802 111 2222', role: 'instructor', status: 'active', date_joined: '2023-06-01', last_active: '2024-07-14' },
  { id: 'INS002', first_name: 'Ngozi', last_name: 'Okafor', email: 'ngozi.okafor@pinassociate.com', phone_number: '+234 802 333 4444', role: 'instructor', status: 'active', date_joined: '2023-06-15', last_active: '2024-07-13' },
  { id: 'INS003', first_name: 'Emeka', last_name: 'Nwosu', email: 'emeka.nwosu@pinassociate.com', phone_number: '+234 802 555 6666', role: 'instructor', status: 'active', date_joined: '2023-07-01', last_active: '2024-07-14' },
  { id: 'INS004', first_name: 'Folake', last_name: 'Adewale', email: 'folake.adewale@pinassociate.com', phone_number: '+234 802 777 8888', role: 'instructor', status: 'active', date_joined: '2023-08-01', last_active: '2024-07-13' },

  // Admins
  { id: 'ADM001', first_name: 'Super', last_name: 'Admin', email: 'admin@pinassociate.com', phone_number: '+234 802 999 0000', role: 'admin', status: 'active', date_joined: '2023-01-01', last_active: '2024-07-14' },
  { id: 'ADM002', first_name: 'Mary', last_name: 'Ojo', email: 'mary.ojo@pinassociate.com', phone_number: '+234 802 888 7777', role: 'admin', status: 'active', date_joined: '2023-03-01', last_active: '2024-07-14' },
];

// Mock Courses
export const mockCourses: Course[] = [
  // ICAN Foundation
  { id: 'CRS001', code: 'FAC', name: 'Financial Accounting', programme: 'ICAN Foundation', duration: '12 weeks', description: 'Introduction to financial accounting principles', instructors: ['Dr. Adebayo Johnson'], studentsEnrolled: 45, status: 'active' },
  { id: 'CRS002', code: 'MGT', name: 'Management', programme: 'ICAN Foundation', duration: '10 weeks', description: 'Basic management concepts and practices', instructors: ['Mrs. Ngozi Okafor'], studentsEnrolled: 38, status: 'active' },
  { id: 'CRS003', code: 'BUS', name: 'Business Law', programme: 'ICAN Foundation', duration: '8 weeks', description: 'Introduction to business and corporate law', instructors: ['Prof. Emeka Nwosu'], studentsEnrolled: 42, status: 'active' },
  { id: 'CRS004', code: 'ECO', name: 'Economics', programme: 'ICAN Foundation', duration: '10 weeks', description: 'Micro and macroeconomics fundamentals', instructors: ['Dr. Folake Adewale'], studentsEnrolled: 35, status: 'active' },

  // ICAN Professional
  { id: 'CRS005', code: 'AFA', name: 'Advanced Financial Accounting', programme: 'ICAN Professional', duration: '14 weeks', description: 'Complex financial accounting standards', instructors: ['Dr. Adebayo Johnson'], studentsEnrolled: 32, status: 'active' },
  { id: 'CRS006', code: 'TAX', name: 'Taxation', programme: 'ICAN Professional', duration: '12 weeks', description: 'Nigerian tax laws and practice', instructors: ['Mrs. Ngozi Okafor'], studentsEnrolled: 28, status: 'active' },
  { id: 'CRS007', code: 'AUD', name: 'Auditing & Assurance', programme: 'ICAN Professional', duration: '12 weeks', description: 'Audit standards and procedures', instructors: ['Prof. Emeka Nwosu'], studentsEnrolled: 30, status: 'active' },
  { id: 'CRS008', code: 'CFA', name: 'Corporate Finance', programme: 'ICAN Professional', duration: '10 weeks', description: 'Corporate financial management', instructors: ['Dr. Folake Adewale'], studentsEnrolled: 25, status: 'active' },

  // Corporate Training
  { id: 'CRS009', code: 'IFRS', name: 'IFRS for SMEs', programme: 'Corporate Training', duration: '5 days', description: 'International Financial Reporting Standards', instructors: ['Dr. Adebayo Johnson', 'Mrs. Ngozi Okafor'], studentsEnrolled: 20, status: 'active' },
  { id: 'CRS010', code: 'FME', name: 'Financial Management for Executives', programme: 'Corporate Training', duration: '3 days', description: 'Executive finance training', instructors: ['Prof. Emeka Nwosu'], studentsEnrolled: 15, status: 'active' },
  { id: 'CRS011', code: 'RMC', name: 'Risk Management & Compliance', programme: 'Corporate Training', duration: '4 days', description: 'Enterprise risk and compliance', instructors: ['Dr. Folake Adewale'], studentsEnrolled: 18, status: 'active' },
  { id: 'CRS012', code: 'BDA', name: 'Business Data Analytics', programme: 'Corporate Training', duration: '5 days', description: 'Data-driven decision making', instructors: ['Mrs. Ngozi Okafor', 'Prof. Emeka Nwosu'], studentsEnrolled: 22, status: 'active' },
];

// Mock Admin Classes
export const mockAdminClasses: AdminClass[] = [
  { id: 'CLS001', courseId: 'CRS001', courseName: 'Financial Accounting', instructorId: 'INS001', instructorName: 'Dr. Adebayo Johnson', date: '2024-07-16', startTime: '09:00', endTime: '12:00', venue: 'PIN Training Centre, Lagos', type: 'in-person', capacity: 50, enrolled: 45, status: 'upcoming' },
  { id: 'CLS002', courseId: 'CRS006', courseName: 'Taxation', instructorId: 'INS002', instructorName: 'Mrs. Ngozi Okafor', date: '2024-07-17', startTime: '14:00', endTime: '17:00', venue: 'Online via Zoom', type: 'online', capacity: 50, enrolled: 28, status: 'upcoming' },
  { id: 'CLS003', courseId: 'CRS008', courseName: 'Corporate Finance', instructorId: 'INS004', instructorName: 'Dr. Folake Adewale', date: '2024-07-16', startTime: '10:00', endTime: '13:00', venue: 'PIN Training Centre, Abuja', type: 'hybrid', capacity: 40, enrolled: 25, status: 'ongoing' },
  { id: 'CLS004', courseId: 'CRS002', courseName: 'Management', instructorId: 'INS002', instructorName: 'Mrs. Ngozi Okafor', date: '2024-07-10', startTime: '09:00', endTime: '12:00', venue: 'PIN Training Centre, Lagos', type: 'in-person', capacity: 45, enrolled: 38, status: 'completed' },
  { id: 'CLS005', courseId: 'CRS007', courseName: 'Auditing & Assurance', instructorId: 'INS003', instructorName: 'Prof. Emeka Nwosu', date: '2024-07-11', startTime: '14:00', endTime: '17:00', venue: 'Online via Google Meet', type: 'online', capacity: 50, enrolled: 30, status: 'completed' },
  { id: 'CLS006', courseId: 'CRS009', courseName: 'IFRS for SMEs', instructorId: 'INS001', instructorName: 'Dr. Adebayo Johnson', date: '2024-07-18', startTime: '09:00', endTime: '17:00', venue: 'Corporate Client Office, VI', type: 'in-person', capacity: 25, enrolled: 20, status: 'upcoming' },
  { id: 'CLS007', courseId: 'CRS003', courseName: 'Business Law', instructorId: 'INS003', instructorName: 'Prof. Emeka Nwosu', date: '2024-07-19', startTime: '10:00', endTime: '13:00', venue: 'PIN Training Centre, Lagos', type: 'in-person', capacity: 50, enrolled: 42, status: 'upcoming' },
  { id: 'CLS008', courseId: 'CRS010', courseName: 'Financial Management for Executives', instructorId: 'INS003', instructorName: 'Prof. Emeka Nwosu', date: '2024-07-12', startTime: '09:00', endTime: '16:00', venue: 'ABC Corp HQ, Victoria Island', type: 'in-person', capacity: 20, enrolled: 15, status: 'completed' },
  { id: 'CLS009', courseId: 'CRS005', courseName: 'Advanced Financial Accounting', instructorId: 'INS001', instructorName: 'Dr. Adebayo Johnson', date: '2024-07-20', startTime: '09:00', endTime: '12:00', venue: 'PIN Training Centre, Abuja', type: 'hybrid', capacity: 40, enrolled: 32, status: 'upcoming' },
  { id: 'CLS010', courseId: 'CRS004', courseName: 'Economics', instructorId: 'INS004', instructorName: 'Dr. Folake Adewale', date: '2024-07-21', startTime: '14:00', endTime: '17:00', venue: 'Online via Zoom', type: 'online', capacity: 50, enrolled: 35, status: 'upcoming' },
  { id: 'CLS011', courseId: 'CRS011', courseName: 'Risk Management & Compliance', instructorId: 'INS004', instructorName: 'Dr. Folake Adewale', date: '2024-07-22', startTime: '10:00', endTime: '16:00', venue: 'XYZ Financial Services, Lagos', type: 'in-person', capacity: 25, enrolled: 18, status: 'upcoming' },
  { id: 'CLS012', courseId: 'CRS012', courseName: 'Business Data Analytics', instructorId: 'INS002', instructorName: 'Mrs. Ngozi Okafor', date: '2024-07-23', startTime: '09:00', endTime: '17:00', venue: 'PIN Training Centre, Lagos', type: 'in-person', capacity: 30, enrolled: 22, status: 'upcoming' },
  { id: 'CLS013', courseId: 'CRS001', courseName: 'Financial Accounting', instructorId: 'INS001', instructorName: 'Dr. Adebayo Johnson', date: '2024-07-08', startTime: '09:00', endTime: '12:00', venue: 'PIN Training Centre, Lagos', type: 'in-person', capacity: 50, enrolled: 45, status: 'completed' },
  { id: 'CLS014', courseId: 'CRS006', courseName: 'Taxation', instructorId: 'INS002', instructorName: 'Mrs. Ngozi Okafor', date: '2024-07-09', startTime: '14:00', endTime: '17:00', venue: 'Online via Zoom', type: 'online', capacity: 50, enrolled: 28, status: 'completed' },
  { id: 'CLS015', courseId: 'CRS002', courseName: 'Management', instructorId: 'INS002', instructorName: 'Mrs. Ngozi Okafor', date: '2024-07-05', startTime: '10:00', endTime: '13:00', venue: 'PIN Training Centre, Abuja', type: 'hybrid', capacity: 45, enrolled: 38, status: 'completed' },
];

// Mock Enrollments
export const mockEnrollments: Enrollment[] = [
  { id: 'ENR001', studentId: 'STU001', studentName: 'Chioma Adeleke', programmeId: 'ICAN-PRO', programmeName: 'ICAN Professional', enrollmentDate: '2024-01-15', startDate: '2024-02-01', endDate: '2024-12-31', status: 'confirmed', paymentStatus: 'partial', progress: 65, totalFees: 350000, amountPaid: 250000, balance: 100000 },
  { id: 'ENR002', studentId: 'STU002', studentName: 'Tunde Bakare', programmeId: 'ICAN-FDN', programmeName: 'ICAN Foundation', enrollmentDate: '2024-01-20', startDate: '2024-02-05', endDate: '2024-08-31', status: 'confirmed', paymentStatus: 'paid', progress: 70, totalFees: 185000, amountPaid: 185000, balance: 0 },
  { id: 'ENR003', studentId: 'STU003', studentName: 'Amina Mohammed', programmeId: 'ICAN-PRO', programmeName: 'ICAN Professional', enrollmentDate: '2024-02-01', startDate: '2024-02-15', endDate: '2024-12-31', status: 'confirmed', paymentStatus: 'paid', progress: 72, totalFees: 350000, amountPaid: 350000, balance: 0 },
  { id: 'ENR004', studentId: 'STU004', studentName: 'Oluwaseun Peters', programmeId: 'ICAN-FDN', programmeName: 'ICAN Foundation', enrollmentDate: '2024-02-10', startDate: '2024-02-20', endDate: '2024-08-31', status: 'confirmed', paymentStatus: 'partial', progress: 60, totalFees: 185000, amountPaid: 100000, balance: 85000 },
  { id: 'ENR005', studentId: 'STU005', studentName: 'Blessing Okonkwo', programmeId: 'ICAN-PRO', programmeName: 'ICAN Professional', enrollmentDate: '2024-02-15', startDate: '2024-03-01', endDate: '2024-12-31', status: 'confirmed', paymentStatus: 'paid', progress: 68, totalFees: 350000, amountPaid: 350000, balance: 0 },
  { id: 'ENR006', studentId: 'STU006', studentName: 'Ibrahim Yusuf', programmeId: 'ICAN-FDN', programmeName: 'ICAN Foundation', enrollmentDate: '2024-03-01', startDate: '2024-03-10', endDate: '2024-09-30', status: 'pending', paymentStatus: 'unpaid', progress: 0, totalFees: 185000, amountPaid: 0, balance: 185000 },
  { id: 'ENR007', studentId: 'STU007', studentName: 'Chiamaka Nwosu', programmeId: 'ICAN-PRO', programmeName: 'ICAN Professional', enrollmentDate: '2024-03-05', startDate: '2024-03-15', endDate: '2024-12-31', status: 'confirmed', paymentStatus: 'partial', progress: 55, totalFees: 350000, amountPaid: 200000, balance: 150000 },
  { id: 'ENR008', studentId: 'STU008', studentName: 'Taiwo Adeyemi', programmeId: 'CORP-IFRS', programmeName: 'IFRS Certification', enrollmentDate: '2024-03-10', startDate: '2024-04-01', endDate: '2024-06-30', status: 'completed', paymentStatus: 'paid', progress: 100, totalFees: 120000, amountPaid: 120000, balance: 0 },
  { id: 'ENR009', studentId: 'STU009', studentName: 'Fatima Abubakar', programmeId: 'ICAN-FDN', programmeName: 'ICAN Foundation', enrollmentDate: '2024-03-15', startDate: '2024-04-01', endDate: '2024-10-31', status: 'confirmed', paymentStatus: 'paid', progress: 62, totalFees: 185000, amountPaid: 185000, balance: 0 },
  { id: 'ENR010', studentId: 'STU010', studentName: 'Chinedu Okafor', programmeId: 'ICAN-PRO', programmeName: 'ICAN Professional', enrollmentDate: '2024-04-01', startDate: '2024-04-15', endDate: '2024-12-31', status: 'confirmed', paymentStatus: 'partial', progress: 50, totalFees: 350000, amountPaid: 175000, balance: 175000 },
  { id: 'ENR011', studentId: 'STU011', studentName: 'Aisha Hassan', programmeId: 'CORP-FME', programmeName: 'Financial Management for Executives', enrollmentDate: '2024-04-10', startDate: '2024-05-01', endDate: '2024-05-15', status: 'completed', paymentStatus: 'paid', progress: 100, totalFees: 95000, amountPaid: 95000, balance: 0 },
  { id: 'ENR012', studentId: 'STU012', studentName: 'Emeka Eze', programmeId: 'ICAN-FDN', programmeName: 'ICAN Foundation', enrollmentDate: '2024-04-15', startDate: '2024-05-01', endDate: '2024-11-30', status: 'cancelled', paymentStatus: 'partial', progress: 15, totalFees: 185000, amountPaid: 50000, balance: 135000 },
  { id: 'ENR013', studentId: 'STU013', studentName: 'Ngozi Okoro', programmeId: 'ICAN-PRO', programmeName: 'ICAN Professional', enrollmentDate: '2024-05-01', startDate: '2024-05-15', endDate: '2024-12-31', status: 'confirmed', paymentStatus: 'paid', progress: 45, totalFees: 350000, amountPaid: 350000, balance: 0 },
  { id: 'ENR014', studentId: 'STU014', studentName: 'Yusuf Ibrahim', programmeId: 'ICAN-FDN', programmeName: 'ICAN Foundation', enrollmentDate: '2024-05-10', startDate: '2024-06-01', endDate: '2024-12-31', status: 'confirmed', paymentStatus: 'partial', progress: 40, totalFees: 185000, amountPaid: 100000, balance: 85000 },
  { id: 'ENR015', studentId: 'STU001', studentName: 'Chioma Adeleke', programmeId: 'CORP-RMC', programmeName: 'Risk Management & Compliance', enrollmentDate: '2024-06-01', startDate: '2024-06-15', endDate: '2024-07-15', status: 'confirmed', paymentStatus: 'paid', progress: 80, totalFees: 85000, amountPaid: 85000, balance: 0 },
  { id: 'ENR016', studentId: 'STU003', studentName: 'Amina Mohammed', programmeId: 'CORP-BDA', programmeName: 'Business Data Analytics', enrollmentDate: '2024-06-05', startDate: '2024-06-20', endDate: '2024-07-20', status: 'confirmed', paymentStatus: 'paid', progress: 75, totalFees: 90000, amountPaid: 90000, balance: 0 },
  { id: 'ENR017', studentId: 'STU005', studentName: 'Blessing Okonkwo', programmeId: 'CORP-IFRS', programmeName: 'IFRS Certification', enrollmentDate: '2024-06-10', startDate: '2024-07-01', endDate: '2024-09-30', status: 'confirmed', paymentStatus: 'partial', progress: 30, totalFees: 120000, amountPaid: 60000, balance: 60000 },
  { id: 'ENR018', studentId: 'STU007', studentName: 'Chiamaka Nwosu', programmeId: 'CORP-FME', programmeName: 'Financial Management for Executives', enrollmentDate: '2024-06-15', startDate: '2024-07-05', endDate: '2024-07-19', status: 'confirmed', paymentStatus: 'paid', progress: 50, totalFees: 95000, amountPaid: 95000, balance: 0 },
  { id: 'ENR019', studentId: 'STU009', studentName: 'Fatima Abubakar', programmeId: 'CORP-RMC', programmeName: 'Risk Management & Compliance', enrollmentDate: '2024-06-20', startDate: '2024-07-10', endDate: '2024-08-10', status: 'confirmed', paymentStatus: 'paid', progress: 25, totalFees: 85000, amountPaid: 85000, balance: 0 },
  { id: 'ENR020', studentId: 'STU013', studentName: 'Ngozi Okoro', programmeId: 'CORP-BDA', programmeName: 'Business Data Analytics', enrollmentDate: '2024-06-25', startDate: '2024-07-15', endDate: '2024-08-15', status: 'pending', paymentStatus: 'unpaid', progress: 0, totalFees: 90000, amountPaid: 0, balance: 90000 },
];

// Mock Payments
export const mockPayments: Payment[] = [
  { id: 'PAY001', studentId: 'STU001', studentName: 'Chioma Adeleke', enrollmentId: 'ENR001', programmeName: 'ICAN Professional', amount: 250000, paymentDate: '2024-01-20', method: 'transfer', status: 'completed', reference: 'TRF/2024/001' },
  { id: 'PAY002', studentId: 'STU002', studentName: 'Tunde Bakare', enrollmentId: 'ENR002', programmeName: 'ICAN Foundation', amount: 185000, paymentDate: '2024-01-25', method: 'card', status: 'completed', reference: 'CRD/2024/002' },
  { id: 'PAY003', studentId: 'STU003', studentName: 'Amina Mohammed', enrollmentId: 'ENR003', programmeName: 'ICAN Professional', amount: 350000, paymentDate: '2024-02-05', method: 'transfer', status: 'completed', reference: 'TRF/2024/003' },
  { id: 'PAY004', studentId: 'STU004', studentName: 'Oluwaseun Peters', enrollmentId: 'ENR004', programmeName: 'ICAN Foundation', amount: 100000, paymentDate: '2024-02-15', method: 'cash', status: 'completed', reference: 'CSH/2024/004' },
  { id: 'PAY005', studentId: 'STU005', studentName: 'Blessing Okonkwo', enrollmentId: 'ENR005', programmeName: 'ICAN Professional', amount: 350000, paymentDate: '2024-02-20', method: 'transfer', status: 'completed', reference: 'TRF/2024/005' },
  { id: 'PAY006', studentId: 'STU007', studentName: 'Chiamaka Nwosu', enrollmentId: 'ENR007', programmeName: 'ICAN Professional', amount: 200000, paymentDate: '2024-03-10', method: 'card', status: 'completed', reference: 'CRD/2024/006' },
  { id: 'PAY007', studentId: 'STU008', studentName: 'Taiwo Adeyemi', enrollmentId: 'ENR008', programmeName: 'IFRS Certification', amount: 120000, paymentDate: '2024-03-15', method: 'transfer', status: 'completed', reference: 'TRF/2024/007' },
  { id: 'PAY008', studentId: 'STU009', studentName: 'Fatima Abubakar', enrollmentId: 'ENR009', programmeName: 'ICAN Foundation', amount: 185000, paymentDate: '2024-03-20', method: 'cheque', status: 'completed', reference: 'CHQ/2024/008' },
  { id: 'PAY009', studentId: 'STU010', studentName: 'Chinedu Okafor', enrollmentId: 'ENR010', programmeName: 'ICAN Professional', amount: 175000, paymentDate: '2024-04-05', method: 'transfer', status: 'completed', reference: 'TRF/2024/009' },
  { id: 'PAY010', studentId: 'STU011', studentName: 'Aisha Hassan', enrollmentId: 'ENR011', programmeName: 'Financial Management for Executives', amount: 95000, paymentDate: '2024-04-15', method: 'card', status: 'completed', reference: 'CRD/2024/010' },
  { id: 'PAY011', studentId: 'STU012', studentName: 'Emeka Eze', enrollmentId: 'ENR012', programmeName: 'ICAN Foundation', amount: 50000, paymentDate: '2024-04-20', method: 'cash', status: 'completed', reference: 'CSH/2024/011' },
  { id: 'PAY012', studentId: 'STU013', studentName: 'Ngozi Okoro', enrollmentId: 'ENR013', programmeName: 'ICAN Professional', amount: 350000, paymentDate: '2024-05-05', method: 'transfer', status: 'completed', reference: 'TRF/2024/012' },
  { id: 'PAY013', studentId: 'STU014', studentName: 'Yusuf Ibrahim', enrollmentId: 'ENR014', programmeName: 'ICAN Foundation', amount: 100000, paymentDate: '2024-05-15', method: 'card', status: 'completed', reference: 'CRD/2024/013' },
  { id: 'PAY014', studentId: 'STU001', studentName: 'Chioma Adeleke', enrollmentId: 'ENR015', programmeName: 'Risk Management & Compliance', amount: 85000, paymentDate: '2024-06-05', method: 'transfer', status: 'completed', reference: 'TRF/2024/014' },
  { id: 'PAY015', studentId: 'STU003', studentName: 'Amina Mohammed', enrollmentId: 'ENR016', programmeName: 'Business Data Analytics', amount: 90000, paymentDate: '2024-06-10', method: 'transfer', status: 'completed', reference: 'TRF/2024/015' },
  { id: 'PAY016', studentId: 'STU005', studentName: 'Blessing Okonkwo', enrollmentId: 'ENR017', programmeName: 'IFRS Certification', amount: 60000, paymentDate: '2024-06-15', method: 'card', status: 'completed', reference: 'CRD/2024/016' },
  { id: 'PAY017', studentId: 'STU007', studentName: 'Chiamaka Nwosu', enrollmentId: 'ENR018', programmeName: 'Financial Management for Executives', amount: 95000, paymentDate: '2024-06-20', method: 'transfer', status: 'completed', reference: 'TRF/2024/017' },
  { id: 'PAY018', studentId: 'STU009', studentName: 'Fatima Abubakar', enrollmentId: 'ENR019', programmeName: 'Risk Management & Compliance', amount: 85000, paymentDate: '2024-06-25', method: 'transfer', status: 'completed', reference: 'TRF/2024/018' },
  { id: 'PAY019', studentId: 'STU006', studentName: 'Ibrahim Yusuf', enrollmentId: 'ENR006', programmeName: 'ICAN Foundation', amount: 50000, paymentDate: '2024-07-01', method: 'cash', status: 'pending', reference: 'CSH/2024/019' },
  { id: 'PAY020', studentId: 'STU013', studentName: 'Ngozi Okoro', enrollmentId: 'ENR020', programmeName: 'Business Data Analytics', amount: 45000, paymentDate: '2024-07-05', method: 'transfer', status: 'pending', reference: 'TRF/2024/020' },
];

// Mock Activity Logs
export const mockActivityLogs: ActivityLog[] = [
  { id: 'ACT001', userId: 'ADM001', userName: 'Super Admin', action: 'Created enrollment', entity: 'enrollment', entityId: 'ENR020', timestamp: '2024-07-14T10:30:00', details: 'New enrollment for Ngozi Okoro in Business Data Analytics' },
  { id: 'ACT002', userId: 'INS002', userName: 'Mrs. Ngozi Okafor', action: 'Updated class', entity: 'class', entityId: 'CLS012', timestamp: '2024-07-14T09:15:00', details: 'Changed class venue to PIN Training Centre, Lagos' },
  { id: 'ACT003', userId: 'ADM002', userName: 'Mary Ojo', action: 'Approved payment', entity: 'payment', entityId: 'PAY018', timestamp: '2024-07-13T16:45:00', details: 'Payment of ₦85,000 approved for Fatima Abubakar' },
  { id: 'ACT004', userId: 'STU007', userName: 'Chiamaka Nwosu', action: 'Enrolled in course', entity: 'enrollment', entityId: 'ENR018', timestamp: '2024-07-13T14:20:00', details: 'Self-enrolled in Financial Management for Executives' },
  { id: 'ACT005', userId: 'INS001', userName: 'Dr. Adebayo Johnson', action: 'Uploaded material', entity: 'material', entityId: 'MAT015', timestamp: '2024-07-13T11:30:00', details: 'Uploaded lecture notes for Financial Accounting' },
  { id: 'ACT006', userId: 'ADM001', userName: 'Super Admin', action: 'Created user', entity: 'user', entityId: 'STU014', timestamp: '2024-07-12T15:00:00', details: 'New student account created for Yusuf Ibrahim' },
  { id: 'ACT007', userId: 'INS003', userName: 'Prof. Emeka Nwosu', action: 'Completed class', entity: 'class', entityId: 'CLS008', timestamp: '2024-07-12T16:00:00', details: 'Marked Financial Management for Executives class as completed' },
  { id: 'ACT008', userId: 'ADM002', userName: 'Mary Ojo', action: 'Updated course', entity: 'course', entityId: 'CRS012', timestamp: '2024-07-11T13:45:00', details: 'Updated course description for Business Data Analytics' },
  { id: 'ACT009', userId: 'STU005', userName: 'Blessing Okonkwo', action: 'Made payment', entity: 'payment', entityId: 'PAY016', timestamp: '2024-07-11T10:20:00', details: 'Partial payment of ₦60,000 for IFRS Certification' },
  { id: 'ACT010', userId: 'INS004', userName: 'Dr. Folake Adewale', action: 'Scheduled class', entity: 'class', entityId: 'CLS011', timestamp: '2024-07-10T09:00:00', details: 'Scheduled Risk Management & Compliance class for July 22' },
];

// Utility Functions
export const getSystemStats = (): SystemStats => {
  const students = mockSystemUsers.filter(u => u.role === 'student');
  const instructors = mockSystemUsers.filter(u => u.role === 'instructor');
  const admins = mockSystemUsers.filter(u => u.role === 'admin');
  
  const totalRevenue = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const outstandingBalance = mockEnrollments
    .reduce((sum, e) => sum + e.balance, 0);
  
  const revenueThisMonth = mockPayments
    .filter(p => p.status === 'completed' && p.paymentDate.startsWith('2024-07'))
    .reduce((sum, p) => sum + p.amount, 0);
  
  const newUsersThisMonth = mockSystemUsers
    .filter(u => u.date_joined.startsWith('2024-07')).length;

  return {
    totalUsers: mockSystemUsers.length,
    totalStudents: students.length,
    totalInstructors: instructors.length,
    totalAdmins: admins.length,
    activeUsers: mockSystemUsers.filter(u => u.status === 'active').length,
    totalRevenue,
    outstandingBalance,
    totalEnrollments: mockEnrollments.length,
    activeClasses: mockAdminClasses.filter(c => c.status === 'upcoming' || c.status === 'ongoing').length,
    completedClasses: mockAdminClasses.filter(c => c.status === 'completed').length,
    upcomingClasses: mockAdminClasses.filter(c => c.status === 'upcoming').length,
    newUsersThisMonth,
    revenueThisMonth,
  };
};

export const getRecentActivity = (limit = 10): ActivityLog[] => {
  return mockActivityLogs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

export const getUsersByRole = (role: 'student' | 'instructor' | 'admin'): SystemUser[] => {
  return mockSystemUsers.filter(u => u.role === role);
};

export const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG')}`;
};

// Chart Data Generators
export const getRevenueChartData = () => {
  return [
    { label: 'Jan', value: 450000 },
    { label: 'Feb', value: 520000 },
    { label: 'Mar', value: 480000 },
    { label: 'Apr', value: 650000 },
    { label: 'May', value: 720000 },
    { label: 'Jun', value: 680000 },
    { label: 'Jul', value: 795000 },
  ];
};

export const getEnrollmentChartData = () => {
  return [
    { label: 'Week 1', value: 8 },
    { label: 'Week 2', value: 12 },
    { label: 'Week 3', value: 15 },
    { label: 'Week 4', value: 11 },
    { label: 'Week 5', value: 18 },
    { label: 'Week 6', value: 22 },
    { label: 'Week 7', value: 25 },
    { label: 'Week 8', value: 20 },
  ];
};

export const getProgrammeBreakdown = () => {
  return [
    { label: 'ICAN Foundation', value: 8, color: 'var(--navy)' },
    { label: 'ICAN Professional', value: 6, color: 'var(--gold)' },
    { label: 'Corporate Training', value: 4, color: '#16A34A' },
  ];
};

export const getPaymentMethodBreakdown = () => {
  return [
    { label: 'Transfer', value: 12, color: 'var(--navy)' },
    { label: 'Card', value: 5, color: 'var(--gold)' },
    { label: 'Cash', value: 2, color: '#16A34A' },
    { label: 'Cheque', value: 1, color: '#2563EB' },
  ];
};

export const getExpenseData = () => {
  return [
    { label: 'Jan', revenue: 450000, expenses: 280000 },
    { label: 'Feb', revenue: 520000, expenses: 310000 },
    { label: 'Mar', revenue: 480000, expenses: 290000 },
    { label: 'Apr', revenue: 650000, expenses: 380000 },
    { label: 'May', revenue: 720000, expenses: 420000 },
    { label: 'Jun', revenue: 680000, expenses: 390000 },
    { label: 'Jul', revenue: 795000, expenses: 450000 },
  ];
};

// ============== NEW INTERFACES FOR CRM ENHANCEMENTS ==============

export interface Notification {
  id: string;
  type: 'enrollment' | 'payment' | 'class' | 'user' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'class' | 'exam' | 'meeting';
  instructor: string;
  venue: string;
  enrolled: number;
  capacity: number;
}

// Mock Notifications (last 48 hours)
export const mockNotifications: Notification[] = [
  { id: 'NOT001', type: 'enrollment', title: 'New Enrollment', message: 'Ngozi Okoro enrolled in Business Data Analytics', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false, link: '/admin/enrollments' },
  { id: 'NOT002', type: 'payment', title: 'Payment Received', message: 'Fatima Abubakar paid ₦85,000 for Risk Management course', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), read: false, link: '/admin/finances' },
  { id: 'NOT003', type: 'class', title: 'Class Scheduled', message: 'Business Data Analytics class scheduled for July 23', timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), read: false, link: '/admin/classes' },
  { id: 'NOT004', type: 'user', title: 'Instructor Assigned', message: 'Mrs. Ngozi Okafor assigned to Taxation class', timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), read: true, link: '/admin/instructors' },
  { id: 'NOT005', type: 'payment', title: 'Payment Pending', message: 'Ibrahim Yusuf has ₦185,000 outstanding balance', timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), read: false, link: '/admin/finances' },
  { id: 'NOT006', type: 'enrollment', title: 'Enrollment Completed', message: 'Chiamaka Nwosu completed Financial Management program', timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(), read: true, link: '/admin/enrollments' },
  { id: 'NOT007', type: 'class', title: 'Class Completed', message: 'Financial Management for Executives class completed', timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(), read: true, link: '/admin/classes' },
  { id: 'NOT008', type: 'user', title: 'New Student', message: 'Yusuf Ibrahim registered as a new student', timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(), read: true, link: '/admin/students' },
  { id: 'NOT009', type: 'system', title: 'System Update', message: 'Platform maintenance scheduled for Sunday 3 AM', timestamp: new Date(Date.now() - 1000 * 60 * 840).toISOString(), read: true, link: '/admin/settings' },
  { id: 'NOT010', type: 'payment', title: 'Payment Received', message: 'Blessing Okonkwo paid ₦60,000 for IFRS Certification', timestamp: new Date(Date.now() - 1000 * 60 * 960).toISOString(), read: true, link: '/admin/finances' },
  { id: 'NOT011', type: 'enrollment', title: 'New Enrollment', message: 'Chioma Adeleke enrolled in Risk Management & Compliance', timestamp: new Date(Date.now() - 1000 * 60 * 1080).toISOString(), read: true, link: '/admin/enrollments' },
  { id: 'NOT012', type: 'class', title: 'Class Rescheduled', message: 'Advanced Financial Accounting moved to July 20', timestamp: new Date(Date.now() - 1000 * 60 * 1200).toISOString(), read: true, link: '/admin/classes' },
  { id: 'NOT013', type: 'user', title: 'Instructor Update', message: 'Dr. Adebayo Johnson updated course materials', timestamp: new Date(Date.now() - 1000 * 60 * 1320).toISOString(), read: true, link: '/admin/instructors' },
  { id: 'NOT014', type: 'payment', title: 'Payment Confirmed', message: 'Amina Mohammed payment of ₦90,000 confirmed', timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), read: true, link: '/admin/finances' },
  { id: 'NOT015', type: 'system', title: 'Backup Completed', message: 'Daily data backup completed successfully', timestamp: new Date(Date.now() - 1000 * 60 * 1560).toISOString(), read: true, link: '/admin/settings' },
];

// Get Upcoming Events (next 7 days from classes)
export const mockUpcomingEvents: UpcomingEvent[] = mockAdminClasses
  .filter(cls => {
    const classDate = new Date(cls.date);
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return classDate >= today && classDate <= sevenDaysFromNow && (cls.status === 'upcoming' || cls.status === 'ongoing');
  })
  .map(cls => ({
    id: cls.id,
    title: cls.courseName,
    date: cls.date,
    startTime: cls.startTime,
    endTime: cls.endTime,
    type: 'class' as const,
    instructor: cls.instructorName,
    venue: cls.venue,
    enrolled: cls.enrolled,
    capacity: cls.capacity,
  }))
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

// Helper Functions
export const getUnreadNotificationCount = (): number => {
  return mockNotifications.filter(n => !n.read).length;
};
