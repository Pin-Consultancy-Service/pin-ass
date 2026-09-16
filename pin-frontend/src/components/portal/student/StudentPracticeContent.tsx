"use client";

import { useState } from "react";
import { Clock, BookOpen, CheckCircle, Play, BarChart3, Trophy, Calendar } from "lucide-react";

// TODO: Replace with real practice sets from PIN Associate
const mockPracticeSets = [
  {
    id: 1,
    subject: "Financial Accounting",
    title: "2023 Past Questions",
    questionsCount: 50,
    duration: 180, // minutes
    difficulty: "Professional",
    attempts: 2,
    bestScore: 85,
    lastAttempted: "2024-01-15",
    status: "completed"
  },
  {
    id: 2,
    subject: "Advanced Audit and Assurance",
    title: "2022 Past Questions",
    questionsCount: 40,
    duration: 150,
    difficulty: "Professional",
    attempts: 1,
    bestScore: 72,
    lastAttempted: "2024-01-10",
    status: "completed"
  },
  {
    id: 3,
    subject: "Taxation",
    title: "2023 Past Questions",
    questionsCount: 45,
    duration: 165,
    difficulty: "Professional",
    attempts: 0,
    bestScore: null,
    lastAttempted: null,
    status: "not_started"
  },
  {
    id: 4,
    subject: "Financial Management",
    title: "Practice Set A",
    questionsCount: 35,
    duration: 120,
    difficulty: "Intermediate",
    attempts: 0,
    bestScore: null,
    lastAttempted: null,
    status: "not_started"
  },
  {
    id: 5,
    subject: "Corporate Reporting",
    title: "2022 Past Questions",
    questionsCount: 60,
    duration: 210,
    difficulty: "Professional",
    attempts: 1,
    bestScore: 78,
    lastAttempted: "2024-01-08",
    status: "in_progress"
  },
  {
    id: 6,
    subject: "Strategic Business Management",
    title: "Case Study Practice",
    questionsCount: 25,
    duration: 180,
    difficulty: "Advanced",
    attempts: 0,
    bestScore: null,
    lastAttempted: null,
    status: "not_started"
  }
];

const getStatusBadge = (status: string, attempts: number) => {
  switch (status) {
    case 'completed':
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" 
             style={{ backgroundColor: 'var(--navy-50)', color: 'var(--navy)' }}>
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

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'advanced':
      return 'var(--navy)';
    case 'professional':
      return 'var(--gold-dark)';
    case 'intermediate':
      return 'var(--ink-muted)';
    default:
      return 'var(--ink-faint)';
  }
};

export default function StudentPracticeContent() {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const subjects = ["all", ...new Set(mockPracticeSets.map(set => set.subject))];
  const filteredSets = selectedSubject === "all" 
    ? mockPracticeSets 
    : mockPracticeSets.filter(set => set.subject === selectedSubject);

  const totalQuestions = mockPracticeSets.reduce((sum, set) => sum + set.questionsCount, 0);
  const completedSets = mockPracticeSets.filter(set => set.status === 'completed').length;
  const averageScore = mockPracticeSets
    .filter(set => set.bestScore !== null)
    .reduce((sum, set) => sum + (set.bestScore || 0), 0) / 
    mockPracticeSets.filter(set => set.bestScore !== null).length || 0;

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
                {totalQuestions}
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
                {completedSets}
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
              style={{ backgroundColor: 'var(--navy)' }}
            >
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {Math.round(averageScore)}%
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
              style={{ backgroundColor: 'var(--gold-dark)' }}
            >
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {mockPracticeSets.length}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                Available Sets
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
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
                <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--ink)' }}>
                  {practiceSet.title}
                </h3>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--navy)' }}>
                  {practiceSet.subject}
                </p>
              </div>
              {getStatusBadge(practiceSet.status, practiceSet.attempts)}
            </div>

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
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getDifficultyColor(practiceSet.difficulty) }}
                />
                <span>{practiceSet.difficulty}</span>
              </div>
            </div>

            {/* Performance */}
            {practiceSet.bestScore !== null && (
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-muted)' }}>
                  Best Performance
                </p>
                <div className="flex items-center gap-4">
                  <div 
                    className="text-2xl font-bold"
                    style={{ 
                      color: practiceSet.bestScore >= 80 ? 'var(--navy)' : 
                             practiceSet.bestScore >= 60 ? 'var(--gold-dark)' : 
                             'var(--ink-muted)',
                      fontFamily: 'var(--font-display)' 
                    }}
                  >
                    {practiceSet.bestScore}%
                  </div>
                  <div className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                    Last attempt: {new Date(practiceSet.lastAttempted || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all hover:shadow-md hover:scale-[1.02]"
              style={{ backgroundColor: 'var(--navy)' }}
            >
              {practiceSet.status === 'not_started' ? 'Start Practice' : 
               practiceSet.status === 'in_progress' ? 'Continue Practice' : 
               'Retake Practice'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}