import { UserCreator } from 'app/main/mission/mission.model';
import { Exam } from './exam';
import { Option } from './option';

export interface QuestionRequest {
  id: string;
  options: string[];
}

export interface Question {
  id: string;
  exam_question: string;
  question_type: QuestionType;
  points: string;
  options: Option[];
  user_creator?: UserCreator;
  exam?: Exam;
}

export type QuestionType = 'correct_choices' | 'correct_essay' | 'correct_fill_the_blank_order';
