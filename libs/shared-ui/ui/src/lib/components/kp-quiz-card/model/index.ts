import { Type } from '@angular/core';

export class QuizCardContentItem {
  constructor(
    public component: Type<unknown>,
    public data: Record<string, unknown>,
  ) {}
}

export interface Option {
  id: string;
  option: string;
  questionId: string;
}

export interface QuestionOption extends Option {
  correct: boolean;
  userSelected: boolean;
}
