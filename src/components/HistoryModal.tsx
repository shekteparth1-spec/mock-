import { motion } from 'motion/react';
import { X, Calendar } from 'lucide-react';
import { QuizAttempt } from '../types';

interface HistoryModalProps {
  history: QuizAttempt[];
  onClose: () => void;
  onClear: () => void;
}

export function HistoryModal({ history, onClose, onClear }: HistoryModalProps) {
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 rounded-2xl w-full max-w-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[70vh]"
      >
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Performance History</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Archived Test Sessions</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors border border-transparent hover:border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-3">
          {sortedHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-30">
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">No records found</div>
            </div>
          ) : (
            sortedHistory.map((attempt) => {
              const date = new Date(attempt.timestamp).toLocaleDateString(undefined, { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
              const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);

              return (
                <div 
                  key={attempt.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0 border ${
                    percentage >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    percentage >= 50 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-slate-700/50 text-slate-400 border-slate-600/30'
                  }`}>
                    {percentage}%
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-slate-100 truncate text-sm tracking-tight">{attempt.chapterTitle}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {date}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black text-white">{attempt.score}<span className="text-slate-600 text-xs mx-0.5">/</span>{attempt.totalQuestions}</div>
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Points</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {sortedHistory.length > 0 && (
          <div className="p-6 border-t border-slate-800 bg-slate-900/50">
            <button
              onClick={onClear}
              className="w-full py-3 text-rose-500 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition-all"
            >
              Purge Database
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
