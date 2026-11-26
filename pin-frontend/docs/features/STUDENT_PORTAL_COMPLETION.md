# Student Portal - Completion Roadmap

## 🎯 Missing Critical Features

### ✅ Already Built:
- Login/Registration (TEST_MODE)
- Classes page with live sessions
- Notifications system
- Basic dashboard layout
- Profile page structure

### ⚠️ **MUST BUILD NOW:**

1. **💰 Finances/Fees Page** (CRITICAL)
   - View total fees
   - Payments made
   - Outstanding balance
   - Payment history
   - Make payments (Paystack integration)
   - Download receipts

2. **📊 Functional Dashboard** (CRITICAL)
   - Show real course data
   - Progress tracking
   - Upcoming classes
   - Recent activities
   - Assignments due
   - Performance metrics

3. **📚 Study Materials Page** (HIGH PRIORITY)
   - Course materials library
   - Download PDFs, slides
   - Video resources
   - Organized by subject

4. **📝 Assignments Page** (HIGH PRIORITY)
   - View assignments
   - Submit assignments
   - Track grades
   - Due dates

5. **📖 Past Questions Page** (MEDIUM PRIORITY)
   - Practice exams
   - Past papers
   - Mock tests
   - Solutions

---

## 💰 **1. FINANCES PAGE - Detailed Spec**

### **Page Overview:**

Students need to see:
- Total course fee
- Amount paid so far
- Outstanding balance
- Payment history
- Make new payments
- Download receipts

### **Visual Design:**

```
┌─────────────────────────────────────────────────────────┐
│  Financial Overview                    [Make Payment]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  💳 Payment Summary                                     │
│  ┌─────────────┬─────────────┬─────────────┐          │
│  │ Total Fees  │ Paid        │ Outstanding │          │
│  │ ₦850,000    │ ₦500,000    │ ₦350,000   │          │
│  │             │ 59%         │ 41%        │          │
│  └─────────────┴─────────────┴─────────────┘          │
│                                                         │
│  ⚠️ Payment Status: Outstanding Balance                │
│  Next Payment Due: Oct 25, 2026 • Amount: ₦175,000    │
│                                                         │
│  📊 Payment Progress                                    │
│  [████████████░░░░░░░░] 59%                            │
│                                                         │
│  ┌─────────────────────────────────────────────┐      │
│  │ 📅 Payment Schedule                         │      │
│  │                                             │      │
│  │ ✅ Registration Fee    ₦150,000  Sept 1     │      │
│  │ ✅ 1st Installment     ₦200,000  Sept 15    │      │
│  │ ✅ 2nd Installment     ₦150,000  Oct 1      │      │
│  │ ⏰ 3rd Installment     ₦175,000  Oct 25     │      │
│  │ ⏰ Final Payment       ₦175,000  Nov 15     │      │
│  │                                             │      │
│  │ [Pay Now]                                   │      │
│  └─────────────────────────────────────────────┘      │
│                                                         │
│  📜 Payment History (3 payments)                       │
│  ┌─────────────────────────────────────────────┐      │
│  │ Oct 1, 2026                                 │      │
│  │ 2nd Installment                             │      │
│  │ ₦150,000 • Paystack • Successful           │      │
│  │ Ref: TXN-20261001-ABC123                    │      │
│  │                                             │      │
│  │ [View Receipt] [Download PDF]               │      │
│  └─────────────────────────────────────────────┘      │
│                                                         │
│  ┌─────────────────────────────────────────────┐      │
│  │ Sept 15, 2026                               │      │
│  │ 1st Installment                             │      │
│  │ ₦200,000 • Paystack • Successful           │      │
│  │                                             │      │
│  │ [View Receipt] [Download PDF]               │      │
│  └─────────────────────────────────────────────┘      │
│                                                         │
│  [View All Transactions] [Download Statement]          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### **Making a Payment:**

```
┌─────────────────────────────────────────────┐
│  Make Payment                               │
├─────────────────────────────────────────────┤
│                                             │
│  Payment Type                               │
│  ● Pay Outstanding Balance (₦350,000)       │
│  ○ Pay Installment (₦175,000)               │
│  ○ Custom Amount                            │
│                                             │
│  Amount to Pay *                            │
│  [₦ 175,000                              ] │
│                                             │
│  Payment Method                             │
│  ● Paystack (Card, Bank Transfer, USSD)     │
│  ○ Bank Transfer (Manual)                   │
│                                             │
│  📧 Email                                   │
│  [john.doe@example.com                   ] │
│  (Receipt will be sent here)                │
│                                             │
│  💡 Payment Options via Paystack:           │
│  • Debit/Credit Card                        │
│  • Bank Transfer                            │
│  • USSD                                     │
│  • Mobile Money                             │
│                                             │
│         [Cancel]      [Proceed to Payment]  │
└─────────────────────────────────────────────┘
```

---

## 📊 **2. FUNCTIONAL DASHBOARD - Detailed Spec**

### **Current Dashboard is Static - Needs Real Data!**

### **New Functional Dashboard:**

```
┌─────────────────────────────────────────────────────────┐
│  Welcome back, John! 👋                                 │
│  ICAN Professional Level - Diet 1 2024                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 Your Progress Overview                              │
│  ┌──────────┬──────────┬──────────┬──────────┐        │
│  │ Classes  │ Attendance│ Assignments│Financial│        │
│  │  8/12    │   92%    │   6/8    │  59%    │        │
│  │ Attended │ Rate     │ Submitted│ Paid    │        │
│  └──────────┴──────────┴──────────┴──────────┘        │
│                                                         │
│  ⚠️ Needs Attention                                     │
│  • Outstanding balance: ₦350,000 due Oct 25            │
│  • 2 assignments due this week                         │
│  • Missed 2 classes - recordings available             │
│                                                         │
│  🔴 Next Live Class                                     │
│  ┌─────────────────────────────────────────────┐      │
│  │ Financial Accounting                        │      │
│  │ Week 6: Cash Flow Statements                │      │
│  │                                             │      │
│  │ ⏰ Tomorrow, Oct 17 at 2:30 PM              │      │
│  │ 👨‍🏫 Anthony Babatunde                        │      │
│  │ 📎 2 materials available                    │      │
│  │                                             │      │
│  │ [View Details] [Set Reminder]              │      │
│  └─────────────────────────────────────────────┘      │
│                                                         │
│  📚 Course Progress                                     │
│  ┌─────────────────────────────────────────────┐      │
│  │ Financial Accounting                        │      │
│  │ [████████████░░░░░░░░] 67% Complete        │      │
│  │ 8/12 classes attended                       │      │
│  │                                             │      │
│  │ Taxation                                    │      │
│  │ [███████░░░░░░░░░░░░░] 42% Complete        │      │
│  │ 5/12 classes attended                       │      │
│  │                                             │      │
│  │ Auditing                                    │      │
│  │ [█████░░░░░░░░░░░░░░░] 33% Complete        │      │
│  │ 4/12 classes attended                       │      │
│  └─────────────────────────────────────────────┘      │
│                                                         │
│  📝 Pending Assignments (2)                             │
│  • Financial Accounting - Week 5 (Due: Oct 18)         │
│  • Taxation - Case Study 2 (Due: Oct 20)               │
│  [View All Assignments]                                │
│                                                         │
│  📹 Missed Classes (2)                                  │
│  • Taxation - Oct 15 (Recording available)             │
│  • Auditing - Oct 14 (Recording available)             │
│  [Watch Recordings]                                    │
│                                                         │
│  🏆 Recent Achievements                                │
│  • 🌟 Perfect attendance this week!                    │
│  • 📝 Submitted 3 assignments on time                  │
│  • 💯 Scored 95% on last quiz                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 **Priority Order - What to Build First**

### **Phase 1: CRITICAL (This Week)**

1. **Finances Page** ✅ TOP PRIORITY
   - Payment summary
   - Payment history
   - Make payment (Paystack)
   - Download receipts

2. **Functional Dashboard** ✅ TOP PRIORITY
   - Real course progress
   - Upcoming classes
   - Assignments due
   - Financial alerts

### **Phase 2: HIGH PRIORITY (Next Week)**

3. **Study Materials Page**
   - View materials by course
   - Download PDFs
   - Video resources

4. **Assignments Page**
   - View assignments
   - Submit work
   - Track grades

### **Phase 3: MEDIUM PRIORITY (Week After)**

5. **Past Questions/Practice**
   - Practice tests
   - Past papers
   - Mock exams

---

## 💳 **Paystack Integration - Already Configured!**

You already have Paystack setup:
- `/app/api/payments/initialize/route.ts` ✅
- `/app/api/payments/callback/route.ts` ✅
- Environment variables in `.env` ✅

**Just need to:**
1. Build the Finances UI
2. Connect to existing Paystack API
3. Store payment records in database

---

## 🎯 **Data Structure Needed**

### **Student Financial Data:**

```typescript
interface StudentFinances {
  studentId: string;
  program: string; // "ICAN Professional - Diet 1"
  totalFees: number; // 850000
  paidAmount: number; // 500000
  outstandingBalance: number; // 350000
  paymentSchedule: PaymentSchedule[];
  paymentHistory: Payment[];
}

interface PaymentSchedule {
  id: string;
  name: string; // "Registration Fee", "1st Installment"
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paidDate?: string;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  type: string; // "Registration", "Installment"
  method: "paystack" | "bank_transfer";
  status: "successful" | "pending" | "failed";
  reference: string;
  receiptUrl?: string;
}
```

### **Student Progress Data:**

```typescript
interface StudentProgress {
  studentId: string;
  program: string;
  courses: CourseProgress[];
  overallProgress: number; // percentage
  totalClasses: number;
  attendedClasses: number;
  attendanceRate: number;
}

interface CourseProgress {
  courseId: string;
  name: string; // "Financial Accounting"
  instructor: string;
  totalClasses: number;
  attendedClasses: number;
  progressPercentage: number;
  assignments: Assignment[];
  nextClass?: ClassInfo;
}
```

---

## 🚀 **Implementation Plan**

### **Step 1: Build Finances Page (Today)**
- Create StudentFeesContent component
- Payment summary cards
- Payment history list
- "Make Payment" button → Paystack

### **Step 2: Update Dashboard (Today/Tomorrow)**
- Real course progress bars
- Upcoming classes from mockClasses
- Pending assignments list
- Financial status alert

### **Step 3: Study Materials (Next)**
- Materials library page
- Download functionality
- Organize by course

### **Step 4: Assignments (Next)**
- Assignments list
- Upload submission
- View grades

---

## 📝 **What You Asked:**

> "One of the most important feature the organisation want also is for student to be able to see that amount they have payed and what they are owing"

**Answer:** I'll build the Finances page NOW with:
- ✅ Total fees breakdown
- ✅ Amount paid (with percentage)
- ✅ Outstanding balance (highlighted)
- ✅ Payment schedule
- ✅ Payment history with receipts
- ✅ Make payment button (Paystack)

> "Also when are we going to make the student dashboard all funtion the date the course?"

**Answer:** I'll update the dashboard NOW to show:
- ✅ Real course progress (from enrolled courses)
- ✅ Actual class attendance data
- ✅ Upcoming classes (from mockClasses)
- ✅ Assignments due
- ✅ Financial status
- ✅ Recent activity

---

**Ready to start building? Let's do the Finances page first!** 💰
