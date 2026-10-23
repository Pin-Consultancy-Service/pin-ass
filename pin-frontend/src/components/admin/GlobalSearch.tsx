"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Users, GraduationCap, Calendar } from "lucide-react";
import { mockSystemUsers, mockAdminClasses, mockCourses } from "@/lib/mockAdminData";
import Link from "next/link";

interface GlobalSearchProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function GlobalSearch({ isOpen = true, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowResults(false);
        setQuery("");
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const searchQuery = query.toLowerCase().trim();

  // Search students
  const studentResults = mockSystemUsers
    .filter(u => u.role === "student" && searchQuery && (
      u.first_name.toLowerCase().includes(searchQuery) ||
      u.last_name.toLowerCase().includes(searchQuery) ||
      u.email.toLowerCase().includes(searchQuery)
    ))
    .slice(0, 4);

  // Search instructors
  const instructorResults = mockSystemUsers
    .filter(u => u.role === "instructor" && searchQuery && (
      u.first_name.toLowerCase().includes(searchQuery) ||
      u.last_name.toLowerCase().includes(searchQuery) ||
      u.email.toLowerCase().includes(searchQuery)
    ))
    .slice(0, 4);

  // Search classes
  const classResults = mockAdminClasses
    .filter(cls => searchQuery && (
      cls.courseName.toLowerCase().includes(searchQuery) ||
      cls.instructorName.toLowerCase().includes(searchQuery)
    ))
    .slice(0, 4);

  const hasResults = studentResults.length > 0 || instructorResults.length > 0 || classResults.length > 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-[480px]">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: "var(--ink-faint)" }}
        />
        <input
          type="text"
          placeholder="Search students, instructors, classes..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border transition-all"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--rule)",
            color: "var(--ink)",
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:opacity-70"
          >
            <X className="w-4 h-4" style={{ color: "var(--ink-muted)" }} />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && query && (
        <div
          className="absolute top-full mt-2 w-full rounded-xl border shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto"
          style={{
            backgroundColor: "var(--bg)",
            borderColor: "var(--rule)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          {!hasResults && (
            <div className="p-4 text-center">
              <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
                No results found for &quot;{query}&quot;
              </p>
            </div>
          )}

          {/* Students */}
          {studentResults.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-2 py-1 mb-1">
                <Users className="w-4 h-4" style={{ color: "var(--ink-muted)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--ink-muted)" }}>
                  Students ({studentResults.length})
                </span>
              </div>
              {studentResults.map((student) => (
                <Link
                  key={student.id}
                  href="/admin/students"
                  onClick={() => {
                    setShowResults(false);
                    setQuery("");
                    onClose?.();
                  }}
                  className="flex items-center gap-3 p-2 rounded-lg transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--surface)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: "var(--navy)" }}
                  >
                    {student.first_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--ink)" }}>
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--ink-muted)" }}>
                      {student.email}
                    </p>
                  </div>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "var(--navy-50)", color: "var(--navy)" }}
                  >
                    Student
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Instructors */}
          {instructorResults.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-2 py-1 mb-1">
                <GraduationCap className="w-4 h-4" style={{ color: "var(--ink-muted)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--ink-muted)" }}>
                  Instructors ({instructorResults.length})
                </span>
              </div>
              {instructorResults.map((instructor) => (
                <Link
                  key={instructor.id}
                  href="/admin/instructors"
                  onClick={() => {
                    setShowResults(false);
                    setQuery("");
                    onClose?.();
                  }}
                  className="flex items-center gap-3 p-2 rounded-lg transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--surface)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: "var(--gold-dark)" }}
                  >
                    {instructor.first_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--ink)" }}>
                      {instructor.first_name} {instructor.last_name}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--ink-muted)" }}>
                      {instructor.email}
                    </p>
                  </div>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "var(--gold-50)", color: "var(--warning-text)" }}
                  >
                    Instructor
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Classes */}
          {classResults.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-2 py-1 mb-1">
                <Calendar className="w-4 h-4" style={{ color: "var(--ink-muted)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--ink-muted)" }}>
                  Classes ({classResults.length})
                </span>
              </div>
              {classResults.map((cls) => (
                <Link
                  key={cls.id}
                  href="/admin/classes"
                  onClick={() => {
                    setShowResults(false);
                    setQuery("");
                    onClose?.();
                  }}
                  className="flex items-center gap-3 p-2 rounded-lg transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--surface)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--surface)" }}
                  >
                    <Calendar className="w-4 h-4" style={{ color: "var(--navy)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--ink)" }}>
                      {cls.courseName}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--ink-muted)" }}>
                      {cls.instructorName} • {new Date(cls.date).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
