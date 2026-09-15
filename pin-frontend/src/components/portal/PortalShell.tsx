"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, User, CreditCard, BookOpen, FileText,
  LogOut, Menu, X, ChevronRight, Bell,
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
  const router   = usePathname();
  const navigate = useRouter();

  useEffect(() => { setUser(getStoredUser()); }, []);

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
      <div className="px-5 py-5 border-b border-[var(--rule)] flex items-center gap-3">
        <Image src="/images/pin-logo.png" alt="PIN Associate" width={36} height={36} className="object-contain" />
        <div className="leading-none">
          <span className="block font-heading font-bold text-[var(--navy)] text-sm">PIN Associate</span>
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
        <div className="px-5 py-4 border-b border-[var(--rule)]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: roleColor }}
            >
              {user.first_name[0]}{user.last_name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--ink)] truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-[11px] text-[var(--ink-faint)] truncate">{user.email}</p>
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
                : "text-[var(--ink-muted)] hover:bg-[var(--surface)] hover:text-[var(--navy)]"
            )}
            style={isActive(href) ? { backgroundColor: roleColor } : {}}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
            {isActive(href) && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-2 border-t border-[var(--rule)]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                     text-[var(--ink-muted)] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--surface)] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[var(--rule)] fixed top-0 left-0 h-full z-40 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute top-0 left-0 w-72 h-full bg-white shadow-2xl">
            <div className="flex justify-end p-3 border-b border-[var(--rule)]">
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg text-[var(--ink-muted)] hover:bg-[var(--rule)]">
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
        <header className="bg-white border-b border-[var(--rule)] px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            className="lg:hidden p-2 rounded-lg text-[var(--ink-muted)] hover:bg-[var(--rule)]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl text-[var(--ink-muted)] hover:bg-[var(--surface)] relative">
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
        <main className="flex-1 px-4 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
