"use client";

import { User, Settings, Home, LogOut } from "lucide-react";
import Link from "next/link";

interface ProfileDropdownProps {
  admin: any;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDropdown({ admin, onLogout, isOpen, onClose }: ProfileDropdownProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        style={{ backgroundColor: "transparent" }}
      />

      {/* Dropdown Panel */}
      <div
        className="absolute right-0 top-full mt-2 w-64 rounded-xl border shadow-2xl z-50 overflow-hidden"
        style={{
          backgroundColor: "var(--bg)",
          borderColor: "var(--rule)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Profile Section */}
        <div className="p-4 border-b" style={{ borderColor: "var(--rule)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
              style={{ backgroundColor: "var(--navy)" }}
            >
              {admin?.first_name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: "var(--ink)" }}>
                {admin?.first_name || "Admin"} {admin?.last_name || ""}
              </p>
              <p className="text-xs truncate" style={{ color: "var(--ink-muted)" }}>
                {admin?.email || "admin@pinassociates.com"}
              </p>
            </div>
          </div>
          <div
            className="inline-flex px-2 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "var(--gold-50)", color: "var(--warning-text)" }}
          >
            Super Admin
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <Link
            href="/admin/profile"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-lg transition-all"
            style={{ color: "var(--ink-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">My Profile</span>
          </Link>

          <Link
            href="/admin/settings"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-lg transition-all"
            style={{ color: "var(--ink-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Settings</span>
          </Link>

          <div className="my-2 border-t" style={{ borderColor: "var(--rule)" }} />

          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-lg transition-all"
            style={{ color: "var(--ink-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Website</span>
          </Link>

          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left"
            style={{ color: "var(--error-text)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--error-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
