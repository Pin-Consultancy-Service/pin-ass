"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Save } from "lucide-react";
import { apiFetch, getStoredUser, DEMO_MODE } from "@/lib/auth";

interface StudentProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  registration_number: string;
  programme: string;
  programme_display: string;
  study_mode: string;
  study_mode_display: string;
  diet: string;
  date_enrolled: string;
  is_active_student: boolean;
}

const PROGRAMMES = [
  { value: "ICAN_FDN",  label: "ICAN Foundation" },
  { value: "ICAN_SKL",  label: "ICAN Skills" },
  { value: "ICAN_PRO",  label: "ICAN Professional" },
  { value: "ACCA_APK",  label: "ACCA Applied Knowledge" },
  { value: "ACCA_APS",  label: "ACCA Applied Skills" },
  { value: "ACCA_SP",   label: "ACCA Strategic Professional" },
  { value: "CITN_QLF",  label: "CITN Qualifying" },
  { value: "CITN_PRO",  label: "CITN Professional" },
  { value: "ATS",       label: "ATS" },
  { value: "CISA",      label: "CISA" },
  { value: "IFRS_CERT", label: "Certificate in IFRS" },
  { value: "IFRS_DIP",  label: "Diploma in IFRS" },
];

const MODES = [
  { value: "WEEKDAY",  label: "Weekday" },
  { value: "WEEKEND",  label: "Weekend" },
  { value: "ONLINE",   label: "Online" },
  { value: "HYBRID",   label: "Hybrid" },
];

export default function StudentProfilePage() {
  const router  = useRouter();
  const user    = getStoredUser();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [programme, setProgramme] = useState("");
  const [mode,      setMode]      = useState("WEEKDAY");
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => {
    // Skip auth check in demo mode
    if (DEMO_MODE) {
      // Set mock profile data for demo
      const mockProfile: StudentProfile = {
        id: "demo-student-123",
        full_name: "Demo Student",
        email: "demo@pinassociate.com",
        phone: "+234 800 000 0000",
        registration_number: "PIN/DEMO/2024/001",
        programme: "ICAN_PRO",
        programme_display: "ICAN Professional",
        study_mode: "HYBRID",
        study_mode_display: "Hybrid (Online + Physical)",
        diet: "NOV",
        date_enrolled: "2024-01-15",
        is_active_student: true,
      };
      setProfile(mockProfile);
      setProgramme(mockProfile.programme);
      setMode(mockProfile.study_mode);
      setLoading(false);
      return;
    }

    if (!user) { router.replace("/portal/login?redirect=/portal/student/profile"); return; }
    apiFetch<StudentProfile>("/api/students/me/profile/")
      .then((p) => { setProfile(p); setProgramme(p.programme); setMode(p.study_mode); })
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      await apiFetch("/api/students/me/profile/", {
        method: "PATCH",
        body: JSON.stringify({ programme, study_mode: mode }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-40 flex items-center justify-center text-[var(--ink-faint)] text-sm">Loading…</div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-7">
        <h1 className="font-heading font-extrabold text-2xl" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>My Profile</h1>
        <p className="text-[var(--ink-muted)] text-sm mt-1">Your registration details and programme information.</p>
      </div>

      {/* Read-only account info */}
      <div className="rounded-2xl border p-6 mb-5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
        <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-5" style={{ color: 'var(--ink)' }}>Account Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { dt: "Full Name",        dd: profile?.full_name        || user?.first_name + " " + user?.last_name },
            { dt: "Email Address",    dd: profile?.email            || user?.email },
            { dt: "Phone Number",     dd: profile?.phone            || "—" },
            { dt: "Registration No.", dd: profile?.registration_number || "Pending assignment" },
            { dt: "Date Enrolled",    dd: profile?.date_enrolled    || "—" },
            { dt: "Account Status",   dd: profile?.is_active_student ? "Active" : "Inactive" },
          ].map(({ dt, dd }) => (
            <div key={dt} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg)' }}>
              <dt className="text-[10px] font-bold text-[var(--ink-faint)] uppercase tracking-wider mb-1">{dt}</dt>
              <dd className="text-sm font-semibold text-[var(--ink)]">{dd}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-[var(--ink-faint)] mt-4">
          To update your name, email, or phone number, contact{" "}
          <a href="mailto:info@pinassociates.com.ng" className="hover:underline" style={{ color: 'var(--navy)' }}>
            info@pinassociates.com.ng
          </a>.
        </p>
      </div>

      {/* Editable programme info */}
      <form onSubmit={handleSave} className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
        <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-5" style={{ color: 'var(--ink)' }}>Programme Details</h2>

        {error && (
          <div className="text-sm text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 mb-5">{error}</div>
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="programme" className="form-label">Enrolled Programme</label>
            <select id="programme" value={programme} onChange={(e) => setProgramme(e.target.value)} className="form-input">
              <option value="">— Select programme —</option>
              {PROGRAMMES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="mode" className="form-label">Study Mode</label>
            <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)} className="form-input">
              {MODES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 font-semibold
                       text-sm px-6 py-3 rounded-xl transition-colors
                       shadow-sm disabled:opacity-60"
            style={{ backgroundColor: 'var(--navy)', color: 'white' }}
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--ink)' }}>
              <CheckCircle2 className="w-4 h-4" /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
