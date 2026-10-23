"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, GraduationCap, UserCheck, Calendar, BookOpen,
  FileText, DollarSign, BarChart3, Settings,
  Sun, Moon, Menu, X, Bell, Search as SearchIcon
} from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import NotificationPanel from "./NotificationPanel";
import ProfileDropdown from "./ProfileDropdown";
import { getUnreadNotificationCount } from "@/lib/mockAdminData";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', key: 'dashboard' },
  { icon: Users, label: 'Users', href: '/admin/users', key: 'users' },
  { icon: GraduationCap, label: 'Students', href: '/admin/students', key: 'students' },
  { icon: UserCheck, label: 'Instructors', href: '/admin/instructors', key: 'instructors' },
  { icon: Calendar, label: 'Classes', href: '/admin/classes', key: 'classes' },
  { icon: BookOpen, label: 'Courses', href: '/admin/courses', key: 'courses' },
  { icon: FileText, label: 'Enrollments', href: '/admin/enrollments', key: 'enrollments' },
  { icon: DollarSign, label: 'Finances', href: '/admin/finances', key: 'finances' },
  { icon: BarChart3, label: 'Reports', href: '/admin/reports', key: 'reports' },
  { icon: Settings, label: 'Settings', href: '/admin/settings', key: 'settings' },
];

export default function AdminDashboardLayout({ children, activeTab = 'dashboard' }: AdminDashboardLayoutProps) {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Get admin data
    const adminData = localStorage.getItem('admin_user');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }

    // Get notification count
    setNotificationCount(getUnreadNotificationCount());
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Mobile Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 lg:hidden border-b"
        style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--bg)' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg"
            style={{ color: 'var(--ink)' }}
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image 
              src="/images/pin-logo.png" 
              alt="PIN Associate" 
              width={24} 
              height={24} 
              className="object-contain" 
            />
            <span 
              className="font-bold text-sm"
              style={{ color: 'var(--navy)', fontFamily: 'var(--font-display)' }}
            >
              Admin Portal
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--ink-muted)' }}
            >
              <SearchIcon className="w-5 h-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--ink-muted)' }}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-lg transition-colors relative"
                style={{ color: 'var(--ink-muted)' }}
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--error-text)' }}
                  />
                )}
              </button>
              <NotificationPanel isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: 'var(--navy)' }}
                  suppressHydrationWarning
                >
                  {mounted ? (admin?.first_name?.charAt(0) || 'A') : 'A'}
                </div>
              </button>
              <ProfileDropdown
                admin={admin}
                onLogout={handleLogout}
                isOpen={profileMenuOpen}
                onClose={() => setProfileMenuOpen(false)}
              />
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="px-4 pb-3 border-t" style={{ borderColor: 'var(--rule)' }}>
            <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
          </div>
        )}
      </header>

      {/* Desktop Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 hidden lg:block border-b"
        style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--bg)' }}
      >
        <div className="flex items-center justify-between px-6 py-4 gap-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3 flex-shrink-0">
            <Image 
              src="/images/pin-logo.png" 
              alt="PIN Associate" 
              width={32} 
              height={32} 
              className="object-contain" 
            />
            <span 
              className="font-bold text-lg"
              style={{ color: 'var(--navy)', fontFamily: 'var(--font-display)' }}
            >
              Admin Portal
            </span>
          </Link>

          {/* Global Search - Center */}
          <div className="flex-1 max-w-xl mx-auto">
            <GlobalSearch isOpen={true} />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-colors"
              style={{ 
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--rule)'
              }}
            >
              {isDarkMode ? 
                <Sun className="w-5 h-5" style={{ color: 'var(--ink-muted)' }} /> : 
                <Moon className="w-5 h-5" style={{ color: 'var(--ink-muted)' }} />
              }
            </button>

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-xl transition-colors relative"
                style={{ 
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--rule)'
                }}
              >
                <Bell className="w-5 h-5" style={{ color: 'var(--ink-muted)' }} />
                {notificationCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: 'var(--error-text)', minWidth: '18px', textAlign: 'center' }}
                  >
                    {notificationCount}
                  </span>
                )}
              </button>
              <NotificationPanel isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-xl transition-colors"
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: 'var(--navy)' }}
                  suppressHydrationWarning
                >
                  {mounted ? (admin?.first_name?.charAt(0) || 'A') : 'A'}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }} suppressHydrationWarning>
                    {mounted ? `${admin?.first_name || 'Admin'} ${admin?.last_name || ''}` : 'Admin'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                    Administrator
                  </p>
                </div>
              </button>
              <ProfileDropdown
                admin={admin}
                onLogout={handleLogout}
                isOpen={profileMenuOpen}
                onClose={() => setProfileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div 
            className="absolute left-0 top-0 h-full w-64 border-r overflow-y-auto"
            style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)' }}
          >
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--rule)' }}>
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <Image 
                  src="/images/pin-logo.png" 
                  alt="PIN Associate" 
                  width={24} 
                  height={24} 
                  className="object-contain" 
                />
                <span 
                  className="font-bold text-sm"
                  style={{ color: 'var(--navy)', fontFamily: 'var(--font-display)' }}
                >
                  Admin
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg"
                style={{ color: 'var(--ink-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 80px)' }}>
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{
                      backgroundColor: activeTab === item.key ? 'var(--navy)' : 'transparent',
                      color: activeTab === item.key ? 'white' : 'var(--ink-muted)',
                    }}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside 
        className="fixed left-0 w-64 border-r hidden lg:flex lg:flex-col"
        style={{ 
          borderColor: 'var(--rule)', 
          backgroundColor: 'var(--bg)',
          top: '80px',
          bottom: 0,
          height: 'calc(100vh - 80px)',
        }}
      >
        <div 
          className="flex-1 overflow-y-auto p-4 hide-scrollbar" 
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-opacity-10"
                style={{
                  backgroundColor: activeTab === item.key ? 'var(--navy)' : 'transparent',
                  color: activeTab === item.key ? 'white' : 'var(--ink-muted)',
                }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-20 lg:ml-64 min-h-screen lg:min-h-0 lg:h-screen">
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
