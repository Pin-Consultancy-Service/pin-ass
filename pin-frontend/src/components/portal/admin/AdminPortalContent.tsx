"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users, FileUp, Building2, Search, CheckCircle2,
  Upload, LogOut,
} from "lucide-react";
import { apiFetch, getStoredUser, logout, getRefreshToken } from "@/lib/auth";

interface StudentSummary {
  id: string;
  full_name: string;
  email: string;
  registration_number: string;
  programme_display: string;
  diet: string;
}

interface EngagementSummary {
  id: string;
  title: string;
  service_type_display: string;
  status_display: string;
}

type AdminTab = "students" | "clients" | "training";

/* ── Fee balance form ─────────────────────────────── */
function FeeBalanceForm({ studentId, onDone }: { studentId: string; onDone: () => void }) {
  const [due, setDue] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg("");
    try {
      await apiFetch(`/api/students/staff/${studentId}/balance/`, {
        method: "PATCH",
        body: JSON.stringify({ total_fees_due: due, notes }),
      });
      setMsg("Balance updated successfully.");
      onDone();
    } catch {
      setMsg("Failed to update. Check the amount and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-4 bg-[var(--surface)] rounded-xl border border-[var(--rule)] space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="form-label text-xs">Total Fees Due (₦)</label>
          <input type="number" value={due} onChange={(e) => setDue(e.target.value)}
                 placeholder="e.g. 95000" className="form-input text-sm" required />
        </div>
        <div>
          <label className="form-label text-xs">Staff Note (shown to student)</label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
                 placeholder="Optional note" className="form-input text-sm" />
        </div>
      </div>
      {msg && (
        <p className={`text-xs font-semibold ${msg.includes("Failed") ? "text-[#DC2626]" : "text-[var(--navy)]"}`}>
          {msg}
        </p>
      )}
      <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 bg-[var(--navy)] text-white font-semibold
                         text-xs px-4 py-2 rounded-lg hover:bg-[var(--navy-dark)] transition-colors disabled:opacity-60">
        {saving
          ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <CheckCircle2 className="w-3.5 h-3.5" />}
        {saving ? "Saving…" : "Update Balance"}
      </button>
    </form>
  );
}

/* ── Deliverable upload form ──────────────────────── */
function DeliverableUploadForm({ engagementId }: { engagementId: string }) {
  const [title,   setTitle]   = useState("");
  const [typeVal, setTypeVal] = useState("OTHER");
  const [url,     setUrl]     = useState("");
  const [isFinal, setIsFinal] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState("");

  const TYPES = [
    { value: "FINANCIAL", label: "Financial Statement" },
    { value: "TAX",       label: "Tax Report" },
    { value: "AUDIT",     label: "Audit Report" },
    { value: "ADVISORY",  label: "Advisory Report" },
    { value: "VALUATION", label: "Valuation" },
    { value: "INVOICE",   label: "Invoice" },
    { value: "OTHER",     label: "Other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg("");
    try {
      await apiFetch("/api/clients/staff/deliverables/upload/", {
        method: "POST",
        body: JSON.stringify({
          engagement: engagementId,
          title,
          deliverable_type: typeVal,
          cloudinary_url: url,
          is_final: isFinal,
        }),
      });
      setMsg("Document uploaded successfully.");
      setTitle(""); setUrl("");
    } catch {
      setMsg("Upload failed. Check the URL and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-4 bg-[var(--surface)] rounded-xl border border-[var(--rule)] space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="form-label text-xs">Document Title *</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                 placeholder="e.g. Financial Statements FY2026" className="form-input text-sm" />
        </div>
        <div>
          <label className="form-label text-xs">Document Type</label>
          <select value={typeVal} onChange={(e) => setTypeVal(e.target.value)} className="form-input text-sm">
            {TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="form-label text-xs">Cloudinary / File URL *</label>
        <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)}
               placeholder="https://res.cloudinary.com/…" className="form-input text-sm" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={isFinal} onChange={(e) => setIsFinal(e.target.checked)}
               className="w-4 h-4 rounded" />
        <span className="text-xs font-medium text-[var(--ink-muted)]">Mark as final version</span>
      </label>
      {msg && (
        <p className={`text-xs font-semibold ${msg.includes("failed") ? "text-[#DC2626]" : "text-[var(--navy)]"}`}>
          {msg}
        </p>
      )}
      <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 bg-[var(--navy-dark)] text-white font-semibold
                         text-xs px-4 py-2 rounded-lg hover:bg-[var(--navy)] transition-colors disabled:opacity-60">
        {saving
          ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <Upload className="w-3.5 h-3.5" />}
        {saving ? "Uploading…" : "Upload Document"}
      </button>
    </form>
  );
}

/* ── Main ─────────────────────────────────────────── */
export default function AdminPortalContent() {
  const router = useRouter();
  const user   = getStoredUser();
  const [tab,         setTab]         = useState<AdminTab>("students");
  const [students,    setStudents]    = useState<StudentSummary[]>([]);
  const [engagements, setEngagements] = useState<EngagementSummary[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [search,      setSearch]      = useState("");
  const [expanded,    setExpanded]    = useState<string | null>(null);

  useEffect(() => {
    if (!user) { router.replace("/portal/login?redirect=/admin-portal"); return; }
    if (user.role !== "STAFF") {
      router.replace(user.role === "CLIENT" ? "/portal/client" : "/portal/student");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setLoading(true); setSearch(""); setExpanded(null);
    if (tab === "students") {
      apiFetch<StudentSummary[]>("/api/students/staff/list/")
        .then((d) => setStudents(Array.isArray(d) ? d : []))
        .catch(() => setStudents([]))
        .finally(() => setLoading(false));
    } else if (tab === "clients") {
      apiFetch<EngagementSummary[]>("/api/clients/staff/engagements/")
        .then((d) => setEngagements(Array.isArray(d) ? d : []))
        .catch(() => setEngagements([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [tab]);

  const handleLogout = async () => {
    await logout(getRefreshToken() ?? "");
    router.push("/portal/login");
  };

  const filteredStudents    = students.filter(
    (s) => `${s.full_name} ${s.email} ${s.registration_number}`.toLowerCase().includes(search.toLowerCase())
  );
  const filteredEngagements = engagements.filter(
    (e) => e.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!user || user.role !== "STAFF") return null;

  const tabs = [
    { id: "students" as const, label: "Student Fees",      icon: Users },
    { id: "clients"  as const, label: "Client Documents",  icon: Building2 },
    { id: "training" as const, label: "Training Records",  icon: FileUp },
  ];

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <header className="bg-[var(--navy-dark)] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="font-heading font-bold text-white text-lg leading-tight">Staff Admin Portal</h1>
          <p className="text-white/40 text-[11px]">PIN Associate · Internal use only · Not linked from public site</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-xs hidden sm:block">{user.first_name} {user.last_name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-white/60
                       hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-[var(--rule)] p-1.5 mb-6 w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${tab === id
                  ? "bg-[var(--navy-dark)] text-white shadow-sm"
                  : "text-[var(--ink-muted)] hover:text-[var(--navy)] hover:bg-[var(--surface)]"}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-faint)]" />
          <input
            type="search"
            placeholder={tab === "students" ? "Search by name, email, or reg. number…" : "Search by engagement title…"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-11"
          />
        </div>

        {loading ? (
          <div className="h-40 flex items-center justify-center text-[var(--ink-faint)] text-sm">Loading…</div>
        ) : tab === "students" ? (
          /* ── Student fee management ─────────── */
          <div className="space-y-3">
            <p className="text-xs text-[var(--ink-faint)] font-semibold uppercase tracking-wider mb-2">
              {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""}
            </p>
            {filteredStudents.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl border border-[var(--rule)] overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--surface)] transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">{s.full_name}</p>
                    <p className="text-xs text-[var(--ink-faint)] mt-0.5">
                      {s.email} · {s.programme_display}
                      {s.registration_number && ` · ${s.registration_number}`}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[var(--navy)]">
                    {expanded === s.id ? "Close ↑" : "Update Fees ↓"}
                  </span>
                </button>
                {expanded === s.id && (
                  <div className="px-5 pb-5">
                    <FeeBalanceForm studentId={s.id} onDone={() => setExpanded(null)} />
                  </div>
                )}
              </div>
            ))}
            {filteredStudents.length === 0 && (
              <div className="text-center py-10 text-sm text-[var(--ink-faint)]">No students found.</div>
            )}
          </div>
        ) : tab === "clients" ? (
          /* ── Client document upload ─────────── */
          <div className="space-y-3">
            <p className="text-xs text-[var(--ink-faint)] font-semibold uppercase tracking-wider mb-2">
              {filteredEngagements.length} engagement{filteredEngagements.length !== 1 ? "s" : ""}
            </p>
            {filteredEngagements.map((e) => (
              <div key={e.id} className="bg-white rounded-2xl border border-[var(--rule)] overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--surface)] transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">{e.title}</p>
                    <p className="text-xs text-[var(--ink-faint)] mt-0.5">
                      {e.service_type_display} · {e.status_display}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[var(--navy-dark)]">
                    {expanded === e.id ? "Close ↑" : "Upload Document ↓"}
                  </span>
                </button>
                {expanded === e.id && (
                  <div className="px-5 pb-5">
                    <DeliverableUploadForm engagementId={e.id} />
                  </div>
                )}
              </div>
            ))}
            {filteredEngagements.length === 0 && (
              <div className="text-center py-10 text-sm text-[var(--ink-faint)]">No engagements found.</div>
            )}
          </div>
        ) : (
          /* ── Training (redirects to Django admin) ─ */
          <div className="bg-white rounded-2xl border border-[var(--rule)] p-10 text-center">
            <FileUp className="w-10 h-10 text-[var(--rule)] mx-auto mb-4" />
            <h2 className="font-heading font-bold text-[var(--navy-dark)] text-lg mb-2">Training Management</h2>
            <p className="text-[var(--ink-muted)] text-sm leading-relaxed max-w-sm mx-auto mb-6">
              Manage training enrollments, upload materials, and record payments
              via the Django admin interface.
            </p>
            <a
              href="http://localhost:8000/admin/training/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--navy-dark)] text-white font-semibold
                         text-sm px-6 py-3 rounded-xl hover:bg-[var(--navy)] transition-colors"
            >
              Open Django Admin →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
