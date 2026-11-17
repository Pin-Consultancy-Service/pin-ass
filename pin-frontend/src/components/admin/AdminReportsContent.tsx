"use client";

import { useState } from "react";
import { Users, DollarSign, Calendar, TrendingUp, BarChart3, FileDown, Printer } from "lucide-react";
import LineChart from "./charts/LineChart";
import AreaChart from "./charts/AreaChart";
import BarChart from "./charts/BarChart";

export default function AdminReportsContent() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reportTypes = [
    {
      key: 'user',
      title: 'User Reports',
      description: 'Student & Instructor analytics',
      icon: Users,
      bgColor: 'var(--navy)',
    },
    {
      key: 'financial',
      title: 'Financial Reports',
      description: 'Revenue & payment summaries',
      icon: DollarSign,
      bgColor: '#16A34A',
    },
    {
      key: 'class',
      title: 'Class Reports',
      description: 'Attendance & performance',
      icon: Calendar,
      bgColor: 'var(--gold-dark)',
    },
    {
      key: 'enrollment',
      title: 'Enrollment Reports',
      description: 'Enrollment trends & status',
      icon: TrendingUp,
      bgColor: '#2563EB',
    },
  ];

  const getSampleData = (reportKey: string) => {
    switch (reportKey) {
      case 'user':
        return [
          { col1: 'Total Students', col2: '14', col3: 'Active', col4: '12' },
          { col1: 'Total Instructors', col2: '4', col3: 'Active', col4: '4' },
          { col1: 'Total Admins', col2: '2', col3: 'Active', col4: '2' },
          { col1: 'New Users (July)', col2: '0', col3: 'Inactive', col4: '2' },
          { col1: 'Avg Daily Active', col2: '16', col3: '-', col4: '-' },
        ];
      case 'financial':
        return [
          { col1: 'Total Revenue', col2: '₦3,840,000', col3: 'Paid', col4: '₦3,475,000' },
          { col1: 'Outstanding', col2: '₦1,310,000', col3: 'Partial', col4: '₦365,000' },
          { col1: 'July Revenue', col2: '₦360,000', col3: 'Pending', col4: '₦275,000' },
          { col1: 'Total Enrollments', col2: '20', col3: 'Completed', col4: '2' },
          { col1: 'Avg Fee/Student', col2: '₦233,750', col3: '-', col4: '-' },
        ];
      case 'class':
        return [
          { col1: 'Total Classes', col2: '15', col3: 'Upcoming', col4: '6' },
          { col1: 'Completed', col2: '6', col3: 'Ongoing', col4: '1' },
          { col1: 'Cancelled', col2: '0', col3: 'In-Person', col4: '9' },
          { col1: 'Avg Attendance', col2: '87%', col3: 'Online', col4: '4' },
          { col1: 'Capacity Util.', col2: '72%', col3: 'Hybrid', col4: '2' },
        ];
      case 'enrollment':
        return [
          { col1: 'Total Enrollments', col2: '20', col3: 'Confirmed', col4: '15' },
          { col1: 'Pending', col2: '2', col3: 'Completed', col4: '2' },
          { col1: 'Cancelled', col2: '1', col3: 'ICAN Found.', col4: '7' },
          { col1: 'July Enrollments', col2: '0', col3: 'ICAN Prof.', col4: '7' },
          { col1: 'Avg Progress', col2: '54%', col3: 'Corporate', col4: '6' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          Reports & Analytics
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Generate comprehensive reports and analytics
        </p>
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <button
            key={report.key}
            onClick={() => setSelectedReport(report.key)}
            className="p-6 rounded-xl border text-left transition-all hover:scale-105"
            style={{ 
              backgroundColor: selectedReport === report.key ? 'var(--navy-50)' : 'var(--surface)', 
              borderColor: selectedReport === report.key ? 'var(--navy)' : 'var(--rule)',
              borderWidth: selectedReport === report.key ? '2px' : '1px'
            }}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: report.bgColor }}
            >
              <report.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
              {report.title}
            </h3>
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
              {report.description}
            </p>
            <button
              className="mt-4 w-full py-2 px-4 rounded-lg font-semibold text-sm"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
            >
              Generate Report
            </button>
          </button>
        ))}
      </div>

      {/* Report Preview */}
      {selectedReport && (
        <div 
          className="p-6 rounded-xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
              {reportTypes.find(r => r.key === selectedReport)?.title} Preview
            </h3>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2"
                style={{ backgroundColor: 'var(--navy)', color: 'white' }}
              >
                <FileDown className="w-4 h-4" />
                Export CSV
              </button>
              <button
                className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2"
                style={{ backgroundColor: 'var(--gold)', color: 'var(--navy-dark)' }}
              >
                <Printer className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Date Range Picker Placeholder */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="form-label">Start Date</label>
              <input 
                type="date" 
                className="form-input"
                defaultValue="2024-01-01"
              />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input 
                type="date" 
                className="form-input"
                defaultValue="2024-07-14"
              />
            </div>
          </div>

          {/* Sample Data Table */}
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--rule)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--navy-50)', borderBottom: '1px solid var(--rule)' }}>
                  <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Metric</th>
                  <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Value</th>
                  <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Category</th>
                  <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {getSampleData(selectedReport).map((row, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--rule)', backgroundColor: 'var(--bg)' }}>
                    <td className="p-4 text-sm" style={{ color: 'var(--ink)' }}>{row.col1}</td>
                    <td className="p-4 text-sm font-bold" style={{ color: 'var(--ink)' }}>{row.col2}</td>
                    <td className="p-4 text-sm" style={{ color: 'var(--ink-muted)' }}>{row.col3}</td>
                    <td className="p-4 text-sm" style={{ color: 'var(--ink-muted)' }}>{row.col4}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Dashboard */}
      <div 
        className="p-6 rounded-xl border"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
      >
        <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          Analytics Dashboard
        </h3>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--rule)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--navy)' }}>
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Total Users</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>20</p>
              </div>
            </div>
            <p className="text-xs" style={{ color: '#10B981' }}>↑ 12% from last month</p>
          </div>

          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--rule)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#10B981' }}>
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Revenue (July)</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>₦360K</p>
              </div>
            </div>
            <p className="text-xs" style={{ color: '#10B981' }}>↑ 8% from June</p>
          </div>

          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--rule)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--gold-dark)' }}>
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Classes (July)</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>15</p>
              </div>
            </div>
            <p className="text-xs" style={{ color: '#10B981' }}>87% avg attendance</p>
          </div>

          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--rule)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2563EB' }}>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Enrollments</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>20</p>
              </div>
            </div>
            <p className="text-xs" style={{ color: '#EF4444' }}>↓ 2 pending payment</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trends */}
          <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--rule)' }}>
            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
              Monthly Revenue (2024)
            </h4>
            <AreaChart
              data={[
                { label: 'Jan', value: 285000 },
                { label: 'Feb', value: 345000 },
                { label: 'Mar', value: 420000 },
                { label: 'Apr', value: 395000 },
                { label: 'May', value: 450000 },
                { label: 'Jun', value: 335000 },
                { label: 'Jul', value: 360000 },
              ]}
              height={240}
              color="#10B981"
            />
          </div>

          {/* Enrollment Trends */}
          <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--rule)' }}>
            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
              New Enrollments (2024)
            </h4>
            <LineChart
              data={[
                { label: 'Jan', value: 2 },
                { label: 'Feb', value: 4 },
                { label: 'Mar', value: 3 },
                { label: 'Apr', value: 3 },
                { label: 'May', value: 2 },
                { label: 'Jun', value: 6 },
                { label: 'Jul', value: 0 },
              ]}
              height={240}
              color="#2563EB"
              gradientFill={true}
            />
          </div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Programme Distribution */}
          <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--rule)' }}>
            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
              Enrollments by Programme
            </h4>
            <BarChart
              data={[
                { label: 'ICAN Foundation', value: 7 },
                { label: 'ICAN Professional', value: 7 },
                { label: 'Corporate Training', value: 6 },
              ]}
              height={240}
              horizontal={false}
            />
          </div>

          {/* Class Status Distribution */}
          <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--rule)' }}>
            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
              Class Status Overview
            </h4>
            <div className="space-y-4 pt-4">
              {/* Upcoming */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Upcoming</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>6 classes</span>
                </div>
                <div className="w-full h-3 rounded-full" style={{ backgroundColor: 'var(--rule)' }}>
                  <div className="h-3 rounded-full" style={{ width: '40%', backgroundColor: '#2563EB' }}></div>
                </div>
              </div>

              {/* Completed */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Completed</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>6 classes</span>
                </div>
                <div className="w-full h-3 rounded-full" style={{ backgroundColor: 'var(--rule)' }}>
                  <div className="h-3 rounded-full" style={{ width: '40%', backgroundColor: '#10B981' }}></div>
                </div>
              </div>

              {/* Ongoing */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Ongoing</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>1 class</span>
                </div>
                <div className="w-full h-3 rounded-full" style={{ backgroundColor: 'var(--rule)' }}>
                  <div className="h-3 rounded-full" style={{ width: '6.7%', backgroundColor: 'var(--gold-dark)' }}></div>
                </div>
              </div>

              {/* In-Person vs Online */}
              <div className="pt-4 mt-4" style={{ borderTop: '1px solid var(--rule)' }}>
                <h5 className="text-sm font-bold mb-3" style={{ color: 'var(--ink)' }}>Delivery Mode</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>In-Person</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--navy)' }}>9 (60%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>Online</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--navy)' }}>4 (27%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>Hybrid</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--navy)' }}>2 (13%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(30, 64, 175, 0.1)', border: '1px solid var(--navy)' }}>
            <h5 className="text-sm font-bold mb-2" style={{ color: 'var(--ink)' }}>Top Programme</h5>
            <p className="text-lg font-bold" style={{ color: 'var(--ink)' }}>ICAN Professional</p>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>7 active enrollments</p>
          </div>

          <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981' }}>
            <h5 className="text-sm font-bold mb-2" style={{ color: 'var(--ink)' }}>Avg. Completion Rate</h5>
            <p className="text-lg font-bold" style={{ color: 'var(--ink)' }}>54%</p>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>Across all programmes</p>
          </div>

          <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid var(--gold-dark)' }}>
            <h5 className="text-sm font-bold mb-2" style={{ color: 'var(--ink)' }}>Outstanding Balance</h5>
            <p className="text-lg font-bold" style={{ color: 'var(--ink)' }}>₦1,310,000</p>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>From 7 students</p>
          </div>
        </div>
      </div>
    </div>
  );
}
