"use client";

import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Edit, Archive } from "lucide-react";
import { mockCourses } from "@/lib/mockAdminData";

export default function AdminCoursesContent() {
  const programmes = Array.from(new Set(mockCourses.map(c => c.programme)));
  const [expandedProgrammes, setExpandedProgrammes] = useState<Record<string, boolean>>({
    'ICAN Foundation': true,
    'ICAN Professional': true,
    'Corporate Training': true,
  });

  const totalCourses = mockCourses.length;
  const activeCourses = mockCourses.filter(c => c.status === 'active').length;
  const totalProgrammes = programmes.length;
  const avgStudents = Math.round(mockCourses.reduce((sum, c) => sum + c.studentsEnrolled, 0) / mockCourses.length);

  const toggleProgramme = (programme: string) => {
    setExpandedProgrammes(prev => ({ ...prev, [programme]: !prev[programme] }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Course Management
          </h1>
          <p style={{ color: 'var(--ink-muted)' }}>
            Manage all courses and programmes
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2"
          style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)' }}
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{totalCourses}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Total Courses</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{activeCourses}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Active Courses</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{totalProgrammes}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Total Programmes</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{avgStudents}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Avg Students/Course</p>
        </div>
      </div>

      {/* Courses by Programme */}
      <div className="space-y-4">
        {programmes.map(programme => {
          const programmeCourses = mockCourses.filter(c => c.programme === programme);
          const isExpanded = expandedProgrammes[programme];

          return (
            <div key={programme} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--rule)' }}>
              {/* Programme Header */}
              <button
                onClick={() => toggleProgramme(programme)}
                className="w-full p-4 flex items-center justify-between transition-colors"
                style={{ backgroundColor: 'var(--navy)', color: 'white' }}
              >
                <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                  {programme} ({programmeCourses.length} courses)
                </h3>
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {/* Programme Courses */}
              {isExpanded && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--rule)' }}>
                        <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Course Name</th>
                        <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Code</th>
                        <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Duration</th>
                        <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Students</th>
                        <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Status</th>
                        <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programmeCourses.map(course => (
                        <tr key={course.id} style={{ borderBottom: '1px solid var(--rule)', backgroundColor: 'var(--bg)' }}>
                          <td className="p-4">
                            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--ink)' }}>{course.name}</p>
                            <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>{course.description}</p>
                          </td>
                          <td className="p-4">
                            <span 
                              className="inline-block px-2 py-1 rounded text-xs font-mono font-bold"
                              style={{ backgroundColor: 'rgba(30, 64, 175, 0.15)', color: 'var(--ink)' }}
                            >
                              {course.code}
                            </span>
                          </td>
                          <td className="p-4 text-sm" style={{ color: 'var(--ink-muted)' }}>{course.duration}</td>
                          <td className="p-4">
                            <span className="font-bold text-sm" style={{ color: 'var(--ink)' }}>
                              {course.studentsEnrolled}
                            </span>
                          </td>
                          <td className="p-4">
                            <span 
                              className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
                              style={{
                                backgroundColor: course.status === 'active' ? 'var(--success-bg)' : 'var(--error-bg)',
                                color: course.status === 'active' ? 'var(--success-text)' : 'var(--error-text)',
                              }}
                            >
                              {course.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 rounded-lg" style={{ color: 'var(--gold-dark)' }}>
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg" style={{ color: 'var(--ink-muted)' }}>
                                <Archive className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
