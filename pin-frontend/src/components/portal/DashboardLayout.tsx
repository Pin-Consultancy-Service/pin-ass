"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  BarChart3, BookOpen, User, CreditCard, Settings, BookOpenCheck, Target,
  Sun, Moon, Bell, Search, Home, LogOut, ChevronDown, Users, FileQuestion, ClipboardList, Menu, X
} from "lucide-react";
import { apiFetch, clearTokens, getStoredUser, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import AISupportChatbot from "@/components/ui/AISupportChatbot";
import ClassNotifications from "@/components/portal/ClassNotifications";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/portal/student', key: 'dashboard' },
  { icon: BookOpen, label: 'Classes', href: '/portal/student/classes', key: 'classes' },
  { icon: FileQuestion, label: 'Past Questions', href: '/portal/student/practice', key: 'practice' },
  { icon: ClipboardList, label: 'Assignments', href: '/portal/student/assignments', key: 'assignments' },
  { icon: User, label: 'My Profile', href: '/portal/student/profile', key: 'profile' },
  { icon: CreditCard, label: 'Finances', href: '/portal/student/fees', key: 'finances' },
  { icon: Settings, label: 'Help & Support', href: '/portal/student/support', key: 'support' },
  { icon: BookOpenCheck, label: 'Resources', href: '/portal/student/materials', key: 'resources' },
];

export default function DashboardLayout({ children, activeTab = 'dashboard' }: DashboardLayoutProps) {
  const router = useRouter();
  const user = getStoredUser();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [accessAllowed, setAccessAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.replace("/portal/login");
      return;
    }
    apiFetch<{ can_access_dashboard: boolean }>("/api/v1/students/me/access")
      .then((access) => setAccessAllowed(access.can_access_dashboard))
      .catch(() => {
        clearTokens();
        router.replace("/portal/login");
      });
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
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
    void logout().finally(() => router.push('/'));
  };

  if (!mounted || accessAllowed === null) {
    return <div className="min-h-screen flex items-center justify-center" style={{ color: "var(--ink-muted)" }}>Loading your portal…</div>;
  }

  if (!accessAllowed && activeTab !== "finances") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--bg)" }}>
        <section className="max-w-lg text-center p-8 rounded-2xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}>
          <CreditCard className="w-12 h-12 mx-auto mb-5" style={{ color: "var(--navy)" }} />
          <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>Complete your first payment</h1>
          <p className="mb-6" style={{ color: "var(--ink-muted)" }}>Your account is ready. Dashboard resources will unlock after a student fee payment is confirmed.</p>
          <Link href="/portal/student/fees" className="btn btn-primary inline-flex items-center gap-2">View fees and pay</Link>
          <button onClick={handleLogout} className="block mx-auto mt-5 text-sm" style={{ color: "var(--ink-muted)" }}>Sign out</button>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Mobile Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 lg:hidden border-b"
        style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--bg)' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg"
            style={{ color: 'var(--ink)' }}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/images/pin-logo.png" 
              alt="PIN Associate" 
              width={24} 
              height={24} 
              className="object-contain" 
            />
            <span 
              className="font-bold text-sm"
              style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
            >
              PIN Associate
            </span>
          </Link>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle - Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--ink-muted)' }}
            >
              {isDarkMode ? 
                <Sun className="w-5 h-5" /> : 
                <Moon className="w-5 h-5" />
              }
            </button>

            {/* Notifications - Mobile */}
            <ClassNotifications />

            {/* Mobile User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: 'var(--navy)' }}
                  suppressHydrationWarning
                >
                  {mounted ? (user?.first_name?.charAt(0) || 'U') : 'U'}
                </div>
              </button>

            {/* Mobile User Dropdown */}
            {userMenuOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-lg z-50"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)' }}
              >
                <div className="p-2">
                  <Link
                    href="/portal/student/profile"
                    className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                    style={{ color: 'var(--ink-muted)' }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">My Profile</span>
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                    style={{ color: 'var(--ink-muted)' }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-sm">Back to Website</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left"
                    style={{ color: 'var(--ink-muted)' }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 hidden lg:block border-b"
        style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--bg)' }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/images/pin-logo.png" 
                alt="PIN Associate" 
                width={32} 
                height={32} 
                className="object-contain" 
              />
              <span 
                className="font-bold text-lg"
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
              >
                PIN Associate
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
              <input
                type="text"
                placeholder="Search courses, materials..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border transition-colors"
                style={{ 
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)'
                }}
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
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
            
            <ClassNotifications />

            {/* Desktop User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-xl transition-colors"
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: 'var(--navy)' }}
                  suppressHydrationWarning
                >
                  {mounted ? (user?.first_name?.charAt(0) || 'U') : 'U'}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }} suppressHydrationWarning>
                    {mounted ? `${user?.first_name || 'User'} ${user?.last_name || ''}` : 'User'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                    Student
                  </p>
                </div>
                <ChevronDown className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
              </button>

              {/* Desktop User Dropdown */}
              {userMenuOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-lg z-50"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)' }}
                >
                  <div className="p-2">
                    <Link
                      href="/portal/student/profile"
                      className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                      style={{ color: 'var(--ink-muted)' }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">My Profile</span>
                    </Link>
                    <Link
                      href="/"
                      className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                      style={{ color: 'var(--ink-muted)' }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Home className="w-4 h-4" />
                      <span className="text-sm">Back to Website</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left"
                      style={{ color: 'var(--ink-muted)' }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
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
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--rule)' }}>
              <Link href="/" className="flex items-center gap-2">
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
                  PIN Associate
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

            {/* Mobile Navigation */}
            <div className="p-4">
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
        className="fixed left-0 w-64 h-screen border-r overflow-y-auto hidden lg:block"
        style={{ 
          borderColor: 'var(--rule)', 
          backgroundColor: 'var(--bg)',
          top: '80px',
          bottom: 0
        }}
      >
        <div className="p-4">
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

      {/* AI Support Chatbot */}
      <AISupportChatbot />
    </div>
  );
}
