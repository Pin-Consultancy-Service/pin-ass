"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  BarChart3, BookOpen, Users, Upload, Settings, LogOut, Home,
  Sun, Moon, Bell, Menu, X, FileText, Calendar, Award
} from "lucide-react";

interface InstructorDashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/instructor/dashboard', key: 'dashboard' },
  { icon: Calendar, label: 'My Classes', href: '/instructor/classes', key: 'classes' },
  { icon: Users, label: 'Students', href: '/instructor/students', key: 'students' },
  { icon: FileText, label: 'Materials', href: '/instructor/materials', key: 'materials' },
  { icon: Award, label: 'Grading', href: '/instructor/grading', key: 'grading' },
  { icon: Settings, label: 'Settings', href: '/instructor/settings', key: 'settings' },
];

export default function InstructorDashboardLayout({ children, activeTab = 'dashboard' }: InstructorDashboardLayoutProps) {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [instructor, setInstructor] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Get instructor data
    const instructorData = localStorage.getItem('instructor_user');
    if (instructorData) {
      setInstructor(JSON.parse(instructorData));
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
    localStorage.removeItem('instructor_token');
    localStorage.removeItem('instructor_user');
    router.push('/instructor/login');
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

          <Link href="/instructor/dashboard" className="flex items-center gap-2">
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
              Instructor Portal
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--ink-muted)' }}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

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
                  {mounted ? (instructor?.first_name?.charAt(0) || 'I') : 'I'}
                </div>
              </button>

              {userMenuOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-lg z-50"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)' }}
                >
                  <div className="p-2">
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
          <Link href="/instructor/dashboard" className="flex items-center gap-3">
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
              Instructor Portal
            </span>
          </Link>

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
                  {mounted ? (instructor?.first_name?.charAt(0) || 'I') : 'I'}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }} suppressHydrationWarning>
                    {mounted ? `${instructor?.first_name || 'Instructor'} ${instructor?.last_name || ''}` : 'Instructor'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                    Instructor
                  </p>
                </div>
              </button>

              {userMenuOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-lg z-50"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--rule)' }}
                >
                  <div className="p-2">
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
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--rule)' }}>
              <Link href="/instructor/dashboard" className="flex items-center gap-2">
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
                  Instructor
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
    </div>
  );
}