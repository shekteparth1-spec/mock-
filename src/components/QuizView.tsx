import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle, Bookmark } from 'lucide-react';
import { Chapter } from '../types';

interface QuizViewProps {
  chapter: Chapter;
  onFinish: (answers: (number | null)[]) => void;
  onCancel: () => void;
}

interface QuizViewProps {
  chapter: Chapter;
  onFinish: (answers: (number | null)[]) => void;
  onCancel: () => void;
}

export function QuizView({ chapter, onFinish, onCancel }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(chapter.questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(chapter.timeLimit);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [flagged, setFlagged] = useState<boolean[]>(new Array(chapter.questions.length).fill(false));

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish(answers);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, answers, onFinish]);

  const currentQuestion = chapter.questions[currentIndex];

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const toggleFlag = () => {
    const newFlagged = [...flagged];
    newFlagged[currentIndex] = !newFlagged[currentIndex];
    setFlagged(newFlagged);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressCount = answers.filter(a => a !== null).length;
  const progressPercent = (progressCount / chapter.questions.length) * 100;
  const isLastQuestion = currentIndex === chapter.questions.length - 1;
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      {/* Test Header */}
      <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">E</div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight truncate max-w-[150px] sm:max-w-md">{chapter.title}</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">EVS QUIZ PORTAL</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Time Left</span>
            <span className={`text-xl font-mono font-bold transition-colors ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-blue-600 dark:text-amber-400'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <button 
            onClick={() => onFinish(answers)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
          >
            Submit
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 w-full relative z-40">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
        />
      </div>

      {/* Main Container */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Question Grid */}
        <aside className="hidden lg:flex w-72 bg-white dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 flex-col shrink-0">
          <div className="p-6 flex-1 overflow-y-auto">
            <h2 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest">Question Map</h2>
            <div className="grid grid-cols-5 gap-2">
              {chapter.questions.map((_, idx) => {
                const isCurrent = currentIndex === idx;
                const isAnswered = answers[idx] !== null;
                const isFlagged = flagged[idx];
                
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 w-10 flex items-center justify-center rounded text-xs font-bold transition-all border ${
                      isCurrent 
                        ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' 
                        : isFlagged
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                        : isAnswered
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Done</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {progressCount.toString().padStart(2, '0')}
              </p>
            </div>
            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Flags</p>
              <p className="text-lg font-bold text-amber-500">
                {flagged.filter(f => f).length.toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </aside>

        {/* Test Section */}
        <section className="flex-1 flex flex-col p-6 md:p-12 lg:p-16 overflow-y-auto">
          <div className="max-w-3xl">
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded uppercase border border-blue-200 dark:border-blue-800 tracking-wider">
                  Question {(currentIndex + 1).toString().padStart(2, '0')}
                </span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Module Test</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight text-slate-900 dark:text-white mb-2 tracking-tight">
                {currentQuestion.text}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full flex items-center p-5 rounded-2xl transition-all group border-2 text-left ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600 ring-4 ring-blue-500/5 shadow-xl shadow-blue-500/5'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className={`h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-xl font-black transition-all mr-5 border-2 ${
                      isSelected
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 group-hover:text-blue-500'
                    }`}>
                      {letters[idx]}
                    </div>
                    <span className={`text-lg transition-colors flex-grow ${isSelected ? 'text-blue-900 dark:text-blue-100 font-bold' : 'text-slate-600 dark:text-slate-300 font-medium'}`}>
                      {option}
                    </span>
                    {isSelected && (
                      <div className="ml-auto h-6 w-6 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation Footer */}
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 font-black hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 flex items-center justify-center gap-2 transition-colors uppercase text-[10px] tracking-widest"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button
                  onClick={toggleFlag}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-black hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors uppercase text-[10px] tracking-widest ${flagged[currentIndex] ? 'text-amber-500' : 'text-slate-400'}`}
                >
                  <Bookmark className="w-4 h-4" fill={flagged[currentIndex] ? "currentColor" : "none"} />
                  Flag
                </button>
              </div>

              {!isLastQuestion ? (
                <button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="w-full sm:w-auto px-10 py-3 rounded-xl bg-blue-600 text-white font-black shadow-xl shadow-blue-500/20 hover:bg-blue-500 flex items-center justify-center gap-2 transition-all uppercase text-[10px] tracking-widest"
                >
                  Next Question <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onFinish(answers)}
                  className="w-full sm:w-auto px-10 py-3 rounded-xl bg-emerald-600 text-white font-black shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 flex items-center justify-center gap-2 transition-all uppercase text-[10px] tracking-widest"
                >
                  Submit Finish <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Mobile Timer/Footer */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-50">
           <div className="flex items-center gap-1.5 text-blue-600 dark:text-amber-400 font-mono font-black">
              <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest mr-1">Time:</span>
              {formatTime(timeLeft)}
           </div>
           <button 
            onClick={() => setShowExitConfirm(true)}
            className="text-[10px] font-black uppercase text-slate-400 tracking-widest"
           >
            Quit Test
           </button>
        </div>
      </main>

      {/* Quit Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto mb-6 border border-rose-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight uppercase">Abort Test?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed font-bold uppercase tracking-wide">
              Your progress will be lost.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors uppercase text-[10px] tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-3 rounded-xl bg-rose-600 text-white font-black hover:bg-rose-500 transition-colors uppercase text-[10px] tracking-widest shadow-lg shadow-rose-500/20"
              >
                Quit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
