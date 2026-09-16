"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, CheckCircle2, Clock, ChevronDown, Plus
} from "lucide-react";
import { apiFetch, getStoredUser } from "@/lib/auth";

interface Balance { total_fees_due: string; total_paid: string; balance_due: string; updated_at: string; }
interface Profile { registration_number: string; programme_display: string; diet: string; study_mode_display: string; date_enrolled: string; }

// Mock data for the demo - replace with real data later
const mockLearningProgress = {
  currentProgram: "ICAN PROFESSIONAL LEVEL", // TODO: Confirm exact program naming convention PIN Associate uses
  papersCompleted: 8, // TODO: Confirm if progress is tracked by papers, subjects, levels, or another unit
  totalPapers: 15, // TODO: Get actual structure from PIN Associate
  progressPercentage: 53, // Calculated from papers completed
};

const mockLearningActivity = {
  hoursThisWeek: 45,
  coursesActive: 3,
  weeklyIncrease: 25,
  activityData: [40, 35, 48, 42, 38, 45, 40],
};

const mockUpcomingClasses = [
  { course: "MBA 610", title: "Leading Organizations", time: "9:00 AM - 9:00 AM", day: "Today" },
  { course: "ITEC 626", title: "Information Systems Structure", time: "10:00 AM - 11:00 AM", day: "Today" },
  { course: "PMAN 635", title: "Projects Quantitative Methods", time: "01:00 PM - 02:00 PM", day: "Today" },
];

const mockAssignments = [
  { id: 1, course: "PMAN 635", title: "Assignment # 2", due: "Due Today at 11:00 PM" },
  { id: 2, course: "ITEC 626", title: "Assignment # 3", due: "Due Tomorrow at 11:00 PM" },
  { id: 3, course: "MBA 610", title: "Evaluation # 3", due: "Next Week" },
];

const mockClassmates = [
  { name: "John", avatar: "👨‍💼" },
  { name: "Kelly", avatar: "👩‍💼" },
  { name: "Julie", avatar: "👩‍🎓" },
  { name: "Rachel", avatar: "👩‍💻" },
  { name: "Richard", avatar: "👨‍🏫" },
  { name: "Jenny", avatar: "👩‍🔬" },
  { name: "George", avatar: "👨‍💻" },
];

export default function StudentDashboardContent() {
  const router = useRouter();
  const user = getStoredUser();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
        >
          Welcome back, {user?.first_name || 'Michael'}!
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Here's what's happening with your studies today
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Learning Progress Card */}
        <div 
          className="lg:col-span-1 p-6 rounded-3xl transition-all hover:shadow-2xl border relative overflow-hidden group"
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
              53% Complete
            </div>
          </div>
          
          {/* Enhanced Circular Progress */}
          <div className="flex items-center justify-center mb-8 relative">
            <div className="relative w-40 h-40 group-hover:scale-105 transition-transform duration-500">
              {/* Outer Ring with Glow */}
              <div 
                className="absolute inset-0 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                style={{
                  background: 'conic-gradient(from 0deg, var(--navy) 0%, var(--gold) 50%, var(--navy) 100%)',
                  filter: 'blur(8px)',
                  animation: 'spin 20s linear infinite'
                }}
              />
              
              <svg className="w-40 h-40 transform -rotate-90 relative z-10" viewBox="0 0 120 120">
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
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - mockLearningProgress.progressPercentage / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 8px rgba(30, 58, 138, 0.3))"
                />
              </svg>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div 
                  className="text-3xl font-bold mb-1 transition-all duration-500 group-hover:scale-110"
                  style={{ 
                    color: 'var(--ink)', 
                    fontFamily: 'var(--font-display)',
                    background: 'linear-gradient(135deg, var(--navy) 0%, var(--gold) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {mockLearningProgress.papersCompleted}
                </div>
                <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                  PAPERS
                </div>
                <div className="text-xs mt-1 text-center leading-tight" style={{ color: 'var(--ink-faint)' }}>
                  of {mockLearningProgress.totalPapers} required
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
                {mockLearningProgress.currentProgram}
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
          className="lg:col-span-1 p-6 rounded-2xl transition-all hover:shadow-lg border"
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
            {fmt(balance?.balance_due) || '₦150.00'}
          </div>
          <p className="text-xs mb-6 font-semibold tracking-wider" style={{ color: 'var(--ink-muted)' }}>
            CURRENT BALANCE
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div 
              className="p-4 rounded-xl transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              <div className="text-white text-sm font-bold mb-1">
                NEXT
              </div>
              <div className="text-white/80 text-xs mb-1">PAYMENT</div>
              <div className="text-white font-bold">₦150.00</div>
              <div className="text-white/70 text-xs">August 30,2021</div>
            </div>
            
            <div 
              className="p-4 rounded-xl transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--ink-faint)' }}
            >
              <div className="text-white text-sm font-bold mb-1">
                LAST
              </div>
              <div className="text-white/80 text-xs mb-1">PAYMENT</div>
              <div className="text-white font-bold">₦200.00</div>
              <div className="text-white/70 text-xs">July 20,2021</div>
            </div>
          </div>
          
          <button 
            className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all hover:shadow-md hover:scale-[1.02]"
            style={{ backgroundColor: 'var(--navy)' }}
          >
            Go to Your Account
          </button>
        </div>

        {/* Weekly Schedule Card */}
        <div 
          className="lg:col-span-1 p-6 rounded-2xl transition-all hover:shadow-lg border"
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
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-all hover:scale-105"
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
            {mockUpcomingClasses.map((cls, index) => (
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
                    {cls.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Learning Activity Card */}
        <div 
          className="lg:col-span-2 p-6 rounded-2xl relative transition-all hover:shadow-lg border"
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
          
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div>
              <div 
                className="text-4xl font-bold mb-2"
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
              >
                {mockLearningActivity.hoursThisWeek}
              </div>
              <div className="text-sm font-semibold tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                HOURS
              </div>
            </div>
            
            <div>
              <div 
                className="text-4xl font-bold mb-2"
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
              >
                {mockLearningActivity.coursesActive}
              </div>
              <div className="text-sm font-semibold tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                COURSES
              </div>
            </div>
            
            <div>
              <div 
                className="text-4xl font-bold mb-2 flex items-center gap-2"
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
              >
                {mockLearningActivity.weeklyIncrease}%
                <TrendingUp className="w-6 h-6 animate-bounce" style={{ color: 'var(--gold)' }} />
              </div>
              <div className="text-sm font-semibold tracking-wider" style={{ color: 'var(--ink-muted)' }}>
                Since Last week
              </div>
            </div>
          </div>
          
          {/* Activity Chart */}
          <div className="h-32 flex items-end gap-2">
            {mockLearningActivity.activityData.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full rounded-t-lg transition-all duration-700 hover:scale-105 group-hover:shadow-lg"
                  style={{ 
                    height: `${(value / 50) * 100}%`,
                    backgroundColor: index === 5 ? 'var(--navy)' : 'var(--rule)',
                    boxShadow: index === 5 ? '0 4px 12px rgba(30, 58, 138, 0.3)' : 'none'
                  }}
                />
                <div className="text-xs mt-2 font-medium transition-colors group-hover:text-gray-900" style={{ color: 'var(--ink-muted)' }}>
                  {['Mon 01', 'Tue 02', 'Wed 03', 'Thu 04', 'Fri 05', 'Sat 06', 'Sun 07'][index]}
                </div>
              </div>
            ))}
          </div>
          
          {/* Hours Badge */}
          <div className="absolute top-4 right-4">
            <div 
              className="px-3 py-1 rounded-full text-white text-sm font-semibold shadow-lg animate-pulse"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              29 Hours
            </div>
          </div>
        </div>

        {/* Today's Workplan */}
        <div 
          className="lg:col-span-1 p-6 rounded-2xl"
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
            {mockAssignments.map((assignment) => (
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
            ))}
          </div>
        </div>

        {/* Classmates Card */}
        <div 
          className="lg:col-span-3 p-6 rounded-2xl transition-all hover:shadow-lg border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <h3 className="font-semibold mb-6" style={{ color: 'var(--ink)' }}>
            Your Coursemates
          </h3>
          
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
           
            
            {mockClassmates.map((classmate, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-shrink-0 group">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 relative transition-all hover:scale-110 group-hover:shadow-lg"
                  style={{ borderColor: 'var(--navy)', backgroundColor: 'var(--surface)' }}
                >
                  <span className="transition-transform group-hover:scale-110">{classmate.avatar}</span>
                  <div 
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white animate-pulse"
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