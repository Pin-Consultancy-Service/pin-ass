'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Home,
  User,
  LogOut,
} from 'lucide-react';
import { getStoredUser, logout } from '@/lib/auth';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'next/navigation';
import { designTokens, colorPalette } from '@/lib/designTokens';
import ClassNotifications from '@/components/portal/ClassNotifications';

interface StudentHeaderProps {
  notificationCount?: number;
  onNotificationClick?: () => void;
}

export default function StudentHeader({ notificationCount = 0, onNotificationClick }: StudentHeaderProps) {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const user = getStoredUser();
  
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [timeEmoji, setTimeEmoji] = useState('☀️');
  const [currentDate, setCurrentDate] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Read collapsed state from localStorage
    const saved = localStorage.getItem('sidebarCollapsed');
    setCollapsed(saved === 'true');

    // Listen for sidebar toggle events
    const handleSidebarToggle = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.collapsed !== undefined) {
        setCollapsed(customEvent.detail.collapsed);
      }
    };

    // Update time emoji based on current hour
    const updateTimeEmoji = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setTimeEmoji('☀️');
      } else if (hour >= 12 && hour < 17) {
        setTimeEmoji('🌤️');
      } else {
        setTimeEmoji('🌙');
      }
    };

    // Update date
    const updateDate = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-NG', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      setCurrentDate(formatted);
    };

    updateTimeEmoji();
    updateDate();

    const interval = setInterval(() => {
      updateTimeEmoji();
      updateDate();
    }, 60000);

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => {
      clearInterval(interval);
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!mounted) return null;

  const bgColor = isDark ? 'rgba(21, 45, 110, 0.95)' : '#ffffff';
  const textPrimary = isDark ? designTokens.colors.dark.textPrimary : designTokens.colors.light.textPrimary;
  const textMuted = isDark ? designTokens.colors.dark.textMuted : designTokens.colors.light.textMuted;
  const pillBg = isDark ? designTokens.colors.dark.pillBg : designTokens.colors.light.pillBg;
  const pillBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)';
  const inputBg = isDark ? 'rgba(255,255,255,0.07)' : '#f9fafb';

  const userInitials = user
    ? `${user.first_name?.[0] || 'U'}${user.last_name?.[0] || ''}`
    : 'U';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-xl hidden lg:block"
      style={{
        borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)',
        backgroundColor: bgColor,
        backgroundImage: isDark
          ? `url('${designTokens.sidebarPhotoUrl}')`
          : 'none',
        backgroundSize: isDark ? 'cover' : 'auto',
        backgroundPosition: isDark ? 'center' : 'auto',
        boxShadow: isDark 
          ? '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 2px 12px rgba(0,0,0,0.08)',
        left: collapsed ? '80px' : '256px',
        transition: 'left 0.3s ease',
      }}
    >
      {/* Dark mode overlay */}
      {isDark && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(160deg, rgba(30,58,138,0.85) 0%, rgba(21,45,110,0.80) 40%, rgba(30,58,138,0.85) 100%)',
          }}
        />
      )}

      <div className="relative z-10 h-[4.79rem] px-4 lg:px-8 flex items-center justify-between gap-6">
        {/* Left Side: Greeting */}
        <div className="hidden lg:flex flex-col justify-center">
          <p className="text-xs font-body" style={{ color: textMuted }}>
            {currentDate}
          </p>
        </div>

        {/* Mobile Greeting */}
        <div className="lg:hidden flex flex-col justify-center flex-1">
          <h2 className="font-[syne] font-bold text-sm leading-tight" style={{ color: textPrimary }}>
            {timeEmoji} {user?.first_name || 'Welcome'}
          </h2>
          <p className="text-xs font-[lexend] leading-tight mt-0.5" style={{ color: textMuted }}>
            {currentDate}
          </p>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 lg:gap-3 ml-auto">
          {/* Desktop Search Bar */}
          <div
            className="hidden lg:flex items-center gap-2 px-4 h-9 rounded-full border transition-all hover:border-opacity-100"
            style={{
              backgroundColor: inputBg,
              border: `1px solid ${pillBorder}`,
            }}
          >
            <Search className="w-4 h-4" style={{ color: textMuted }} />
            <input
              type="text"
              placeholder="Search resources…"
              className="flex-1 bg-transparent border-0 outline-none text-sm font-body"
              style={{ color: textPrimary }}
            />
            <span className="text-xs font-[lexend] font-semibold px-2 py-1 rounded" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.05)', color: textMuted }}>
              ⌘K
            </span>
          </div>

          {/* Mobile Search Toggle */}
          <button
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{
              backgroundColor: pillBg,
              border: `1px solid ${pillBorder}`,
            }}
          >
            <Search className="w-4 h-4" style={{ color: textMuted }} />
          </button>

          {/* Wellbeing Pill */}
          <div
            className="hidden lg:flex items-center gap-2 px-4 h-9 rounded-full border"
            style={{
              backgroundColor: pillBg,
              border: `1px solid ${pillBorder}`,
            }}
          >
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-[lexend] font-semibold" style={{ color: '#F4C430' }}>
              Active
            </span>
          </div>

          {/* Notification Bell */}
          <ClassNotifications />

          {/* Desktop Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full transition-all border"
            style={{
              backgroundColor: pillBg,
              border: `1px solid ${pillBorder}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = pillBg;
            }}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4" style={{ color: textMuted }} />
            )}
          </button>

          {/* Vertical Divider */}
          <div
            className="hidden lg:block w-px h-6"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)' }}
          />

          {/* Profile Chip */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="hidden lg:flex items-center gap-2 px-3 h-9 rounded-full transition-all border"
              style={{
                backgroundColor: pillBg,
                border: `1px solid ${pillBorder}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = pillBg;
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-[syne] font-bold"
                style={{ backgroundColor: '#1E3A8A' }}
              >
                {userInitials}
              </div>
              <span className="text-xs font-body font-medium hidden sm:inline" style={{ color: textPrimary }}>
                {user?.first_name || 'User'}
              </span>
              <ChevronDown className="w-4 h-4" style={{ color: textMuted }} />
            </button>

            {/* Profile Dropdown */}
            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-2xl border z-50 backdrop-blur-sm"
                style={{
                  backgroundColor: isDark ? 'rgba(21, 45, 110, 0.95)' : '#ffffff',
                  borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)',
                }}
              >
                <div className="p-2">
                  <Link
                    href="/portal/student/profile"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-body text-sm"
                    style={{ color: textMuted }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-body text-sm"
                    style={{ color: textMuted }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Home className="w-4 h-4" />
                    <span>Back to Website</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left font-body text-sm"
                    style={{ color: '#f87171' }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile User Avatar */}
          <div className="lg:hidden relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all"
              style={{ backgroundColor: '#1E3A8A' }}
            >
              <span className="text-white text-xs font-[syne] font-bold">{userInitials}</span>
            </button>

            {/* Mobile Menu Dropdown */}
            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-2xl border z-50 backdrop-blur-sm"
                style={{
                  backgroundColor: isDark ? 'rgba(21, 45, 110, 0.95)' : '#ffffff',
                  borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)',
                }}
              >
                <div className="p-2">
                  <Link
                    href="/portal/student/profile"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-body text-sm"
                    style={{ color: textMuted }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-body text-sm"
                    style={{ color: textMuted }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Home className="w-4 h-4" />
                    <span>Back to Website</span>
                  </Link>
                  <div className="p-2 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)' }}>
                    <button
                      onClick={() => {
                        toggleTheme();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left font-body text-sm"
                      style={{ color: textMuted }}
                    >
                      {isDark ? (
                        <Sun className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                      <span>Toggle Theme</span>
                    </button>
                  </div>
                  <div className="p-2 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)' }}>
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left font-body text-sm"
                      style={{ color: '#f87171' }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
