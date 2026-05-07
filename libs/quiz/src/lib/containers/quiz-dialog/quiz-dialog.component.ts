import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { FormField } from '@angular/forms/signals';
import { filter } from 'rxjs';
import { QuizDialogFooterComponent } from '../../components/quiz-dialog-footer/quiz-dialog-footer.component';
import { QuizQuestionFormComponent } from '../../components/quiz-question-form/quiz-question-form.component';
import { QuizSettingsFormComponent } from '../../components/quiz-settings-form/quiz-settings-form.component';
import { quizFeature } from '../../store/quiz/quiz.feature';
import { QuizActions } from '../../store/quiz/quiz.actions';
import { QuizFormService } from '../../services/quiz-dialog/quiz-form.service';
import { QuestionBankService } from '../../services/question-bank/question-bank.service';
import { CsvImportDialogService } from '../../services/csv-import-dialog/csv-import-dialog.service';
import { QuestionBankOutput, QuestionInput } from '../../models/quiz';

@Component({
  selector: 'qz-quiz-dialog',
  templateUrl: './quiz-dialog.component.html',
  styleUrl: './quiz-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [QuizFormService],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatAccordion,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    TranslocoPipe,
    FormField,
    QuizDialogFooterComponent,
    QuizQuestionFormComponent,
    QuizSettingsFormComponent,
  ],
})
export class QuizDialogComponent {
  private readonly _dialogRef = inject(MatDialogRef<QuizDialogComponent>);
  private readonly _store = inject(Store);
  private readonly _questionBankService = inject(QuestionBankService);
  private readonly _csvImportDialogService = inject(CsvImportDialogService);
  private readonly _destroyRef = inject(DestroyRef);

  protected readonly formService = inject(QuizFormService);

  private readonly _currentQuiz = toSignal(this._store.select(quizFeature.selectCurrentQuiz));
  private readonly _isEditing = toSignal(this._store.select(quizFeature.selectIsEditing), { initialValue: false });
  private readonly _isSaving = toSignal(this._store.select(quizFeature.selectLoading), { initialValue: false });

  protected readonly title = computed(() =>
    this._isEditing() ? 'QUIZ.QUIZ_DIALOG.TITLE_EDIT' : 'QUIZ.QUIZ_DIALOG.TITLE_CREATE',
  );

  protected readonly isEditing = computed(() => this._isEditing());

  protected readonly canDeleteQuestion = this.formService.canDeleteQuestion;

  protected readonly isPublishDisabled = computed(() => !this.formService.isFormValid() || this._isSaving());

  constructor() {
    effect(() => {
      const quiz = this._currentQuiz();

      if (quiz) {
        this.formService.setQuiz(quiz);
      }
    });
  }

  protected onCancel(): void {
    this._dialogRef.close();
  }

  protected onAddQuestion(): void {
    this.formService.addQuestion();
  }

  protected onDeleteQuestion(index: number): void {
    this.formService.confirmAndRemoveQuestion(index).pipe(takeUntilDestroyed(this._destroyRef)).subscribe();
  }

  protected onPublish(): void {
    if (!this.formService.isFormValid()) {
      return;
    }

    const quiz = this.formService.getQuiz();
    if (this._isEditing()) {
      this._store.dispatch(QuizActions.updateQuiz({ quiz }));
    } else {
      this._store.dispatch(QuizActions.createQuiz({ quiz }));
    }
  }

  protected onQuestionBankClicked(): void {
    this._questionBankService
      .open()
      .pipe(filter((questions): questions is QuestionBankOutput[] => !!questions?.length))
      .subscribe((questions) => {
        for (const q of questions) {
          this.formService.addQuestionFromBank({
            question_text: q.question,
            options: q.options.map((opt) => ({ option: opt.option, correct_answer: opt.correct_answer })),
          });
        }
      });
  }

  protected onImportSpreadsheet(): void {
    this._csvImportDialogService
      .open()
      .pipe(filter((questions): questions is QuestionInput[] => !!questions?.length))
      .subscribe((questions) => {
        for (const q of questions) {
          this.formService.addQuestionFromBank(q);
        }
      });
  }

  protected onTitleChange(questionIndex: number, title: string) {
    this.formService.updateQuestionText(questionIndex, title);
  }

  protected addQuestionOption(questionIndex: number) {
    this.formService.addQuestionOption(questionIndex);
  }

  protected removeQuestionOption(questionIndex: number, optionIndex: number) {
    this.formService.removeQuestionOption(questionIndex, optionIndex);
  }
}
