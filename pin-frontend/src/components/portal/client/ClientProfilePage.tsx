"use client";

import { getStoredUser } from "@/lib/auth";
import { Mail, Phone, User, Shield } from "lucide-react";

export default function ClientProfilePage() {
  const user = getStoredUser();

  const fields = [
    { icon: User,   label: "Full Name",     value: user ? `${user.first_name} ${user.last_name}` : "—" },
    { icon: Mail,   label: "Email Address", value: user?.email            ?? "—" },
    { icon: Phone,  label: "Phone Number",  value: user?.phone_number     || "—" },
    { icon: Shield, label: "Account Role",  value: "Consultancy Client" },
  ];

  return (
    <div className="max-w-2xl">
      <div className="mb-7">
        <h1 className="font-heading font-extrabold text-[var(--navy-dark)] text-2xl">My Profile</h1>
        <p className="text-[var(--ink-muted)] text-sm mt-1">Your account details on file with PIN Associates.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--rule)] p-6">
        <h2 className="font-heading font-bold text-[var(--navy-dark)] text-sm uppercase tracking-wider mb-5">Account Information</h2>
        <div className="space-y-4">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 p-4 bg-[var(--surface)] rounded-xl">
              <div className="w-9 h-9 bg-[var(--navy-50)] rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[var(--navy-dark)]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--ink-faint)] uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-[var(--ink)] mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--ink-faint)] mt-5">
          To update your details, contact{" "}
          <a href="mailto:info@pinassociates.com.ng" className="text-[var(--navy)] hover:underline">
            info@pinassociates.com.ng
          </a>.
        </p>
      </div>
    </div>
  );
}
