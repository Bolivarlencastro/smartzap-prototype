import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { CsvImportPreviewCardComponent } from '../../components/csv-import-preview-card/csv-import-preview-card.component';
import { QuestionInput } from '../../models/quiz';
import { CsvImportActions } from '../../store/csv-import/csv-import.actions';
import { csvImportFeature } from '../../store/csv-import/csv-import.feature';

@Component({
  selector: 'qz-csv-import-dialog',
  templateUrl: './csv-import-dialog.component.html',
  styleUrl: './csv-import-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslocoPipe,
    CsvImportPreviewCardComponent,
  ],
})
export class CsvImportDialogComponent {
  private readonly _store = inject(Store);
  private readonly _dialogRef = inject(MatDialogRef<CsvImportDialogComponent>);

  protected readonly status = toSignal(this._store.select(csvImportFeature.selectStatus), {
    initialValue: 'idle' as const,
  });
  protected readonly questions = toSignal(this._store.select(csvImportFeature.selectQuestions), {
    initialValue: [] as QuestionInput[],
  });
  protected readonly errorMessage = toSignal(this._store.select(csvImportFeature.selectErrorMessage), {
    initialValue: null,
  });
  protected readonly fileName = toSignal(this._store.select(csvImportFeature.selectFileName), { initialValue: null });
  protected readonly isDragging = signal(false);
  private readonly _fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  constructor() {
    this._store.dispatch(CsvImportActions.reset());
  }

  protected onFileSelected(): void {
    const input = this._fileInput().nativeElement;
    const file = input.files?.[0];
    if (file) {
      this._store.dispatch(CsvImportActions.parseFile({ file }));
    }
    input.value = '';
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  protected onDragLeave(): void {
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      this._store.dispatch(CsvImportActions.parseFile({ file }));
    }
  }

  protected onToggleSaveToBank(index: number): void {
    this._store.dispatch(CsvImportActions.toggleSaveToBank({ index }));
  }

  protected onAddAllToBank(): void {
    this._store.dispatch(CsvImportActions.addAllToBank());
  }

  protected onCancel(): void {
    this._dialogRef.close();
  }

  protected onImport(): void {
    this._dialogRef.close(this.questions());
  }
}
