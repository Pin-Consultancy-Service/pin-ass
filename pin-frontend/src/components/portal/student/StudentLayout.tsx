'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { designTokens } from '@/lib/designTokens';
import StudentSidebar from './StudentSidebar';
import StudentHeader from './StudentHeader';
import AISupportChatbot from '@/components/ui/AISupportChatbot';

interface StudentLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  user?: any;
  notificationCount?: number;
}

export default function StudentLayout({
  children,
  activeTab = 'dashboard',
  user,
  notificationCount = 0,
}: StudentLayoutProps) {
  const { isDark } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

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

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const bgGradient = isDark ? designTokens.gradients.darkBg : designTokens.gradients.lightBg;
  const contentOverlay = isDark ? designTokens.contentOverlay.dark : designTokens.contentOverlay.light;

  return (
    <div
      className="min-h-screen"
      style={{
        background: bgGradient,
      }}
    >
      {/* Background Overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundColor: contentOverlay,
        }}
      />

      {/* Sidebar */}
      <StudentSidebar activeTab={activeTab} user={user} />

      {/* Header */}
      <StudentHeader notificationCount={notificationCount} />

      {/* Main Content - Desktop */}
      <div
        className="hidden lg:block fixed top-[4.79rem] bottom-0 right-0 overflow-y-auto transition-all duration-300"
        style={{
          left: collapsed ? '80px' : '256px',
        }}
      >
        <div className="p-6 relative z-10">
          {children}
        </div>
      </div>

      {/* Main Content - Mobile */}
      <main className="lg:hidden pt-[4.79rem] relative z-10 pb-20">
        <div className="p-4">
          {children}
        </div>
      </main>

      {/* AI Support Chatbot */}
      <AISupportChatbot />
    </div>
  );
}
