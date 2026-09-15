"use client";
import PortalShell from "./PortalShell";
import { LayoutDashboard, User, BookOpen, CreditCard } from "lucide-react";

const nav = [
  { label: "Dashboard",       href: "/portal/training",           icon: LayoutDashboard },
  { label: "My Profile",      href: "/portal/training/profile",   icon: User },
  { label: "Materials",       href: "/portal/training/materials", icon: BookOpen },
  { label: "Payment Status",  href: "/portal/training/fees",      icon: CreditCard },
];

export default function TrainingPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell nav={nav} role="training" roleLabel="Training Portal" roleColor="var(--navy)">
      {children}
    </PortalShell>
  );
}
