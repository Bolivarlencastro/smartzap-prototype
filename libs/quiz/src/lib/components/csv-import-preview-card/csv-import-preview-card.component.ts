import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoPipe } from '@jsverse/transloco';
import { QuestionInput } from '../../models/quiz';

@Component({
  selector: 'qz-csv-import-preview-card',
  styleUrl: './csv-import-preview-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'csv-import-preview-card' },
  imports: [MatIconModule, MatSlideToggleModule, TranslocoPipe],
  template: `
    <div class="preview-card-header">
      <span class="preview-card-title">
        {{ 'QUIZ.CSV_IMPORT_DIALOG.QUESTION_LABEL' | transloco: { index: index() + 1 } }}
      </span>
      <label class="preview-card-bank-toggle">
        <span>{{ 'QUIZ.CSV_IMPORT_DIALOG.ADD_TO_BANK' | transloco }}</span>
        <mat-slide-toggle [checked]="question().save_to_bank" (change)="saveToBankChange.emit()" />
      </label>
    </div>
    <p class="preview-card-question">{{ question().question_text }}</p>
    <div class="preview-card-options">
      @for (option of question().options; track option.option) {
        <div class="preview-card-option">
          <mat-icon inline class="preview-card-option-icon" [class.preview-card-icon-hidden]="!option.correct_answer"
            >check_circle</mat-icon
          >
          <p>{{ option.option }}</p>
        </div>
      }
    </div>
  `,
})
export class CsvImportPreviewCardComponent {
  question = input.required<QuestionInput>();
  index = input.required<number>();
  saveToBankChange = output<void>();
}
