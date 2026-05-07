import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { KpLinebreakPipe } from '@keeps-platform-frontend-workspace/ui/kp-linebreak';
import { KpEditorComponent } from '@keeps-platform-frontend-workspace/ui/kp-editor';
import { TranslocoModule } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'kp-description-dialog',
  imports: [KpEditorComponent, MatDialogActions, TranslocoModule, MatDialogModule, MatButtonModule],
  providers: [KpLinebreakPipe],
  template: `<span class="text-lg" mat-dialog-title> {{ 'GENERAL.EDIT_RESUME_TITLE' | transloco }} </span>
    <div mat-dialog-content>
      <kp-editor [value]="model.editorData" (valueChange)="onValueChanged($event)"></kp-editor>
    </div>
    <mat-dialog-actions align="end">
      <button mat-stroked-button class="mr-2" mat-dialog-close>
        {{ 'GENERAL.CANCEL' | transloco }}
      </button>
      <button mat-flat-button color="primary" (click)="onClick()" [disabled]="!model.editorData">
        {{ 'GENERAL.SAVE' | transloco }}
      </button>
    </mat-dialog-actions> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpDescriptionDialogComponent {
  model = {
    editorData: '',
  };

  constructor(
    public dialogRef: MatDialogRef<KpDescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    linebreakPipe: KpLinebreakPipe,
  ) {
    this.model.editorData = data ?? '';
    this.model.editorData = linebreakPipe.transform(this.model.editorData) ?? '';
  }

  onClick(): void {
    this.dialogRef.close(this.model.editorData);
  }

  onValueChanged(value: string) {
    this.model.editorData = value;
  }
}
