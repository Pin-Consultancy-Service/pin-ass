// Demo data for testing without authentication

export const mockStudentProfile = {
  id: "demo-student-123",
  full_name: "Demo Student",
  email: "demo@pinassociate.com",
  phone: "+234 800 000 0000",
  registration_number: "PIN/DEMO/2024/001",
  programme: "ICAN_PRO",
  programme_display: "ICAN Professional",
  study_mode: "HYBRID",
  study_mode_display: "Hybrid (Online + Physical)",
  diet: "NOV",
  date_enrolled: "2024-01-15",
  is_active_student: true,
};

export const mockBalance = {
  total_fees_due: "300000",
  total_paid: "150000", 
  balance_due: "150000",
  updated_at: new Date().toISOString(),
};

export const mockMaterials = [
  {
    id: "1",
    title: "ICAN Professional Level - Financial Reporting",
    description: "Comprehensive study materials for FR paper",
    file_type: "PDF",
    file_size: "2.5 MB",
    uploaded_at: "2024-01-15",
    category: "STUDY_GUIDE"
  },
  {
    id: "2", 
    title: "Past Questions - Advanced Taxation",
    description: "Collection of past examination questions",
    file_type: "PDF",
    file_size: "1.8 MB", 
    uploaded_at: "2024-01-10",
    category: "PAST_QUESTIONS"
  }
];

export const mockPayments = [
  {
    id: "1",
    amount: "150000",
    description: "ICAN Professional Level - 1st Installment", 
    payment_date: "2024-01-15",
    status: "COMPLETED",
    reference: "PIN_REF_001"
  }
];

export const mockEngagements = [
  {
    id: "1",
    title: "Financial Statement Preparation",
    description: "Annual financial statements for FY 2023",
    status: "IN_PROGRESS",
    start_date: "2024-01-01",
    deadline: "2024-03-31"
  }
];

export const mockEnrollments = [
  {
    id: "1",
    programme_title: "Advanced Excel for Finance Professionals",
    start_date: "2024-02-01",
    end_date: "2024-02-15", 
    status: "ACTIVE",
    completion_percentage: 65
  }
];