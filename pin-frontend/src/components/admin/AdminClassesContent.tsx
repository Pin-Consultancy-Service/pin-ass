"use client";

import { useState } from "react";
import { Plus, UserCheck, Clock, MapPin, Video } from "lucide-react";
import { mockAdminClasses } from "@/lib/mockAdminData";
import CreateClassModal from '@/components/admin/modals/CreateClassModal';

export default function AdminClassesContent() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredClasses = mockAdminClasses.filter(cls => {
    const matchesStatus = statusFilter === 'all' || cls.status === statusFilter;
    const matchesSearch = searchQuery === '' ||
      cls.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalClasses = mockAdminClasses.length;
  const upcomingClasses = mockAdminClasses.filter(c => c.status === 'upcoming').length;
  const ongoingClasses = mockAdminClasses.filter(c => c.status === 'ongoing').length;
  const completedClasses = mockAdminClasses.filter(c => c.status === 'completed').length;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'upcoming':
        return { backgroundColor: '#FEF3C7', color: '#D97706' };
      case 'ongoing':
        return { backgroundColor: '#DCFCE7', color: '#16A34A' };
      case 'completed':
        return { backgroundColor: '#DBEAFE', color: '#2563EB' };
      case 'cancelled':
        return { backgroundColor: '#FEE2E2', color: '#DC2626' };
      default:
        return { backgroundColor: 'var(--surface)', color: 'var(--ink-muted)' };
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'in-person':
        return { backgroundColor: 'var(--navy-50)', color: 'var(--navy)' };
      case 'online':
        return { backgroundColor: '#DBEAFE', color: '#2563EB' };
      case 'hybrid':
        return { backgroundColor: 'var(--gold-50)', color: '#92600A' };
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
            Class Management
          </h1>
          <p style={{ color: 'var(--ink-muted)' }}>
            Schedule and manage all classes
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2"
          style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)' }}
        >
          <Plus className="w-4 h-4" />
          Schedule Class
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{totalClasses}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Total Classes</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{upcomingClasses}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Upcoming</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{ongoingClasses}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Ongoing</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{completedClasses}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Completed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'ongoing', label: 'Ongoing' },
          { key: 'completed', label: 'Completed' }
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
      <input
        type="text"
        placeholder="Search classes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
      />

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((cls) => (
          <div 
            key={cls.id}
            className="p-5 rounded-xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            {/* Course Name */}
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
              {cls.courseName}
            </h3>

            {/* Instructor */}
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>{cls.instructorName}</p>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                {new Date(cls.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })} • {cls.startTime} - {cls.endTime}
              </p>
            </div>

            {/* Venue */}
            <div className="flex items-center gap-2 mb-4">
              {cls.type === 'online' ? (
                <Video className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
              ) : (
                <MapPin className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
              )}
              <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>{cls.venue}</p>
            </div>

            {/* Capacity Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Capacity</p>
                <p className="text-xs font-bold" style={{ color: 'var(--ink)' }}>
                  {cls.enrolled}/{cls.capacity}
                </p>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--rule)' }}>
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${(cls.enrolled / cls.capacity) * 100}%`, 
                    backgroundColor: 'var(--navy)' 
                  }}
                />
              </div>
            </div>

            {/* Badges */}
            <div className="flex gap-2">
              <span 
                className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
                style={getStatusBadgeStyle(cls.status)}
              >
                {cls.status}
              </span>
              <span 
                className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
                style={getTypeBadgeStyle(cls.type)}
              >
                {cls.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <p style={{ color: 'var(--ink-muted)' }}>No classes found matching your filters</p>
        </div>
      )}

      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          console.log('Class created successfully');
        }}
      />
    </div>
  );
}
