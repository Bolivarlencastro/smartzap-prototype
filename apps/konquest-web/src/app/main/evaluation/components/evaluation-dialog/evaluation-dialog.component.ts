import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogClose } from '@angular/material/dialog';
import { fuseAnimations } from '@keeps-platform-frontend-workspace/layout';
import { Mission, MissionModel } from 'app/main/mission/mission.model';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MissionEvaluationComponent } from '../../evaluation.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  templateUrl: 'evaluation-dialog.component.html',
  animations: fuseAnimations,
  selector: 'app-evaluation-dialog',
  imports: [MatDialogTitle, MatIconButton, MatDialogClose, MatIcon, MissionEvaluationComponent, TranslocoPipe],
})
export class EvaluationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public mission: Mission,
    public dialogRef: MatDialogRef<EvaluationDialogComponent>,
  ) {}

  get isExternalMission(): boolean {
    return this.mission.mission_model === MissionModel.EXTERNAL_PROVIDER;
  }
}
