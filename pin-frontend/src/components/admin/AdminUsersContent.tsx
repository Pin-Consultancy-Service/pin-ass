"use client";

import { useState } from "react";
import { Search, Eye, Edit, Trash2 } from "lucide-react";
import { mockSystemUsers, getUsersByRole } from "@/lib/mockAdminData";

export default function AdminUsersContent() {
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'instructors' | 'admins'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = mockSystemUsers.filter(user => {
    const matchesTab = activeTab === 'all' || user.role === activeTab.slice(0, -1);
    const matchesSearch = searchQuery === '' || 
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalUsers = mockSystemUsers.length;
  const activeUsers = mockSystemUsers.filter(u => u.status === 'active').length;
  const newThisMonth = mockSystemUsers.filter(u => u.date_joined.startsWith('2024-07')).length;
  const inactiveUsers = mockSystemUsers.filter(u => u.status === 'inactive').length;

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'student':
        return { backgroundColor: 'var(--navy-50)', color: 'var(--navy)' };
      case 'instructor':
        return { backgroundColor: 'var(--gold-50)', color: '#92600A' };
      case 'admin':
        return { backgroundColor: '#F3E8FF', color: '#7C3AED' };
      default:
        return { backgroundColor: 'var(--surface)', color: 'var(--ink-muted)' };
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    return status === 'active'
      ? { backgroundColor: '#DCFCE7', color: '#16A34A' }
      : { backgroundColor: '#FEE2E2', color: '#DC2626' };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          User Management
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Manage all system users and their permissions
        </p>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All Users' },
          { key: 'students', label: 'Students' },
          { key: 'instructors', label: 'Instructors' },
          { key: 'admins', label: 'Admins' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap"
            style={{
              backgroundColor: activeTab === tab.key ? 'var(--navy)' : 'var(--surface)',
              color: activeTab === tab.key ? 'white' : 'var(--ink-muted)',
              border: `1px solid ${activeTab === tab.key ? 'var(--navy)' : 'var(--rule)'}`
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{totalUsers}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Total Users</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{activeUsers}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Active Today</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{newThisMonth}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>New This Month</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{inactiveUsers}</p>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Inactive</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--ink-faint)' }} />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border"
          style={{ 
            backgroundColor: 'var(--surface)', 
            borderColor: 'var(--rule)',
            color: 'var(--ink)'
          }}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--rule)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--rule)' }}>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>User</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Email</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Phone</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Role</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Status</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Join Date</th>
              <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--ink)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--rule)', backgroundColor: 'var(--bg)' }}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: 'var(--navy)' }}
                    >
                      {user.first_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>{user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm" style={{ color: 'var(--ink-muted)' }}>{user.email}</td>
                <td className="p-4 text-sm" style={{ color: 'var(--ink-muted)' }}>{user.phone_number}</td>
                <td className="p-4">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
                    style={getRoleBadgeStyle(user.role)}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
                    style={getStatusBadgeStyle(user.status)}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
                  {new Date(user.date_joined).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: 'var(--navy)' }}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: 'var(--gold-dark)' }}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: '#DC2626' }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredUsers.map((user) => (
          <div 
            key={user.id}
            className="p-4 rounded-xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ backgroundColor: 'var(--navy)' }}
              >
                {user.first_name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm mb-2" style={{ color: 'var(--ink-muted)' }}>{user.email}</p>
                <div className="flex gap-2">
                  <span 
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium capitalize"
                    style={getRoleBadgeStyle(user.role)}
                  >
                    {user.role}
                  </span>
                  <span 
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium capitalize"
                    style={getStatusBadgeStyle(user.status)}
                  >
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>
              Joined {new Date(user.date_joined).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="text-center py-4">
        <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
          Showing {filteredUsers.length} of {mockSystemUsers.length} users
        </p>
      </div>
    </div>
  );
}
