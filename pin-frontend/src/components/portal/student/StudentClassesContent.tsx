"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Calendar, CheckCircle, Clock, ExternalLink, Play, Video } from "lucide-react";
import { apiFetch, getStoredUser } from "@/lib/auth";

type ClassStatus = "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
type Filter = "all" | "upcoming" | "live" | "completed";

interface ClassSession {
  id: string;
  fee_plan_id: string;
  exam_body: "ICAN" | "ACCA" | "CITN" | "CISA" | "ATS" | null;
  course_name: string;
  cohort: string;
  subject: string;
  topic: string;
  instructor_name: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_url: string | null;
  recording_url: string | null;
  materials: { name: string; url: string }[];
  description: string | null;
  status: ClassStatus;
}

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All Classes" },
  { id: "upcoming", label: "Upcoming" },
  { id: "live", label: "Live" },
  { id: "completed", label: "Completed" },
];

export default function StudentClassesContent() {
  const router = useRouter();
  const user = getStoredUser();
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClasses = useCallback(async () => {
    try {
      const result = await apiFetch<ClassSession[]>("/api/v1/students/me/classes");
      setClasses(Array.isArray(result) ? result : []);
      setError("");
    } catch {
      setError("Classes could not be loaded. Please refresh or sign in again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      router.replace("/portal/login?redirect=/portal/student/classes");
      return;
    }
    void loadClasses();
    const refreshInterval = window.setInterval(() => void loadClasses(), 60_000);
    return () => window.clearInterval(refreshInterval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredClasses = useMemo(() => {
    const result = classes.filter((session) => {
      if (selectedFilter === "upcoming") return session.status === "SCHEDULED";
      if (selectedFilter === "live") return session.status === "LIVE";
      if (selectedFilter === "completed") return session.status === "COMPLETED";
      return true;
    });
    return result.sort((a, b) => {
      const timeA = new Date(a.scheduled_at).getTime();
      const timeB = new Date(b.scheduled_at).getTime();
      if (a.status === "SCHEDULED" && b.status !== "SCHEDULED") return -1;
      if (b.status === "SCHEDULED" && a.status !== "SCHEDULED") return 1;
      return a.status === "SCHEDULED" ? timeA - timeB : timeB - timeA;
    });
  }, [classes, selectedFilter]);

  const counts = {
    upcoming: classes.filter(session => session.status === "SCHEDULED").length,
    live: classes.filter(session => session.status === "LIVE").length,
    completed: classes.filter(session => session.status === "COMPLETED").length,
    recordings: classes.filter(session => session.recording_url).length,
  };

  const formatDate = (value: string) => new Date(value).toLocaleString("en-NG", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos",
  });

  const getMeetingUrl = (value: string | null) => {
    if (!value) return null;
    try {
      const url = new URL(value);
      const isGoogleMeet = url.hostname === "meet.google.com";
      const isZoom = url.hostname === "zoom.us" || url.hostname.endsWith(".zoom.us");
      return url.protocol === "https:" && (isGoogleMeet || isZoom) ? url.toString() : null;
    } catch {
      return null;
    }
  };

  const getRecordingPlayer = (value: string | null) => {
    if (!value) return null;
    try {
      const url = new URL(value);
      if (url.protocol !== "https:") return null;

      if (url.hostname === "drive.google.com") {
        const fileId = url.pathname.match(/^\/file\/d\/([A-Za-z0-9_-]+)/)?.[1];
        return fileId ? { type: "iframe" as const, src: `https://drive.google.com/file/d/${fileId}/preview` } : null;
      }

      if (url.hostname === "youtu.be" || url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
        const videoId = url.hostname === "youtu.be"
          ? url.pathname.split("/").filter(Boolean)[0]
          : url.pathname === "/watch" ? url.searchParams.get("v") : url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
        return videoId && /^[A-Za-z0-9_-]{6,20}$/.test(videoId)
          ? { type: "iframe" as const, src: `https://www.youtube-nocookie.com/embed/${videoId}` }
          : null;
      }

      return /\.(mp4|webm|ogg)$/i.test(url.pathname) ? { type: "video" as const, src: url.toString() } : null;
    } catch {
      return null;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>
          Live Classes &amp; Recordings
        </h1>
        <p style={{ color: "var(--ink-muted)" }}>Classes and recordings for your paid course cohorts.</p>
      </div>

      {error && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Upcoming", count: counts.upcoming, icon: Calendar, color: "var(--navy)" },
          { label: "Live Now", count: counts.live, icon: Play, color: "#DC2626" },
          { label: "Completed", count: counts.completed, icon: CheckCircle, color: "var(--gold-dark)" },
          { label: "Recordings", count: counts.recordings, icon: Video, color: "var(--navy)" },
        ].map(({ label, count, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-2xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color }}><Icon className="w-5 h-5 text-white" /></span>
              <div><p className="text-2xl font-bold" style={{ color: "var(--ink)" }}>{loading ? "…" : count}</p><p className="text-xs font-semibold" style={{ color: "var(--ink-muted)" }}>{label}</p></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map(filter => (
          <button key={filter.id} type="button" onClick={() => setSelectedFilter(filter.id)} className="px-4 py-2 rounded-xl text-sm font-medium capitalize" style={{
            backgroundColor: selectedFilter === filter.id ? "var(--navy)" : "var(--surface)",
            color: selectedFilter === filter.id ? "white" : "var(--ink-muted)",
            border: "1px solid var(--rule)",
          }}>{filter.label}</button>
        ))}
      </div>

      {loading ? <p className="py-12 text-center text-sm" style={{ color: "var(--ink-muted)" }}>Loading your classes…</p> : filteredClasses.length ? (
        <div className="space-y-4">
          {filteredClasses.map(session => (
            <article key={session.id} className="p-5 md:p-6 rounded-2xl border" style={{ backgroundColor: session.status === "LIVE" ? "#FEF3C7" : "var(--surface)", borderColor: session.status === "LIVE" ? "var(--gold)" : "var(--rule)" }}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--gold-dark)" }}>{session.exam_body ?? "Unclassified"} · {session.course_name} · {session.cohort}</p>
                  <h2 className="font-bold text-xl mb-1" style={{ color: "var(--ink)" }}>{session.topic}</h2>
                  <p className="text-sm" style={{ color: "var(--ink-muted)" }}>{session.subject} · {session.instructor_name}</p>
                  {session.description && <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>{session.description}</p>}
                  {session.materials?.length > 0 && <div className="mt-4"><p className="text-xs font-semibold mb-2" style={{ color: "var(--ink)" }}>Class materials</p><ul className="flex flex-wrap gap-2">{session.materials.map(material => <li key={`${material.name}-${material.url}`}><a href={material.url} target="_blank" rel="noopener noreferrer" className="rounded-lg border px-3 py-2 text-sm underline" style={{ borderColor: "var(--rule)", color: "var(--navy)" }}>{material.name}</a></li>)}</ul></div>}
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm" style={{ color: "var(--ink-muted)" }}>
                    <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" />{formatDate(session.scheduled_at)}</span>
                    <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4" />{session.duration_minutes} minutes</span>
                  </div>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-bold" style={{
                  backgroundColor: session.status === "LIVE" ? "#FEE2E2" : session.status === "COMPLETED" ? "#DCFCE7" : "var(--navy-50)",
                  color: session.status === "LIVE" ? "#B91C1C" : session.status === "COMPLETED" ? "#166534" : "var(--navy)",
                }}>{session.status.toLowerCase()}</span>
              </div>
              {(session.meeting_url || session.recording_url) && (
                <div className="mt-5 pt-4 border-t flex flex-wrap gap-3" style={{ borderColor: "var(--rule)" }}>
                  {session.meeting_url && (getMeetingUrl(session.meeting_url) ? (
                    <a href={getMeetingUrl(session.meeting_url)!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white" style={{ backgroundColor: "#15803D" }}><Video className="w-4 h-4" />Join live class<ExternalLink className="w-4 h-4" /></a>
                  ) : (
                    <span className="text-sm" style={{ color: "var(--ink-muted)" }}>Meeting link unavailable. Ask your administrator to check the Google Meet URL.</span>
                  ))}
                  {session.recording_url && <>
                    {getRecordingPlayer(session.recording_url) ? (
                      <button type="button" onClick={() => setPlayingRecordingId(playingRecordingId === session.id ? null : session.id)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white" style={{ backgroundColor: "var(--navy)" }}><Play className="w-4 h-4" />{playingRecordingId === session.id ? "Close recording" : "Watch recording"}</button>
                    ) : null}
                    <a href={session.recording_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold" style={{ borderColor: "var(--rule)", color: "var(--navy)" }}>{getRecordingPlayer(session.recording_url) ? "Open recording separately" : "Watch recording"}<ExternalLink className="w-4 h-4" /></a>
                  </>}
                </div>
              )}
              {playingRecordingId === session.id && session.recording_url && getRecordingPlayer(session.recording_url) && (
                <div className="mt-4 overflow-hidden rounded-xl border" style={{ borderColor: "var(--rule)" }}>
                  <div className="flex items-center justify-between gap-3 p-3" style={{ backgroundColor: "var(--bg)" }}>
                    <p className="font-semibold" style={{ color: "var(--ink)" }}>Class recording · {session.topic}</p>
                    <button type="button" onClick={() => setPlayingRecordingId(null)} className="rounded-lg border px-3 py-1 text-sm" style={{ borderColor: "var(--rule)", color: "var(--ink)" }}>Close</button>
                  </div>
                  {getRecordingPlayer(session.recording_url)?.type === "iframe" ? (
                    <iframe src={getRecordingPlayer(session.recording_url)!.src} title={`Recording: ${session.topic}`} className="aspect-video w-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="no-referrer" />
                  ) : (
                    <video src={getRecordingPlayer(session.recording_url)!.src} controls playsInline preload="metadata" className="aspect-video w-full bg-black" />
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}>
          <AlertCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--ink-faint)" }} />
          <p className="text-lg font-medium mb-2" style={{ color: "var(--ink-muted)" }}>{classes.length ? "No classes match this filter" : "No classes available"}</p>
          <p className="text-sm" style={{ color: "var(--ink-faint)" }}>{classes.length ? "Choose another filter to see your sessions." : "Scheduled classes for your paid programmes will appear here."}</p>
        </div>
      )}

    </div>
  );
}
