import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';

export type ConfirmationDialogConfig = {
  title: string;
  message: string;
  positiveButton: string;
  negativeButton?: string;
  hideCancelButton?: boolean;
};

export interface CourseConfirmationDialogStrategy {
  showDialog(labels: ConfirmationDialogConfig): Observable<boolean>;
}

export abstract class AbstractCourseConfirmationDialogStrategy implements CourseConfirmationDialogStrategy {
  protected constructor(private dialog: MatDialog) {}

  abstract showDialog(): Observable<boolean>;

  protected openDialog(config: ConfirmationDialogConfig): Observable<boolean> {
    const dialogRef = this.dialog.open<KpConfirmDialogComponent, any, boolean>(KpConfirmDialogComponent, {
      autoFocus: 'dialog',
      width: '360px',
      disableClose: true,
    });

    const instance = dialogRef.componentInstance;
    instance.confirmTitle = config.title;
    instance.confirmMessage = config.message;
    instance.negativeButtonLabel = config.negativeButton;
    instance.positiveButtonLabel = config.positiveButton;
    instance.hideCancelButton = config.hideCancelButton;

    return dialogRef.afterClosed();
  }
}
