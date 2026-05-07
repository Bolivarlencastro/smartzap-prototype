import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

export type QuizType = 'assessment' | 'research';
export type QuizCreationMethod = 'manual' | 'ai_assisted';

export interface QuizWizardDialogResult {
  quizType: QuizType;
  creationMethod: QuizCreationMethod;
}

type WizardStep = 'select_type' | 'select_creation_method';

@Component({
  selector: 'qz-quiz-wizard-dialog',
  templateUrl: './quiz-wizard-dialog.component.html',
  styleUrl: './quiz-wizard-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule,
    TranslocoPipe,
  ],
})
export class QuizWizardDialogComponent {
  private readonly _dialogRef = inject(MatDialogRef<QuizWizardDialogComponent>);

  readonly currentStep = signal<WizardStep>('select_type');
  readonly selectedType = signal<QuizType | null>(null);

  readonly title = computed(() =>
    this.currentStep() === 'select_type'
      ? 'QUIZ.QUIZ_WIZARD_DIALOG.SELECT_TYPE.TITLE'
      : 'QUIZ.QUIZ_WIZARD_DIALOG.SELECT_METHOD.TITLE',
  );

  readonly subtitle = computed(() =>
    this.currentStep() === 'select_type'
      ? 'QUIZ.QUIZ_WIZARD_DIALOG.SELECT_TYPE.SUBTITLE'
      : 'QUIZ.QUIZ_WIZARD_DIALOG.SELECT_METHOD.SUBTITLE',
  );

  readonly backButtonLabel = computed(() =>
    this.currentStep() === 'select_type' ? 'QUIZ.QUIZ_WIZARD_DIALOG.CLOSE' : 'QUIZ.QUIZ_WIZARD_DIALOG.BACK',
  );

  selectType(type: QuizType) {
    this.selectedType.set(type);
    this.currentStep.set('select_creation_method');
  }

  selectCreationMethod(method: QuizCreationMethod) {
    const quizType = this.selectedType();
    if (!quizType) {
      return;
    }
    this._dialogRef.close({ quizType, creationMethod: method });
  }

  onBack() {
    if (this.currentStep() === 'select_type') {
      this._dialogRef.close();
    } else {
      this.currentStep.set('select_type');
    }
  }
}
