"use client";

import { Users, DollarSign, Calendar, TrendingUp, BarChart3, Clock } from "lucide-react";
import { getSystemStats, formatNaira, mockEnrollments, getRecentActivity } from "@/lib/mockAdminData";

export default function AdminDashboardContent() {
  const stats = getSystemStats();
  const recentEnrollments = mockEnrollments.slice(0, 5);
  const recentActivity = getRecentActivity(6);

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
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          Dashboard Overview
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Complete system statistics and recent activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div 
          className="p-6 rounded-xl border"
          style={{ backgroundColor: 'var(--navy-50)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
            {stats.totalUsers}
          </h3>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
            Total Users
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--navy)' }}>
            +{stats.newUsersThisMonth} this month
          </p>
        </div>

        {/* Total Revenue */}
        <div 
          className="p-6 rounded-xl border"
          style={{ backgroundColor: '#DCFCE7', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#16A34A' }}
            >
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
            {formatNaira(stats.totalRevenue)}
          </h3>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
            Total Revenue
          </p>
          <p className="text-xs mt-2" style={{ color: '#16A34A' }}>
            {formatNaira(stats.revenueThisMonth)} this month
          </p>
        </div>

        {/* Active Classes */}
        <div 
          className="p-6 rounded-xl border"
          style={{ backgroundColor: 'var(--gold-50)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--gold-dark)' }}
            >
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
            {stats.activeClasses}
          </h3>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
            Active Classes
          </p>
          <p className="text-xs mt-2" style={{ color: '#92600A' }}>
            {stats.upcomingClasses} upcoming
          </p>
        </div>

        {/* Total Enrollments */}
        <div 
          className="p-6 rounded-xl border"
          style={{ backgroundColor: 'var(--navy-100)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#2563EB' }}
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
            {stats.totalEnrollments}
          </h3>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
            Total Enrollments
          </p>
          <p className="text-xs mt-2" style={{ color: '#2563EB' }}>
            {stats.completedClasses} completed
          </p>
        </div>
      </div>

      {/* Recent Enrollments & Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <div 
          className="p-6 rounded-xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Recent Enrollments
          </h3>
          
          <div className="space-y-3">
            {recentEnrollments.map((enrollment) => (
              <div 
                key={enrollment.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--rule)' }}
              >
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1" style={{ color: 'var(--ink)' }}>
                    {enrollment.studentName}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                    {enrollment.programmeName}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--ink-faint)' }}>
                    {new Date(enrollment.enrollmentDate).toLocaleDateString('en-NG', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm mb-1" style={{ color: 'var(--ink)' }}>
                    {formatNaira(enrollment.totalFees)}
                  </p>
                  <span 
                    className="inline-block px-2 py-1 rounded-md text-xs font-medium"
                    style={{
                      backgroundColor: enrollment.paymentStatus === 'paid' 
                        ? '#DCFCE7' 
                        : enrollment.paymentStatus === 'partial' 
                        ? '#FEF3C7' 
                        : '#FEE2E2',
                      color: enrollment.paymentStatus === 'paid' 
                        ? '#16A34A' 
                        : enrollment.paymentStatus === 'partial' 
                        ? '#D97706' 
                        : '#DC2626',
                    }}
                  >
                    {enrollment.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Overview Placeholder */}
        <div 
          className="p-6 rounded-xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Revenue Overview
          </h3>
          
          <div 
            className="flex flex-col items-center justify-center py-12"
            style={{ borderRadius: '12px', backgroundColor: 'var(--bg)' }}
          >
            <BarChart3 className="w-16 h-16 mb-4" style={{ color: 'var(--ink-faint)' }} />
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
              Analytics dashboard coming soon
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div 
        className="p-6 rounded-xl border"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
      >
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          Recent Activity
        </h3>
        
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--rule)' }}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--navy-50)' }}
              >
                <Clock className="w-4 h-4" style={{ color: 'var(--navy)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm mb-1" style={{ color: 'var(--ink)' }}>
                  <span className="font-semibold">{activity.userName}</span>
                  {' '}{activity.action.toLowerCase()}
                </p>
                <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                  {activity.details}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--ink-faint)' }}>
                  {getRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
