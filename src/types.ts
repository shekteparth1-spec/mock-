export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option (0-3)
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number; // Time in seconds
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

export interface QuizAttempt {
  id: string;
  chapterId: string;
  chapterTitle: string;
  score: number;
  totalQuestions: number;
  timestamp: number;
  answers: (number | null)[]; // User selections
}

export interface QuizState {
  currentChapter: Chapter | null;
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  isFinished: boolean;
  timeLeft: number;
  startTime: number | null;
}
