import { MatDialog } from '@angular/material/dialog';
import { Course, EnrollmentResume } from '@keeps-platform-frontend-workspace/kp-keeps';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Observable } from 'rxjs';
import { CourseResultDialogComponent } from '../../../components/course-result-dialog/course-result-dialog.component';

export interface ResultDialogConfig {
  title: string;
  message: string;
  buttonLabel: string;
  resume: EnrollmentResume;
  course: Course;
  hasGamification: boolean;
  approved: boolean;
}

export class CourseResultDialogStrategy {
  constructor(
    private dialog: MatDialog,
    private approved: boolean,
    private resume: EnrollmentResume,
    private course: Course,
    private hasGamification: boolean,
  ) {}

  showDialog(): Observable<boolean> {
    const config = { resume: this.resume, course: this.course, hasGamification: this.hasGamification };

    const approvedLabels: ResultDialogConfig = {
      title: marker('CLASSROOM.COURSE_APPROVED_DIALOG.TITLE'),
      message: marker('CLASSROOM.COURSE_APPROVED_DIALOG.MESSAGE'),
      buttonLabel: marker('CLASSROOM.COURSE_APPROVED_DIALOG.POSITIVE_BUTTON'),
      approved: true,
      ...config,
    };

    const reprovedLabels: ResultDialogConfig = {
      title: marker('CLASSROOM.COURSE_REPROVED_DIALOG.TITLE'),
      message: marker('CLASSROOM.COURSE_REPROVED_DIALOG.MESSAGE'),
      buttonLabel: marker('CLASSROOM.COURSE_REPROVED_DIALOG.POSITIVE_BUTTON'),
      approved: false,
      ...config,
    };

    return this.openDialog(this.approved ? approvedLabels : reprovedLabels);
  }

  openDialog(data: ResultDialogConfig): Observable<boolean> {
    const dialogRef = this.dialog.open(CourseResultDialogComponent, {
      autoFocus: 'dialog',
      width: '480px',
      disableClose: true,
      data,
    });

    return dialogRef.afterClosed();
  }
}
