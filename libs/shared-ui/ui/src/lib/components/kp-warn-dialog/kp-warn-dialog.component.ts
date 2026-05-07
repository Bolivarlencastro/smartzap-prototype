import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { MatDialogTitle, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'kp-warn-dialog',
  templateUrl: './kp-warn-dialog.component.html',
  styleUrls: ['./kp-warn-dialog.component.scss'],
  imports: [
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    MatDialogClose,
    MatTooltip,
    CdkScrollable,
    MatDialogContent,
    TranslocoPipe,
  ],
})
export class KpWarnDialogComponent {
  dialogTitle: string;
  dialogDescription: string;
  icon: string;
}
