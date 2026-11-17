"use client";

import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Search } from "lucide-react";
import { mockSystemUsers, mockAdminClasses } from "@/lib/mockAdminData";
import AddInstructorModal from "@/components/admin/modals/AddInstructorModal";

export default function AdminInstructorsContent() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const instructors = mockSystemUsers.filter(u => u.role === 'instructor');
  
  const totalInstructors = instructors.length;
  const activeClasses = mockAdminClasses.filter(c => c.status === 'upcoming' || c.status === 'ongoing').length;
  const avgRating = 4.7;
  const totalStudents = instructors.reduce((sum, inst) => {
    const instructorClasses = mockAdminClasses.filter(c => c.instructorId === inst.id);
    return sum + instructorClasses.reduce((classSum, cls) => classSum + cls.enrolled, 0);
  }, 0);

  const getInstructorSpecialization = (instructorId: string) => {
    const specializations: Record<string, string> = {
      'INS001': 'Financial Accounting & IFRS',
      'INS002': 'Taxation & Management',
      'INS003': 'Auditing & Corporate Finance',
      'INS004': 'Corporate Finance & Risk Management',
    };
    return specializations[instructorId] || 'General Accounting';
  };

  const getInstructorClasses = (instructorId: string) => {
    return mockAdminClasses.filter(c => c.instructorId === instructorId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Instructor Management
          </h1>
          <p style={{ color: 'var(--ink-muted)' }}>
            Manage instructors and their teaching assignments
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2"
          style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)' }}
        >
          <Plus className="w-4 h-4" />
          Add Instructor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{totalInstructors}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Total Instructors</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{activeClasses}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Active Classes</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{avgRating} ⭐</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Avg Rating</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{totalStudents}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Students Taught</p>
        </div>
      </div>

      {/* Enhanced Search & Filter Bar */}
      <div 
        className="p-4 rounded-xl border"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--ink-faint)' }} />
            <input
              type="text"
              placeholder="Search instructors by name, email, or specialization..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: 'var(--bg)', 
                borderColor: 'var(--rule)', 
                color: 'var(--ink)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(244, 196, 48, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--rule)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          <select 
            className="px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: 'var(--bg)', 
              borderColor: 'var(--rule)', 
              color: 'var(--ink)',
              minWidth: '160px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--gold)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(244, 196, 48, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--rule)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Desktop Table with Enhanced Styling */}
      <div className="hidden md:block overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--rule)', boxShadow: 'var(--shadow-sm)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '2px solid var(--rule)' }}>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Instructor</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Email</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Specialization</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Active Classes</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Status</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => {
              const instructorClasses = getInstructorClasses(instructor.id);
              const activeClassCount = instructorClasses.filter(c => c.status === 'upcoming' || c.status === 'ongoing').length;
              const isExpanded = expandedRow === instructor.id;
              const totalStudents = instructorClasses.reduce((sum, cls) => sum + cls.enrolled, 0);
              
              return (
                <>
                  <tr 
                    key={instructor.id} 
                    style={{ 
                      borderBottom: '1px solid var(--rule)', 
                      backgroundColor: 'var(--bg)',
                      transition: 'all 0.15s ease'
                    }}
                    className="cursor-pointer"
                    onClick={() => setExpandedRow(isExpanded ? null : instructor.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface)';
                      e.currentTarget.style.transform = 'scale(1.002)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: 'var(--navy)' }}
                        >
                          {instructor.first_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                            {instructor.first_name} {instructor.last_name}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>{instructor.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm" style={{ color: 'var(--ink-muted)' }}>{instructor.email}</td>
                    <td className="p-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
                      {getInstructorSpecialization(instructor.id)}
                    </td>
                    <td className="p-4">
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-sm font-bold"
                        style={{ backgroundColor: 'rgba(30, 64, 175, 0.15)', color: 'var(--ink)' }}
                      >
                        {activeClassCount}
                      </span>
                    </td>
                    <td className="p-4">
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
                        style={{
                          backgroundColor: instructor.status === 'active' ? 'var(--success-bg)' : 'var(--error-bg)',
                          color: instructor.status === 'active' ? 'var(--success-text)' : 'var(--error-text)',
                        }}
                      >
                        {instructor.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr style={{ backgroundColor: 'var(--navy-50)', borderBottom: '1px solid var(--rule)' }}>
                      <td colSpan={6} className="p-4">
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-muted)' }}>Bio</p>
                            <p className="text-sm" style={{ color: 'var(--ink)' }}>
                              Experienced instructor with expertise in {getInstructorSpecialization(instructor.id)}. 
                              Teaching at PIN Associate since {new Date(instructor.date_joined).getFullYear()}.
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-muted)' }}>Assigned Classes</p>
                            <div className="grid grid-cols-2 gap-2">
                              {instructorClasses.slice(0, 4).map(cls => (
                                <div 
                                  key={cls.id}
                                  className="p-2 rounded-lg"
                                  style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--rule)' }}
                                >
                                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>{cls.courseName}</p>
                                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                                    {new Date(cls.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })} - {cls.startTime}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-muted)' }}>Student Count</p>
                            <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{totalStudents} students across all classes</p>
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

      {/* Enhanced Mobile Cards */}
      <div className="md:hidden space-y-3">
        {instructors.map((instructor) => {
          const instructorClasses = getInstructorClasses(instructor.id);
          const activeClassCount = instructorClasses.filter(c => c.status === 'upcoming' || c.status === 'ongoing').length;
          
          return (
            <div 
              key={instructor.id}
              className="p-4 rounded-xl border transition-all"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: 'var(--rule)',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ backgroundColor: 'var(--navy)' }}
                >
                  {instructor.first_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                    {instructor.first_name} {instructor.last_name}
                  </p>
                  <p className="text-sm mb-2" style={{ color: 'var(--ink-muted)' }}>
                    {getInstructorSpecialization(instructor.id)}
                  </p>
                  <div className="flex gap-2">
                    <span 
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'rgba(30, 64, 175, 0.15)', color: 'var(--ink)' }}
                    >
                      {activeClassCount} classes
                    </span>
                    <span 
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium capitalize"
                      style={{
                        backgroundColor: instructor.status === 'active' ? 'var(--success-bg)' : 'var(--error-bg)',
                        color: instructor.status === 'active' ? 'var(--success-text)' : 'var(--error-text)',
                      }}
                    >
                      {instructor.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Instructor Modal */}
      <AddInstructorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          // In a real app, refresh the instructor list
        }}
      />
    </div>
  );
}
