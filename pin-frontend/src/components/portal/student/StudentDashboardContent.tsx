"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, CheckCircle2, Clock, ChevronDown, Plus
} from "lucide-react";
import { apiFetch, getStoredUser, DEMO_MODE } from "@/lib/auth";
import { mockClasses } from "@/lib/mockClassData";
import { mockAssignments as allAssignments } from "@/lib/mockAssignmentsData";
import { mockFinances } from "@/lib/mockFinanceData";

interface Balance { total_fees_due: string; total_paid: string; balance_due: string; updated_at: string; }
interface Profile { registration_number: string; programme_display: string; diet: string; study_mode_display: string; date_enrolled: string; }

export default function StudentDashboardContent() {
  const router = useRouter();
  const user = getStoredUser();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Skip auth check in demo mode
    if (DEMO_MODE) {
      setLoading(false);
      return;
    }

    if (!user) { 
      router.replace("/portal/login?redirect=/portal/student"); 
      return; 
    }
    
    Promise.all([
      apiFetch<Balance>("/api/students/me/balance/").catch(() => null),
      apiFetch<Profile>("/api/students/me/profile/").catch(() => null),
    ]).then(([b, p]) => { 
      setBalance(b); 
      setProfile(p); 
    }).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (v: string | undefined) =>
    v ? `₦${Number(v).toLocaleString()}` : "—";

  // Calculate real learning progress from mock classes
  const completedClasses = mockClasses.filter(c => c.status === 'completed').length;
  const totalClasses = mockClasses.length;
  const progressPercentage = totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;
  
  const learningProgress = {
    currentProgram: "ICAN PROFESSIONAL LEVEL",
    papersCompleted: completedClasses,
    totalPapers: totalClasses,
    progressPercentage,
  };

  // Get upcoming classes (scheduled or live) sorted by date
  // Only compute on client to avoid hydration issues
  const upcomingClasses = mounted ? mockClasses
    .filter(c => c.status === 'scheduled' || c.status === 'live')
    .sort((a, b) => {
      const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
      const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3)
    .map(cls => {
      const now = new Date();
      const startTime = new Date(`${cls.scheduledDate}T${cls.scheduledTime}`);
      const endTime = new Date(startTime.getTime() + cls.duration * 60000);
      const isToday = startTime.toDateString() === now.toDateString();
      const isTomorrow = startTime.toDateString() === new Date(now.getTime() + 86400000).toDateString();
      
      return {
        course: cls.subject,
        title: cls.topic,
        time: `${startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
        day: isToday ? 'Today' : isTomorrow ? 'Tomorrow' : startTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      };
    }) : [];

  // Get pending assignments
  const pendingAssignments = mounted ? allAssignments
    .filter(a => a.status === 'pending' || a.status === 'submitted')
    .slice(0, 3)
    .map(assignment => {
      const now = new Date();
      const dueDate = new Date(assignment.dueDate);
      const isToday = dueDate.toDateString() === now.toDateString();
      const isTomorrow = dueDate.toDateString() === new Date(now.getTime() + 86400000).toDateString();
      
      let dueText = '';
      if (isToday) {
        dueText = `Due Today at ${dueDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
      } else if (isTomorrow) {
        dueText = `Due Tomorrow at ${dueDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
      } else {
        dueText = `Due ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      }
      
      return {
        id: assignment.id,
        course: assignment.course,
        title: assignment.title,
        due: dueText
      };
    }) : [];

  // Mock learning activity (can be enhanced later with real data)
  const learningActivity = {
    hoursThisWeek: completedClasses * 2, // Assume 2 hours per completed class
    coursesActive: [...new Set(mockClasses.map(c => c.course))].length,
    weeklyIncrease: 25,
    activityData: [40, 35, 48, 42, 38, 45, 40],
  };

  // Mock classmates (can be populated from real data later)
  const mockClassmates = [
    { name: "John", avatar: "👨‍💼" },
    { name: "Kelly", avatar: "👩‍💼" },
    { name: "Julie", avatar: "👩‍🎓" },
    { name: "Rachel", avatar: "👩‍💻" },
    { name: "Richard", avatar: "👨‍🏫" },
    { name: "Jenny", avatar: "👩‍🔬" },
    { name: "George", avatar: "👨‍💻" },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-6 md:mb-8">
        <h1 
          className="text-xl md:text-2xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
        >
          Welcome back, {user?.first_name || 'Michael'}!
        </h1>
        <p className="text-sm md:text-base" style={{ color: 'var(--ink-muted)' }}>
          Here's what's happening with your studies today
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        
        {/* Learning Progress Card */}
        <div 
          className="md:col-span-2 xl:col-span-1 p-4 md:p-6 rounded-2xl md:rounded-3xl transition-all hover:shadow-2xl border relative overflow-hidden group"
          style={{ 
            backgroundColor: 'var(--surface)', 
            borderColor: 'var(--rule)',
            background: 'linear-gradient(135deg, var(--surface) 0%, var(--navy-50) 100%)'
          }}
        >
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${encodeURIComponent('1E3A8A').substring(1)}' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='27' cy='7' r='2'/%3E%3Ccircle cx='47' cy='7' r='2'/%3E%3Ccircle cx='7' cy='27' r='2'/%3E%3Ccircle cx='27' cy='27' r='2'/%3E%3Ccircle cx='47' cy='27' r='2'/%3E%3Ccircle cx='7' cy='47' r='2'/%3E%3Ccircle cx='27' cy='47' r='2'/%3E%3Ccircle cx='47' cy='47' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          
          {/* Header with Icons */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
                  Learning Progress
                </h3>
              </div>
            </div>
            
            <div 
              className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg animate-pulse"
              style={{ 
                background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)'
              }}
            >
              {learningProgress.progressPercentage}% Complete
            </div>
          </div>
          
          {/* Enhanced Circular Progress */}
          <div className="flex items-center justify-center mb-6 md:mb-8 relative">
            <div className="relative w-28 h-28 md:w-40 md:h-40 group-hover:scale-105 transition-transform duration-500">
              {/* Outer Ring with Glow */}
              <div 
                className="absolute inset-0 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                style={{
                  background: 'conic-gradient(from 0deg, var(--navy) 0%, var(--gold) 50%, var(--navy) 100%)',
                  filter: 'blur(8px)',
                  animation: 'spin 20s linear infinite'
                }}
              />
              
              <svg className="w-28 h-28 md:w-40 md:h-40 transform -rotate-90 relative z-10" viewBox="0 0 120 120">
                {/* Background Circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="var(--rule)"
                  strokeWidth="4"
                  fill="none"
                  opacity="0.3"
                />
                
                {/* Progress Circle with Gradient */}
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'var(--navy)', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: 'var(--gold)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'var(--navy)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="url(#progressGradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - learningProgress.progressPercentage / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 8px rgba(30, 58, 138, 0.3))"
                />
              </svg>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div 
                  className="text-2xl md:text-3xl font-bold mb-1 transition-all duration-500 group-hover:scale-110"
                  style={{ 
                    color: 'var(--ink)', 
                    fontFamily: 'var(--font-display)',
                    background: 'linear-gradient(135deg, var(--navy) 0%, var(--gold) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {learningProgress.papersCompleted}
                </div>
                <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                  PAPERS
                </div>
                <div className="text-xs mt-1 text-center leading-tight" style={{ color: 'var(--ink-faint)' }}>
                  of {learningProgress.totalPapers} required
                </div>
              </div>
            </div>
          </div>
          
          {/* Program Info with Enhanced Design */}
          <div className="text-center relative z-10">
            <div 
              className="inline-block px-4 py-2 rounded-2xl mb-3 shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, var(--navy-50) 0%, var(--surface) 100%)',
                border: '2px solid var(--rule)'
              }}
            >
              <p className="text-xs font-bold tracking-wider mb-1" style={{ color: 'var(--ink-faint)' }}>
                PROFESSIONAL CERTIFICATION
              </p>
              <p className="font-bold text-sm leading-tight" style={{ color: 'var(--navy)' }}>
                {learningProgress.currentProgram}
              </p>
            </div>
            
            {/* Progress Milestones */}
            <div className="flex justify-between items-center mt-4 px-2">
              {[
                { label: 'Enrolled', value: 0, achieved: true }, // TODO: Confirm PIN Associate's preferred terminology
                { label: 'In Progress', value: 50, achieved: true },
                { label: 'Qualified', value: 100, achieved: false } // TODO: Some bodies use "Chartered" - confirm PIN Associate preference
              ].map((milestone, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      milestone.achieved ? 'shadow-lg' : ''
                    }`}
                    style={{ 
                      backgroundColor: milestone.achieved ? 'var(--gold)' : 'var(--rule)',
                      boxShadow: milestone.achieved ? '0 0 12px rgba(244, 196, 48, 0.6)' : 'none'
                    }}
                  />
                  <span className="text-xs font-medium mt-1" style={{ 
                    color: milestone.achieved ? 'var(--navy)' : 'var(--ink-faint)'
                  }}>
                    {milestone.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Finances Card */}
        <div 
          className="p-4 md:p-6 rounded-2xl transition-all hover:shadow-lg border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <h3 className="font-semibold mb-4" style={{ color: 'var(--ink)' }}>
            Your Finances
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--ink-muted)' }}>
            Financial and Billing Details
          </p>
          
          <div 
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
          >
            {DEMO_MODE 
              ? `₦${mockFinances.outstandingBalance.toLocaleString()}`
              : (fmt(balance?.balance_due) || '₦0.00')
            }
          </div>
          <p className="text-xs mb-6 font-semibold tracking-wider" style={{ color: 'var(--ink-muted)' }}>
            OUTSTANDING BALANCE
          </p>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            <div 
              className="p-3 md:p-4 rounded-lg md:rounded-xl transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              <div className="text-white text-xs md:text-sm font-bold mb-1">
                TOTAL
              </div>
              <div className="text-white/80 text-xs mb-1">FEES</div>
              <div className="text-white font-bold text-sm md:text-base">
                ₦{mockFinances.totalFees.toLocaleString()}
              </div>
            </div>
            
            <div 
              className="p-3 md:p-4 rounded-lg md:rounded-xl transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--gold)' }}
            >
              <div className="text-white text-xs md:text-sm font-bold mb-1">
                TOTAL
              </div>
              <div className="text-white/80 text-xs mb-1">PAID</div>
              <div className="text-white font-bold text-sm md:text-base">
                ₦{mockFinances.totalPaid.toLocaleString()}
              </div>
            </div>
          </div>
          
          <Link 
            href="/portal/student/fees"
            className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all hover:shadow-md hover:scale-[1.02] block text-center"
            style={{ backgroundColor: 'var(--navy)' }}
          >
            View Full Financial Details
          </Link>
        </div>

        {/* Weekly Schedule Card */}
        <div 
          className="p-4 md:p-6 rounded-2xl transition-all hover:shadow-lg border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <h3 className="font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            Your Weekly Schedule
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--ink-muted)' }}>
            Let's see what we have today
          </p>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-xs mb-1 font-medium" style={{ color: 'var(--ink-muted)' }}>
                  {day}
                </div>
                <div 
                  className="w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-xs md:text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: index === 3 ? 'var(--navy)' : 'transparent',
                    color: index === 3 ? 'white' : 'var(--ink)',
                    boxShadow: index === 3 ? '0 4px 12px rgba(30, 58, 138, 0.3)' : 'none'
                  }}
                >
                  {['01', '02', '03', '04', '05', '06', '07'][index]}
                </div>
              </div>
            ))}
          </div>
          
          {/* Today's Classes */}
          <div className="space-y-3">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((cls, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-opacity-50" style={{ backgroundColor: 'transparent' }}>
                  <div 
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: 'var(--gold)' }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                      {cls.course}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                      {cls.title}
                    </p>
                    <p className="text-xs font-medium" style={{ color: 'var(--ink-faint)' }}>
                      {cls.time} • {cls.day}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4" style={{ color: 'var(--ink-muted)' }}>
                <p className="text-sm">No upcoming classes scheduled</p>
              </div>
            )}
          </div>
        </div>
        {/* Learning Activity Card */}
        <div 
          className="md:col-span-2 xl:col-span-2 p-4 md:p-6 rounded-2xl relative transition-all hover:shadow-lg border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold" style={{ color: 'var(--ink)' }}>
              Your Learning Activity
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                Week 01 - 07
              </span>
              <ChevronDown className="w-4 h-4 transition-transform hover:rotate-180" style={{ color: 'var(--ink-muted)' }} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-8">
            <div>
              <div 
                className="text-2xl md:text-4xl font-bold mb-2"
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
              >
                {learningActivity.hoursThisWeek}
              </div>
              <div className="text-xs md:text-sm font-semibold tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                HOURS
              </div>
            </div>
            
            <div>
              <div 
                className="text-2xl md:text-4xl font-bold mb-2"
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
              >
                {learningActivity.coursesActive}
              </div>
              <div className="text-xs md:text-sm font-semibold tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                COURSES
              </div>
            </div>
            
            <div>
              <div 
                className="text-2xl md:text-4xl font-bold mb-2 flex items-center gap-2"
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
              >
                {learningActivity.weeklyIncrease}%
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 animate-bounce" style={{ color: 'var(--gold)' }} />
              </div>
              <div className="text-xs md:text-sm font-semibold tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                Since Last week
              </div>
            </div>
          </div>
          
          {/* Activity Chart - Line Chart */}
          <div className="h-24 md:h-32 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full border-b opacity-10" style={{ borderColor: 'var(--rule)' }} />
              ))}
            </div>

            {/* Line Chart SVG */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'var(--navy)', stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: 'var(--gold)', stopOpacity: 0.8 }} />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'var(--navy)', stopOpacity: 0.2 }} />
                  <stop offset="100%" style={{ stopColor: 'var(--navy)', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              
              {/* Area under the line */}
              <path
                d={`M 0,${96 - (learningActivity.activityData[0] / 50) * 96} ${learningActivity.activityData.map((value, index) => 
                  `L ${(index / 6) * 100},${96 - (value / 50) * 96}`
                ).join(' ')} L 100,96 L 0,96 Z`}
                fill="url(#areaGradient)"
                vectorEffect="non-scaling-stroke"
              />
              
              {/* Line */}
              <path
                d={`M 0,${96 - (learningActivity.activityData[0] / 50) * 96} ${learningActivity.activityData.map((value, index) => 
                  `L ${(index / 6) * 100},${96 - (value / 50) * 96}`
                ).join(' ')}`}
                stroke="url(#lineGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              
              {/* Data points */}
              {learningActivity.activityData.map((value, index) => (
                <circle
                  key={index}
                  cx={`${(index / 6) * 100}%`}
                  cy={`${96 - (value / 50) * 96}%`}
                  r="4"
                  fill={index === 5 ? 'var(--gold)' : 'var(--navy)'}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all hover:r-6"
                  style={{ filter: index === 5 ? 'drop-shadow(0 2px 4px rgba(244, 196, 48, 0.4))' : 'none' }}
                />
              ))}
            </svg>

            {/* Day labels */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-1">
              {['Mon 01', 'Tue 02', 'Wed 03', 'Thu 04', 'Fri 05', 'Sat 06', 'Sun 07'].map((day, index) => (
                <div key={index} className="text-xs font-medium hidden sm:block" style={{ color: 'var(--ink-muted)' }}>
                  {day}
                </div>
              ))}
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <div key={index} className="text-xs font-medium sm:hidden" style={{ color: 'var(--ink-muted)' }}>
                  {day}
                </div>
              ))}
            </div>
          </div>
          
          {/* Hours Badge */}
          <div className="absolute top-4 right-4">
            <div 
              className="px-3 py-1 rounded-full text-white text-sm font-semibold shadow-lg animate-pulse"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              {learningActivity.hoursThisWeek} Hours
            </div>
          </div>
        </div>

        {/* Today's Workplan */}
        <div 
          className="p-4 md:p-6 rounded-2xl"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--rule)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold" style={{ color: 'var(--ink)' }}>
              Today's Workplan
            </h3>
            <Link 
              href="/portal/student/assignments"
              className="text-xs font-semibold hover:underline transition-colors"
              style={{ color: 'var(--navy)' }}
            >
              View All →
            </Link>
          </div>
          <p className="text-sm mb-6" style={{ color: 'var(--ink-muted)' }}>
            Where to focus today
          </p>
          
          <div className="space-y-4">
            {pendingAssignments.length > 0 ? (
              pendingAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-start gap-3">
                  <div 
                    className="w-5 h-5 rounded flex items-center justify-center mt-0.5"
                    style={{ border: '2px solid var(--rule)' }}
                  >
                    <div 
                      className="w-2 h-2 rounded-sm"
                      style={{ backgroundColor: 'var(--navy)' }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                      {assignment.course}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                      {assignment.title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                      {assignment.due}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4" style={{ color: 'var(--ink-muted)' }}>
                <p className="text-sm">No pending assignments</p>
              </div>
            )}
          </div>
        </div>

        {/* Classmates Card */}
        <div 
          className="md:col-span-2 xl:col-span-3 p-4 md:p-6 rounded-2xl transition-all hover:shadow-lg border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <h3 className="font-semibold mb-4 md:mb-6" style={{ color: 'var(--ink)' }}>
            Your Coursemates
          </h3>
          
          <div className="flex items-center gap-3 md:gap-4 overflow-x-auto pb-2">
           
            
            {mockClassmates.map((classmate, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-shrink-0 group">
                <div 
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg md:text-2xl border-2 relative transition-all hover:scale-110 group-hover:shadow-lg"
                  style={{ borderColor: 'var(--navy)', backgroundColor: 'var(--surface)' }}
                >
                  <span className="transition-transform group-hover:scale-110">{classmate.avatar}</span>
                  <div 
                    className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white animate-pulse"
                    style={{ backgroundColor: '#10B981' }}
                  />
                </div>
                <span className="text-xs font-medium transition-colors group-hover:font-semibold" style={{ color: 'var(--ink-muted)' }}>
                  {classmate.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}