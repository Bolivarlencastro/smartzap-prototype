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
