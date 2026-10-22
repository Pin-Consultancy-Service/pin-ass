"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, BookOpen, CheckCircle, Play, BarChart3, Trophy, Calendar, Award, Target } from "lucide-react";
import { mockPastQuestions, getStatistics, type PastQuestionSet } from "@/lib/mockPastQuestionsData";
import { DEMO_MODE } from "@/lib/auth";

const getStatusBadge = (status: string, attempts: number) => {
  switch (status) {
    case 'completed':
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" 
             style={{ backgroundColor: 'var(--navy-50)', color: 'var(--ink)' }}>
          <CheckCircle className="w-3 h-3" />
          Completed ({attempts} attempt{attempts > 1 ? 's' : ''})
        </div>
      );
    case 'in_progress':
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
             style={{ backgroundColor: 'var(--gold-50)', color: 'var(--gold-dark)' }}>
          <Clock className="w-3 h-3" />
          In Progress
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
             style={{ backgroundColor: 'var(--surface)', color: 'var(--ink-muted)' }}>
          <Play className="w-3 h-3" />
          Not Started
        </div>
      );
  }
};

const getDifficultyColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'professional':
      return 'var(--ink)';
    case 'skills':
      return 'var(--gold-dark)';
    case 'foundation':
      return 'var(--ink-muted)';
    default:
      return 'var(--ink-faint)';
  }
};

export default function StudentPracticeContent() {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  // Get statistics from mock data
  const stats = getStatistics();
  
  const subjects = ["all", ...Array.from(new Set(mockPastQuestions.map(set => set.subject)))];
  const levels = ["all", ...Array.from(new Set(mockPastQuestions.map(set => set.level)))];
  
  const filteredSets = mockPastQuestions.filter(set => {
    const matchesSubject = selectedSubject === "all" || set.subject === selectedSubject;
    const matchesLevel = selectedLevel === "all" || set.level === selectedLevel;
    return matchesSubject && matchesLevel;
  });

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
        >
          Past Questions & Practice
        </h1>
        <p style={{ color: 'var(--ink-muted)' }}>
          Practice with past exam questions and track your performance across all subjects
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {stats.totalQuestions}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Total Questions
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--gold)' }}
            >
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {stats.completedSets}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Sets Completed
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#16A34A' }}
            >
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {stats.averageScore}%
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Average Score
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-2xl border transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#9333EA' }}
            >
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {stats.availableSets}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Available Sets
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 space-y-4">
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-muted)' }}>
            Filter by Subject:
          </p>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-md"
                style={{
                  backgroundColor: selectedSubject === subject ? 'var(--navy)' : 'var(--surface)',
                  color: selectedSubject === subject ? 'white' : 'var(--ink-muted)',
                  border: '1px solid var(--rule)'
                }}
              >
                {subject === "all" ? "All Subjects" : subject}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-muted)' }}>
            Filter by Level:
          </p>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-md capitalize"
                style={{
                  backgroundColor: selectedLevel === level ? 'var(--gold)' : 'var(--surface)',
                  color: selectedLevel === level ? 'white' : 'var(--ink-muted)',
                  border: '1px solid var(--rule)'
                }}
              >
                {level === "all" ? "All Levels" : level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Practice Sets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSets.map((practiceSet) => (
          <div
            key={practiceSet.id}
            className="p-6 rounded-2xl border transition-all hover:shadow-lg cursor-pointer"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className="text-xs font-bold px-2 py-1 rounded"
                    style={{ backgroundColor: 'var(--navy-50)', color: 'var(--ink)' }}
                  >
                    {practiceSet.year}
                  </span>
                  <span 
                    className="text-xs font-bold px-2 py-1 rounded capitalize"
                    style={{ 
                      backgroundColor: getDifficultyColor(practiceSet.level) + '20', 
                      color: getDifficultyColor(practiceSet.level) 
                    }}
                  >
                    {practiceSet.level}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--ink)' }}>
                  {practiceSet.title}
                </h3>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--ink)' }}>
                  {practiceSet.subject}
                </p>
              </div>
              {getStatusBadge(practiceSet.status, practiceSet.attempts)}
            </div>

            {/* Topics */}
            {practiceSet.topics && practiceSet.topics.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-muted)' }}>
                  Topics Covered:
                </p>
                <div className="flex flex-wrap gap-2">
                  {practiceSet.topics.map((topic, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 rounded"
                      style={{ backgroundColor: 'var(--surface)', color: 'var(--ink-muted)', border: '1px solid var(--rule)' }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="flex items-center gap-6 mb-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{practiceSet.questionsCount} Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{practiceSet.duration} mins</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>{practiceSet.totalMarks} marks</span>
              </div>
            </div>

            {/* Performance */}
            {practiceSet.bestScore !== undefined && practiceSet.bestScore !== null && (
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-muted)' }}>
                  Best Performance
                </p>
                <div className="flex items-center gap-4">
                  <div 
                    className="text-2xl font-bold"
                    style={{ 
                      color: practiceSet.bestScore >= 80 ? '#16A34A' : 
                             practiceSet.bestScore >= 60 ? 'var(--gold)' : 
                             'var(--ink-muted)',
                      fontFamily: 'var(--font-display)' 
                    }}
                  >
                    {practiceSet.bestScore}%
                  </div>
                  {practiceSet.lastAttemptedAt && (
                    <div className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                      Last attempt: {new Date(practiceSet.lastAttemptedAt).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Link
              href={`/portal/student/practice/${practiceSet.id}`}
              className="w-full py-3 px-4 rounded-xl font-semibold transition-all hover:shadow-md hover:scale-[1.02] flex items-center justify-center gap-2 block text-center"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
            >
              {practiceSet.status === 'not_started' ? (
                <>
                  <Play className="w-4 h-4" />
                  Start Practice
                </>
              ) : practiceSet.status === 'in_progress' ? (
                <>
                  <Play className="w-4 h-4" />
                  Continue Practice
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Retake Practice
                </>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}