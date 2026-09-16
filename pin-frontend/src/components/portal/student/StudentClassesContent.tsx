"use client";

import { useState } from "react";
import { 
  Calendar, Clock, Play, Download, Users, BookOpen, Video, 
  Eye, CheckCircle, PlayCircle, Pause, Volume2, Maximize
} from "lucide-react";

// TODO: Replace with real class data from PIN Associate
const mockClasses = [
  {
    id: 1,
    subject: "Financial Accounting",
    topic: "Introduction to Financial Statements",
    instructor: "Dr. Adebayo Johnson",
    date: "2024-01-15",
    time: "10:00 AM - 12:00 PM",
    duration: 120, // minutes
    status: "completed",
    type: "live",
    attendance: "present",
    recordingUrl: "/recordings/financial-accounting-lesson-1.mp4",
    materials: [
      { name: "Lesson_1_Slides.pdf", size: "2.4MB" },
      { name: "Practice_Exercises.pdf", size: "1.1MB" }
    ],
    description: "Overview of the three main financial statements: Income Statement, Balance Sheet, and Cash Flow Statement. Understanding their purpose and interconnections."
  },
  {
    id: 2,
    subject: "Taxation",
    topic: "Personal Income Tax - PAYE System",
    instructor: "Prof. Fatima Bello",
    date: "2024-01-18",
    time: "2:00 PM - 4:00 PM",
    duration: 120,
    status: "completed",
    type: "live",
    attendance: "present",
    recordingUrl: "/recordings/taxation-lesson-2.mp4",
    materials: [
      { name: "PAYE_Calculation_Examples.xlsx", size: "850KB" },
      { name: "Tax_Tables_2024.pdf", size: "450KB" }
    ],
    description: "Detailed explanation of Nigeria's Pay As You Earn (PAYE) tax system, calculation methods, and practical examples."
  },
  {
    id: 3,
    subject: "Advanced Audit and Assurance",
    topic: "Risk Assessment and Internal Controls",
    instructor: "CA. Samuel Okafor",
    date: "2024-01-20",
    time: "9:00 AM - 11:00 AM",
    duration: 120,
    status: "completed",
    type: "live",
    attendance: "absent",
    recordingUrl: "/recordings/audit-lesson-3.mp4",
    materials: [
      { name: "Risk_Assessment_Framework.pdf", size: "1.8MB" },
      { name: "Internal_Controls_Checklist.docx", size: "520KB" }
    ],
    description: "Understanding audit risk components and evaluating internal control systems in various business environments."
  },
  {
    id: 4,
    subject: "Corporate Reporting",
    topic: "Consolidation of Financial Statements",
    instructor: "Dr. Aisha Mohammed",
    date: "2024-01-22",
    time: "11:00 AM - 1:00 PM",
    duration: 120,
    status: "upcoming",
    type: "live",
    attendance: null,
    recordingUrl: null,
    materials: [
      { name: "Consolidation_Guide.pdf", size: "3.2MB" }
    ],
    description: "Step-by-step approach to consolidating parent and subsidiary financial statements, including elimination entries."
  },
  {
    id: 5,
    subject: "Financial Management",
    topic: "Capital Budgeting and Investment Decisions",
    instructor: "Prof. Ibrahim Yusuf",
    date: "2024-01-25",
    time: "3:00 PM - 5:00 PM",
    duration: 120,
    status: "upcoming",
    type: "live",
    attendance: null,
    recordingUrl: null,
    materials: [],
    description: "Evaluation techniques for long-term investment decisions using NPV, IRR, and payback period methods."
  },
  {
    id: 6,
    subject: "Financial Accounting",
    topic: "Revenue Recognition and Measurement",
    instructor: "Dr. Adebayo Johnson",
    date: "2024-01-12",
    time: "10:00 AM - 12:00 PM",
    duration: 120,
    status: "completed",
    type: "recorded",
    attendance: "watched",
    recordingUrl: "/recordings/financial-accounting-revenue.mp4",
    materials: [
      { name: "IFRS_15_Summary.pdf", size: "1.6MB" },
      { name: "Revenue_Examples.xlsx", size: "980KB" }
    ],
    description: "Comprehensive coverage of IFRS 15 Revenue from Contracts with Customers, including the five-step model."
  }
];

const getStatusBadge = (status: string, attendance: string | null) => {
  switch (status) {
    case 'completed':
      if (attendance === 'present') {
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" 
               style={{ backgroundColor: 'var(--navy-50)', color: 'var(--navy)' }}>
            <CheckCircle className="w-3 h-3" />
            Attended
          </div>
        );
      } else if (attendance === 'watched') {
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" 
               style={{ backgroundColor: 'var(--gold-50)', color: 'var(--gold-dark)' }}>
            <Eye className="w-3 h-3" />
            Watched
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" 
               style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
            <Video className="w-3 h-3" />
            Missed
          </div>
        );
      }
    case 'upcoming':
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
             style={{ backgroundColor: 'var(--surface)', color: 'var(--ink-muted)' }}>
          <Calendar className="w-3 h-3" />
          Upcoming
        </div>
      );
    default:
      return null;
  }
};

const getTypeIcon = (type: string) => {
  return type === 'live' ? (
    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--navy)' }}>
      <Users className="w-3 h-3" />
      Live Class
    </div>
  ) : (
    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--gold-dark)' }}>
      <Video className="w-3 h-3" />
      Recorded
    </div>
  );
};

export default function StudentClassesContent() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  const filters = ["all", "upcoming", "completed", "missed"];
  const filteredClasses = selectedFilter === "all" 
    ? mockClasses 
    : selectedFilter === "missed"
    ? mockClasses.filter(cls => cls.status === 'completed' && cls.attendance === 'absent')
    : mockClasses.filter(cls => cls.status === selectedFilter);

  const upcomingCount = mockClasses.filter(c => c.status === 'upcoming').length;
  const completedCount = mockClasses.filter(c => c.status === 'completed').length;
  const attendedCount = mockClasses.filter(c => c.attendance === 'present' || c.attendance === 'watched').length;
  const recordedCount = mockClasses.filter(c => c.recordingUrl).length;

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
        >
          Classes & Recordings
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Access live classes, watch recorded sessions, and download class materials
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {upcomingCount}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Upcoming
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--gold)' }}
            >
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {attendedCount}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Attended
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--navy-dark)' }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {completedCount}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Total Classes
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--gold-dark)' }}
            >
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {recordedCount}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Recordings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-md capitalize"
              style={{
                backgroundColor: selectedFilter === filter ? 'var(--navy)' : 'var(--surface)',
                color: selectedFilter === filter ? 'white' : 'var(--ink-muted)',
                border: '1px solid var(--rule)'
              }}
            >
              {filter === "all" ? "All Classes" : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {filteredClasses.map((classItem) => (
          <div
            key={classItem.id}
            className="p-6 rounded-2xl border transition-all hover:shadow-lg"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            {/* Class Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
                      {classItem.topic}
                    </h3>
                    <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
                      <span className="font-medium" style={{ color: 'var(--navy)' }}>
                        {classItem.subject}
                      </span>
                      <span>{classItem.instructor}</span>
                      {getTypeIcon(classItem.type)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(classItem.status, classItem.attendance)}
              </div>
            </div>

            {/* Class Description */}
            <p className="mb-4 leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
              {classItem.description}
            </p>

            {/* Class Details */}
            <div className="flex items-center gap-6 mb-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(classItem.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{classItem.time} ({classItem.duration} mins)</span>
              </div>
            </div>

            {/* Class Materials */}
            {classItem.materials.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-muted)' }}>
                  Class Materials:
                </p>
                <div className="flex flex-wrap gap-2">
                  {classItem.materials.map((material, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:shadow-md"
                      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)' }}
                    >
                      <Download className="w-4 h-4" style={{ color: 'var(--navy)' }} />
                      <span className="text-xs font-medium" style={{ color: 'var(--ink)' }}>
                        {material.name}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                        ({material.size})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--rule)' }}>
              {classItem.recordingUrl && (
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white transition-all hover:shadow-md hover:scale-[1.02]"
                  style={{ backgroundColor: 'var(--navy)' }}
                >
                  <PlayCircle className="w-4 h-4" />
                  Watch Recording
                </button>
              )}
              
              {classItem.status === 'upcoming' && (
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-all hover:shadow-md"
                  style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}
                >
                  <Calendar className="w-4 h-4" />
                  Add to Calendar
                </button>
              )}

              {classItem.materials.length > 0 && (
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-all hover:shadow-md"
                  style={{ borderColor: 'var(--rule)', color: 'var(--ink-muted)' }}
                >
                  <Download className="w-4 h-4" />
                  Download All Materials
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}