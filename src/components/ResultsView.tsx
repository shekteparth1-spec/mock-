import { motion } from 'motion/react';
import { CheckCircle2, XCircle, RotateCcw, Home, Award, ChevronDown } from 'lucide-react';
import { Chapter } from '../types';
import { useState } from 'react';

interface ResultsViewProps {
  chapter: Chapter;
  answers: (number | null)[];
  onRetry: () => void;
  onGoHome: () => void;
}

export function ResultsView({ chapter, answers, onRetry, onGoHome }: ResultsViewProps) {
  const [showReview, setShowReview] = useState(false);
  
  const correctCount = answers.reduce((acc, current, idx) => {
    return current === chapter.questions[idx].correctAnswer ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((correctCount / chapter.questions.length) * 100);
  const score = correctCount;
  const total = chapter.questions.length;

  const getGreeting = () => {
    if (percentage >= 80) return "Exceptional Result";
    if (percentage >= 60) return "Qualified Performance";
    if (percentage >= 40) return "Developing Level";
    return "Action Required";
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 text-center mb-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-6 border border-blue-100 dark:border-blue-500/20 shadow-lg shadow-blue-500/5">
            <Award className="w-10 h-10" />
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight leading-none">{getGreeting()}</h2>
          <p className="text-slate-400 dark:text-slate-500 mb-8 font-black text-[10px] uppercase tracking-[0.2em]">{chapter.title} EVALUATION COMPLETED</p>

          <div className="flex justify-center items-baseline gap-2 mb-10">
            <span className="text-8xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">{score}</span>
            <span className="text-3xl font-bold text-slate-300 dark:text-slate-600">/ {total}</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-10">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-widest">Correct</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{correctCount}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-widest">Wrong</div>
              <div className="text-xl font-bold text-rose-500 dark:text-rose-400">{total - correctCount}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-widest">Efficiency</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{percentage}%</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onRetry}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> 
              {chapter.id.startsWith('mock-') || 
               chapter.id === 'practice-all' || 
               chapter.id.includes('-marks-') || 
               chapter.id.endsWith('-practice') 
               ? 'Retake Test' : 'Revisit Chapter'}
            </button>
            <button
              onClick={onGoHome}
              className="w-full sm:w-auto px-10 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-3.5 h-3.5" /> Dashboard
            </button>
          </div>
        </motion.div>

        {/* Detailed Review Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Detailed Analysis</h3>
            <button 
              onClick={() => setShowReview(!showReview)}
              className="text-blue-600 dark:text-blue-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:text-blue-500 transition-colors"
            >
              {showReview ? 'Collapse Report' : 'Review Answers'} 
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showReview ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showReview && (
            <div className="space-y-4">
              {chapter.questions.map((q, idx) => {
                const isCorrect = answers[idx] === q.correctAnswer;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={q.id}
                    className={`p-6 rounded-2xl border-2 ${
                      isCorrect 
                        ? 'bg-emerald-50/10 dark:bg-emerald-500/5 border-emerald-500/10 dark:border-emerald-500/20' 
                        : 'bg-rose-50/10 dark:bg-rose-500/5 border-rose-500/10 dark:border-rose-500/20'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                        isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                      }`}>
                        {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-6 text-base tracking-tight leading-snug">
                          <span className="text-slate-300 dark:text-slate-700 mr-2 font-black">{(idx + 1).toString().padStart(2, '0')}</span>
                          {q.text}
                        </h4>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className={`flex-1 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50/20 dark:bg-emerald-500/10 border-emerald-500/10 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-100' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300'} text-xs font-bold leading-relaxed`}>
                            <span className="text-[9px] block uppercase font-black text-slate-400 dark:text-slate-500 mb-2 tracking-widest">Candidate Choice</span>
                            {answers[idx] !== null ? q.options[answers[idx]!] : 'Skipped'}
                          </div>
                          {!isCorrect && (
                            <div className="flex-1 p-4 rounded-xl border bg-emerald-50/20 dark:bg-emerald-500/10 border-emerald-500/10 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-100 text-xs font-bold leading-relaxed">
                              <span className="text-[9px] block uppercase font-black text-slate-400 dark:text-slate-500 mb-2 tracking-widest">Validated Answer</span>
                              {q.options[q.correctAnswer]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
