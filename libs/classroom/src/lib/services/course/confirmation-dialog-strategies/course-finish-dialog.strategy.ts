import {
  AbstractCourseConfirmationDialogStrategy,
  ConfirmationDialogConfig,
} from './course-confirmation-dialog.strategy';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export class CourseFinishDialogStrategy extends AbstractCourseConfirmationDialogStrategy {
  constructor(dialog: MatDialog) {
    super(dialog);
  }

  override showDialog(): Observable<boolean> {
    const config: ConfirmationDialogConfig = {
      title: marker('CLASSROOM.COURSE_FINISH_DIALOG.TITLE'),
      message: marker('CLASSROOM.COURSE_FINISH_DIALOG.MESSAGE'),
      positiveButton: marker('CLASSROOM.COURSE_FINISH_DIALOG.POSITIVE_BUTTON'),
      negativeButton: marker('CLASSROOM.COURSE_FINISH_DIALOG.NEGATIVE_BUTTON'),
    };

    return this.openDialog(config);
  }
}
