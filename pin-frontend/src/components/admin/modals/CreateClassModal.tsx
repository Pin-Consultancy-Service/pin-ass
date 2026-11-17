"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { apiFetch } from "@/lib/auth";

type ExamBody = "ICAN" | "ACCA" | "CITN" | "CISA" | "ATS";
const examBodies: ExamBody[] = ["ICAN", "ACCA", "CITN", "CISA", "ATS"];
interface FeePlan { id: string; name: string; exam_body: ExamBody | null; cohort_name: string | null; amount_minor: number; is_active: boolean; }
export interface EditableClass {
  id: string; fee_plan_id: string; exam_body: ExamBody | null; course_name: string; cohort: string; subject: string; topic: string;
  instructor_name: string; scheduled_at: string; duration_minutes: number; meeting_url: string | null; recording_url: string | null;
  description: string | null; materials: { name: string; url: string }[]; status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
}
interface CreateClassModalProps { isOpen: boolean; onClose: () => void; onSuccess: () => void; initialClass?: EditableClass | null; }

const inputStyle = { backgroundColor: "var(--bg)", borderColor: "var(--rule)", color: "var(--ink)" };

export default function CreateClassModal({ isOpen, onClose, onSuccess, initialClass = null }: CreateClassModalProps) {
  const [feePlans, setFeePlans] = useState<FeePlan[]>([]);
  const [feePlanId, setFeePlanId] = useState("");
  const [examBody, setExamBody] = useState<ExamBody | "">("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [instructor, setInstructor] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState("120");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [recordingUrl, setRecordingUrl] = useState("");
  const [materialsText, setMaterialsText] = useState("");
  const [description, setDescription] = useState("");
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    if (initialClass) {
      const date = new Date(initialClass.scheduled_at);
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
      setFeePlanId(initialClass.fee_plan_id);
      setExamBody(initialClass.exam_body ?? "");
      setSubject(initialClass.subject);
      setTopic(initialClass.topic);
      setInstructor(initialClass.instructor_name);
      setScheduledAt(localDate);
      setDuration(String(initialClass.duration_minutes));
      setMeetingUrl(initialClass.meeting_url ?? "");
      setRecordingUrl(initialClass.recording_url ?? "");
      setMaterialsText(initialClass.materials.map(item => `${item.name} | ${item.url}`).join("\n"));
      setDescription(initialClass.description ?? "");
      setError("");
      return;
    }
    setLoadingPlans(true);
    apiFetch<FeePlan[]>("/api/v1/admin/fee-plans")
      .then(plans => {
        const active = Array.isArray(plans) ? plans.filter(plan => plan.is_active) : [];
        setFeePlans(active);
        setExamBody("");
        setFeePlanId("");
      })
      .catch(() => setError("Could not load active fee plans. Please close and reopen this form."))
      .finally(() => setLoadingPlans(false));
  }, [isOpen, initialClass]);

  if (!isOpen) return null;

  const compatiblePlans = feePlans.filter(plan => plan.exam_body === examBody);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...(!initialClass ? { fee_plan_id: feePlanId, exam_body: examBody } : {}),
        subject: subject.trim(),
        topic: topic.trim(),
        instructor_name: instructor.trim(),
        scheduled_at: new Date(scheduledAt).toISOString(),
        duration_minutes: Number(duration),
        meeting_url: meetingUrl.trim() || null,
        recording_url: recordingUrl.trim() || null,
        materials: materialsText.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
          const separator = line.indexOf("|");
          return { name: line.slice(0, separator).trim(), url: line.slice(separator + 1).trim() };
        }),
        description: description.trim() || null,
      };
      await apiFetch(initialClass ? `/api/v1/admin/classes/${initialClass.id}` : "/api/v1/admin/classes", {
        method: initialClass ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      onSuccess();
    } catch (cause) {
      const apiError = cause as { body?: { detail?: unknown } };
      setError(typeof apiError.body?.detail === "string" ? apiError.body.detail : "Could not schedule this class. Check the details and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,.5)" }} onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "var(--surface)" }} onClick={event => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-2xl font-bold" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>{initialClass ? "Edit Scheduled Class" : "Schedule a Class"}</h2><p className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>{initialClass ? `${initialClass.course_name} · ${initialClass.cohort}` : "Only students with a confirmed payment for the selected fee plan can access the class."}</p></div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 rounded-lg" style={{ backgroundColor: "var(--bg)" }}><X className="w-5 h-5" style={{ color: "var(--ink)" }} /></button>
        </div>
        {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!initialClass && <label className="block text-sm font-medium" style={{ color: "var(--ink)" }}>Exam body / course
            <select required value={examBody} onChange={event => {
              const selected = event.target.value as ExamBody | "";
              setExamBody(selected);
              setFeePlanId("");
            }} disabled={loadingPlans} className="mt-1 w-full rounded-lg border px-4 py-2" style={inputStyle}>
              <option value="">Choose an exam body</option>
              {examBodies.map(body => <option key={body} value={body}>{body}</option>)}
            </select>
          </label>}
          {!initialClass && <label className="block text-sm font-medium" style={{ color: "var(--ink)" }}>Course and cohort
            <select required value={feePlanId} onChange={event => setFeePlanId(event.target.value)} disabled={loadingPlans || compatiblePlans.length === 0} className="mt-1 w-full rounded-lg border px-4 py-2" style={inputStyle}>
              {loadingPlans && <option value="">Loading fee plans…</option>}
              {!loadingPlans && compatiblePlans.length === 0 && <option value="">No cohort available for {examBody || "this course"}</option>}
              {!loadingPlans && compatiblePlans.length > 0 && <option value="">Choose a course cohort</option>}
              {compatiblePlans.map(plan => <option key={plan.id} value={plan.id}>{plan.name} · {plan.cohort_name ?? "Legacy cohort"}</option>)}
            </select>
          </label>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium" style={{ color: "var(--ink)" }}>Subject
              <input required minLength={2} maxLength={180} value={subject} onChange={event => setSubject(event.target.value)} className="mt-1 w-full rounded-lg border px-4 py-2" style={inputStyle} />
            </label>
            <label className="block text-sm font-medium" style={{ color: "var(--ink)" }}>Instructor name
              <input required minLength={2} maxLength={180} value={instructor} onChange={event => setInstructor(event.target.value)} className="mt-1 w-full rounded-lg border px-4 py-2" style={inputStyle} />
            </label>
          </div>
          <label className="block text-sm font-medium" style={{ color: "var(--ink)" }}>Class topic
            <input required minLength={2} maxLength={240} value={topic} onChange={event => setTopic(event.target.value)} className="mt-1 w-full rounded-lg border px-4 py-2" style={inputStyle} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium" style={{ color: "var(--ink)" }}>Date and time (local)
              <input required type="datetime-local" value={scheduledAt} onChange={event => setScheduledAt(event.target.value)} className="mt-1 w-full rounded-lg border px-4 py-2" style={inputStyle} />
            </label>
            <label className="block text-sm font-medium" style={{ color: "var(--ink)" }}>Duration in minutes
              <input required type="number" min="15" max="480" value={duration} onChange={event => setDuration(event.target.value)} className="mt-1 w-full rounded-lg border px-4 py-2" style={inputStyle} />
            </label>
          </div>
          <label className="block text-sm font-medium" style={{ color: "var(--ink)" }}>Google Meet / Zoom link (HTTPS)
            <input type="url" pattern="https://.*" value={meetingUrl} onChange={event => setMeetingUrl(event.target.value)} placeholder="https://meet.google.com/..." className="mt-1 w-full rounded-lg border px-4 py-2" style={inputStyle} />
          </label>
          {!initialClass && <label className="block text-sm font-medium" style={{ color: "var(--ink)" }}>Recording link (optional, HTTPS)
            <input type="url" pattern="https://.*" value={recordingUrl} onChange={event => setRecordingUrl(event.target.value)} placeholder="Add a recording link when available" className="mt-1 w-full rounded-lg border px-4 py-2" style={inputStyle} />
          </label>}
          <label className="block text-sm font-medium" style={{ color: "var(--ink)" }}>Class materials (optional)
            <textarea rows={3} value={materialsText} onChange={event => setMaterialsText(event.target.value)} placeholder={"One material per line: File name | https://secure-link"} className="mt-1 w-full rounded-lg border px-4 py-2" style={inputStyle} />
            <span className="mt-1 block text-xs font-normal" style={{ color: "var(--ink-muted)" }}>Use HTTPS links. Each line must contain a name, a vertical bar, and the secure URL.</span>
          </label>
          <label className="block text-sm font-medium" style={{ color: "var(--ink)" }}>Description (optional)
            <textarea maxLength={3000} rows={3} value={description} onChange={event => setDescription(event.target.value)} className="mt-1 w-full rounded-lg border px-4 py-2" style={inputStyle} />
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border px-4 py-2 font-semibold" style={{ borderColor: "var(--rule)", color: "var(--ink)" }}>Cancel</button>
            <button type="submit" disabled={saving || (!initialClass && (loadingPlans || compatiblePlans.length === 0 || !feePlanId))} className="flex-1 rounded-xl px-4 py-2 font-semibold disabled:opacity-60" style={{ backgroundColor: "var(--gold)", color: "var(--navy-dark)" }}>{saving ? "Saving…" : initialClass ? "Save changes" : "Schedule Class"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
