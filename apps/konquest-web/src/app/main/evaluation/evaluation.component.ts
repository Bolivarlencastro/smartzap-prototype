import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { Evaluation, EvaluationQuestion } from '@core/model/evaluation.model';
import { fuseAnimations } from '@keeps-platform-frontend-workspace/layout';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { CourseEvaluationActions, CourseEvaluationSelectors } from './store';
import { AsyncPipe } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { EvaluationContentComponent } from './components/evaluation-content/evaluation-content.component';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-evaluation',
  templateUrl: 'evaluation.component.html',
  styles: [
    `
      :host {
        padding: 0 32px;
      }

      .mat-flat-button.mat-button-disabled.mat-button-disabled {
        background-color: rgb(140, 140, 140, 0.2) !important;
        color: rgb(206, 206, 206) !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  imports: [
    MatDivider,
    CdkScrollable,
    MatDialogContent,
    EvaluationContentComponent,
    MatDialogActions,
    MatButton,
    TranslocoPipe,
    AsyncPipe,
  ],
})
export class MissionEvaluationComponent implements OnInit, OnDestroy {
  @Input() isOnCourse = true;
  @Input() missionId!: string | undefined;
  @Input() enrollmentId!: string | undefined;
  @Input() isExternalMission = false;

  evaluation: Evaluation | undefined;
  evaluations$!: Observable<Evaluation[] | undefined>;
  questions$: Observable<EvaluationQuestion[]>;
  questions: EvaluationQuestion[] = [];
  evaluationForm: UntypedFormGroup;

  constructor(private store: Store) {
    this.questions$ = this.store.select(CourseEvaluationSelectors.selectEvaluationQuestions).pipe(
      filter((response) => response?.length > 0),
      tap((questions) => this.initQuestionForm(questions)),
    );

    this.evaluations$ = this.store.select(CourseEvaluationSelectors.selectEvaluations);

    this.evaluationForm = new FormGroup({
      comment: new FormControl<string>(''),
      rating: new FormControl<number | null>(null, Validators.required),
      nps: new FormControl<number | null>(null, Validators.required),
    });

    this.store.dispatch(CourseEvaluationActions.loadEvaluationQuestions());
  }

  ngOnInit() {
    this.setRequiredData();

    this.evaluations$
      .pipe(
        filter((evaluations) => !!evaluations?.length),
        map((evaluations) => evaluations?.at(-1)),
      )
      .subscribe((evaluation: Evaluation | undefined) => {
        this.evaluation = evaluation;

        this.evaluationForm.patchValue({
          comment: evaluation?.comment,
          rating: evaluation?.rating_avg,
          nps: evaluation?.nps,
          ...this.questions.reduce(
            (current, question) => ({
              ...current,
              [`question_${question.id}_rating`]: evaluation?.[`question_${question.id}_rating` as keyof Evaluation],
            }),
            {},
          ),
        });

        this.evaluationForm.controls['comment'].disable();
      });
  }

  save(): void {
    this.store.dispatch(
      CourseEvaluationActions.postEvaluation({
        evaluation: {
          ...this.evaluationForm.getRawValue(),
          isOnCourse: this.isOnCourse,
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.clear();
  }

  private setRequiredData(): void {
    this.store.dispatch(
      CourseEvaluationActions.setRequiredData({
        missionId: this.missionId,
        enrollmentId: this.enrollmentId,
        isExternalMission: this.isExternalMission,
      }),
    );
  }

  private clear(): void {
    this.store.dispatch(CourseEvaluationActions.clearCache());
  }

  private initQuestionForm(questions: EvaluationQuestion[]): void {
    this.questions = questions;
    this.questions.forEach((question) =>
      this.evaluationForm.addControl(
        `question_${question.id}_rating`,
        new FormControl<number | null>(null, Validators.required),
      ),
    );
  }
}
