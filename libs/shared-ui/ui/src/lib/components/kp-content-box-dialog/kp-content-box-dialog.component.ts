import { Component, Inject, TemplateRef } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton } from '@angular/material/button';
import { NgClass, NgTemplateOutlet } from '@angular/common';

export interface ActionButton {
  id: string;
  label: string;
  color?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'kp-content-box-dialog',
  templateUrl: './kp-content-box-dialog.component.html',
  styleUrls: ['./kp-content-box-dialog.component.scss'],
  imports: [
    MatDialogTitle,
    NgClass,
    MatIconButton,
    MatIcon,
    CdkScrollable,
    MatDialogContent,
    NgTemplateOutlet,
    MatDialogActions,
    MatButton,
    TranslocoPipe,
  ],
})
export class KpContentBoxDialogComponent {
  confirmTitle: string;
  placeholder = '';
  titleClass = '';
  isSaveDisabled = false;

  actionButtons: ActionButton[];

  customTemplate: TemplateRef<any>;
  context: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<KpContentBoxDialogComponent>,
  ) {
    if (data) {
      this.confirmTitle = data.confirmTitle;
      this.customTemplate = data.customTemplate;
      this.context = data.context;
      this.actionButtons = data.actionButtons;
      this.titleClass = data.titleClass;
    }
  }
}
