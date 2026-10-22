"use client";

import { getStoredUser } from "@/lib/auth";
import { Mail, Phone, User, Building2, Calendar, Award, MapPin } from "lucide-react";

export default function TrainingProfilePage() {
  const user = getStoredUser();
  
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
        >
          My Profile
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Your account information and training programme details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div 
          className="lg:col-span-1 p-6 rounded-2xl border text-center"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold"
            style={{ backgroundColor: 'var(--navy)' }}
          >
            {user ? user.first_name?.charAt(0) : "P"}
          </div>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
            {user ? `${user.first_name} ${user.last_name}` : "Participant"}
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--ink-muted)' }}>
            Training Participant
          </p>
          <div 
            className="px-4 py-2 rounded-lg inline-flex items-center gap-2"
            style={{ backgroundColor: 'var(--navy-50)' }}
          >
            <Award className="w-4 h-4" style={{ color: 'var(--navy)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>
              Active Learner
            </span>
          </div>
        </div>

        {/* Personal Information */}
        <div 
          className="lg:col-span-2 rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--rule)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
              Personal Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { 
                icon: User, 
                label: "Full Name", 
                value: user ? `${user.first_name} ${user.last_name}` : "—",
                bgColor: 'var(--navy-50)',
                iconColor: 'var(--navy)'
              },
              { 
                icon: Mail, 
                label: "Email Address", 
                value: user?.email || "—",
                bgColor: '#DBEAFE',
                iconColor: '#2563EB'
              },
              { 
                icon: Phone, 
                label: "Phone Number", 
                value: user?.phone_number || "—",
                bgColor: '#DCFCE7',
                iconColor: '#16A34A'
              },
              { 
                icon: Building2, 
                label: "Account Type", 
                value: "Corporate Training Participant",
                bgColor: 'var(--gold-50)',
                iconColor: 'var(--gold-dark)'
              },
            ].map(({ icon: Icon, label, value, bgColor, iconColor }) => (
              <div 
                key={label} 
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ backgroundColor: 'var(--bg)' }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: bgColor }}
                >
                  <Icon className="w-5 h-5" style={{ color: iconColor }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--ink-muted)' }}>
                    {label}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Update Notice */}
      <div 
        className="mt-6 p-5 rounded-2xl border"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
      >
        <div className="flex items-start gap-4">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#FEF3C7' }}
          >
            <Mail className="w-5 h-5" style={{ color: '#92600A' }} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
              Need to update your information?
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--ink-muted)' }}>
              To update your personal details or account information, please contact our support team.
            </p>
            <a 
              href="mailto:info@pinassociates.com.ng"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
