// Mock financial data for testing - TODO: Replace with real API

export interface PaymentPlan {
  id: string;
  name: string;
  amount: number;
  description: string;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  type: string;
  method: "paystack" | "bank_transfer" | "cash";
  methodDisplay: string;
  status: "CONFIRMED" | "PENDING" | "FAILED";
  statusDisplay: string;
  reference: string;
  receiptUrl?: string;
}

export interface StudentFinances {
  studentId: string;
  program: string;
  totalFees: number;
  totalPaid: number;
  outstandingBalance: number;
  paymentPlans: PaymentPlan[];
  paymentHistory: PaymentRecord[];
}

// Mock data for ICAN Professional Level student
export const mockFinances: StudentFinances = {
  studentId: "STU001",
  program: "ICAN Professional Level - Diet 1 2024",
  totalFees: 850000,
  totalPaid: 425000,
  outstandingBalance: 425000,
  
  paymentPlans: [
    {
      id: "1",
      name: "First of two payments",
      amount: 425000,
      description: "First half of the course fee",
      dueDate: "2026-09-01",
      isPaid: true,
      paidDate: "2026-09-01"
    },
    {
      id: "2",
      name: "Second and final payment",
      amount: 425000,
      description: "Final half of the course fee",
      dueDate: "2026-10-01",
      isPaid: false,
    }
  ],
  
  paymentHistory: [
    {
      id: "PAY001",
      date: "2026-10-01",
      amount: 425000,
      type: "First of two payments",
      method: "paystack",
      methodDisplay: "Paystack (Card)",
      status: "CONFIRMED",
      statusDisplay: "Successful",
      reference: "TXN-20260901-FIRST-HALF",
      receiptUrl: "#"
    }
  ]
};

// Get payment progress percentage
export function getPaymentProgress(finances: StudentFinances): number {
  return Math.round((finances.totalPaid / finances.totalFees) * 100);
}

// Get next payment due
export function getNextPaymentDue(finances: StudentFinances): PaymentPlan | null {
  const unpaid = finances.paymentPlans
    .filter(plan => !plan.isPaid)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  return unpaid[0] || null;
}

// Format currency
export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Check if payment is overdue
export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
}
