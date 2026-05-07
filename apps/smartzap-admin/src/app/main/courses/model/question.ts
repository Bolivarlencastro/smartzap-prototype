export interface Option {
  id: string;
  option: string;
  correct_answer?: boolean;
}

export type QuestionType =
  | 'correct_choices'
  | 'correct_essay'
  | 'correct_fill_the_blank_order'
  | 'survey_choices'
  | 'survey_text';

export interface Question {
  id: string;
  workspace_id: string;
  user_creator_id: string;
  question_type: QuestionType;
  title: string;
  points: number;
  created_date: string;
  updated_date: string;
  options?: Option[];
  order?: number;
  question_input_type?: QuestionInputType;
}

export const EMPTY_OPTION: Option = {
  id: '',
  correct_answer: false,
  option: '',
};

export const EMPTY_QUESTION: Question = {
  id: '',
  workspace_id: '',
  user_creator_id: '',
  question_type: 'correct_choices',
  title: '',
  points: 5,
  options: [{ ...EMPTY_OPTION }, { ...EMPTY_OPTION }],
  created_date: '',
  updated_date: '',
  order: 1,
  question_input_type: 'CHOICE',
};

export type QuestionInputType = 'CHOICE' | 'TEXT';
