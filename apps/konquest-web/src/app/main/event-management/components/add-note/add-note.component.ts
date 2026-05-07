import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-add-note',
  imports: [MatButtonModule, FormsModule, TranslocoModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: `
    <span mat-dialog-title class="text-xl">
      {{ 'EVENT_MANAGEMENT.ADD_NOTE.TITLE' | transloco }}
    </span>

    <mat-form-field mat-dialog-content class="w-full text-sm" appearance="outline">
      <textarea
        matInput
        rows="4"
        [maxLength]="inputLimit"
        [placeholder]="'EVENT_MANAGEMENT.ADD_NOTE.INPUT_PLACEHOLDER' | transloco"
        [(ngModel)]="note"
      ></textarea>
      <mat-hint>{{ 'EVENT_MANAGEMENT.ADD_NOTE.INPUT_HINT' | transloco: { value: inputLimit } }}</mat-hint>
    </mat-form-field>

    <div mat-dialog-actions class="p-6 pt-5 flex justify-end">
      <button mat-button (click)="onCancel()">
        {{ 'GENERAL.CANCEL' | transloco }}
      </button>

      <button mat-raised-button color="primary" [disabled]="disabledSaveButton" (click)="onSave()">
        {{ 'GENERAL.SAVE' | transloco }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNoteComponent {
  note = signal<string>('');
  protected readonly inputLimit = 140;

  get disabledSaveButton(): boolean {
    return !this.note()?.length;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private dialogRef: MatDialogRef<AddNoteComponent>,
  ) {
    this.note.set(data);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.note());
  }
}
