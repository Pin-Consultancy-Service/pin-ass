"use client";

import PortalShell from "./PortalShell";
import { LayoutDashboard, User, CreditCard, BookOpen } from "lucide-react";

const nav = [
  { label: "Dashboard",       href: "/portal/student",           icon: LayoutDashboard },
  { label: "My Profile",      href: "/portal/student/profile",   icon: User },
  { label: "Fees & Payments", href: "/portal/student/fees",      icon: CreditCard },
  { label: "Study Materials", href: "/portal/student/materials", icon: BookOpen },
];

export default function StudentPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell
      nav={nav}
      role="student"
      roleLabel="Student Portal"
      roleColor="var(--navy)"
    >
      {children}
    </PortalShell>
  );
}
