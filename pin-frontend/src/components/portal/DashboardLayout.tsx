"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  BarChart3, BookOpen, User, CreditCard, Settings, BookOpenCheck, Target,
  Sun, Moon, Bell, Search, Home, LogOut, ChevronDown, Users, FileQuestion, ClipboardList
} from "lucide-react";
import { getStoredUser, clearTokens } from "@/lib/auth";
import { useRouter } from "next/navigation";
import AISupportChatbot from "@/components/ui/AISupportChatbot";

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

  useEffect(() => {
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
    clearTokens();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Top Navigation */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 border-b"
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
                style={{ color: 'var(--navy)', fontFamily: 'var(--font-display)' }}
              >
                PIN Associate
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div 
              className="relative flex items-center"
            >
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
            
            <button
              className="p-2 rounded-xl transition-colors relative"
              style={{ 
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--rule)'
              }}
            >
              <Bell className="w-5 h-5" style={{ color: 'var(--ink-muted)' }} />
              <div 
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: 'var(--gold)' }}
              />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-xl transition-colors"
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: 'var(--navy)' }}
                >
                  {user?.first_name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                    {user?.first_name || 'User'} {user?.last_name || ''}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                    Student
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 hidden sm:block" style={{ color: 'var(--ink-muted)' }} />
              </button>

              {/* Dropdown Menu */}
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

      {/* Layout Container */}
      <div className="flex w-full" style={{ paddingTop: '80px' }}>
        {/* Fixed Sidebar */}
        <aside 
          className="fixed left-0 w-64 h-screen border-r overflow-y-auto"
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
        <main className="flex-1 overflow-y-auto" style={{ marginLeft: '256px', height: 'calc(100vh - 80px)' }}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* AI Support Chatbot */}
      <AISupportChatbot />
    </div>
  );
}