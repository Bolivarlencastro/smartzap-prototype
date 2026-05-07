export interface ContentOptions {
  name: string;
  order: number;
  dispatch_in: number;
  lesson_id: string;
  learn_content: string;
  type_id: string;
  dispatch_period: string;
}

export interface LessonPayload {
  course_id: string;
  name: string;
  order: number;
}

export interface LearnContentPayload {
  path: string;
  name: string;
  fileName: string;
}

export interface FixtureContent {
  content?: ContentOptions;
  lesson?: LessonPayload;
  learnContent?: LearnContentPayload;
}

export interface QuizOptions {
  question: string;
  options: [
    {
      option: string;
      correct_answer: boolean;
    },
    {
      option: string;
      correct_answer: boolean;
    },
    {
      option: string;
      correct_answer: boolean;
    },
  ];
}
