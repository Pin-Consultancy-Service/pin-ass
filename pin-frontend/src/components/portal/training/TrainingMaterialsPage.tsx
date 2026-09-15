"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Download, FileText } from "lucide-react";
import { apiFetch, getStoredUser } from "@/lib/auth";

interface Material {
  id: string;
  title: string;
  programme_display: string;
  material_type: string;
  material_type_display: string;
  description: string;
  download_url: string;
  uploaded_at: string;
}

const typeColor: Record<string, string> = {
  SLIDES:   "var(--navy)",
  WORKBOOK: "var(--navy)",
  CASE:     "#92600A",
  CERT:     "#D4A820",
  OTHER:    "var(--ink-muted)",
};

export default function TrainingMaterialsPage() {
  const router = useRouter();
  const user   = getStoredUser();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (!user) { router.replace("/portal/login?redirect=/portal/training/materials"); return; }
    apiFetch<Material[]>("/api/training/me/materials/")
      .then((m) => setMaterials(Array.isArray(m) ? m : []))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-3xl">
      <div className="mb-7">
        <h1 className="font-heading font-extrabold text-[var(--navy)] text-2xl">Programme Materials</h1>
        <p className="text-[var(--ink-muted)] text-sm mt-1">Materials available once your enrolment is confirmed.</p>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-[var(--ink-faint)] text-sm">Loading…</div>
      ) : materials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--rule)] p-12 text-center">
          <BookOpen className="w-10 h-10 text-[var(--rule)] mx-auto mb-3" />
          <p className="text-sm font-medium text-[var(--ink-faint)]">No materials available yet.</p>
          <p className="text-xs text-[var(--ink-faint)] mt-1">Materials are released once your enrolment is confirmed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {materials.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-4 p-5 bg-white rounded-2xl
                         border border-[var(--rule)] hover:border-[var(--navy-100)] hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" style={{ color: typeColor[m.material_type] ?? "var(--ink-muted)" }} strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--ink)] truncate">{m.title}</p>
                  <p className="text-xs text-[var(--ink-faint)] mt-0.5">{m.material_type_display} · {m.programme_display}</p>
                </div>
              </div>
              {m.download_url ? (
                <a
                  href={m.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-2 text-xs font-bold
                             text-[var(--navy)] bg-[var(--surface)] px-4 py-2.5 rounded-xl
                             hover:bg-[var(--navy)] hover:text-white transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              ) : (
                <span className="flex-shrink-0 text-xs text-[var(--ink-faint)]">Unavailable</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
