"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  CreditCard, BookOpen, User, ArrowRight, TrendingUp, CheckCircle2, Clock, 
  Calendar, BarChart3, Users, Settings, Sun, Moon, Bell, Search, Plus,
  Target, Award, Activity, ChevronDown, Star, BookOpenCheck, GraduationCap
} from "lucide-react";
import { apiFetch, getStoredUser } from "@/lib/auth";

interface FeeBalance { total_minor: number; paid_minor: number; balance_minor: number; }
interface Profile { registration_number: string; programme_display: string; diet: string; study_mode_display: string; date_enrolled: string; }

// Mock data for the demo - replace with real data later
const mockLearningProgress = {
  currentProgram: "MS IN TRANSFORMATIONAL LEADERSHIP",
  creditsCompleted: 18,
  creditsRequired: 36,
  progressPercentage: 50,
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

export default function ModernStudentDashboard() {
  const router = useRouter();
  const user = getStoredUser();
  const [feeBalances, setFeeBalances] = useState<FeeBalance[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    if (!user) { 
      router.replace("/portal/login?redirect=/portal/student"); 
      return; 
    }
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    Promise.all([
      apiFetch<FeeBalance[]>("/api/v1/students/me/fee-balances").catch(() => []),
      apiFetch<Profile>("/api/students/me/profile/").catch(() => null),
    ]).then(([balances, p]) => { 
      setFeeBalances(Array.isArray(balances) ? balances : []); 
      setProfile(p); 
    }).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const outstandingNaira = feeBalances.reduce((sum, item) => sum + item.balance_minor, 0) / 100;
  const paidNaira = feeBalances.reduce((sum, item) => sum + item.paid_minor, 0) / 100;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--bg)' }}>
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--navy)' }}
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 
                  className="text-xl font-bold"
                  style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
                >
                  Welcome back, {user?.first_name || 'Michael'}!
                </h1>
                <p style={{ color: 'var(--ink-muted)', fontSize: '0.875rem' }}>
                  Student ID: {profile?.registration_number || '1234567'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl transition-colors"
                style={{ 
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--rule)'
                }}
              >
                {isDarkMode ? <Sun className="w-5 h-5" style={{ color: 'var(--ink-muted)' }} /> : <Moon className="w-5 h-5" style={{ color: 'var(--ink-muted)' }} />}
              </button>
              <button
                className="p-2 rounded-xl transition-colors"
                style={{ 
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--rule)'
                }}
              >
                <Bell className="w-5 h-5" style={{ color: 'var(--ink-muted)' }} />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: 'var(--navy)' }}
              >
                {user?.first_name?.charAt(0) || 'M'}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                  {user?.first_name || 'Michael'} {user?.last_name || 'Smith'}
                </p>
                <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                  Student
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div 
          className="w-64 min-h-screen border-r p-6"
          style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--bg)' }}
        >
          <nav className="space-y-2">{[
              { icon: BarChart3, label: 'Dashboard', active: true },
              { icon: BookOpen, label: 'Classes', active: false },
              { icon: User, label: 'Academic History', active: false },
              { icon: Target, label: 'Degree Planner', active: false },
              { icon: CreditCard, label: 'Finances', active: false },
              { icon: Settings, label: 'Help & Support', active: false },
              { icon: BookOpenCheck, label: 'Resources', active: false },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                style={{
                  backgroundColor: item.active ? 'var(--navy)' : 'transparent',
                  color: item.active ? 'white' : 'var(--ink-muted)',
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
          {/* AI Assistant Card */}
          <div 
            className="mt-8 p-4 rounded-2xl"
            style={{ backgroundColor: 'var(--navy)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Hi {user?.first_name || 'Michael'}!</p>
                <p className="text-white/80 text-xs">Your new personal advisor</p>
              </div>
            </div>
            <p className="text-white/90 text-xs mb-3">
              Just let me know how can I help today
            </p>
            <button 
              className="w-full bg-white/20 text-white text-xs font-semibold py-2 px-4 rounded-lg hover:bg-white/30 transition-colors"
            >
              Ask me anything
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Learning Progress Card */}
            <div 
              className="lg:col-span-1 p-6 rounded-2xl"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--rule)' }}
            >
              <h3 className="font-semibold mb-4" style={{ color: 'var(--ink)' }}>
                Your Learning Progress
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--ink-muted)' }}>
                Keep up! You're doing great!
              </p>
              
              {/* Circular Progress */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      stroke="var(--rule)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      stroke="var(--navy)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      strokeDashoffset={`${2 * Math.PI * 48 * (1 - mockLearningProgress.progressPercentage / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
                    >
                      {mockLearningProgress.creditsCompleted}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                      SATISFIED CREDITS
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--ink-faint)' }}>
                      OF {mockLearningProgress.creditsRequired} REQUIRED
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--ink-faint)' }}>
                  MS IN
                </p>
                <p className="font-bold text-sm" style={{ color: 'var(--navy)' }}>
                  TRANSFORMATIONAL<br />LEADERSHIP
                </p>
              </div>
            </div>

            {/* Finances Card */}
            <div 
              className="lg:col-span-1 p-6 rounded-2xl"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--rule)' }}
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
                {loading ? "…" : `₦${outstandingNaira.toLocaleString("en-NG")}`}
              </div>
              <p className="text-xs mb-6" style={{ color: 'var(--ink-muted)' }}>
                CURRENT BALANCE
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div 
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: 'var(--navy)' }}
                >
                  <div className="text-white text-sm font-bold mb-1">BALANCE</div>
                  <div className="text-white text-xs mb-1">REMAINING</div>
                  <div className="text-white font-bold">{loading ? "…" : `₦${outstandingNaira.toLocaleString("en-NG")}`}</div>
                  <div className="text-white/70 text-xs">Across active fee plans</div>
                </div>
                
                <div 
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: 'var(--ink-faint)' }}
                >
                  <div className="text-white text-sm font-bold mb-1">
                    TOTAL
                  </div>
                  <div className="text-white text-xs mb-1">PAID</div>
                  <div className="text-white font-bold">{loading ? "…" : `₦${paidNaira.toLocaleString("en-NG")}`}</div>
                  <div className="text-white/70 text-xs">Confirmed transactions</div>
                </div>
              </div>
              
              <button 
                className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-colors"
                style={{ backgroundColor: 'var(--navy)' }}
              >
                Go to Your Account
              </button>
            </div>

            {/* Weekly Schedule Card */}
            <div 
              className="lg:col-span-1 p-6 rounded-2xl"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--rule)' }}
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
                    <div className="text-xs mb-1" style={{ color: 'var(--ink-muted)' }}>
                      {day}
                    </div>
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold"
                      style={{
                        backgroundColor: index === 3 ? 'var(--navy)' : 'transparent',
                        color: index === 3 ? 'white' : 'var(--ink)'
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
                  <div key={index} className="flex items-center gap-3">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--gold)' }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                        {cls.course}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                        {cls.title}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                        {cls.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Learning Activity Card */}
            <div 
              className="lg:col-span-2 p-6 rounded-2xl relative"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--rule)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold" style={{ color: 'var(--ink)' }}>
                  Your Learning Activity
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                    Week 01 - 07
                  </span>
                  <ChevronDown className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
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
                  <div className="text-sm" style={{ color: 'var(--ink-muted)' }}>
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
                  <div className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                    COURSES
                  </div>
                </div>
                
                <div>
                  <div 
                    className="text-4xl font-bold mb-2 flex items-center gap-2"
                    style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
                  >
                    {mockLearningActivity.weeklyIncrease}%
                    <TrendingUp className="w-6 h-6" style={{ color: 'var(--gold)' }} />
                  </div>
                  <div className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                    Since Last week
                  </div>
                </div>
              </div>
              
              {/* Activity Chart */}
              <div className="h-32 flex items-end gap-2">
                {mockLearningActivity.activityData.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full rounded-t-lg transition-all duration-500"
                      style={{ 
                        height: `${(value / 50) * 100}%`,
                        backgroundColor: index === 5 ? 'var(--navy)' : 'var(--rule)'
                      }}
                    />
                    <div className="text-xs mt-2" style={{ color: 'var(--ink-muted)' }}>
                      {['Mon 01', 'Tue 02', 'Wed 03', 'Thu 04', 'Fri 05', 'Sat 06', 'Sun 07'][index]}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Hours Badge */}
              <div className="absolute top-4 right-4">
                <div 
                  className="px-3 py-1 rounded-full text-white text-sm font-semibold"
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
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                Today's Workplan
              </h3>
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
              className="lg:col-span-3 p-6 rounded-2xl"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--rule)' }}
            >
              <h3 className="font-semibold mb-6" style={{ color: 'var(--ink)' }}>
                Your Classmates
              </h3>
              
              <div className="flex items-center gap-4">
                <button 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 border-dashed transition-colors"
                  style={{ borderColor: 'var(--rule)', color: 'var(--ink-muted)' }}
                >
                  <Plus className="w-6 h-6" />
                </button>
                
                {mockClassmates.map((classmate, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 relative"
                      style={{ borderColor: 'var(--navy)', backgroundColor: 'var(--surface)' }}
                    >
                      {classmate.avatar}
                      <div 
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                        style={{ backgroundColor: '#10B981' }}
                      />
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'var(--ink-muted)' }}>
                      {classmate.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
