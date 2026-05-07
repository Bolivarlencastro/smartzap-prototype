import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { QuestionBankOutput } from '../../models/quiz';
import { QuestionBankActions } from '../../store/question-bank/question-bank.actions';
import { questionBankFeature } from '../../store/question-bank/question-bank.feature';

@Component({
  selector: 'qz-question-bank',
  templateUrl: './question-bank.component.html',
  styleUrl: './question-bank.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    TranslocoPipe,
  ],
})
export class QuestionBankComponent {
  private readonly _dialogRef = inject(MatDialogRef<QuestionBankComponent>);
  private readonly _store = inject(Store);
  private readonly _dialog = inject(MatDialog);
  private readonly _userProfileService = inject(UserProfileService);

  protected readonly searchControl = new FormControl('');

  protected readonly _questions = toSignal(this._store.select(questionBankFeature.selectQuestions), {
    initialValue: [],
  });
  protected readonly _isLoading = toSignal(this._store.select(questionBankFeature.selectLoading), {
    initialValue: false,
  });
  protected readonly _canDelete = signal(this._userProfileService.isContentCreator());

  private readonly _selectedIds = signal<Set<string>>(new Set());
  protected readonly selectedCount = computed(() => this._selectedIds().size);

  constructor() {
    this._store.dispatch(QuestionBankActions.loadQuestionBank({}));

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => {
        this._store.dispatch(QuestionBankActions.loadQuestionBank({ filters: value ? { title: value } : undefined }));
      });
  }

  protected isSelected(id: string): boolean {
    return this._selectedIds().has(id);
  }

  protected correctAnswersText(question: QuestionBankOutput): string {
    return question.options
      .filter((opt) => opt.correct_answer)
      .map((opt) => opt.option)
      .join(', ');
  }

  protected toggleSelection(id: string): void {
    this._selectedIds.update((ids) => {
      const next = new Set(ids);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected onDelete(question: QuestionBankOutput): void {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
    dialogRef.componentInstance.confirmTitle = 'QUIZ.QUESTION_BANK.DELETE_CONFIRM.TITLE';
    dialogRef.componentInstance.confirmMessage = 'QUIZ.QUESTION_BANK.DELETE_CONFIRM.MESSAGE';
    dialogRef.componentInstance.positiveButtonLabel = 'QUIZ.QUESTION_BANK.DELETE_CONFIRM.CONFIRM_BUTTON';

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._store.dispatch(QuestionBankActions.deleteQuestionFromBank({ id: question.id }));
        this._selectedIds.update((ids) => {
          const next = new Set(ids);
          next.delete(question.id);
          return next;
        });
      }
    });
  }

  protected onCancel(): void {
    this._dialogRef.close();
  }

  protected onAddQuestions(): void {
    const selected = this._questions().filter((q) => this._selectedIds().has(q.id));
    this._dialogRef.close(selected);
  }
}
