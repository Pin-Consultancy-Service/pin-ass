"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Clock, AlertCircle, CheckCircle, BookOpen, Flag, ChevronLeft, ChevronRight,
  List, X, Save, Send, Award, TrendingUp, BarChart3
} from "lucide-react";
import { mockExamQuestions, calculateMCQScore, getExamStats, type ExamQuestion } from "@/lib/mockExamQuestionsData";
import { mockPastQuestions } from "@/lib/mockPastQuestionsData";

interface PracticeExamInterfaceProps {
  examId: string;
}

type ExamPhase = 'pre-exam' | 'in-exam' | 'review' | 'results';

export default function PracticeExamInterface({ examId }: PracticeExamInterfaceProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<ExamPhase>('pre-exam');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(180 * 60); // 3 hours in seconds
  const [showNavigator, setShowNavigator] = useState(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [examResults, setExamResults] = useState<any>(null);

  // Get exam details
  const examDetails = mockPastQuestions.find(e => e.id === examId);
  const stats = getExamStats();
  const currentQuestion = mockExamQuestions[currentQuestionIndex];

  // Timer logic
  useEffect(() => {
    if (phase !== 'in-exam') return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // Auto-save logic
  useEffect(() => {
    if (phase !== 'in-exam') return;

    const interval = setInterval(() => {
      setAutoSaveStatus('saving');
      // Simulate save
      setTimeout(() => setAutoSaveStatus('saved'), 500);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [phase, answers]);

  // Prevent accidental navigation
  useEffect(() => {
    if (phase !== 'in-exam') return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'You have an exam in progress. Are you sure you want to leave?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [phase]);

  // Keyboard shortcuts
  useEffect(() => {
    if (phase !== 'in-exam') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentQuestionIndex < mockExamQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [phase, currentQuestionIndex]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining > 30 * 60) return 'var(--navy)';
    if (timeRemaining > 10 * 60) return 'var(--gold-dark)';
    return '#DC2626';
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    setAutoSaveStatus('saving');
    setTimeout(() => setAutoSaveStatus('saved'), 300);
  };

  const toggleMarkForReview = (questionId: string) => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const getQuestionStatus = (question: ExamQuestion) => {
    if (answers[question.id]) return 'answered';
    if (markedForReview.has(question.id)) return 'marked';
    return 'unanswered';
  };

  const handleStartExam = () => {
    setPhase('in-exam');
    setTimeRemaining(examDetails?.duration ? examDetails.duration * 60 : 180 * 60);
  };

  const handleReviewClick = () => {
    setPhase('review');
  };

  const handleSubmitExam = () => {
    const results = calculateMCQScore(answers);
    setExamResults(results);
    setPhase('results');
  };

  const handleAutoSubmit = () => {
    alert('Time is up! Your exam will be submitted automatically.');
    handleSubmitExam();
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = mockExamQuestions.length - answeredCount;
  const markedCount = markedForReview.size;

  // Pre-Exam Screen
  if (phase === 'pre-exam') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg)' }}>
        <div 
          className="max-w-2xl w-full p-8 rounded-3xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="text-center mb-8">
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: 'var(--navy-50)' }}
            >
              <BookOpen className="w-10 h-10" style={{ color: 'var(--navy)' }} />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
              {examDetails?.title || 'Practice Exam'}
            </h1>
            <p className="text-lg font-medium" style={{ color: 'var(--navy)' }}>
              {examDetails?.subject}
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="font-bold mb-3" style={{ color: 'var(--ink)' }}>📊 Exam Details:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--ink-muted)' }}>Duration</p>
                  <p className="font-bold" style={{ color: 'var(--ink)' }}>
                    {examDetails?.duration || 180} minutes
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--ink-muted)' }}>Questions</p>
                  <p className="font-bold" style={{ color: 'var(--ink)' }}>
                    {stats.totalQuestions}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--ink-muted)' }}>Total Marks</p>
                  <p className="font-bold" style={{ color: 'var(--ink)' }}>
                    {stats.totalMarks}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--ink-muted)' }}>Pass Mark</p>
                  <p className="font-bold" style={{ color: 'var(--ink)' }}>
                    50
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-3" style={{ color: 'var(--ink)' }}>📚 Exam Structure:</h3>
              <div className="space-y-2">
                <div className="p-3 rounded-xl border" style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--bg)' }}>
                  <p className="font-semibold" style={{ color: 'var(--ink)' }}>
                    Section A: Multiple Choice ({stats.sectionA.count} questions, {stats.sectionA.marks} marks)
                  </p>
                </div>
                <div className="p-3 rounded-xl border" style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--bg)' }}>
                  <p className="font-semibold" style={{ color: 'var(--ink)' }}>
                    Section B: Short Answer ({stats.sectionB.count} questions, {stats.sectionB.marks} marks)
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="p-4 rounded-xl border-l-4"
              style={{ backgroundColor: 'var(--gold-50)', borderColor: 'var(--gold)' }}
            >
              <h3 className="font-bold mb-2" style={{ color: 'var(--ink)' }}>⚠️ Important Instructions:</h3>
              <ul className="space-y-1 text-sm" style={{ color: 'var(--ink)' }}>
                <li>• Answer ALL questions</li>
                <li>• You can navigate between questions freely</li>
                <li>• Your progress is auto-saved every 30 seconds</li>
                <li>• Mark difficult questions for review</li>
                <li>• Exam will auto-submit when time expires</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all border"
              style={{ borderColor: 'var(--rule)', color: 'var(--ink-muted)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleStartExam}
              className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Review Screen (before final submit)
  if (phase === 'review') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg)' }}>
        <div 
          className="max-w-2xl w-full p-8 rounded-3xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            Review Your Answers
          </h1>

          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--navy-50)' }}>
                <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--navy)' }} />
                <p className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>{answeredCount}</p>
                <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>Answered</p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#FEE2E2' }}>
                <AlertCircle className="w-8 h-8 mx-auto mb-2" style={{ color: '#DC2626' }} />
                <p className="text-2xl font-bold" style={{ color: '#DC2626' }}>{unansweredCount}</p>
                <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>Unanswered</p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--gold-50)' }}>
                <Flag className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--gold-dark)' }} />
                <p className="text-2xl font-bold" style={{ color: 'var(--gold-dark)' }}>{markedCount}</p>
                <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>Marked</p>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="p-4 rounded-xl border-l-4" style={{ backgroundColor: '#FEE2E2', borderColor: '#DC2626' }}>
                <h3 className="font-bold mb-2" style={{ color: '#DC2626' }}>⚠️ Unanswered Questions:</h3>
                <div className="flex flex-wrap gap-2">
                  {mockExamQuestions
                    .filter(q => !answers[q.id])
                    .map(q => (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentQuestionIndex(mockExamQuestions.indexOf(q));
                          setPhase('in-exam');
                        }}
                        className="px-3 py-1 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: 'white', color: '#DC2626' }}
                      >
                        Q{q.questionNumber}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {markedCount > 0 && (
              <div className="p-4 rounded-xl border-l-4" style={{ backgroundColor: 'var(--gold-50)', borderColor: 'var(--gold)' }}>
                <h3 className="font-bold mb-2" style={{ color: 'var(--gold-dark)' }}>🔖 Questions Marked for Review:</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(markedForReview).map(questionId => {
                    const q = mockExamQuestions.find(question => question.id === questionId);
                    return q ? (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentQuestionIndex(mockExamQuestions.indexOf(q));
                          setPhase('in-exam');
                        }}
                        className="px-3 py-1 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: 'white', color: 'var(--gold-dark)' }}
                      >
                        Q{q.questionNumber}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setPhase('in-exam')}
              className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all border"
              style={{ borderColor: 'var(--rule)', color: 'var(--ink)' }}
            >
              Back to Exam
            </button>
            <button
              onClick={handleSubmitExam}
              className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
            >
              <Send className="w-4 h-4" />
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (phase === 'results' && examResults) {
    const percentage = Math.round((examResults.score / examResults.total) * 100);
    const passed = percentage >= 50;

    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg)' }}>
        <div 
          className="max-w-3xl w-full p-8 rounded-3xl border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
        >
          <div className="text-center mb-8">
            <div 
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: passed ? 'var(--navy-50)' : '#FEE2E2' }}
            >
              {passed ? (
                <Award className="w-12 h-12" style={{ color: 'var(--navy)' }} />
              ) : (
                <TrendingUp className="w-12 h-12" style={{ color: '#DC2626' }} />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
              {passed ? '🎉 Congratulations!' : 'Keep Practicing!'}
            </h1>
            <p className="text-lg" style={{ color: 'var(--ink-muted)' }}>
              {passed ? 'You passed the exam!' : 'You can retake this exam to improve your score'}
            </p>
          </div>

          <div className="mb-8">
            <div className="text-center mb-6">
              <div 
                className="text-6xl font-bold mb-2"
                style={{ 
                  color: passed ? 'var(--navy)' : '#DC2626',
                  fontFamily: 'var(--font-display)' 
                }}
              >
                {percentage}%
              </div>
              <p className="text-xl font-semibold" style={{ color: 'var(--ink-muted)' }}>
                {examResults.score} out of {examResults.total} marks
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--bg)' }}>
                <BarChart3 className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--navy)' }} />
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--ink-muted)' }}>Pass Mark</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>50%</p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--bg)' }}>
                <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--gold)' }} />
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--ink-muted)' }}>Your Score</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>{percentage}%</p>
              </div>
            </div>

            <div 
              className="p-4 rounded-xl"
              style={{ backgroundColor: passed ? 'var(--navy-50)' : '#FEE2E2' }}
            >
              <p className="text-center font-bold" style={{ color: passed ? 'var(--navy)' : '#DC2626' }}>
                Status: {passed ? 'PASSED ✓' : 'NOT PASSED ✗'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/portal/student/practice')}
              className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all border"
              style={{ borderColor: 'var(--rule)', color: 'var(--ink)' }}
            >
              Back to Practice
            </button>
            <button
              onClick={() => {
                setPhase('pre-exam');
                setAnswers({});
                setMarkedForReview(new Set());
                setCurrentQuestionIndex(0);
              }}
              className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--navy)', color: 'white' }}
            >
              Retake Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Exam Interface (in-exam phase)
  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Top Bar */}
      <div 
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
      >
        <div>
          <h1 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
            {examDetails?.title || 'Practice Exam'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
            {examDetails?.subject}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Auto-save indicator */}
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--ink-muted)' }}>
            <Save className="w-4 h-4" />
            <span>{autoSaveStatus === 'saved' ? 'Saved' : 'Saving...'}</span>
          </div>

          {/* Timer */}
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg"
            style={{ 
              backgroundColor: timeRemaining < 600 ? '#FEE2E2' : 'var(--navy-50)',
              color: getTimerColor()
            }}
          >
            <Clock className="w-5 h-5" />
            {formatTime(timeRemaining)}
          </div>

          {/* Navigator Toggle */}
          <button
            onClick={() => setShowNavigator(!showNavigator)}
            className="p-2 rounded-lg transition-all hover:bg-opacity-50"
            style={{ backgroundColor: showNavigator ? 'var(--navy-50)' : 'transparent' }}
          >
            <List className="w-5 h-5" style={{ color: 'var(--navy)' }} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Navigator Panel */}
        {showNavigator && (
          <div 
            className="w-64 border-r p-4 overflow-y-auto"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <div className="mb-4">
              <h3 className="font-bold mb-2" style={{ color: 'var(--ink)' }}>Progress</h3>
              <div className="text-2xl font-bold" style={{ color: 'var(--navy)', fontFamily: 'var(--font-display)' }}>
                {answeredCount}/{mockExamQuestions.length}
              </div>
              <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>questions answered</p>
            </div>

            <div className="space-y-4">
              {['A', 'B'].map(section => {
                const sectionQuestions = mockExamQuestions.filter(q => q.section === section);
                return (
                  <div key={section}>
                    <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--ink-muted)' }}>
                      Section {section}
                    </h4>
                    <div className="grid grid-cols-5 gap-2">
                      {sectionQuestions.map((q, idx) => {
                        const status = getQuestionStatus(q);
                        const isCurrent = mockExamQuestions.indexOf(q) === currentQuestionIndex;
                        
                        return (
                          <button
                            key={q.id}
                            onClick={() => setCurrentQuestionIndex(mockExamQuestions.indexOf(q))}
                            className="w-10 h-10 rounded-lg text-sm font-semibold transition-all"
                            style={{
                              backgroundColor: isCurrent ? 'var(--navy)' :
                                status === 'answered' ? 'var(--navy-50)' :
                                status === 'marked' ? 'var(--gold-50)' : 'var(--surface)',
                              color: isCurrent ? 'white' :
                                status === 'answered' ? 'var(--navy)' :
                                status === 'marked' ? 'var(--gold-dark)' : 'var(--ink-muted)',
                              border: '1px solid var(--rule)'
                            }}
                          >
                            {q.questionNumber}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={handleReviewClick}
                className="w-full py-2 px-4 rounded-xl font-semibold transition-all hover:shadow-md"
                style={{ backgroundColor: 'var(--gold)', color: 'white' }}
              >
                Review & Submit
              </button>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--rule)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-muted)' }}>Legend:</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--navy-50)' }} />
                  <span style={{ color: 'var(--ink-muted)' }}>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--gold-50)' }} />
                  <span style={{ color: 'var(--ink-muted)' }}>Marked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border" style={{ borderColor: 'var(--rule)' }} />
                  <span style={{ color: 'var(--ink-muted)' }}>Unanswered</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Question Display Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: 'var(--navy-50)', color: 'var(--navy)' }}
                    >
                      Section {currentQuestion.section}
                    </span>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: 'var(--gold-50)', color: 'var(--gold-dark)' }}
                    >
                      {currentQuestion.marks} marks
                    </span>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--ink)' }}>
                    Question {currentQuestion.questionNumber} of {mockExamQuestions.length}
                  </h2>
                </div>

                <button
                  onClick={() => toggleMarkForReview(currentQuestion.id)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                    markedForReview.has(currentQuestion.id) ? '' : 'border'
                  }`}
                  style={{
                    backgroundColor: markedForReview.has(currentQuestion.id) ? 'var(--gold)' : 'transparent',
                    color: markedForReview.has(currentQuestion.id) ? 'white' : 'var(--gold-dark)',
                    borderColor: 'var(--gold)'
                  }}
                >
                  <Flag className="w-4 h-4" />
                  {markedForReview.has(currentQuestion.id) ? 'Marked' : 'Mark for Review'}
                </button>
              </div>

              {/* Question Text */}
              <div 
                className="p-6 rounded-2xl mb-6"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--rule)' }}
              >
                <p className="text-lg leading-relaxed" style={{ color: 'var(--ink)' }}>
                  {currentQuestion.text}
                </p>
              </div>

              {/* Answer Section */}
              {currentQuestion.type === 'mcq' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md"
                      style={{
                        borderColor: answers[currentQuestion.id] === option.id ? 'var(--navy)' : 'var(--rule)',
                        backgroundColor: answers[currentQuestion.id] === option.id ? 'var(--navy-50)' : 'var(--surface)'
                      }}
                    >
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={option.id}
                        checked={answers[currentQuestion.id] === option.id}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <span className="font-semibold mr-2" style={{ color: 'var(--navy)' }}>
                          {option.id}.
                        </span>
                        <span style={{ color: 'var(--ink)' }}>{option.text}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'short_answer' && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold" style={{ color: 'var(--ink-muted)' }}>
                      Your Answer:
                    </p>
                    {currentQuestion.wordLimit && (
                      <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                        {answers[currentQuestion.id]?.split(' ').length || 0} / {currentQuestion.wordLimit} words
                      </p>
                    )}
                  </div>
                  <textarea
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Type your answer here..."
                    rows={10}
                    className="w-full p-4 rounded-xl border-2 transition-all focus:outline-none focus:border-navy-300"
                    style={{ 
                      borderColor: 'var(--rule)',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--ink)'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div 
            className="flex items-center justify-between px-6 py-4 border-t"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--rule)' }}
          >
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: currentQuestionIndex === 0 ? 'var(--surface)' : 'var(--navy)',
                color: currentQuestionIndex === 0 ? 'var(--ink-muted)' : 'white'
              }}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>
              Question {currentQuestionIndex + 1} of {mockExamQuestions.length}
            </div>

            {currentQuestionIndex < mockExamQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-md"
                style={{ backgroundColor: 'var(--navy)', color: 'white' }}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleReviewClick}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-md"
                style={{ backgroundColor: 'var(--gold)', color: 'white' }}
              >
                Review & Submit
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
