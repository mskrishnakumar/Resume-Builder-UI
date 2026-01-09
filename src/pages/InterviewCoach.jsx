import { useState } from "react";
import { Link } from "react-router-dom";
import { INTERVIEW_CATEGORIES, INTERVIEW_QUESTIONS, DIFFICULTY_LABELS } from "../data/interviewQuestions";

// Icons for categories
const CategoryIcon = ({ icon, className }) => {
  const icons = {
    user: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    scale: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    chat: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    target: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    lightbulb: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  };
  return icons[icon] || icons.user;
};

const ChevronDown = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const COLOR_MAP = {
  blue: { bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  purple: { bg: "bg-purple-500", light: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  green: { bg: "bg-green-500", light: "bg-green-50", text: "text-green-600", border: "border-green-200" },
  orange: { bg: "bg-orange-500", light: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  pink: { bg: "bg-pink-500", light: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" }
};

const DIFFICULTY_COLOR_MAP = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700"
};

export default function InterviewCoach() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selfRating, setSelfRating] = useState(null);
  const [practiceHistory, setPracticeHistory] = useState(() => {
    const saved = localStorage.getItem("interview_practice_history");
    return saved ? JSON.parse(saved) : {};
  });

  const filteredQuestions = selectedCategory
    ? INTERVIEW_QUESTIONS.filter(q => q.category === selectedCategory)
    : INTERVIEW_QUESTIONS;

  const handleStartPractice = (question) => {
    setSelectedQuestion(question);
    setPracticeMode(true);
    setShowAnswer(false);
    setSelfRating(null);
  };

  const handleRating = (rating) => {
    setSelfRating(rating);
    const newHistory = {
      ...practiceHistory,
      [selectedQuestion.id]: {
        lastPracticed: new Date().toISOString(),
        rating,
        attempts: (practiceHistory[selectedQuestion.id]?.attempts || 0) + 1
      }
    };
    setPracticeHistory(newHistory);
    localStorage.setItem("interview_practice_history", JSON.stringify(newHistory));
  };

  const handleNextQuestion = () => {
    const currentIndex = filteredQuestions.findIndex(q => q.id === selectedQuestion.id);
    const nextIndex = (currentIndex + 1) % filteredQuestions.length;
    handleStartPractice(filteredQuestions[nextIndex]);
  };

  const handleBackToQuestions = () => {
    setPracticeMode(false);
    setSelectedQuestion(null);
    setShowAnswer(false);
    setSelfRating(null);
  };

  // Practice Mode View
  if (practiceMode && selectedQuestion) {
    const category = INTERVIEW_CATEGORIES.find(c => c.id === selectedQuestion.category);
    const colors = COLOR_MAP[category?.color || "blue"];
    const difficulty = DIFFICULTY_LABELS[selectedQuestion.difficulty];

    return (
      <div className="min-h-screen bg-slate-100 font-sans">
        {/* Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <button
              onClick={handleBackToQuestions}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Questions
            </button>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.light} ${colors.text}`}>
              {category?.title}
            </span>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8">
          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className={`${colors.bg} px-6 py-4`}>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium ${DIFFICULTY_COLOR_MAP[difficulty.color]}`}>
                  {difficulty.label}
                </span>
                {practiceHistory[selectedQuestion.id] && (
                  <span className="text-white/80 text-sm">
                    Practiced {practiceHistory[selectedQuestion.id].attempts} time(s)
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                "{selectedQuestion.question}"
              </h2>

              {!showAnswer ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Practice Instructions
                    </h3>
                    <ol className="text-blue-800 space-y-2 text-sm">
                      <li>1. Read the question carefully</li>
                      <li>2. Think about your answer for 30 seconds</li>
                      <li>3. Speak your answer out loud (or write it down)</li>
                      <li>4. Click "Show Answer" to see tips and sample answer</li>
                      <li>5. Rate yourself honestly</li>
                    </ol>
                  </div>

                  <button
                    onClick={() => setShowAnswer(true)}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-semibold text-lg transition-colors"
                  >
                    Show Answer & Tips
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Tips */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tips for Answering
                    </h3>
                    <ul className="text-green-800 space-y-2 text-sm">
                      {selectedQuestion.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample Answer */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Sample Answer Framework
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed italic">
                      "{selectedQuestion.sampleAnswer}"
                    </p>
                  </div>

                  {/* What NOT to do */}
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Avoid These Mistakes
                    </h3>
                    <ul className="text-red-800 space-y-2 text-sm">
                      {selectedQuestion.doNot.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">✗</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Self Rating */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4 text-center">
                      How well did you answer?
                    </h3>
                    <div className="flex justify-center gap-3">
                      {[
                        { value: 1, label: "Needs Work", color: "bg-red-100 hover:bg-red-200 text-red-700 border-red-200" },
                        { value: 2, label: "Okay", color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-200" },
                        { value: 3, label: "Good", color: "bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200" },
                        { value: 4, label: "Excellent", color: "bg-green-100 hover:bg-green-200 text-green-700 border-green-200" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleRating(option.value)}
                          className={`px-4 py-3 rounded-xl font-medium text-sm border-2 transition-all ${
                            selfRating === option.value
                              ? `${option.color} ring-2 ring-offset-2 ring-gray-400`
                              : `${option.color}`
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    {selfRating && (
                      <div className="mt-6 text-center animate-in fade-in">
                        <p className="text-gray-600 mb-4">
                          {selfRating <= 2
                            ? "Keep practicing! You'll get better with time."
                            : "Great job! Keep up the good work!"}
                        </p>
                        <button
                          onClick={handleNextQuestion}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                          Next Question →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main Questions Browser View
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">I</div>
              <span className="font-bold text-xl text-gray-800 tracking-tight">Interview<span className="text-indigo-600">Coach</span></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{INTERVIEW_QUESTIONS.length} questions</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Master Your Interview Skills
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Practice common interview questions, learn winning strategies, and build confidence for your next opportunity.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              All Questions ({INTERVIEW_QUESTIONS.length})
            </button>
            {INTERVIEW_CATEGORIES.map((category) => {
              const count = INTERVIEW_QUESTIONS.filter(q => q.category === category.id).length;
              const colors = COLOR_MAP[category.color];
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? `${colors.bg} text-white`
                      : `bg-white ${colors.text} hover:${colors.light} border ${colors.border}`
                  }`}
                >
                  <CategoryIcon icon={category.icon} className="w-4 h-4" />
                  {category.title} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuestions.map((question) => {
            const category = INTERVIEW_CATEGORIES.find(c => c.id === question.category);
            const colors = COLOR_MAP[category?.color || "blue"];
            const difficulty = DIFFICULTY_LABELS[question.difficulty];
            const history = practiceHistory[question.id];

            return (
              <div
                key={question.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className={`${colors.bg} h-1`} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${colors.light} ${colors.text}`}>
                      {category?.title}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${DIFFICULTY_COLOR_MAP[difficulty.color]}`}>
                      {difficulty.label}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-4 line-clamp-2">
                    {question.question}
                  </h3>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleStartPractice(question)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                    >
                      Practice Now
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    {history && (
                      <span className="text-xs text-gray-400">
                        Last: {history.rating === 4 ? "Excellent" : history.rating === 3 ? "Good" : history.rating === 2 ? "Okay" : "Needs Work"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        {Object.keys(practiceHistory).length > 0 && (
          <div className="mt-10 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Your Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {Object.keys(practiceHistory).length}
                </div>
                <div className="text-sm text-gray-500">Questions Practiced</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {Object.values(practiceHistory).reduce((sum, h) => sum + h.attempts, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Attempts</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(practiceHistory).filter(h => h.rating >= 3).length}
                </div>
                <div className="text-sm text-gray-500">Good/Excellent</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {INTERVIEW_QUESTIONS.length - Object.keys(practiceHistory).length}
                </div>
                <div className="text-sm text-gray-500">Remaining</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
