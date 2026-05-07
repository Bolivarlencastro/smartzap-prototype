import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { QuestionRequest } from '@keeps-platform-frontend-workspace/kp-keeps';
import { fuseAnimations } from '@keeps-platform-frontend-workspace/layout';
import { KpQuizCardComponent } from '@keeps-platform-frontend-workspace/ui/kp-quiz-card';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { ClassroomFacade } from '../../facades';

@Component({
  templateUrl: 'quiz.component.html',
  styleUrl: 'quiz.component.scss',
  host: { class: 'light' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  imports: [KpQuizCardComponent, AsyncPipe, MatIcon, TranslocoPipe],
})
export class ClassQuizComponent {
  private readonly classroomFacade = inject(ClassroomFacade);

  readonly loading$ = this.classroomFacade.examLoading$;
  readonly examQuestions$ = this.classroomFacade.examQuestions$;
  readonly answers$ = this.classroomFacade.examAnswers$;
  readonly answeringQuiz$ = this.classroomFacade.answeringQuiz$;
  readonly score$ = this.classroomFacade.examScore$;
  readonly loadingScore$ = this.classroomFacade.examLoadingScore$;
  readonly randomizeQuestions$ = this.classroomFacade.examRandomizeQuestions$;
  readonly randomizeOptions$ = this.classroomFacade.examRandomizeOptions$;
  readonly isViewingAsUser = this.classroomFacade.isViewingAsUser;

  onAnswerer(answer: QuestionRequest): void {
    this.classroomFacade.answerQuestion(answer);
  }

  onFinishExam(): void {
    this.classroomFacade.nextStep();
  }
}
