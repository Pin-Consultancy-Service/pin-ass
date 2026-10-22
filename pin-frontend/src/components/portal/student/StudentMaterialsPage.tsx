"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Download, FileText, Search, FileSpreadsheet, FileVideo, Link as LinkIcon } from "lucide-react";
import { apiFetch, getStoredUser, DEMO_MODE } from "@/lib/auth";
import { mockMaterials, type CourseMaterial, type MaterialFile, getFileIcon } from "@/lib/mockMaterialsData";

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

// File type icons and colors
const fileTypeConfig: Record<MaterialFile['type'], { icon: any; color: string; bgColor: string }> = {
  pdf: { icon: FileText, color: '#DC2626', bgColor: '#FEE2E2' },
  docx: { icon: FileText, color: '#2563EB', bgColor: '#DBEAFE' },
  pptx: { icon: FileText, color: '#EA580C', bgColor: '#FFEDD5' },
  xlsx: { icon: FileSpreadsheet, color: '#16A34A', bgColor: '#DCFCE7' },
  video: { icon: FileVideo, color: '#9333EA', bgColor: '#F3E8FF' },
  link: { icon: LinkIcon, color: '#0891B2', bgColor: '#CFFAFE' },
};

export default function StudentMaterialsPage() {
  const router  = useRouter();
  const user    = getStoredUser();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [courseMaterials, setCourseMaterials] = useState<CourseMaterial[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  useEffect(() => {
    // Use mock data in demo mode
    if (DEMO_MODE) {
      setCourseMaterials(mockMaterials);
      setLoading(false);
      return;
    }

    if (!user) { router.replace("/portal/login?redirect=/portal/student/materials"); return; }
    
    // TODO: Replace with actual API call when backend is ready
    // apiFetch<Material[]>("/api/students/me/materials/")
    //   .then((m) => setMaterials(Array.isArray(m) ? m : []))
    //   .catch(() => setMaterials([]))
    //   .finally(() => setLoading(false));
    
    // For now, use mock data
    setCourseMaterials(mockMaterials);
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Get unique subjects for filter
  const subjects = Array.from(new Set(courseMaterials.map(m => m.subject)));

  // Filter materials by search and subject
  const filtered = courseMaterials.filter((m) => {
    const matchesSearch = 
      m.courseName.toLowerCase().includes(search.toLowerCase()) ||
      m.topic.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.instructor.toLowerCase().includes(search.toLowerCase());
    
    const matchesSubject = selectedSubject === "all" || m.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  // Group by subject
  const grouped = filtered.reduce<Record<string, CourseMaterial[]>>((acc, m) => {
    const key = m.subject;
    acc[key] = acc[key] ? [...acc[key], m] : [m];
    return acc;
  }, {});

  // Calculate stats
  const totalFiles = courseMaterials.reduce((total, m) => total + m.files.length, 0);
  const totalMaterials = courseMaterials.length;

  return (
    <div className="max-w-6xl">
      <div className="mb-7">
        <h1 className="font-heading font-extrabold text-2xl md:text-3xl" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>Study Materials</h1>
        <p className="text-[var(--ink-muted)] text-sm mt-2">
          Access all your course materials, lecture slides, and study resources in one place
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--navy-50)' }}
            >
              <BookOpen className="w-6 h-6" style={{ color: 'var(--navy)' }} />
            </div>
            <div>
              <div 
                className="text-2xl font-bold"
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
              >
                {totalMaterials}
              </div>
              <div className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                MATERIALS
              </div>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#DCFCE7' }}
            >
              <FileText className="w-6 h-6" style={{ color: '#16A34A' }} />
            </div>
            <div>
              <div 
                className="text-2xl font-bold"
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
              >
                {totalFiles}
              </div>
              <div className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                FILES
              </div>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#FEF3C7' }}
            >
              <Download className="w-6 h-6" style={{ color: '#CA8A04' }} />
            </div>
            <div>
              <div 
                className="text-2xl font-bold"
                style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
              >
                {subjects.length}
              </div>
              <div className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                SUBJECTS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-faint)]" />
          <input
            type="search"
            placeholder="Search by course, topic, or instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-11 w-full"
          />
        </div>
        
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="form-input sm:w-64"
          style={{ color: 'var(--ink)' }}
        >
          <option value="all">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-[var(--ink-faint)] text-sm">Loading materials…</div>
      ) : courseMaterials.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--rule)' }} />
          <p className="text-sm font-semibold text-[var(--ink-faint)]">No study materials available yet.</p>
          <p className="text-xs text-[var(--ink-faint)] mt-1">
            Materials are uploaded by instructors. Check back after enrolment is confirmed.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}>
          <Search className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--rule)' }} />
          <p className="text-sm font-semibold text-[var(--ink-faint)]">No materials found</p>
          <p className="text-xs text-[var(--ink-faint)] mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([subject, items]) => (
            <div key={subject}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--ink)' }}>{subject}</h2>
                <span className="text-xs font-semibold text-[var(--ink-muted)] px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--bg)' }}>
                  {items.length} {items.length === 1 ? 'Material' : 'Materials'}
                </span>
              </div>
              
              <div className="space-y-4">
                {items.map((material) => (
                  <div
                    key={material.id}
                    className="rounded-2xl border p-5 transition-all hover:shadow-lg"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
                  >
                    {/* Material Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span 
                            className="text-xs font-bold px-2 py-1 rounded"
                            style={{ 
                              backgroundColor: 'var(--navy-50)', 
                              color: 'var(--ink)' 
                            }}
                          >
                            Week {material.week}
                          </span>
                          <span className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                            {material.courseName}
                          </span>
                        </div>
                        <h3 className="font-bold text-base mb-1" style={{ color: 'var(--ink)' }}>
                          {material.topic}
                        </h3>
                        {material.description && (
                          <p className="text-sm mb-2" style={{ color: 'var(--ink-muted)' }}>
                            {material.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--ink-faint)' }}>
                          <span>👨‍🏫 {material.instructor}</span>
                          <span>📅 {new Date(material.uploadedDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>📎 {material.files.length} {material.files.length === 1 ? 'file' : 'files'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Files Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {material.files.map((file) => {
                        const config = fileTypeConfig[file.type];
                        const IconComponent = config.icon;
                        
                        return (
                          <a
                            key={file.id}
                            href={file.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md hover:scale-[1.02] group"
                            style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--bg)' }}
                          >
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: config.bgColor }}
                            >
                              <IconComponent
                                className="w-5 h-5"
                                style={{ color: config.color }}
                                strokeWidth={1.75}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate transition-colors" style={{ color: 'var(--ink)' }}>
                                {file.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                                  {file.size}
                                </span>
                                <Download className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--ink)' }} />
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
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
