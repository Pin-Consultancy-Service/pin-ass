"use client";

import { useState } from "react";
import { Download, Search, Eye, Edit, X } from "lucide-react";
import { mockEnrollments, formatNaira } from "@/lib/mockAdminData";

export default function AdminEnrollmentsContent() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEnrollments = mockEnrollments.filter(enrollment => {
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    const matchesSearch = searchQuery === '' ||
      enrollment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.programmeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalEnrollments = mockEnrollments.length;
  const confirmedCount = mockEnrollments.filter(e => e.status === 'confirmed').length;
  const pendingCount = mockEnrollments.filter(e => e.status === 'pending').length;
  const completedCount = mockEnrollments.filter(e => e.status === 'completed').length;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { backgroundColor: '#DCFCE7', color: '#16A34A' };
      case 'pending':
        return { backgroundColor: '#FEF3C7', color: '#D97706' };
      case 'completed':
        return { backgroundColor: '#DBEAFE', color: '#2563EB' };
      case 'cancelled':
        return { backgroundColor: '#FEE2E2', color: '#DC2626' };
      default:
        return { backgroundColor: 'var(--surface)', color: 'var(--ink-muted)' };
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Enrollment Management
          </h1>
          <p style={{ color: 'var(--ink-muted)' }}>
            Track and manage all student enrollments
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2"
          style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)' }}
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{totalEnrollments}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Total Enrollments</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{confirmedCount}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Confirmed</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{pendingCount}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Pending</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{completedCount}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Completed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'confirmed', label: 'Confirmed' },
          { key: 'pending', label: 'Pending' },
          { key: 'completed', label: 'Completed' },
          { key: 'cancelled', label: 'Cancelled' }
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--ink-faint)' }} />
        <input
          type="text"
          placeholder="Search by student name or programme..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--rule)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--rule)' }}>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Student</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Programme</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Enroll Date</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Start Date</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Status</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Payment</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Progress</th>
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
                <td className="p-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
                  {new Date(enrollment.enrollmentDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="p-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
                  {new Date(enrollment.startDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="p-4">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
                    style={getStatusBadgeStyle(enrollment.status)}
                  >
                    {enrollment.status}
                  </span>
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
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 rounded-full" style={{ backgroundColor: 'var(--rule)' }}>
                      <div 
                        className="h-full rounded-full"
                        style={{ width: `${enrollment.progress}%`, backgroundColor: 'var(--navy)' }}
                      />
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'var(--ink-muted)' }}>
                      {enrollment.progress}%
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg" style={{ color: 'var(--navy)' }}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg" style={{ color: 'var(--gold-dark)' }}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg" style={{ color: '#DC2626' }}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
            <div className="flex gap-2 mb-3">
              <span 
                className="inline-block px-2 py-1 rounded-full text-xs font-medium capitalize"
                style={getStatusBadgeStyle(enrollment.status)}
              >
                {enrollment.status}
              </span>
              <span 
                className="inline-block px-2 py-1 rounded-full text-xs font-medium capitalize"
                style={getPaymentStatusBadgeStyle(enrollment.paymentStatus)}
              >
                {enrollment.paymentStatus}
              </span>
            </div>
            <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--rule)' }}>
              <div 
                className="h-full rounded-full"
                style={{ width: `${enrollment.progress}%`, backgroundColor: 'var(--navy)' }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>{enrollment.progress}% complete</p>
          </div>
        ))}
      </div>
    </div>
  );
}
