import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ApplicationServicesApi,
  apps,
  Course,
  CourseEnrollmentsApi,
  CoursesApi,
  DevelopmentStatus,
  EnrollmentResume,
  EnrollmentStatuses,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { TranslocoService } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { FinishEnrollmentResult } from '../../models';
import {
  CourseExitDialogStrategy,
  CourseFinishDialogStrategy,
  CourseResultDialogStrategy,
} from './confirmation-dialog-strategies';

@Injectable()
export class CourseService {
  constructor(
    private router: Router,
    private messageService: KpMessageService,
    private coursesApi: CoursesApi,
    private dialog: MatDialog,
    private translocoService: TranslocoService,
    private courseEnrollmentApi: CourseEnrollmentsApi,
    private applicationServicesApi: ApplicationServicesApi,
  ) {}

  loadCourse(id: string): Observable<Course> {
    return this.coursesApi.fetchById(id);
  }

  leaveCourse(courseId: string, rollbackPath?: string) {
    if (rollbackPath?.length) {
      this.router.navigateByUrl(rollbackPath);
      return;
    }

    this.navigateToMission(courseId);
  }

  openLeaveConfirmationDialog(course: Course, isViewingAsUser: boolean) {
    if (isViewingAsUser || course.enrollment?.status === EnrollmentStatuses.COMPLETED) {
      return of(true);
    }

    return new CourseExitDialogStrategy(course, this.dialog, this.translocoService).showDialog();
  }

  openFinishConfirmationDialog() {
    return new CourseFinishDialogStrategy(this.dialog).showDialog();
  }

  openCourseResultDialog(
    approved: boolean,
    resume: EnrollmentResume,
    course: Course,
    hasGamification: boolean,
  ): Observable<boolean> {
    return new CourseResultDialogStrategy(this.dialog, approved, resume, course, hasGamification).showDialog();
  }

  shareCertificate(courseName: string) {
    window.open(`${constants.linkedinShareUrl}${courseName}`);
  }

  updateGoalDate(enrollmentId: string, date: Date) {
    return this.courseEnrollmentApi.updateGoalDate(enrollmentId, date).pipe(
      tap({
        next: () => this.messageService.success(marker('CLASSROOM.PROGRESS_PANEL.GOAL_DATE.CHANGE_GOAL_DATE_SUCCESS')),
      }),
    );
  }

  finishEnrollment(course: Course): Observable<FinishEnrollmentResult> {
    return this.finishEnrollmentApiCall(course.enrollment.id).pipe(
      switchMap((enrollmentResume) =>
        forkJoin({
          resume: of(enrollmentResume),
          enrollment: this.loadCourse(course.id).pipe(map((course) => course.enrollment)),
        }),
      ),
      catchError((error) => this.handleEnrollmentError(error)),
    );
  }

  showWarningIfInactive(course: Course): void {
    if (course.development_status !== DevelopmentStatus.INACTIVATED) {
      return;
    }

    this.messageService.info(marker('COURSE.COURSE_DISABLED_MESSAGE'));
  }

  navigateToCertificate(courseId: string) {
    this.router.navigate(['course', courseId, 'certificate']);
  }

  loadCertificate(enrollmentId: string) {
    return this.courseEnrollmentApi.loadCertificate(enrollmentId);
  }

  loadGamification() {
    const gamificationId = apps.konquest.services.gamification.id;
    return this.applicationServicesApi
      .getApplicationServices()
      .pipe(map((services) => services.some((service) => service.id === gamificationId)));
  }

  private navigateToMission(id: string) {
    const url = `/C/${id}?rti=true`;
    this.router.navigateByUrl(url);
  }

  private finishEnrollmentApiCall(enrollmentId: string): Observable<EnrollmentResume> {
    return this.courseEnrollmentApi.finishCourseEnrollment(enrollmentId);
  }

  private handleEnrollmentError(error: any): Observable<never> {
    this.messageService.error(marker('CLASSROOM.FINISH_ENROLLMENT_ERROR'));
    return throwError(() => error);
  }
}
