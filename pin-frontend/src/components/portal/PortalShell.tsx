"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, User, CreditCard, BookOpen, FileText,
  LogOut, Menu, X, ChevronRight, Bell, Sun, Moon,
} from "lucide-react";
import { clearTokens, getStoredUser, logout, getRefreshToken } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PortalShellProps {
  nav: NavItem[];
  role: string;
  roleLabel: string;
  roleColor: string;
  children: React.ReactNode;
}

export default function PortalShell({
  nav, role, roleLabel, roleColor, children,
}: PortalShellProps) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router   = usePathname();
  const navigate = useRouter();

  useEffect(() => { 
    setUser(getStoredUser()); 
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

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [router]);

  const handleLogout = async () => {
    const refresh = getRefreshToken() ?? "";
    await logout(refresh);
    navigate.push("/portal/login");
  };

  const isActive = (href: string) =>
    href === `/portal/${role}` ? router === href : router.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b flex items-center gap-3" style={{ borderColor: 'var(--rule)' }}>
        <Image src="/images/pin-logo.png" alt="PIN Associates" width={36} height={36} className="object-contain" />
        <div className="leading-none">
          <span className="block font-heading font-bold text-sm" style={{ color: 'var(--navy)', fontFamily: 'var(--font-display)' }}>PIN Associates</span>
          <span
            className="block text-[10px] font-bold uppercase tracking-widest mt-0.5"
            style={{ color: roleColor }}
          >
            {roleLabel}
          </span>
        </div>
      </div>

      {/* User chip */}
      {user && (
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--rule)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: roleColor }}
            >
              {user.first_name[0]}{user.last_name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--ink)' }}>
                {user.first_name} {user.last_name}
              </p>
              <p className="text-[11px] truncate" style={{ color: 'var(--ink-faint)' }}>{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              isActive(href)
                ? "text-white shadow-sm"
                : "hover:bg-opacity-50"
            )}
            style={isActive(href) ? { backgroundColor: roleColor } : { color: 'var(--ink-muted)' }}
            onMouseEnter={(e) => {
              if (!isActive(href)) {
                e.currentTarget.style.backgroundColor = 'var(--surface)';
                e.currentTarget.style.color = 'var(--navy)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(href)) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--ink-muted)';
              }
            }}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
            {isActive(href) && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-2 border-t" style={{ borderColor: 'var(--rule)' }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ color: 'var(--ink-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEF2F2';
            e.currentTarget.style.color = '#DC2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--ink-muted)';
          }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r fixed top-0 left-0 h-full z-40 flex-shrink-0" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute top-0 left-0 w-72 h-full shadow-2xl" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="flex justify-end p-3 border-b" style={{ borderColor: 'var(--rule)' }}>
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--ink-muted)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--rule)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="border-b px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <button
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--ink-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--rule)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-colors"
              style={{ color: 'var(--ink-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--rule)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              className="p-2 rounded-xl transition-colors relative"
              style={{ color: 'var(--ink-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Bell className="w-5 h-5" />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: roleColor }}
            >
              {user ? `${user.first_name[0]}${user.last_name[0]}` : "?"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 lg:px-8 py-6 md:py-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
