"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Pencil, Plus, Search, Video } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import CreateClassModal from "@/components/admin/modals/CreateClassModal";

type ClassStatus = "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
type ExamBody = "ICAN" | "ACCA" | "CITN" | "CISA" | "ATS";
interface ClassSession {
  id: string; fee_plan_id: string; exam_body: ExamBody | null; course_name: string; cohort: string; subject: string; topic: string;
  instructor_name: string; scheduled_at: string; duration_minutes: number;
  meeting_url: string | null; recording_url: string | null; description: string | null; status: ClassStatus;
  materials: { name: string; url: string }[];
}
type Filter = "ALL" | ClassStatus;

export default function AdminClassesContent() {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSession | null>(null);
  const [selectedRecordingClass, setSelectedRecordingClass] = useState<ClassSession | null>(null);
  const [recordingDraft, setRecordingDraft] = useState("");
  const [savingRecording, setSavingRecording] = useState(false);
  const [recordingError, setRecordingError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClasses = useCallback(async () => {
    try {
      const result = await apiFetch<ClassSession[]>("/api/v1/admin/classes");
      setClasses(Array.isArray(result) ? result : []);
      setError("");
    } catch {
      setError("Class records could not be loaded. Please refresh or sign in again as an administrator.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadClasses();
    const refreshInterval = window.setInterval(() => void loadClasses(), 60_000);
    return () => window.clearInterval(refreshInterval);
  }, [loadClasses]);

  const shownClasses = useMemo(() => classes.filter(session => {
    const matchesFilter = filter === "ALL" || session.status === filter;
    const searchText = `${session.exam_body ?? ""} ${session.course_name} ${session.topic} ${session.subject} ${session.instructor_name} ${session.cohort}`.toLowerCase();
    return matchesFilter && searchText.includes(query.toLowerCase());
  }), [classes, filter, query]);

  const stats = [
    { label: "Total Classes", value: classes.length },
    { label: "Upcoming", value: classes.filter(item => item.status === "SCHEDULED").length },
    { label: "Live Now", value: classes.filter(item => item.status === "LIVE").length },
    { label: "Completed", value: classes.filter(item => item.status === "COMPLETED").length },
  ];
  const formatDate = (value: string) => new Date(value).toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos",
  });

  const saveRecording = async (classId: string, value = recordingDraft) => {
    setSavingRecording(true);
    setRecordingError("");
    try {
      await apiFetch(`/api/v1/admin/classes/${classId}/recording`, {
        method: "PATCH",
        body: JSON.stringify({ recording_url: value.trim() || null }),
      });
      setSelectedRecordingClass(null);
      setRecordingDraft("");
      await loadClasses();
    } catch (cause) {
      const apiError = cause as { body?: { detail?: unknown } };
      setRecordingError(typeof apiError.body?.detail === "string" ? apiError.body.detail : "Could not save the class recording link. Check that it is a valid HTTPS URL.");
    } finally {
      setSavingRecording(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap justify-between items-start gap-4">
        <div><h1 className="text-3xl font-bold mb-2" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>Class Management</h1><p style={{ color: "var(--ink-muted)" }}>Schedule classes, edit upcoming sessions, and add a recording link from a completed class card.</p></div>
        <button type="button" onClick={() => setIsCreateOpen(true)} className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2" style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}><Plus className="w-4 h-4" />Schedule Class</button>
      </header>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => <div key={stat.label} className="p-4 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}><p className="text-2xl font-bold mb-1" style={{ color: "var(--ink)" }}>{loading ? "…" : stat.value}</p><p className="text-sm" style={{ color: "var(--ink-muted)" }}>{stat.label}</p></div>)}
      </div>

      <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}>
        <div className="flex flex-wrap gap-3">
          {(["ALL", "SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"] as Filter[]).map(value => <button key={value} type="button" onClick={() => setFilter(value)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: filter === value ? "var(--navy)" : "transparent", color: filter === value ? "white" : "var(--ink-muted)", border: `1px solid ${filter === value ? "var(--navy)" : "var(--rule)"}` }}>{value === "ALL" ? "All Classes" : value.toLowerCase()}</button>)}
        </div>
      </div>

      <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--ink-faint)" }} /><input type="search" placeholder="Search by topic, subject, programme, or instructor…" value={query} onChange={event => setQuery(event.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)", color: "var(--ink)" }} /></div>

      {loading ? <p className="py-12 text-center text-sm" style={{ color: "var(--ink-muted)" }}>Loading classes…</p> : shownClasses.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {shownClasses.map(session => <article key={session.id} className="p-5 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--gold-dark)" }}>{session.exam_body ?? "Unclassified"} · {session.course_name} · {session.cohort}</p>
            <h2 className="font-bold text-lg mb-1" style={{ color: "var(--ink)" }}>{session.topic}</h2>
            <p className="text-sm mb-4" style={{ color: "var(--ink-muted)" }}>{session.subject} · {session.instructor_name}</p>
            <div className="flex items-start gap-2 mb-2 text-sm" style={{ color: "var(--ink-muted)" }}><Calendar className="w-4 h-4 mt-0.5" /><span>{formatDate(session.scheduled_at)}</span></div>
            <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: "var(--ink-muted)" }}><Clock className="w-4 h-4" /><span>{session.duration_minutes} minutes</span></div>
            <div className="flex flex-wrap gap-2"><span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: "var(--navy-50)", color: "var(--navy)" }}>{session.status.toLowerCase()}</span>{session.meeting_url && <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--ink-muted)" }}><Video className="w-3 h-3" />Online</span>}</div>
            {new Date(session.scheduled_at).getTime() > Date.now() && session.status !== "CANCELLED" && <button type="button" onClick={() => setEditingClass(session)} className="mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold" style={{ borderColor: "var(--rule)", color: "var(--navy)" }}><Pencil className="h-4 w-4" />Edit class</button>}
            {session.status === "COMPLETED" && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3" style={{ borderColor: "var(--rule)", backgroundColor: "var(--bg)" }}>
              <div><p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>Class recording</p><p className="text-xs" style={{ color: "var(--ink-muted)" }}>{session.recording_url ? "A recording link is saved" : "No recording link added yet"}</p></div>
              <button type="button" onClick={() => { setSelectedRecordingClass(session); setRecordingDraft(session.recording_url ?? ""); setRecordingError(""); }} className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: "var(--navy)" }}>{session.recording_url ? "Update recording" : "Add recording"}</button>
            </div>}
          </article>)}
        </div>
      ) : <div className="py-12 text-center rounded-2xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)", color: "var(--ink-muted)" }}>{classes.length ? "No classes match these filters." : "No classes scheduled yet."}</div>}

      <CreateClassModal
        isOpen={isCreateOpen || Boolean(editingClass)}
        initialClass={editingClass}
        onClose={() => { setIsCreateOpen(false); setEditingClass(null); }}
        onSuccess={() => { setIsCreateOpen(false); setEditingClass(null); void loadClasses(); }}
      />

      {selectedRecordingClass && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedRecordingClass(null)}>
        <section role="dialog" aria-modal="true" aria-labelledby="recording-dialog-title" className="w-full max-w-xl rounded-2xl border p-6 shadow-2xl" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }} onClick={event => event.stopPropagation()}>
          <h2 id="recording-dialog-title" className="text-2xl font-bold" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>{selectedRecordingClass.recording_url ? "Update class recording" : "Add class recording"}</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>{selectedRecordingClass.course_name} · {selectedRecordingClass.cohort} · {selectedRecordingClass.topic}</p>
          <p className="mt-4 text-sm" style={{ color: "var(--ink-muted)" }}>After Google finishes processing the recording, copy its Drive link and paste it here. Students with permission to view the Drive file will see it on their dashboard.</p>
          <label htmlFor="class-recording-url" className="mt-5 block text-sm font-medium" style={{ color: "var(--ink)" }}>Recording URL (HTTPS)</label>
          <input id="class-recording-url" autoFocus type="url" pattern="https://.*" value={recordingDraft} onChange={event => setRecordingDraft(event.target.value)} placeholder="https://drive.google.com/file/d/..." className="mt-2 w-full rounded-lg border px-4 py-3" style={{ backgroundColor: "var(--bg)", borderColor: "var(--rule)", color: "var(--ink)" }} />
          {recordingError && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{recordingError}</p>}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            {selectedRecordingClass.recording_url && <button type="button" onClick={() => void saveRecording(selectedRecordingClass.id, "")} disabled={savingRecording} className="mr-auto rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-50" style={{ borderColor: "var(--rule)", color: "#B91C1C" }}>Remove link</button>}
            <button type="button" onClick={() => setSelectedRecordingClass(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold" style={{ borderColor: "var(--rule)", color: "var(--ink)" }}>Cancel</button>
            <button type="button" onClick={() => void saveRecording(selectedRecordingClass.id)} disabled={savingRecording || !recordingDraft.trim()} className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" style={{ backgroundColor: "var(--navy)" }}>{savingRecording ? "Saving…" : "Save recording link"}</button>
          </div>
        </section>
      </div>}
    </div>
  );
}
