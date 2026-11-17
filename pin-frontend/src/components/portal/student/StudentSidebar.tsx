'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  FileQuestion,
  ClipboardList,
  User,
  CreditCard,
  Settings,
  BookOpenCheck,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { getStoredUser } from '@/lib/auth';
import { useTheme } from '@/hooks/useTheme';
import { designTokens, colorPalette } from '@/lib/designTokens';

interface StudentSidebarProps {
  activeTab?: string;
  user?: any;
}

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/portal/student', key: 'dashboard' },
  { icon: BookOpen, label: 'Classes', href: '/portal/student/classes', key: 'classes' },
  { icon: FileQuestion, label: 'Past Questions', href: '/portal/student/practice', key: 'practice' },
  { icon: ClipboardList, label: 'Assignments', href: '/portal/student/assignments', key: 'assignments' },
  { icon: BookOpenCheck, label: 'Resources', href: '/portal/student/materials', key: 'resources' },
  { icon: User, label: 'My Profile', href: '/portal/student/profile', key: 'profile' },
  { icon: CreditCard, label: 'Finances', href: '/portal/student/fees', key: 'finances' },
  { icon: Settings, label: 'Help & Support', href: '/portal/student/support', key: 'support' },
];

export default function StudentSidebar({ activeTab = 'dashboard', user: propUser }: StudentSidebarProps) {
  const router = useRouter();
  const { isDark } = useTheme();
  const storedUser = propUser || getStoredUser();
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Read collapse state from localStorage
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved === 'true') {
      setCollapsed(true);
    }

    // Listen for sidebar toggle events
    const handleSidebarToggle = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.collapsed !== undefined) {
        setCollapsed(customEvent.detail.collapsed);
      }
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  const handleCollapseToggle = useCallback(() => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
    window.dispatchEvent(
      new CustomEvent('sidebarToggle', {
        detail: { collapsed: newState },
      })
    );
  }, [collapsed]);

  const handleMobileClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleThemeToggle = useCallback(() => {
    const newTheme = !isDark;
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    window.dispatchEvent(
      new CustomEvent('themeToggle', {
        detail: { isDarkMode: newTheme },
      })
    );
  }, [isDark]);

  if (!mounted) return null;

  const textPrimary = isDark ? designTokens.colors.dark.textPrimary : designTokens.colors.light.textPrimary;
  const textMuted = isDark ? designTokens.colors.dark.textMuted : designTokens.colors.light.textMuted;
  const sectionLabel = isDark ? designTokens.colors.dark.sectionLabel : designTokens.colors.light.sectionLabel;
  const navActiveBg = isDark ? 'rgba(30,58,138,0.20)' : 'rgba(30,58,138,0.10)';
  const navIdleHover = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';

  const userInitials = storedUser
    ? `${storedUser.first_name?.[0] || 'U'}${storedUser.last_name?.[0] || ''}`
    : 'U';

  const sidebarContent = (
    <>
      {/* Brand Section */}
      <div className="p-3 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)' }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Image
              src="/images/pin-logo.png"
              alt="PIN Associate"
              width={collapsed ? 22 : 30}
              height={collapsed ? 22 : 30}
              className="object-contain flex-shrink-0"
            />
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-body text-xs font-semibold leading-tight" style={{ color: '#1E3A8A', fontSize: '0.75rem' }}>
                  PIN Associate
                </p>
                <p className="font-body text-[10px] leading-tight" style={{ color: textMuted }}>
                  Student Portal
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleCollapseToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
              borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.10)',
              color: isDark ? textMuted : '#475569',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(30,58,138,0.07)';
              event.currentTarget.style.color = '#1E3A8A';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
              event.currentTarget.style.color = isDark ? textMuted : '#475569';
            }}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
      </div>



      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {sidebarItems.map((item) => {
          const isActive = activeTab === item.key;
          const Icon = item.icon;

          return (
            <div key={item.key} className="relative group">
              <Link
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setMobileOpen(false);
                  }
                }}
                className="flex items-center gap-3 px-3 py-3 rounded-[12px] transition-all relative overflow-hidden"
                style={{
                  backgroundColor: isActive ? navActiveBg : 'transparent',
                }}
              >
                {/* Active left accent bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[18px] rounded-r-full"
                    style={{ backgroundColor: '#F4C430' }}
                  />
                )}

                {/* Icon */}
                <div
                  className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: isActive ? '#1E3A8A' : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                    color: isActive ? '#F4C430' : isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)',
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Label */}
                {!collapsed && (
                  <span
                    className="text-[15px] font-body font-medium flex-1 truncate transition-colors"
                    style={{
                      color: isActive
                        ? isDark
                          ? '#F4C430'
                          : '#1E3A8A'
                        : textMuted,
                    }}
                  >
                    {item.label}
                  </span>
                )}

                {/* Collapsed Tooltip */}
                {collapsed && (
                  <div
                    className="absolute left-full ml-3 px-3 py-2 rounded-lg text-xs font-[lexend] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg"
                    style={{
                      backgroundColor: isDark ? '#1f2937' : '#111827',
                      color: '#ffffff',
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Mobile Theme Toggle */}
      {!collapsed && (
        <div className="lg:hidden p-4 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)' }}>
          <div
            className="flex items-center rounded-full p-1 gap-1"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}`,
            }}
          >
            <button
              onClick={handleThemeToggle}
              className="flex-1 w-7 h-7 rounded-full flex items-center justify-center transition-all"
              style={{
                backgroundColor: !isDark ? '#1E3A8A' : 'transparent',
              }}
            >
              <Sun className={`w-4 h-4 ${!isDark ? '#F4C430' : 'text-yellow-500'}`} />
            </button>
            <button
              onClick={handleThemeToggle}
              className="flex-1 w-7 h-7 rounded-full flex items-center justify-center transition-all"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'transparent',
              }}
            >
              <Moon className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>
      )}

      {/* Sign Out Button */}
      {!collapsed && (
        <div className="p-2 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)' }}>
          <button
            onClick={() => {
              localStorage.clear();
              router.push('/');
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-[10px] transition-all"
            style={{
              backgroundColor: 'transparent',
              color: textMuted,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.10)';
              e.currentTarget.style.color = '#f87171';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = textMuted;
            }}
          >
            <div
              className="w-5 h-5 rounded-[8px] flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#f87171' }}
            >
              <LogOut className="w-3 h-3" />
            </div>
            <span className="text-xs font-body font-medium">Sign out</span>
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } border-r overflow-hidden`}
        style={{
          backgroundColor: isDark ? '#152D6E' : '#ffffff',
          backgroundImage: isDark
            ? `url('${designTokens.sidebarPhotoUrl}')`
            : 'none',
          backgroundSize: isDark ? 'cover' : 'auto',
          backgroundPosition: isDark ? 'center' : 'auto',
          borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)',
          boxShadow: isDark 
            ? 'inset 0 0 60px rgba(30,58,138,0.4), 0 4px 16px rgba(0,0,0,0.2)'
            : '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        {/* Dark mode overlay for sidebar photo */}
        {isDark && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(160deg, rgba(30,58,138,0.97) 0%, rgba(21,45,110,0.95) 40%, rgba(30,58,138,0.90) 70%, rgba(21,45,110,0.96) 100%)',
            }}
          />
        )}

        {/* Content wrapper for z-index */}
        <div className="relative z-10 flex flex-col h-full">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 rounded-lg"
        style={{ color: textPrimary }}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.40)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Off-canvas) */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 z-40 lg:hidden flex flex-col transition-transform duration-300 border-r overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: isDark ? '#152D6E' : '#ffffff',
          borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)',
        }}
      >
        {/* Mobile Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)' }}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/pin-logo.png"
              alt="PIN Associate"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="font-[syne] font-bold text-sm" style={{ color: '#1E3A8A' }}>
              PIN
            </span>
          </Link>
          <button onClick={handleMobileClose} className="p-2 rounded-lg" style={{ color: textMuted }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {sidebarContent}
      </aside>
    </>
  );
}
