"use client";

import { Bell, DollarSign, Calendar, Users, AlertCircle } from "lucide-react";
import { mockNotifications } from "@/lib/mockAdminData";
import Link from "next/link";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <Users className="w-4 h-4" />;
      case "payment":
        return <DollarSign className="w-4 h-4" />;
      case "class":
        return <Calendar className="w-4 h-4" />;
      case "user":
        return <Users className="w-4 h-4" />;
      case "system":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationIconColor = (type: string) => {
    switch (type) {
      case "enrollment":
        return { backgroundColor: "var(--navy-50)", color: "var(--navy)" };
      case "payment":
        return { backgroundColor: "var(--success-bg)", color: "var(--success-text)" };
      case "class":
        return { backgroundColor: "var(--gold-50)", color: "var(--warning-text)" };
      case "user":
        return { backgroundColor: "var(--info-bg)", color: "var(--info-text)" };
      case "system":
        return { backgroundColor: "var(--warning-bg)", color: "var(--warning-text)" };
      default:
        return { backgroundColor: "var(--surface)", color: "var(--ink-muted)" };
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        style={{ backgroundColor: "transparent" }}
      />

      {/* Panel */}
      <div
        className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border shadow-2xl z-50 overflow-hidden"
        style={{
          backgroundColor: "var(--bg)",
          borderColor: "var(--rule)",
          backdropFilter: "blur(12px)",
          maxHeight: "min(32rem, 80vh)",
        }}
      >
        {/* Header */}
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: "var(--rule)" }}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg" style={{ color: "var(--ink)" }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: "var(--error-text)" }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <button
            className="text-xs font-semibold transition-colors hover:opacity-70"
            style={{ color: "var(--navy)" }}
          >
            Mark all read
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(80vh - 120px)" }}>
          {mockNotifications.map((notification) => (
            <Link
              key={notification.id}
              href={notification.link || "/admin/dashboard"}
              onClick={onClose}
              className="block border-b transition-all hover:scale-[1.01]"
              style={{
                borderColor: "var(--rule)",
                borderLeftWidth: notification.read ? "0" : "3px",
                borderLeftColor: notification.read ? "transparent" : "var(--gold)",
                backgroundColor: notification.read ? "transparent" : "var(--navy-50)",
              }}
            >
              <div className="p-3 flex gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={getNotificationIconColor(notification.type)}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm" style={{ color: "var(--ink)" }}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: "var(--gold)" }}
                      />
                    )}
                  </div>
                  <p className="text-xs mb-1 line-clamp-2" style={{ color: "var(--ink-muted)" }}>
                    {notification.message}
                  </p>
                  <p className="text-xs" style={{ color: "var(--ink-faint)" }}>
                    {getRelativeTime(notification.timestamp)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div
          className="p-3 border-t text-center"
          style={{ borderColor: "var(--rule)", backgroundColor: "var(--surface)" }}
        >
          <Link
            href="/admin/notifications"
            onClick={onClose}
            className="text-sm font-semibold transition-colors hover:opacity-70"
            style={{ color: "var(--navy)" }}
          >
            View all notifications
          </Link>
        </div>
      </div>
    </>
  );
}
