"use client";

import PortalShell from "./PortalShell";
import { LayoutDashboard, User, FileText } from "lucide-react";

const nav = [
  { label: "Dashboard",     href: "/portal/client",              icon: LayoutDashboard },
  { label: "My Profile",    href: "/portal/client/profile",      icon: User },
  { label: "Deliverables",  href: "/portal/client/deliverables", icon: FileText },
];

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell nav={nav} role="client" roleLabel="Client Portal" roleColor="var(--navy-dark)">
      {children}
    </PortalShell>
  );
}
