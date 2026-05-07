import { Question } from './question';
import { QuizQuestion } from '@keeps-platform-frontend-workspace/ui/kp-quiz-form';
import { Answer } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface Exam {
  id: string;
  title: string;
  correct_answer: boolean;
  created_date?: string;
  updated_date?: string;
  stage: string;
  channel: string;
  pulse: string;
  user_answers: Answer[];
  questions: Question[] | QuizQuestion[];
}
