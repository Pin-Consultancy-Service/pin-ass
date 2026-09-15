"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Download, FileText, Search } from "lucide-react";
import { apiFetch, getStoredUser } from "@/lib/auth";

interface Material {
  id: string;
  title: string;
  programme_display: string;
  diet: string;
  material_type: string;
  material_type_display: string;
  description: string;
  download_url: string;
  uploaded_at: string;
}

const typeIcon: Record<string, string> = {
  TEXTBOOK:    "var(--navy)",
  PAST_QS:     "var(--navy-dark)",
  REVISION:    "var(--navy)",
  EXAM_REPORT: "#92600A",
  OTHER:       "var(--ink-muted)",
};

export default function StudentMaterialsPage() {
  const router  = useRouter();
  const user    = getStoredUser();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");

  useEffect(() => {
    if (!user) { router.replace("/portal/login?redirect=/portal/student/materials"); return; }
    apiFetch<Material[]>("/api/students/me/materials/")
      .then((m) => setMaterials(Array.isArray(m) ? m : []))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.material_type_display.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, Material[]>>((acc, m) => {
    const key = m.material_type_display;
    acc[key] = acc[key] ? [...acc[key], m] : [m];
    return acc;
  }, {});

  return (
    <div className="max-w-3xl">
      <div className="mb-7">
        <h1 className="font-heading font-extrabold text-[var(--navy)] text-2xl">Study Materials</h1>
        <p className="text-[var(--ink-muted)] text-sm mt-1">
          Downloadable materials for your enrolled programme. Updated each diet.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-faint)]" />
        <input
          type="search"
          placeholder="Search materials…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input pl-11"
        />
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-[var(--ink-faint)] text-sm">Loading materials…</div>
      ) : materials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--rule)] p-12 text-center">
          <BookOpen className="w-10 h-10 text-[var(--rule)] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--ink-faint)]">No study materials available yet.</p>
          <p className="text-xs text-[var(--ink-faint)] mt-1">
            Materials are uploaded by staff. Check back after enrolment is confirmed.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <h2 className="font-heading font-bold text-[var(--navy)] text-sm uppercase tracking-wider mb-3">{type}</h2>
              <div className="space-y-3">
                {items.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl
                               border border-[var(--rule)] hover:border-[var(--navy-100)] hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[var(--surface)]"
                      >
                        <FileText
                          className="w-5 h-5"
                          style={{ color: typeIcon[m.material_type] ?? "var(--ink-muted)" }}
                          strokeWidth={1.75}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--ink)] truncate">{m.title}</p>
                        <p className="text-xs text-[var(--ink-faint)] mt-0.5">
                          {m.diet && <span>{m.diet} · </span>}
                          {m.programme_display}
                        </p>
                        {m.description && (
                          <p className="text-xs text-[var(--ink-muted)] mt-0.5 truncate">{m.description}</p>
                        )}
                      </div>
                    </div>
                    {m.download_url ? (
                      <a
                        href={m.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 flex items-center gap-2 text-xs font-bold
                                   text-[var(--navy)] bg-[var(--navy-50)] px-4 py-2.5 rounded-xl
                                   hover:bg-[var(--navy)] hover:text-white transition-all duration-200"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    ) : (
                      <span className="flex-shrink-0 text-xs text-[var(--ink-faint)] px-4 py-2.5">Unavailable</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
