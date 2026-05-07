import { Component } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { UserRole } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { AsyncPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-dialog-transfer',
  templateUrl: './dialog-transfer.component.html',
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatSelectionList,
    MatListOption,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class DialogTransferComponent {
  constructor(public dialogRef: MatDialogRef<DialogTransferComponent>) {}

  readonly defaultUserAvatar = environment.defaultUserAvatar;
  idCourse!: string;
  usersWithRoles$!: Observable<UserRole[]>;
  transfersIsLoading$!: Observable<boolean>;
}
