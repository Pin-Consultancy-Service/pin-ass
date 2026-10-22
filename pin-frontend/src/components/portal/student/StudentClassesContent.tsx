"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Clock, Play, Download, Users, BookOpen, Video, 
  Eye, CheckCircle, PlayCircle, AlertCircle, ExternalLink, Maximize2
} from "lucide-react";
import { mockClasses, getTimeUntilClass, isClassLive, type ClassData } from "@/lib/mockClassData";

export default function StudentClassesContent() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activeClassId, setActiveClassId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only showing dynamic content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update clock every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Auto-open live classes when it's time
      mockClasses.forEach(cls => {
        if (cls.status === 'scheduled' && isClassLive(cls.scheduledDate, cls.scheduledTime, cls.duration)) {
          setActiveClassId(cls.id);
        }
      });
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const filters = ["all", "upcoming", "live", "completed", "missed"];
  
  // Filter classes based on selected filter
  const filteredClasses = mockClasses.filter(cls => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "upcoming") return cls.status === 'scheduled' && !isClassLive(cls.scheduledDate, cls.scheduledTime, cls.duration);
    if (selectedFilter === "live") return isClassLive(cls.scheduledDate, cls.scheduledTime, cls.duration);
    if (selectedFilter === "completed") return cls.status === 'completed';
    if (selectedFilter === "missed") return cls.status === 'completed' && cls.attendance === 'absent';
    return true;
  });

  // Smart sorting: Upcoming/scheduled classes FIRST, then completed classes by date (newest first)
  const sortedClasses = [...filteredClasses].sort((a, b) => {
    // Priority 1: Scheduled/upcoming classes always come first
    if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
    if (a.status !== 'scheduled' && b.status === 'scheduled') return 1;
    
    // Priority 2: Within same status, sort by date (newest first)
    const dateA = new Date(`${a.scheduledDate} ${a.scheduledTime}`);
    const dateB = new Date(`${b.scheduledDate} ${b.scheduledTime}`);
    
    // For upcoming classes: soonest first (ascending)
    if (a.status === 'scheduled' && b.status === 'scheduled') {
      return dateA.getTime() - dateB.getTime();
    }
    
    // For completed classes: newest first (descending)
    return dateB.getTime() - dateA.getTime();
  });

  const upcomingCount = mockClasses.filter(c => c.status === 'scheduled').length;
  const liveCount = mockClasses.filter(c => isClassLive(c.scheduledDate, c.scheduledTime, c.duration)).length;
  const missedCount = mockClasses.filter(c => c.status === 'completed' && c.attendance === 'absent').length;
  const recordedCount = mockClasses.filter(c => c.recordingUrl).length;

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
        >
          Live Classes & Recordings
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Join live classes, watch missed class recordings, and download materials
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
          style={{ backgroundColor: liveCount > 0 ? '#FEF3C7' : 'var(--surface)', borderColor: liveCount > 0 ? 'var(--gold)' : 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center relative"
              style={{ backgroundColor: '#DC2626' }}
            >
              <Play className="w-5 h-5 text-white" />
              {liveCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {liveCount}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Live Now
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
              style={{ backgroundColor: '#EF4444' }}
            >
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {missedCount}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Missed
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
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-md capitalize relative"
              style={{
                backgroundColor: selectedFilter === filter ? 'var(--navy)' : 'var(--surface)',
                color: selectedFilter === filter ? 'white' : 'var(--ink-muted)',
                border: '1px solid var(--rule)'
              }}
            >
              {filter === "all" ? "All Classes" : filter}
              {filter === "live" && liveCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {liveCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {sortedClasses.map((classItem) => {
          const timeUntil = getTimeUntilClass(classItem.scheduledDate, classItem.scheduledTime);
          const isLive = isClassLive(classItem.scheduledDate, classItem.scheduledTime, classItem.duration);
          const isActive = activeClassId === classItem.id;
          const isMissed = classItem.status === 'completed' && classItem.attendance === 'absent';

          return (
            <div
              key={classItem.id}
              className="p-6 rounded-2xl border transition-all"
              style={{ 
                backgroundColor: isLive ? '#FEF3C7' : 'var(--surface)', 
                borderColor: isLive ? 'var(--gold)' : 'var(--rule)',
                boxShadow: isLive ? '0 4px 20px rgba(217, 119, 6, 0.2)' : 'none'
              }}
            >
              {/* Live Indicator */}
              {isLive && (
                <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-red-500 text-white w-fit animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="font-bold text-sm">CLASS IS LIVE NOW!</span>
                </div>
              )}

              {/* Completed Class Badge */}
              {classItem.status === 'completed' && !isLive && (
                <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 w-fit">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold text-sm">Class Ended</span>
                </div>
              )}

              {/* Countdown Timer for Upcoming Classes */}
              {mounted && timeUntil && !isLive && (
                <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--navy-50)', border: '2px solid var(--navy)' }} suppressHydrationWarning>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" style={{ color: 'var(--navy)' }} />
                      <span className="font-bold" style={{ color: 'var(--navy)' }}>
                        Class starts in:
                      </span>
                    </div>
                    <div className="flex items-center gap-4" suppressHydrationWarning>
                      <div className="text-center">
                        <div className="text-3xl font-bold" style={{ color: 'var(--navy)', fontFamily: 'var(--font-display)' }}>
                          {timeUntil.hours}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>hours</div>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>:</div>
                      <div className="text-center">
                        <div className="text-3xl font-bold" style={{ color: 'var(--navy)', fontFamily: 'var(--font-display)' }}>
                          {timeUntil.minutes}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>minutes</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Class Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--gold-dark)' }}>
                      {classItem.cohort}
                    </p>
                    <h3 className="font-bold text-xl mb-1" style={{ color: 'var(--ink)' }}>
                      {classItem.topic}
                    </h3>
                    <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
                      <span className="font-medium" style={{ color: 'var(--navy)' }}>
                        {classItem.subject}
                      </span>
                      <span>{classItem.instructor}</span>
                    </div>
                  </div>
                  {isMissed && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" 
                         style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                      <AlertCircle className="w-3 h-3" />
                      Missed - Recording Available
                    </div>
                  )}
                </div>

                <p className="leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
                  {classItem.description}
                </p>
              </div>

              {/* Google Meet Join Section - Shows when live */}
              {(isLive || isActive) && classItem.googleMeetLink && (
                <div className="mb-4">
                  {/* Big Join Button */}
                  <div className="p-6 rounded-xl border-2 border-green-500 bg-green-50 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-bold text-gray-700">LIVE SESSION IN PROGRESS</span>
                    </div>
                    <a 
                      href={classItem.googleMeetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
                      style={{ backgroundColor: '#10B981', color: 'white' }}
                    >
                      <Video className="w-6 h-6" />
                      Join Live Class Now
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <p className="mt-3 text-xs text-gray-600">
                      Click to open Google Meet and join the session with {classItem.instructor}
                    </p>
                  </div>
                </div>
              )}

              {/* Recording Player - Auto-shown for missed classes */}
              {isMissed && classItem.recordingUrl && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                      📹 Class Recording (Auto-uploaded from Google Meet)
                    </p>
                  </div>
                  <div className="relative w-full rounded-xl overflow-hidden border-2" style={{ paddingBottom: '56.25%', borderColor: 'var(--rule)' }}>
                    <iframe
                      src={classItem.recordingUrl}
                      className="absolute top-0 left-0 w-full h-full"
                      allow="autoplay; fullscreen"
                      style={{ border: 'none' }}
                    />
                  </div>
                </div>
              )}

              {/* Class Details */}
              <div className="flex items-center gap-6 mb-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
                <div className="flex items-center gap-2" suppressHydrationWarning>
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(classItem.scheduledDate).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{classItem.scheduledTime} ({classItem.duration} mins)</span>
                </div>
              </div>

              {/* Class Materials */}
              {classItem.materials && classItem.materials.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                    📚 Class Materials:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {classItem.materials.map((material, index) => (
                      <a
                        key={index}
                        href={material.url}
                        download
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:shadow-md"
                        style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)' }}
                      >
                        <Download className="w-4 h-4" style={{ color: 'var(--navy)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                          {material.name}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                          ({material.size})
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--rule)' }}>
                {isLive && !isActive && (
                  <button 
                    onClick={() => setActiveClassId(classItem.id)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:shadow-lg hover:scale-[1.02] animate-pulse"
                    style={{ backgroundColor: '#DC2626' }}
                  >
                    <Play className="w-5 h-5" />
                    Join Live Class Now
                  </button>
                )}

                {timeUntil && !isLive && (
                  <button 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-all hover:shadow-md"
                    style={{ borderColor: 'var(--navy)', color: 'var(--navy)', backgroundColor: 'var(--surface)' }}
                  >
                    <Calendar className="w-4 h-4" />
                    Add to Calendar
                  </button>
                )}

                {classItem.recordingUrl && !isLive && (
                  <button 
                    className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition-all hover:shadow-md"
                    style={{ backgroundColor: 'var(--navy)' }}
                  >
                    <PlayCircle className="w-4 h-4" />
                    Watch Recording
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {sortedClasses.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--ink-faint)' }} />
          <p className="text-lg font-medium mb-2" style={{ color: 'var(--ink-muted)' }}>
            No classes found
          </p>
          <p className="text-sm" style={{ color: 'var(--ink-faint)' }}>
            Check back later for upcoming classes and recordings
          </p>
        </div>
      )}
    </div>
  );
}
