"use client";

import { useState, useEffect } from "react";
import { 
  FileText, Video, Presentation, Download, Edit, Trash2, 
  Plus, Filter, Upload
} from "lucide-react";
import { mockTrainingMaterials, type TrainingMaterial } from "@/lib/mockTrainingData";

export default function InstructorMaterialsContent() {
  const [mounted, setMounted] = useState(false);
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'video' | 'slides' | 'document'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get unique courses
  const courses = ['all', ...Array.from(new Set(mockTrainingMaterials.map(m => m.course)))];

  // Filter materials
  const filteredMaterials = mockTrainingMaterials.filter(material => {
    const courseMatch = filterCourse === 'all' || material.course === filterCourse;
    const typeMatch = filterType === 'all' || material.type === filterType;
    return courseMatch && typeMatch;
  });

  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString("en-NG", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    }) : "—";

  const getFileIcon = (type: TrainingMaterial['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" style={{ color: 'var(--navy)' }} />;
      case 'slides':
        return <Presentation className="w-5 h-5" style={{ color: 'var(--navy)' }} />;
      case 'pdf':
      case 'document':
      default:
        return <FileText className="w-5 h-5" style={{ color: 'var(--navy)' }} />;
    }
  };

  // Calculate stats
  const totalMaterials = mockTrainingMaterials.length;
  const pdfCount = mockTrainingMaterials.filter(m => m.type === 'pdf').length;
  const videoCount = mockTrainingMaterials.filter(m => m.type === 'video').length;
  const slidesCount = mockTrainingMaterials.filter(m => m.type === 'slides').length;

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
          >
            Materials
          </h1>
          <p style={{ color: 'var(--ink-muted)' }}>
            Manage training materials and course resources
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--navy)', color: 'white' }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Upload Material</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Materials', value: totalMaterials, color: 'var(--navy)' },
          { label: 'PDFs', value: pdfCount, color: '#2563EB' },
          { label: 'Videos', value: videoCount, color: 'var(--gold-dark)' },
          { label: 'Slides', value: slidesCount, color: '#16A34A' },
        ].map((stat, index) => (
          <div 
            key={index}
            className="p-4 rounded-xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <p 
              className="text-3xl font-bold mb-1"
              style={{ color: stat.color, fontFamily: 'var(--font-display)' }}
            >
              {stat.value}
            </p>
            <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Course Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>Course:</span>
          <div className="flex gap-2 flex-wrap">
            {courses.map((course) => (
              <button
                key={course}
                onClick={() => setFilterCourse(course)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize"
                style={{
                  backgroundColor: filterCourse === course ? 'var(--navy)' : 'var(--surface)',
                  color: filterCourse === course ? 'white' : 'var(--ink-muted)',
                  border: '1px solid var(--rule)'
                }}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>Type:</span>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pdf', 'video', 'slides', 'document'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize"
                style={{
                  backgroundColor: filterType === type ? 'var(--navy)' : 'var(--surface)',
                  color: filterType === type ? 'white' : 'var(--ink-muted)',
                  border: '1px solid var(--rule)'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="space-y-4">
        {filteredMaterials.length === 0 ? (
          <div 
            className="p-12 text-center rounded-2xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <Upload className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--rule)' }} />
            <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
              No materials found
            </p>
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
              {filterCourse === 'all' && filterType === 'all'
                ? 'Upload your first material to get started' 
                : 'No materials match the selected filters'}
            </p>
          </div>
        ) : (
          filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="p-6 rounded-2xl border transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* File Icon */}
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: 'var(--navy-50)' }}
                  >
                    {getFileIcon(material.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ink)' }}>
                      {material.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--ink-muted)' }}>
                      {material.course} • {material.programme}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
                      <span>
                        <strong style={{ color: 'var(--ink)' }}>Uploaded by:</strong> {material.uploadedBy}
                      </span>
                      <span>
                        <strong style={{ color: 'var(--ink)' }}>Date:</strong> {mounted && fmtDate(material.uploadDate)}
                      </span>
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: 'var(--gold-50)', color: 'var(--gold-dark)' }}
                      >
                        {material.fileSize}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(material.downloadUrl, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:shadow-md"
                    style={{ backgroundColor: 'var(--navy)', color: 'white' }}
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button
                    className="p-2 rounded-lg transition-all hover:shadow-md"
                    style={{ backgroundColor: 'var(--bg)' }}
                  >
                    <Edit className="w-4 h-4" style={{ color: 'var(--ink-muted)' }} />
                  </button>
                  <button
                    className="p-2 rounded-lg transition-all hover:shadow-md"
                    style={{ backgroundColor: '#FEE2E2' }}
                  >
                    <Trash2 className="w-4 h-4" style={{ color: '#DC2626' }} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div 
            className="w-full max-w-2xl rounded-2xl p-6"
            style={{ backgroundColor: 'var(--bg)' }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ink)' }}>
              Upload Material
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--ink-muted)' }}>
              Feature coming soon! This will allow you to upload training materials.
            </p>
            <button
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2 rounded-xl font-semibold"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
