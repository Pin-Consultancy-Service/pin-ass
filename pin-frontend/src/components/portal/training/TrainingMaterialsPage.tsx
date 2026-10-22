"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Download, FileText, Folder, Search, Filter } from "lucide-react";
import { apiFetch, getStoredUser, DEMO_MODE } from "@/lib/auth";
import { mockEnrollments } from "@/lib/mockTrainingData";

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
  WORKBOOK: "#2563EB",
  CASE:     "#92600A",
  CERT:     "#D4A820",
  OTHER:    "var(--ink-muted)",
};

const typeIcon: Record<string, string> = {
  SLIDES:   "📊",
  WORKBOOK: "📘",
  CASE:     "📋",
  CERT:     "🏆",
  OTHER:    "📄",
};

// Mock materials for demo
const mockMaterials = [
  {
    id: "mat-1",
    title: "Introduction to Business Strategy - Slides",
    programme_display: "Business Strategy for Executives",
    material_type: "SLIDES",
    material_type_display: "Presentation Slides",
    description: "Core concepts and frameworks",
    download_url: "#",
    uploaded_at: "2024-10-15T10:00:00Z"
  },
  {
    id: "mat-2",
    title: "Leadership Workshop Workbook",
    programme_display: "Leadership Excellence Programme",
    material_type: "WORKBOOK",
    material_type_display: "Workbook",
    description: "Interactive exercises and assessments",
    download_url: "#",
    uploaded_at: "2024-10-14T10:00:00Z"
  },
  {
    id: "mat-3",
    title: "Case Study: Market Entry Strategy",
    programme_display: "Business Strategy for Executives",
    material_type: "CASE",
    material_type_display: "Case Study",
    description: "Real-world market entry analysis",
    download_url: "#",
    uploaded_at: "2024-10-10T10:00:00Z"
  },
  {
    id: "mat-4",
    title: "Financial Management Fundamentals",
    programme_display: "Corporate Finance Essentials",
    material_type: "SLIDES",
    material_type_display: "Presentation Slides",
    description: "Core financial concepts",
    download_url: "#",
    uploaded_at: "2024-10-08T10:00:00Z"
  },
  {
    id: "mat-5",
    title: "Programme Completion Certificate",
    programme_display: "Leadership Excellence Programme",
    material_type: "CERT",
    material_type_display: "Certificate",
    description: "Your completion certificate",
    download_url: "#",
    uploaded_at: "2024-09-30T10:00:00Z"
  }
];

export default function TrainingMaterialsPage() {
  const router = useRouter();
  const user   = getStoredUser();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) {
      setMaterials(mockMaterials);
      setLoading(false);
      return;
    }

    if (!user) { 
      router.replace("/portal/login?redirect=/portal/training/materials"); 
      return; 
    }
    
    apiFetch<Material[]>("/api/training/me/materials/")
      .then((m) => setMaterials(Array.isArray(m) ? m : []))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—";

  // Filter materials
  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.programme_display.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "ALL" || m.material_type === filterType;
    return matchesSearch && matchesType;
  });

  // Group materials by programme
  const materialsByProgramme = filteredMaterials.reduce((acc, material) => {
    const prog = material.programme_display;
    if (!acc[prog]) acc[prog] = [];
    acc[prog].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  const materialTypes = ["ALL", ...Array.from(new Set(materials.map(m => m.material_type)))];

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
        >
          Programme Materials
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Access course materials, presentations, and resources for your training programmes
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" 
            style={{ color: 'var(--ink-faint)' }} 
          />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border"
            style={{ 
              backgroundColor: 'var(--surface)', 
              borderColor: 'var(--rule)',
              color: 'var(--ink)'
            }}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 rounded-xl border font-semibold"
          style={{ 
            backgroundColor: 'var(--surface)', 
            borderColor: 'var(--rule)',
            color: 'var(--ink)'
          }}
        >
          {materialTypes.map(type => (
            <option key={type} value={type}>
              {type === "ALL" ? "All Types" : type}
            </option>
          ))}
        </select>
      </div>

      {/* Materials Count */}
      <div className="mb-6">
        <p className="text-sm font-semibold" style={{ color: 'var(--ink-muted)' }}>
          {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materials'} found
        </p>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div 
            className="w-8 h-8 border-3 border-t-3 rounded-full animate-spin"
            style={{ borderColor: 'var(--rule)', borderTopColor: 'var(--navy)' }}
          />
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div 
          className="p-12 text-center rounded-2xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--rule)' }} />
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>
            {searchQuery || filterType !== "ALL" ? 'No materials match your search' : 'No materials available yet'}
          </p>
          <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
            {searchQuery || filterType !== "ALL" 
              ? 'Try adjusting your search or filter' 
              : 'Materials are released once your enrolment is confirmed'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(materialsByProgramme).map(([programme, progMaterials]) => (
            <div 
              key={programme}
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              <div 
                className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--bg)' }}
              >
                <Folder className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--navy)' }} />
                <div className="flex-1">
                  <h2 className="font-bold" style={{ color: 'var(--ink)' }}>
                    {programme}
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                    {progMaterials.length} {progMaterials.length === 1 ? 'material' : 'materials'}
                  </p>
                </div>
              </div>

              <div className="divide-y" style={{ borderColor: 'var(--rule)' }}>
                {progMaterials.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-opacity-50"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                        style={{ backgroundColor: 'var(--bg)' }}
                      >
                        {typeIcon[m.material_type] || "📄"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--ink)' }}>
                          {m.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ 
                              backgroundColor: `${typeColor[m.material_type] || 'var(--ink-muted)'}15`,
                              color: typeColor[m.material_type] || 'var(--ink-muted)'
                            }}
                          >
                            {m.material_type_display}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--ink-faint)' }} suppressHydrationWarning>
                            {mounted && fmtDate(m.uploaded_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {m.download_url ? (
                      <a
                        href={m.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-md"
                        style={{ backgroundColor: 'var(--navy)', color: 'white' }}
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                    ) : (
                      <span className="flex-shrink-0 text-xs font-semibold" style={{ color: 'var(--ink-faint)' }}>
                        Unavailable
                      </span>
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
