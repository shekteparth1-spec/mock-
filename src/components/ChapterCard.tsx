import { ChevronRight, Clock, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Chapter } from '../types';

interface ChapterCardProps {
  chapter: Chapter;
  onSelect: (chapter: Chapter) => void;
  index: number;
  key?: string;
}

export function ChapterCard({ chapter, onSelect, index }: ChapterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onSelect(chapter)}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 cursor-pointer hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
      id={`chapter-card-${chapter.id}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <Clock className="w-3 h-3" />
            {chapter.timeLimit / 60}M
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors uppercase tracking-tight">
          {chapter.title}
        </h3>
        <p className="text-xs text-slate-500 mb-6 flex-grow leading-relaxed font-medium">
          {chapter.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {chapter.questions.length.toString().padStart(2, '0')} Questions
          </span>
          <div className="flex items-center gap-2 text-blue-500 group-hover:translate-x-1 transition-transform">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Start</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
