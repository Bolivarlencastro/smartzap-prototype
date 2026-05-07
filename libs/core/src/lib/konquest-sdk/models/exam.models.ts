export interface CourseExam {
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

export type QuestionType = 'correct_choices' | 'correct_essay' | 'correct_fill_the_blank_order';

export interface QuestionRequest {
  id: string;
  options: string[];
}

export interface AnswerDto {
  question: string;
  options: string[];
  enrollment?: string;
}

export interface Answer {
  id: string;
  correct_options: string[];
  options: string[];
  is_ok: boolean;
  created_at: string;
  updated_at: string;
  exam_has_question: string;
  user: string;
  exam: string;
}

export interface Question {
  id: string;
  exam_question: string;
  question_type: QuestionType;
  points: string;
  options: QuestionOption[];
  // user_creator?: UserCreator;
  // exam?: Exam;
}

export interface QuizQuestion {
  id?: string;
  title: string;
  name: string | undefined;
  options: QuizOption[];
}

export interface QuizOption {
  id?: string;
  correct: boolean;
  text: string;
  selected?: boolean;
}

export interface QuestionOption {
  id: string;
  option: string;
  correct_answer: boolean;
}
