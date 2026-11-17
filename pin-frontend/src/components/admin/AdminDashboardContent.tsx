"use client";

import { useState } from "react";
import { Users, DollarSign, Calendar, TrendingUp, Clock, PlusCircle, FileText, TrendingDown } from "lucide-react";
import { 
  getSystemStats, 
  formatNaira, 
  mockEnrollments, 
  getRecentActivity,
  getRevenueChartData,
  getEnrollmentChartData,
  getProgrammeBreakdown,
  mockAdminClasses
} from "@/lib/mockAdminData";
import LineChart from "@/components/admin/charts/LineChart";
import AreaChart from "@/components/admin/charts/AreaChart";
import BarChart from "@/components/admin/charts/BarChart";
import CalendarWidget from "./CalendarWidget";
import TopPerformers from "./TopPerformers";
import CreateClassModal from "./modals/CreateClassModal";
import AddStudentModal from "./modals/AddStudentModal";
import GenerateReportModal from "./modals/GenerateReportModal";

export default function AdminDashboardContent() {
  const stats = getSystemStats();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '3m' | 'all'>('30d');
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const recentEnrollments = mockEnrollments.slice(0, 5);
  const recentActivity = getRecentActivity(6);
  const revenueData = getRevenueChartData();
  const enrollmentData = getEnrollmentChartData();
  const programmeData = getProgrammeBreakdown();
  const upcomingClasses = mockAdminClasses
    .filter(c => c.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-6">
      {/* Hero Section with Gradient */}
      <div 
        className="p-8 rounded-2xl relative overflow-hidden mb-8"
        style={{
          background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 50%, var(--gold) 0%, transparent 50%)',
          }} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3 text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome Back! 👋
          </h1>
          <p className="text-white opacity-90 mb-6 max-w-2xl">
            Complete system overview with real-time analytics, enrollment tracking, and financial insights
          </p>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowCreateClass(true)}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)' }}
            >
              <PlusCircle className="w-4 h-4" />
              Create Class
            </button>
            <button 
              onClick={() => setShowAddStudent(true)}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:bg-white/20"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <Users className="w-4 h-4" />
              Add Student
            </button>
            <button 
              onClick={() => setShowGenerateReport(true)}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:bg-white/20"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards with Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div 
          className="p-6 rounded-2xl border relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy)] to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          <div className="relative z-10">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%)' }}
            >
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
              {stats.totalUsers}
            </h3>
            <p className="text-sm mb-2" style={{ color: 'var(--ink-muted)' }}>
              Total Users
            </p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" style={{ color: 'var(--success-text)' }} />
              <p className="text-xs font-semibold" style={{ color: 'var(--success-text)' }}>
                +{stats.newUsersThisMonth} this month
              </p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div 
          className="p-6 rounded-2xl border relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          <div className="relative z-10">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--success-text) 0%, var(--success-bg) 100%)' }}
            >
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
              {formatNaira(stats.totalRevenue)}
            </h3>
            <p className="text-sm mb-2" style={{ color: 'var(--ink-muted)' }}>
              Total Revenue
            </p>
            <p className="text-xs font-semibold" style={{ color: 'var(--success-text)' }}>
              {formatNaira(stats.revenueThisMonth)} this month
            </p>
          </div>
        </div>

        {/* Active Classes */}
        <div 
          className="p-6 rounded-2xl border relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)] to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          <div className="relative z-10">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
            >
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
              {stats.activeClasses}
            </h3>
            <p className="text-sm mb-2" style={{ color: 'var(--ink-muted)' }}>
              Active Classes
            </p>
            <p className="text-xs font-semibold" style={{ color: 'var(--warning-text)' }}>
              {stats.upcomingClasses} upcoming
            </p>
          </div>
        </div>

        {/* Total Enrollments */}
        <div 
          className="p-6 rounded-2xl border relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          <div className="relative z-10">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--info-text) 0%, var(--info-bg) 100%)' }}
            >
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
              {stats.totalEnrollments}
            </h3>
            <p className="text-sm mb-2" style={{ color: 'var(--ink-muted)' }}>
              Total Enrollments
            </p>
            <p className="text-xs font-semibold" style={{ color: 'var(--info-text)' }}>
              {stats.completedClasses} completed
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Line Chart with Date Filter */}
        <div 
          className="p-6 rounded-2xl border shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
              Revenue Trend
            </h3>
            <div className="flex gap-2">
              {[
                { key: '7d', label: '7d' },
                { key: '30d', label: '30d' },
                { key: '3m', label: '3m' },
                { key: 'all', label: 'All' }
              ].map((range) => (
                <button
                  key={range.key}
                  onClick={() => setDateRange(range.key as any)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: dateRange === range.key ? 'var(--navy)' : 'var(--bg)',
                    color: dateRange === range.key ? 'white' : 'var(--ink-muted)',
                    border: `1px solid ${dateRange === range.key ? 'var(--navy)' : 'var(--rule)'}`,
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          <LineChart 
            data={revenueData}
            height={240}
            color="var(--navy)"
            title=""
            showGrid={true}
            gradientFill={true}
          />
        </div>

        {/* Enrollment Area Chart */}
        <div 
          className="p-6 rounded-2xl border shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <AreaChart 
            data={enrollmentData}
            height={280}
            color="var(--success-text)"
            title="Enrollment Growth (8 Weeks)"
          />
        </div>
      </div>

      {/* Programme Breakdown & Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Programme Bar Chart */}
        <div 
          className="p-6 rounded-2xl border shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <BarChart 
            data={programmeData}
            height={280}
            title="Students per Programme"
            horizontal={true}
          />
        </div>

        {/* Upcoming Classes */}
        <div 
          className="p-6 rounded-2xl border shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Upcoming Classes
          </h3>
          
          <div className="space-y-3">
            {upcomingClasses.map((classItem) => (
              <div 
                key={classItem.id}
                className="p-4 rounded-xl border transition-all hover:shadow-md"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--ink)' }}>
                      {classItem.courseName}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                      {classItem.instructorName}
                    </p>
                  </div>
                  <span 
                    className="inline-block px-2 py-1 rounded-md text-xs font-medium"
                    style={{
                      backgroundColor: classItem.type === 'online' ? 'var(--info-bg)' : classItem.type === 'hybrid' ? 'var(--warning-bg)' : 'var(--success-bg)',
                      color: classItem.type === 'online' ? 'var(--info-text)' : classItem.type === 'hybrid' ? 'var(--warning-text)' : 'var(--success-text)',
                    }}
                  >
                    {classItem.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--ink-muted)' }}>
                  <span>{new Date(classItem.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}</span>
                  <span>{classItem.startTime}</span>
                  <span>{classItem.enrolled}/{classItem.capacity} enrolled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Widget & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <CalendarWidget />
        </div>
        <div className="lg:col-span-2">
          <TopPerformers />
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div 
        className="p-6 rounded-2xl border shadow-lg"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Recent Activity
          </h3>
          <button className="text-sm font-medium" style={{ color: 'var(--navy)' }}>
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div 
              key={activity.id}
              className="flex items-start gap-4 p-4 rounded-xl transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--rule)' }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                style={{ 
                  background: index % 4 === 0 ? 'linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%)' :
                             index % 4 === 1 ? 'linear-gradient(135deg, var(--success-text) 0%, var(--success-bg) 100%)' :
                             index % 4 === 2 ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' :
                             'linear-gradient(135deg, var(--info-text) 0%, var(--info-bg) 100%)'
                }}
              >
                {activity.userName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm mb-1" style={{ color: 'var(--ink)' }}>
                  <span className="font-semibold">{activity.userName}</span>
                  {' '}<span style={{ color: 'var(--ink-muted)' }}>{activity.action.toLowerCase()}</span>
                </p>
                <p className="text-xs mb-2" style={{ color: 'var(--ink-muted)' }}>
                  {activity.details}
                </p>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" style={{ color: 'var(--ink-faint)' }} />
                  <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                    {getRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <CreateClassModal 
        isOpen={showCreateClass}
        onClose={() => setShowCreateClass(false)}
        onSuccess={() => {
          setShowCreateClass(false);
          // Could refresh data here in real app
        }}
      />
      <AddStudentModal 
        isOpen={showAddStudent}
        onClose={() => setShowAddStudent(false)}
        onSuccess={() => {
          setShowAddStudent(false);
          // Could refresh data here in real app
        }}
      />
      <GenerateReportModal 
        isOpen={showGenerateReport}
        onClose={() => setShowGenerateReport(false)}
      />
    </div>
  );
}
