import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TranslocoModule } from '@jsverse/transloco';
import { KpEditorComponent } from '@keeps-platform-frontend-workspace/ui/kp-editor';

@Component({
  selector: 'app-detail-description-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    TranslocoModule,
    MatDialogModule,
    MatButtonModule,
    KpEditorComponent,
  ],
  template: `<span class="text-lg" mat-dialog-title>
      {{ 'GENERAL.EDIT' | transloco }}
    </span>
    <div mat-dialog-content class="pt-2">
      <kp-editor [value]="description" (valueChange)="onValueChanged($event)"></kp-editor>
    </div>
    <mat-dialog-actions align="end" class="flex justify-end">
      <button mat-stroked-button class="mr-2" mat-dialog-close>
        {{ 'GENERAL.CANCEL' | transloco }}
      </button>
      <button mat-flat-button color="primary" (click)="onSave()" [disabled]="!description?.trim()">
        {{ 'GENERAL.SAVE' | transloco }}
      </button>
    </mat-dialog-actions> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailDescriptionDialogComponent {
  description = '';

  constructor(
    public dialogRef: MatDialogRef<DetailDescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {
    this.description = this.normalizeEditorValue(data || '');
  }

  onValueChanged(value: string): void {
    this.description = value;
  }

  onSave() {
    this.dialogRef.close(this.description);
  }

  private normalizeEditorValue(value: string): string {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return '';
    }

    const containsHtml = /<\/?[a-z][\s\S]*>/i.test(trimmedValue);

    if (containsHtml) {
      return trimmedValue;
    }

    const escapedValue = trimmedValue
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

    return `<p>${escapedValue}</p>`;
  }
}
