import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { Evaluation, EvaluationQuestion } from '@keeps-platform-frontend-workspace/kp-keeps';
import { fuseAnimations } from '@keeps-platform-frontend-workspace/layout';
import { KpEvaluationContentComponent } from '@keeps-platform-frontend-workspace/ui/kp-evaluation-content';
import { TranslocoModule } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { ClassroomFacade, EvaluationFacade } from '../../facades';
import { getTranslocoScope } from '../../transloco-scope.factory';

@Component({
  selector: 'kp-evaluation',
  templateUrl: 'evaluation.component.html',
  styles: [
    `
      :host {
        padding: 32px;
        display: block;
        height: var(--classroom-fixed-height);
        position: relative;
        border-radius: inherit;
        overflow: scroll;
      }

      .mat-flat-button.mat-button-disabled.mat-button-disabled {
        background-color: rgb(140, 140, 140, 0.2) !important;
        color: rgb(206, 206, 206) !important;
      }
    `,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
    TranslocoModule,
    KpEvaluationContentComponent,
  ],
  providers: [getTranslocoScope()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class EvaluationComponent implements OnInit, OnDestroy {
  @Input() missionId!: string | undefined;
  @Input() enrollmentId!: string | undefined;

  evaluation: Evaluation | undefined;
  evaluations$!: Observable<Evaluation[] | undefined>;
  questions$: Observable<EvaluationQuestion[]>;
  questions: EvaluationQuestion[] = [];
  evaluationForm: UntypedFormGroup;

  private destroyRef = inject(DestroyRef);

  constructor(
    private evaluationFacade: EvaluationFacade,
    private classroomFacade: ClassroomFacade,
  ) {
    this.questions$ = evaluationFacade.questions$.pipe(
      filter((response) => response?.length > 0),
      tap((questions) => this.initQuestionForm(questions)),
    );
    this.evaluations$ = evaluationFacade.evaluations$;

    this.buildForm();
    evaluationFacade.loadEvaluationQuestions();
  }

  ngOnInit() {
    this.loadEvaluations();
    this.patchForm();
  }

  ngOnDestroy() {
    this.evaluationFacade.clearCache();
  }

  save() {
    const evaluation = { ...this.evaluationForm.getRawValue() };
    this.evaluationFacade.postEvaluation(evaluation);
  }

  private loadEvaluations() {
    this.classroomFacade.course$.pipe(take(1)).subscribe((mission) => {
      this.evaluationFacade.loadEvaluations(mission?.id, mission?.enrollment?.id);
    });
  }

  private initQuestionForm(questions: EvaluationQuestion[]) {
    this.questions = questions;
    this.questions.forEach((question) =>
      this.evaluationForm.addControl(
        `question_${question.id}_rating`,
        new FormControl<number | null>(null, Validators.required),
      ),
    );
  }

  private buildForm() {
    this.evaluationForm = new FormGroup({
      comment: new FormControl<string>(''),
      rating: new FormControl<number | null>(null, Validators.required),
      nps: new FormControl<number | null>(null, Validators.required),
    });
  }

  private patchForm() {
    this.evaluations$
      .pipe(
        filter((evaluations) => !!evaluations?.length),
        map((evaluations) => evaluations?.at(-1)),
        takeUntilDestroyed(this.destroyRef),
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
}
