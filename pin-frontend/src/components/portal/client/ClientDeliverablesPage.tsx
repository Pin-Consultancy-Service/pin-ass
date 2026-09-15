"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Download, CheckCircle2, Clock, Search } from "lucide-react";
import { apiFetch, getStoredUser } from "@/lib/auth";

interface Deliverable {
  id: string;
  title: string;
  deliverable_type: string;
  type_display: string;
  description: string;
  is_final: boolean;
  download_url: string;
  uploaded_by_name: string;
  uploaded_at: string;
}

const typeColor: Record<string, string> = {
  FINANCIAL:  "var(--navy)",
  TAX:        "var(--navy-dark)",
  AUDIT:      "#92600A",
  ADVISORY:   "var(--navy)",
  VALUATION:  "var(--ink-muted)",
  COMPLIANCE: "#DC2626",
  INVOICE:    "var(--navy-dark)",
  OTHER:      "var(--ink-faint)",
};

export default function ClientDeliverablesPage() {
  const router = useRouter();
  const user   = getStoredUser();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");

  useEffect(() => {
    if (!user) { router.replace("/portal/login?redirect=/portal/client/deliverables"); return; }
    apiFetch<Deliverable[]>("/api/clients/me/deliverables/")
      .then((d) => setDeliverables(Array.isArray(d) ? d : []))
      .catch(() => setDeliverables([]))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = deliverables.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.type_display.toLowerCase().includes(search.toLowerCase())
  );

  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="max-w-3xl">
      <div className="mb-7">
        <h1 className="font-heading font-extrabold text-[var(--navy-dark)] text-2xl">Deliverables</h1>
        <p className="text-[var(--ink-muted)] text-sm mt-1">
          Documents and reports uploaded by PIN Associate for your engagements.
          These files are private to your account.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-faint)]" />
        <input
          type="search"
          placeholder="Search deliverables…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input pl-11"
        />
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-[var(--ink-faint)] text-sm">Loading…</div>
      ) : deliverables.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--rule)] p-12 text-center">
          <FileText className="w-10 h-10 text-[var(--rule)] mx-auto mb-3" />
          <p className="text-sm font-medium text-[var(--ink-faint)]">No documents uploaded yet.</p>
          <p className="text-xs text-[var(--ink-faint)] mt-1">
            Documents will appear here once uploaded by PIN Associate staff.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between gap-4 p-5 bg-white rounded-2xl
                         border border-[var(--rule)] hover:border-[var(--navy-100)] hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[var(--surface)] border border-[var(--rule)]
                               flex items-center justify-center flex-shrink-0">
                  <FileText
                    className="w-5 h-5"
                    style={{ color: typeColor[d.deliverable_type] ?? "var(--ink-muted)" }}
                    strokeWidth={1.75}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-[var(--ink)] truncate">{d.title}</p>
                    {d.is_final ? (
                      <span className="flex-shrink-0 flex items-center gap-1 text-[10px] font-bold
                                       text-[var(--navy-dark)] bg-[var(--navy-50)] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Final
                      </span>
                    ) : (
                      <span className="flex-shrink-0 flex items-center gap-1 text-[10px] font-bold
                                       text-[#92600A] bg-[#FEF3C7] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        <Clock className="w-2.5 h-2.5" /> Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--ink-faint)]">
                    {d.type_display} · Uploaded {fmtDate(d.uploaded_at)}
                    {d.uploaded_by_name && ` by ${d.uploaded_by_name}`}
                  </p>
                  {d.description && (
                    <p className="text-xs text-[var(--ink-muted)] mt-0.5 truncate">{d.description}</p>
                  )}
                </div>
              </div>
              {d.download_url ? (
                <a
                  href={d.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-2 text-xs font-bold
                             text-[var(--navy-dark)] bg-[var(--surface)] px-4 py-2.5 rounded-xl
                             hover:bg-[var(--navy-dark)] hover:text-white transition-all duration-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
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
