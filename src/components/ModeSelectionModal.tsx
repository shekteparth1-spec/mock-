import { motion } from 'motion/react';
import { X, Play, Zap, Trophy, BookOpen } from 'lucide-react';
import { Chapter } from '../types';

interface ModeSelectionModalProps {
  chapter: Chapter;
  onClose: () => void;
  onModeSelect: (chapter: Chapter, marks?: number) => void;
}

export function ModeSelectionModal({ chapter, onClose, onModeSelect }: ModeSelectionModalProps) {
  const modes = [
    { 
      id: 'practice', 
      title: 'Practice Mode', 
      description: 'Go through all questions at your own pace.', 
      icon: BookOpen, 
      color: 'bg-blue-500',
      marks: undefined
    },
    { 
      id: 'test-30', 
      title: '30 Marks Test', 
      description: '30 random questions. 30 minutes.', 
      icon: Zap, 
      color: 'bg-yellow-500',
      marks: 30 
    },
    { 
      id: 'test-40', 
      title: '40 Marks Test', 
      description: '40 random questions. 40 minutes.', 
      icon: Play, 
      color: 'bg-green-500',
      marks: 40 
    },
    { 
      id: 'test-50', 
      title: '50 Marks Test', 
      description: '50 random questions. 50 minutes.', 
      icon: Trophy, 
      color: 'bg-purple-500',
      marks: 50 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
              Select Mode
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {chapter.title}
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Choose how you want to attempt this module.
            </p>
          </div>

          <div className="space-y-3">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onModeSelect(chapter, mode.marks)}
                className="w-full group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 text-left"
              >
                <div className={`w-12 h-12 rounded-xl ${mode.color} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform`}>
                  <mode.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">
                    {mode.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    {mode.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-8 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center">
            Total Questions available in bank: {chapter.questions.length}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
