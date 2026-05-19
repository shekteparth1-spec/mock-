import { Moon, Sun, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  showHistory: () => void;
}

export function Header({ isDark, toggleTheme, showHistory }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 transition-colors duration-300 h-16">
      <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => window.location.reload()}
        >
          <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">
            M
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white leading-tight">
              AceMock Platform
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Mock Test 2024
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          <button
            id="btn-history"
            onClick={showHistory}
            className="flex flex-col items-center p-2 rounded hover:bg-slate-800 text-slate-400 transition-colors group"
            title="View History"
          >
            <Clock className="w-4 h-4 group-hover:text-blue-400" />
            <span className="text-[8px] uppercase font-bold mt-0.5 tracking-wider">History</span>
          </button>
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            className="flex flex-col items-center p-2 rounded hover:bg-slate-800 text-slate-400 transition-colors group"
          >
            {isDark ? <Sun className="w-4 h-4 group-hover:text-amber-400" /> : <Moon className="w-4 h-4 group-hover:text-blue-400" />}
            <span className="text-[8px] uppercase font-bold mt-0.5 tracking-wider">Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
}
