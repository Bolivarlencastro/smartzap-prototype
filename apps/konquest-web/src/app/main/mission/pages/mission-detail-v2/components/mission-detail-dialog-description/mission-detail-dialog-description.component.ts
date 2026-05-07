import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KpLinebreakPipe } from '@keeps-platform-frontend-workspace/ui/kp-linebreak';

@Component({
  selector: 'app-mission-detail-dialog-description',
  templateUrl: './mission-detail-dialog-description.component.html',
  providers: [KpLinebreakPipe],
})
export class MissionDetailDialogDescriptionComponent {
  model = {
    editorData: '',
  };

  constructor(
    public dialogRef: MatDialogRef<MissionDetailDialogDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    linebreakPipe: KpLinebreakPipe,
  ) {
    this.model.editorData = data || '';
    this.model.editorData = linebreakPipe.transform(this.model.editorData) || '';
  }

  onClick(): void {
    this.dialogRef.close(this.model.editorData);
  }

  onValueChanged(value: string) {
    this.model.editorData = value;
  }
}
