import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatButton } from '@angular/material/button';
import { KpEditorComponent } from '../kp-editor/kp-editor.component';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'kp-edit-comment-dialog',
  templateUrl: './kp-edit-comment-dialog.component.html',
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    KpEditorComponent,
    MatDialogActions,
    MatButton,
    TranslocoPipe,
  ],
})
export class KpEditCommentDialogComponent {
  public title: string;
  public text: string;

  constructor(
    public dialogRef: MatDialogRef<KpEditCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { title: string; comment: string; userLanguage: string },
  ) {
    this.title = data.title;
    this.text = data.comment;
  }

  onValueChanged(value: string) {
    this.text = value;
  }
}
