import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { ChapterCard } from './components/ChapterCard';
import { QuizView } from './components/QuizView';
import { ResultsView } from './components/ResultsView';
import { HistoryModal } from './components/HistoryModal';
import { ModeSelectionModal } from './components/ModeSelectionModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Chapter, QuizAttempt, Question } from './types';
import mcqData from './data/mcqData.json';

// Simple shuffle function
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

type AppScreen = 'home' | 'quiz' | 'results';

export default function App() {
  const [isDark, setIsDark] = useLocalStorage('theme-dark', true);
  const [history, setHistory] = useLocalStorage<QuizAttempt[]>('quiz-history', []);
  const [screen, setScreen] = useState<AppScreen>('home');
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [selectedChapterForMode, setSelectedChapterForMode] = useState<Chapter | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleStartQuiz = (chapter: Chapter) => {
    setSelectedChapterForMode(chapter);
  };

  const handleModeSelect = (chapter: Chapter, marks?: number) => {
    setSelectedChapterForMode(null);
    
    let questions = [...chapter.questions];
    let title = chapter.title;
    let timeLimit = chapter.timeLimit;
    let id = chapter.id;

    if (marks) {
      questions = shuffle(questions).slice(0, marks);
      title = `${chapter.title} - ${marks} Marks Test`;
      timeLimit = marks * 60; // 1 minute per question
      id = `${chapter.id}-marks-${marks}`;
    } else {
      questions = shuffle(questions);
      title = `${chapter.title} - Practice Mode`;
      timeLimit = questions.length * 60; // 1 minute per question
      id = `${chapter.id}-practice`;
    }

    setCurrentChapter({
      ...chapter,
      id,
      title,
      questions,
      timeLimit
    });
    setScreen('quiz');
  };

  const handleStartMockTest = (marks: number) => {
    const allChapters = mcqData.subjects.flatMap(s => s.chapters);
    const questionsPerChapter = Math.floor(marks / allChapters.length);
    const remainder = marks % allChapters.length;
    
    let selectedQuestions: Question[] = [];
    
    allChapters.forEach((chapter, idx) => {
      const count = questionsPerChapter + (idx < remainder ? 1 : 0);
      const shuffledChapter = shuffle(chapter.questions);
      selectedQuestions = [...selectedQuestions, ...shuffledChapter.slice(0, count)];
    });
    
    // Final shuffle to mix chapters
    selectedQuestions = shuffle(selectedQuestions);
    
    const mockChapter: Chapter = {
      id: `mock-${marks}`,
      title: `${marks} Marks Mock Test`,
      description: `A balanced random mix of questions from all ${allChapters.length} chapters.`,
      questions: selectedQuestions,
      timeLimit: marks * 60, // 1 minute per question
    };
    
    setCurrentChapter(mockChapter);
    setScreen('quiz');
  };

  const handleStartPracticeMode = () => {
    const allQuestions = mcqData.subjects.flatMap(s => s.chapters).flatMap(c => c.questions);
    
    const practiceChapter: Chapter = {
      id: 'practice-all',
      title: 'Full Subject Practice',
      description: 'Practice all available questions without time pressure.',
      questions: allQuestions,
      timeLimit: allQuestions.length * 60,
    };
    
    setCurrentChapter(practiceChapter);
    setScreen('quiz');
  };

  const handleFinishQuiz = (answers: (number | null)[]) => {
    if (!currentChapter) return;

    setQuizAnswers(answers);
    
    const correctCount = answers.reduce((acc, current, idx) => {
      return current === currentChapter.questions[idx].correctAnswer ? acc + 1 : acc;
    }, 0);

    const newAttempt: QuizAttempt = {
      id: crypto.randomUUID(),
      chapterId: currentChapter.id,
      chapterTitle: currentChapter.title,
      score: correctCount,
      totalQuestions: currentChapter.questions.length,
      timestamp: Date.now(),
      answers: answers
    };

    setHistory([newAttempt, ...history]);
    setScreen('results');
  };

  const handleRetry = () => {
    if (currentChapter) {
      if (currentChapter.id.startsWith('mock-')) {
        const marks = parseInt(currentChapter.id.split('-')[1]);
        handleStartMockTest(marks);
      } else if (currentChapter.id === 'practice-all') {
        handleStartPracticeMode();
      } else if (currentChapter.id.includes('-marks-') || currentChapter.id.endsWith('-practice')) {
        // Find the original chapter ID
        const originalId = currentChapter.id.split('-marks-')[0].split('-practice')[0];
        const chapter = mcqData.subjects
          .flatMap(s => s.chapters)
          .find(c => c.id === originalId);
        
        if (chapter) {
          if (currentChapter.id.includes('-marks-')) {
            const marks = parseInt(currentChapter.id.split('-marks-')[1]);
            handleModeSelect(chapter as Chapter, marks);
          } else {
            handleModeSelect(chapter as Chapter);
          }
        }
      } else {
        // Find the chapter in the nested structure
        const chapter = mcqData.subjects
          .flatMap(s => s.chapters)
          .find(c => c.id === currentChapter.id);
        if (chapter) {
          handleStartQuiz(chapter as Chapter);
        }
      }
    }
  };

  const handleGoHome = () => {
    setScreen('home');
    setCurrentChapter(null);
    setQuizAnswers([]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-300 text-slate-900 dark:text-slate-100">
      <Header 
        isDark={isDark} 
        toggleTheme={() => setIsDark(!isDark)} 
        showHistory={() => setShowHistory(true)}
      />

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-20">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Mock Exams Section */}
              <div className="space-y-10">
                <div className="text-center max-w-2xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-block px-4 py-1.5 rounded-lg bg-purple-600/10 text-purple-500 text-[10px] font-black uppercase tracking-widest mb-6 border border-purple-500/20"
                  >
                    Full Syllabus
                  </motion.div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight leading-none">
                    Mock <span className="text-purple-500">Exams</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[30, 40, 50, 70].map((marks, idx) => (
                    <motion.div
                      key={`mock-${marks}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleStartMockTest(marks)}
                      className="group cursor-pointer bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <span className="text-xl font-black text-purple-600 dark:text-purple-400">{marks}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
                        {marks} Marks Test
                      </h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                        {marks} Questions • 1 Hour
                      </p>
                    </motion.div>
                  ))}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    onClick={handleStartPracticeMode}
                    className="sm:col-span-2 lg:col-span-4 group cursor-pointer bg-blue-600 p-8 rounded-3xl hover:bg-blue-700 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                        All Chapters Practice Mode
                      </h3>
                      <p className="text-sm text-blue-100 font-medium opacity-80">
                        Go through every single question in the bank at your own pace.
                      </p>
                    </div>
                    <div className="px-8 py-4 bg-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-sm backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                      Start Practice
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Existing Chapter Sections */}
              {mcqData.subjects.map((subject) => (
                <div key={subject.id} className="space-y-10">
                  <div className="text-center max-w-2xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-block px-4 py-1.5 rounded-lg bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-500/20"
                    >
                      Subject: {subject.title}
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight leading-none">
                      {subject.title} <span className="text-blue-500">Modules</span>
                    </h2>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-8">
                      {subject.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subject.chapters.map((chapter, idx) => (
                      <ChapterCard 
                        key={chapter.id} 
                        chapter={chapter as Chapter} 
                        onSelect={handleStartQuiz}
                        index={idx}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {screen === 'quiz' && currentChapter && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <QuizView 
                chapter={currentChapter} 
                onFinish={handleFinishQuiz} 
                onCancel={handleGoHome}
              />
            </motion.div>
          )}

          {screen === 'results' && currentChapter && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultsView 
                chapter={currentChapter} 
                answers={quizAnswers} 
                onRetry={handleRetry} 
                onGoHome={handleGoHome}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showHistory && (
          <HistoryModal 
            history={history} 
            onClose={() => setShowHistory(false)} 
            onClear={() => setHistory([])}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedChapterForMode && (
          <ModeSelectionModal
            chapter={selectedChapterForMode}
            onClose={() => setSelectedChapterForMode(null)}
            onModeSelect={handleModeSelect}
          />
        )}
      </AnimatePresence>

      <footer className="py-8 text-center text-slate-400 dark:text-slate-600 text-xs font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} AceMock Test Platform
      </footer>
    </div>
  );
}
