import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'qz-quiz-dialog-footer',
  template: `
    <div class="quiz-dialog-footer__left">
      <button mat-button (click)="importSpreadsheet.emit()">
        <mat-icon>upload</mat-icon>
        {{ 'QUIZ.QUIZ_DIALOG.FOOTER.IMPORT_SPREADSHEET' | transloco }}
      </button>
      <button mat-button (click)="questionBankClicked.emit()">
        <mat-icon>account_balance</mat-icon>
        {{ 'QUIZ.QUIZ_DIALOG.FOOTER.QUESTION_BANK' | transloco }}
      </button>
      <button mat-button color="primary" (click)="addQuestion.emit()">
        <mat-icon>add</mat-icon>
        {{ 'QUIZ.QUIZ_DIALOG.FOOTER.ADD_QUESTION' | transloco }}
      </button>
    </div>
    <div class="quiz-dialog-footer__right">
      <button mat-stroked-button (click)="cancelled.emit()">
        {{ 'QUIZ.QUIZ_DIALOG.FOOTER.CANCEL' | transloco }}
      </button>
      <button mat-flat-button color="primary" [disabled]="isPublishDisabled()" (click)="published.emit()">
        {{ 'QUIZ.QUIZ_DIALOG.FOOTER.PUBLISH' | transloco }}
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 8px;
      }

      .quiz-dialog-footer__left {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .quiz-dialog-footer__right {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, TranslocoPipe],
})
export class QuizDialogFooterComponent {
  isPublishDisabled = input<boolean>(false);

  cancelled = output<void>();
  published = output<void>();
  importSpreadsheet = output<void>();
  questionBankClicked = output<void>();
  addQuestion = output<void>();
}
