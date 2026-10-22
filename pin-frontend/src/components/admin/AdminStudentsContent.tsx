"use client";

import { useState } from "react";
import { Search, Download, Eye, Edit, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { mockSystemUsers, mockEnrollments, formatNaira } from "@/lib/mockAdminData";
import AddStudentModal from "@/components/admin/modals/AddStudentModal";

export default function AdminStudentsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const students = mockSystemUsers.filter(u => u.role === 'student');
  const filteredStudents = students.filter(student =>
    searchQuery === '' ||
    student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const completedProgrammes = mockEnrollments.filter(e => e.status === 'completed').length;
  const feeDefaulters = mockEnrollments.filter(e => e.balance > 0).length;

  const getStudentEnrollment = (studentId: string) => {
    return mockEnrollments.find(e => e.studentId === studentId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Student Management
          </h1>
          <p style={{ color: 'var(--ink-muted)' }}>
            Manage student enrollments and track progress
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)' }}
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
          <button
            className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--rule)' }}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{totalStudents}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Total Students</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{activeStudents}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Active Students</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{completedProgrammes}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Completed Programmes</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{feeDefaulters}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Fee Defaulters</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--ink-faint)' }} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
          />
        </div>
        <select 
          className="px-4 py-3 rounded-xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
        >
          <option>All Programmes</option>
          <option>ICAN Foundation</option>
          <option>ICAN Professional</option>
          <option>Corporate Training</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--rule)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--rule)' }}>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Student</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Programme</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Enroll Date</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Payment Status</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Progress</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const enrollment = getStudentEnrollment(student.id);
              const isExpanded = expandedRow === student.id;
              
              return (
                <>
                  <tr 
                    key={student.id} 
                    style={{ borderBottom: '1px solid var(--rule)', backgroundColor: 'var(--bg)' }}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setExpandedRow(isExpanded ? null : student.id)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: 'var(--navy)' }}
                        >
                          {student.first_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                            {student.first_name} {student.last_name}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>{student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
                      {enrollment?.programmeName || 'Not enrolled'}
                    </td>
                    <td className="p-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
                      {enrollment ? new Date(enrollment.enrollmentDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                    </td>
                    <td className="p-4">
                      {enrollment && (
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
                          style={{
                            backgroundColor: enrollment.paymentStatus === 'paid' ? '#DCFCE7' : enrollment.paymentStatus === 'partial' ? '#FEF3C7' : '#FEE2E2',
                            color: enrollment.paymentStatus === 'paid' ? '#16A34A' : enrollment.paymentStatus === 'partial' ? '#D97706' : '#DC2626',
                          }}
                        >
                          {enrollment.paymentStatus}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {enrollment && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--rule)' }}>
                            <div 
                              className="h-full rounded-full"
                              style={{ width: `${enrollment.progress}%`, backgroundColor: 'var(--navy)' }}
                            />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'var(--ink-muted)' }}>
                            {enrollment.progress}%
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </td>
                  </tr>
                  {isExpanded && enrollment && (
                    <tr style={{ backgroundColor: 'var(--navy-50)', borderBottom: '1px solid var(--rule)' }}>
                      <td colSpan={6} className="p-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-muted)' }}>Contact Info</p>
                            <p className="text-sm mb-1" style={{ color: 'var(--ink)' }}>{student.email}</p>
                            <p className="text-sm" style={{ color: 'var(--ink)' }}>{student.phone_number}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-muted)' }}>Payment History</p>
                            <p className="text-sm mb-1" style={{ color: 'var(--ink)' }}>Total: {formatNaira(enrollment.totalFees)}</p>
                            <p className="text-sm mb-1" style={{ color: 'var(--ink)' }}>Paid: {formatNaira(enrollment.amountPaid)}</p>
                            <p className="text-sm" style={{ color: enrollment.balance > 0 ? '#DC2626' : '#16A34A' }}>
                              Balance: {formatNaira(enrollment.balance)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-muted)' }}>Programme Period</p>
                            <p className="text-sm mb-1" style={{ color: 'var(--ink)' }}>
                              Start: {new Date(enrollment.startDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--ink)' }}>
                              End: {new Date(enrollment.endDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredStudents.map((student) => {
          const enrollment = getStudentEnrollment(student.id);
          return (
            <div 
              key={student.id}
              className="p-4 rounded-xl border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ backgroundColor: 'var(--navy)' }}
                >
                  {student.first_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                    {student.first_name} {student.last_name}
                  </p>
                  <p className="text-sm mb-2" style={{ color: 'var(--ink-muted)' }}>
                    {enrollment?.programmeName || 'Not enrolled'}
                  </p>
                  {enrollment && (
                    <>
                      <span 
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium capitalize"
                        style={{
                          backgroundColor: enrollment.paymentStatus === 'paid' ? '#DCFCE7' : enrollment.paymentStatus === 'partial' ? '#FEF3C7' : '#FEE2E2',
                          color: enrollment.paymentStatus === 'paid' ? '#16A34A' : enrollment.paymentStatus === 'partial' ? '#D97706' : '#DC2626',
                        }}
                      >
                        {enrollment.paymentStatus}
                      </span>
                      <div className="mt-2">
                        <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--rule)' }}>
                          <div 
                            className="h-full rounded-full"
                            style={{ width: `${enrollment.progress}%`, backgroundColor: 'var(--navy)' }}
                          />
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>{enrollment.progress}% complete</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          // In a real app, refresh the student list
          console.log('Student added successfully');
        }}
      />
    </div>
  );
}
