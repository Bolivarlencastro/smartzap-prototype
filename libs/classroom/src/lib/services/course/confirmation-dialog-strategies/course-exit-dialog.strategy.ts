import { Observable } from 'rxjs';
import {
  AbstractCourseConfirmationDialogStrategy,
  ConfirmationDialogConfig,
} from './course-confirmation-dialog.strategy';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Course } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatDialog } from '@angular/material/dialog';
import { format } from 'date-fns';
import { TranslocoService } from '@jsverse/transloco';

export class CourseExitDialogStrategy extends AbstractCourseConfirmationDialogStrategy {
  constructor(
    private course: Course,
    dialog: MatDialog,
    private translocoService: TranslocoService,
  ) {
    super(dialog);
  }

  override showDialog(): Observable<boolean> {
    const config: ConfirmationDialogConfig = {
      title: marker('CLASSROOM.GET_OUT_DIALOG.TITLE'),
      message: this.getConfirmationDialogMessage(this.course.enrollment?.goal_date),
      positiveButton: marker('CLASSROOM.GET_OUT_DIALOG.POSITIVE_BUTTON_LABEL'),
      negativeButton: marker('CLASSROOM.GET_OUT_DIALOG.CANCEL_BUTTON_LABEL'),
    };

    return this.openDialog(config);
  }

  private getConfirmationDialogMessage(goalDate: string) {
    if (!goalDate) {
      return marker('CLASSROOM.GET_OUT_DIALOG.DESCRIPTION');
    }

    const formattedGoalDate = format(new Date(`${goalDate}T00:00:00`), 'P');

    return this.translocoService.translate(marker('CLASSROOM.GET_OUT_DIALOG.DESCRIPTION_WITH_GOAL_DATE'), {
      value: formattedGoalDate,
    });
  }
}
