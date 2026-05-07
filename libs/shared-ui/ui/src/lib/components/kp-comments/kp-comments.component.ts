import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { kpAnimations } from '../../animations';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDivider } from '@angular/material/divider';
import { KpCommentComponent } from './kp-comment/kp-comment.component';

import { KpEditCommentDialogComponent } from '../kp-edit-comment-dialog';
import { KpConfirmDialogComponent } from '../kp-confirm-dialog';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'kp-comments',
  templateUrl: './kp-comments.component.html',
  styleUrls: ['./kp-comments.component.scss'],
  animations: kpAnimations,
  imports: [KpCommentComponent, MatDivider, MatProgressSpinner],
})
export class KpCommentsComponent {
  @Input() title: string;
  @Input() comments: any[];
  @Input() userId: string;
  @Input() userLanguage: string;
  @Input() isLoading: boolean;
  @Input() canDeleteAnyComment: boolean;

  @Output() public editEvent = new EventEmitter<any>();
  @Output() public deleteEvent = new EventEmitter<any>();

  constructor(private _dialog: MatDialog) {}

  onEdit(comment: any): void {
    const dialogRefConfirm = this._dialog.open(KpEditCommentDialogComponent, {
      data: {
        title: 'COMMENT.EDIT',
        comment: comment.comment,
        userLanguage: this.userLanguage,
      },
      autoFocus: 'dialog',
      minWidth: '300px',
      width: '50vw',
    });

    dialogRefConfirm
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        tap((result) =>
          this.editEvent.emit({
            new_comment: result,
            comment: comment,
          }),
        ),
      )
      .subscribe();
  }

  onDelete(comment: any): void {
    const dialogRefConfirm = this._dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRefConfirm.componentInstance.confirmTitle = 'COMMENT.CONFIRM_DELETE_TITLE';
    dialogRefConfirm.componentInstance.confirmMessage = 'COMMENT.CONFIRM_DELETE';
    dialogRefConfirm.componentInstance.positiveButtonLabel = 'UI.GENERAL.DELETE';

    dialogRefConfirm
      .afterClosed()
      .pipe(
        filter((ok) => ok === true),
        tap(() => this.deleteEvent.emit(comment)),
      )
      .subscribe();
  }
}
