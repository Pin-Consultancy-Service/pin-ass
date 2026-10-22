// Mock financial data for testing - TODO: Replace with real API

export interface PaymentPlan {
  id: string;
  name: string;
  amount: number;
  description: string;
  dueDate: string;
  isPaid: boolean;
  installments?: number;
  paidDate?: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  type: string;
  method: "paystack" | "bank_transfer" | "cash";
  methodDisplay: string;
  status: "CONFIRMED" | "PENDING" | "FAILED" | "REFUNDED";
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
  totalPaid: 500000,
  outstandingBalance: 350000,
  
  paymentPlans: [
    {
      id: "1",
      name: "Registration Fee",
      amount: 150000,
      description: "Initial registration and materials fee",
      dueDate: "2026-09-01",
      isPaid: true,
      paidDate: "2026-09-01"
    },
    {
      id: "2",
      name: "1st Installment",
      amount: 200000,
      description: "First installment payment",
      dueDate: "2026-09-15",
      isPaid: true,
      paidDate: "2026-09-15",
      installments: 4
    },
    {
      id: "3",
      name: "2nd Installment",
      amount: 150000,
      description: "Second installment payment",
      dueDate: "2026-10-01",
      isPaid: true,
      paidDate: "2026-10-01",
      installments: 4
    },
    {
      id: "4",
      name: "3rd Installment",
      amount: 175000,
      description: "Third installment payment",
      dueDate: "2026-10-25",
      isPaid: false,
      installments: 4
    },
    {
      id: "5",
      name: "Final Payment",
      amount: 175000,
      description: "Final installment payment",
      dueDate: "2026-11-15",
      isPaid: false,
      installments: 4
    }
  ],
  
  paymentHistory: [
    {
      id: "PAY003",
      date: "2026-10-01",
      amount: 150000,
      type: "2nd Installment",
      method: "paystack",
      methodDisplay: "Paystack (Card)",
      status: "CONFIRMED",
      statusDisplay: "Successful",
      reference: "TXN-20261001-ABC123",
      receiptUrl: "#"
    },
    {
      id: "PAY002",
      date: "2026-09-15",
      amount: 200000,
      type: "1st Installment",
      method: "paystack",
      methodDisplay: "Paystack (Bank Transfer)",
      status: "CONFIRMED",
      statusDisplay: "Successful",
      reference: "TXN-20260915-XYZ789",
      receiptUrl: "#"
    },
    {
      id: "PAY001",
      date: "2026-09-01",
      amount: 150000,
      type: "Registration Fee",
      method: "bank_transfer",
      methodDisplay: "Bank Transfer",
      status: "CONFIRMED",
      statusDisplay: "Successful",
      reference: "TXN-20260901-REG001",
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
