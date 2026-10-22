"use client";

import { useState } from "react";
import { BarChart3, FileDown, Receipt } from "lucide-react";
import { mockPayments, mockEnrollments, formatNaira, getSystemStats } from "@/lib/mockAdminData";

export default function AdminFinancesContent() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');
  const stats = getSystemStats();

  // Calculate financials based on enrollments
  const totalRevenue = mockEnrollments.reduce((sum, e) => sum + e.amountPaid, 0);
  const outstandingBalance = mockEnrollments.reduce((sum, e) => sum + e.balance, 0);
  const paidThisMonth = mockPayments
    .filter(p => p.status === 'completed' && p.paymentDate.startsWith('2024-07'))
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = mockEnrollments.filter(e => e.balance > 0).length;

  const filteredEnrollments = mockEnrollments.filter(enrollment => {
    if (statusFilter === 'all') return true;
    return enrollment.paymentStatus === statusFilter;
  });

  const visibleTotalFees = filteredEnrollments.reduce((sum, e) => sum + e.totalFees, 0);
  const visibleAmountPaid = filteredEnrollments.reduce((sum, e) => sum + e.amountPaid, 0);
  const visibleBalance = filteredEnrollments.reduce((sum, e) => sum + e.balance, 0);

  const getPaymentStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return { backgroundColor: '#DCFCE7', color: '#16A34A' };
      case 'partial':
        return { backgroundColor: '#FEF3C7', color: '#D97706' };
      case 'unpaid':
        return { backgroundColor: '#FEE2E2', color: '#DC2626' };
      default:
        return { backgroundColor: 'var(--surface)', color: 'var(--ink-muted)' };
    }
  };

  const getMethodBadgeStyle = (method: string) => {
    return { backgroundColor: 'var(--navy-50)', color: 'var(--navy)' };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Financial Management
          </h1>
          <p style={{ color: 'var(--ink-muted)' }}>
            Track payments, revenue, and financial reports
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2"
          style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)' }}
        >
          <FileDown className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{formatNaira(totalRevenue)}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Total Revenue</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: '#DC2626' }}>{formatNaira(outstandingBalance)}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Outstanding Balance</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{formatNaira(paidThisMonth)}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Paid This Month</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{pendingPayments}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Pending Payments</p>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div 
        className="p-6 rounded-xl border"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
      >
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          Revenue Chart
        </h3>
        <div 
          className="flex flex-col items-center justify-center py-12"
          style={{ borderRadius: '12px', backgroundColor: 'var(--bg)' }}
        >
          <BarChart3 className="w-16 h-16 mb-4" style={{ color: 'var(--ink-faint)' }} />
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
            Analytics coming soon
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'paid', label: 'Paid' },
          { key: 'partial', label: 'Partial' },
          { key: 'unpaid', label: 'Unpaid' }
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => setStatusFilter(filter.key as any)}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap"
            style={{
              backgroundColor: statusFilter === filter.key ? 'var(--navy)' : 'var(--surface)',
              color: statusFilter === filter.key ? 'white' : 'var(--ink-muted)',
              border: `1px solid ${statusFilter === filter.key ? 'var(--navy)' : 'var(--rule)'}`
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--rule)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--rule)' }}>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Student</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Programme</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Total Fees</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Amount Paid</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Balance</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Status</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.map((enrollment) => (
              <tr key={enrollment.id} style={{ borderBottom: '1px solid var(--rule)', backgroundColor: 'var(--bg)' }}>
                <td className="p-4">
                  <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{enrollment.studentName}</p>
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>{enrollment.studentId}</p>
                </td>
                <td className="p-4 text-sm" style={{ color: 'var(--ink-muted)' }}>{enrollment.programmeName}</td>
                <td className="p-4 text-sm font-bold" style={{ color: 'var(--ink)' }}>{formatNaira(enrollment.totalFees)}</td>
                <td className="p-4 text-sm font-bold" style={{ color: '#16A34A' }}>{formatNaira(enrollment.amountPaid)}</td>
                <td className="p-4 text-sm font-bold" style={{ color: enrollment.balance > 0 ? '#DC2626' : '#16A34A' }}>
                  {formatNaira(enrollment.balance)}
                </td>
                <td className="p-4">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
                    style={getPaymentStatusBadgeStyle(enrollment.paymentStatus)}
                  >
                    {enrollment.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <button className="p-2 rounded-lg" style={{ color: 'var(--navy)' }}>
                    <Receipt className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {/* Totals Row */}
            <tr style={{ backgroundColor: 'var(--navy-50)', borderTop: '2px solid var(--navy)' }}>
              <td colSpan={2} className="p-4 font-bold" style={{ color: 'var(--ink)' }}>TOTALS</td>
              <td className="p-4 text-sm font-bold" style={{ color: 'var(--ink)' }}>{formatNaira(visibleTotalFees)}</td>
              <td className="p-4 text-sm font-bold" style={{ color: '#16A34A' }}>{formatNaira(visibleAmountPaid)}</td>
              <td className="p-4 text-sm font-bold" style={{ color: '#DC2626' }}>{formatNaira(visibleBalance)}</td>
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredEnrollments.map((enrollment) => (
          <div 
            key={enrollment.id}
            className="p-4 rounded-xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>{enrollment.studentName}</p>
            <p className="text-sm mb-3" style={{ color: 'var(--ink-muted)' }}>{enrollment.programmeName}</p>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>Total Fees:</span>
                <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{formatNaira(enrollment.totalFees)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>Paid:</span>
                <span className="text-sm font-bold" style={{ color: '#16A34A' }}>{formatNaira(enrollment.amountPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>Balance:</span>
                <span className="text-sm font-bold" style={{ color: enrollment.balance > 0 ? '#DC2626' : '#16A34A' }}>
                  {formatNaira(enrollment.balance)}
                </span>
              </div>
            </div>
            <span 
              className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
              style={getPaymentStatusBadgeStyle(enrollment.paymentStatus)}
            >
              {enrollment.paymentStatus}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
