"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Clock, MapPin, Users, Video, Plus, Edit, Trash2, 
  ExternalLink, Filter, CheckCircle, XCircle
} from "lucide-react";
import { mockTrainingClasses, type TrainingClass } from "@/lib/mockTrainingData";

export default function InstructorClassesContent() {
  const [mounted, setMounted] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredClasses = mockTrainingClasses.filter(cls => {
    if (filterStatus === 'all') return true;
    return cls.status === filterStatus;
  });

  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString("en-NG", { 
      weekday: 'short',
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    }) : "—";

  const getStatusBadge = (status: TrainingClass['status']) => {
    const config = {
      upcoming: { bg: 'var(--navy-50)', color: 'var(--ink)', label: 'Upcoming' },
      live: { bg: '#DCFCE7', color: '#16A34A', label: 'Live' },
      completed: { bg: 'var(--gold-50)', color: 'var(--gold-dark)', label: 'Completed' },
      cancelled: { bg: '#FEE2E2', color: '#DC2626', label: 'Cancelled' },
    };
    const { bg, color, label } = config[status];
    
    return (
      <span 
        className="px-3 py-1 rounded-full text-xs font-bold"
        style={{ backgroundColor: bg, color }}
      >
        {label}
      </span>
    );
  };

  const getTypeIcon = (type: TrainingClass['type']) => {
    if (type === 'online') return <Video className="w-4 h-4" />;
    if (type === 'hybrid') return <><Video className="w-4 h-4" /><MapPin className="w-4 h-4" /></>;
    return <MapPin className="w-4 h-4" />;
  };

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
          >
            My Classes
          </h1>
          <p style={{ color: 'var(--ink-muted)' }}>
            Manage your scheduled classes and track attendance
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--navy)', color: 'white' }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Schedule Class</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Classes', value: mockTrainingClasses.length, color: 'var(--navy)' },
          { label: 'Upcoming', value: mockTrainingClasses.filter(c => c.status === 'upcoming').length, color: '#2563EB' },
          { label: 'Completed', value: mockTrainingClasses.filter(c => c.status === 'completed').length, color: 'var(--gold-dark)' },
          { label: 'Cancelled', value: mockTrainingClasses.filter(c => c.status === 'cancelled').length, color: '#DC2626' },
        ].map((stat, index) => (
          <div 
            key={index}
            className="p-4 rounded-xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <p 
              className="text-3xl font-bold mb-1"
              style={{ color: stat.color, fontFamily: 'var(--font-display)' }}
            >
              {stat.value}
            </p>
            <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
        <div className="flex gap-2">
          {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize"
              style={{
                backgroundColor: filterStatus === status ? 'var(--navy)' : 'var(--surface)',
                color: filterStatus === status ? 'white' : 'var(--ink-muted)',
                border: '1px solid var(--rule)'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Grid */}
      <div className="space-y-4">
        {filteredClasses.length === 0 ? (
          <div 
            className="p-12 text-center rounded-2xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--rule)' }} />
            <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
              No classes found
            </p>
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
              {filterStatus === 'all' 
                ? 'Schedule your first class to get started' 
                : `No ${filterStatus} classes`}
            </p>
          </div>
        ) : (
          filteredClasses.map((cls) => (
            <div
              key={cls.id}
              className="p-6 rounded-2xl border transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
                      {cls.title}
                    </h3>
                    {getStatusBadge(cls.status)}
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--ink-muted)' }}>
                    {cls.course} • {cls.programme}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-lg transition-all hover:shadow-md"
                    style={{ backgroundColor: 'var(--bg)' }}
                  >
                    <Edit className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
                  </button>
                  <button
                    className="p-2 rounded-lg transition-all hover:shadow-md"
                    style={{ backgroundColor: '#FEE2E2' }}
                  >
                    <Trash2 className="w-4 h-4" style={{ color: '#DC2626' }} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
                  <Calendar className="w-4 h-4" />
                  <span>{mounted && fmtDate(cls.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
                  <Clock className="w-4 h-4" />
                  <span>{cls.startTime} - {cls.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
                  {getTypeIcon(cls.type)}
                  <span className="capitalize">{cls.type}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--ink-muted)' }}>
                <MapPin className="w-4 h-4" />
                <span>{cls.venue}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--rule)' }}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                    {cls.studentsEnrolled} / {cls.maxCapacity} Students
                  </span>
                  <div 
                    className="ml-2 h-2 rounded-full overflow-hidden"
                    style={{ 
                      width: '100px', 
                      backgroundColor: 'var(--rule)' 
                    }}
                  >
                    <div 
                      className="h-full transition-all"
                      style={{ 
                        width: `${(cls.studentsEnrolled / cls.maxCapacity) * 100}%`,
                        backgroundColor: 'var(--navy)'
                      }}
                    />
                  </div>
                </div>

                {cls.meetingLink && cls.status === 'upcoming' && (
                  <a
                    href={cls.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md"
                    style={{ backgroundColor: 'var(--navy)', color: 'white' }}
                  >
                    <Video className="w-4 h-4" />
                    Join Class
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {cls.status === 'completed' && (
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md"
                    style={{ backgroundColor: 'var(--gold)', color: 'white' }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    View Report
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div 
            className="w-full max-w-2xl rounded-2xl p-6"
            style={{ backgroundColor: 'var(--bg)' }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ink)' }}>
              Schedule New Class
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--ink-muted)' }}>
              Feature coming soon! This will allow you to schedule new classes.
            </p>
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl font-semibold"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
