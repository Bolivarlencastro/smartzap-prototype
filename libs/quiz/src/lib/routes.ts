import { Routes } from '@angular/router';
import { QuizComponent } from './containers/quiz/quiz.component';
import { QUIZ_PROVIDERS } from './quiz.providers';

export const quizRoutes: Routes = [
  {
    path: '',
    component: QuizComponent,
    providers: QUIZ_PROVIDERS,
  },
];
