import { CourseService } from './course.service';
import { Router } from '@angular/router';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { TranslocoService } from '@jsverse/transloco';
import {
  ApplicationServicesApi,
  Course,
  CourseEnrollmentsApi,
  CoursesApi,
  EnrollmentStatuses,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, forkJoin, of, throwError } from 'rxjs';
import { DialogRef } from '@angular/cdk/dialog';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';

describe('CourseService', () => {
  let service: CourseService;
  let routerMock: jest.Mocked<Router>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let coursesApiMock: jest.Mocked<CoursesApi>;
  let dialogMock: jest.Mocked<MatDialog>;
  let translocoServiceStub: jest.Mocked<TranslocoService>;
  let dialogRef: DialogRef<boolean, KpConfirmDialogComponent>;
  let coursesEnrollmentsApiMock: jest.Mocked<CourseEnrollmentsApi>;
  let applicationServicesApiMock: jest.Mocked<ApplicationServicesApi>;

  beforeEach(() => {
    routerMock = { navigateByUrl: jest.fn() } as unknown as jest.Mocked<Router>;
    messageServiceMock = {
      success: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;
    coursesApiMock = { fetchById: jest.fn().mockReturnValue(of(EMPTY)) } as unknown as jest.Mocked<CoursesApi>;
    dialogRef = {
      componentInstance: {} as KpConfirmDialogComponent,
      afterClosed: jest.fn().mockReturnValue(of(true)),
    } as unknown as DialogRef<boolean, KpConfirmDialogComponent>;
    dialogMock = {
      open: jest.fn().mockReturnValue(dialogRef),
    } as unknown as jest.Mocked<MatDialog>;
    translocoServiceStub = {
      translate: jest.fn().mockImplementation((value) => value),
    } as unknown as jest.Mocked<TranslocoService>;
    coursesEnrollmentsApiMock = {
      updateGoalDate: jest.fn().mockReturnValue(of(EMPTY)),
      finishCourseEnrollment: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<CourseEnrollmentsApi>;
    applicationServicesApiMock = {
      getApplicationServices: jest.fn(),
    } as unknown as jest.Mocked<ApplicationServicesApi>;

    service = new CourseService(
      routerMock,
      messageServiceMock,
      coursesApiMock,
      dialogMock,
      translocoServiceStub,
      coursesEnrollmentsApiMock,
      applicationServicesApiMock,
    );
  });

  describe('loadCourse', () => {
    it('should call fetchById with the course id', (done) => {
      service.loadCourse('mock_id').subscribe(() => {
        expect(coursesApiMock.fetchById).toHaveBeenCalledWith('mock_id');
        done();
      });
    });
  });

  describe('leaveCourse', () => {
    it('should navigate to the mission detail dialog', () => {
      const courseId = 'mock_id';

      service.leaveCourse(courseId);

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith(`/C/${courseId}?rti=true`);
    });

    it('should leave the course navigating to the rollbackPath', () => {
      const courseId = 'mock_id';
      const rollbackPath = '/enrollments/missions';

      service.leaveCourse(courseId, rollbackPath);

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith(rollbackPath);
    });
  });

  describe('updateGoalDate', () => {
    it('should update the course goal date', (done) => {
      const enrollmentId = 'mock_id';
      const goalDate = new Date();

      service.updateGoalDate(enrollmentId, goalDate).subscribe(() => {
        expect(coursesEnrollmentsApiMock.updateGoalDate).toHaveBeenCalledWith(enrollmentId, goalDate);
        done();
      });
    });
  });

  describe('finishCourse', () => {
    it('should finish the course enrollment', (done) => {
      const enrollmentId = 'enrollment_id';
      const course = { id: 'course_id', enrollment: { id: enrollmentId } } as Course;

      service.finishEnrollment(course).subscribe(() => {
        expect(coursesEnrollmentsApiMock.finishCourseEnrollment).toHaveBeenCalledWith(enrollmentId);
        done();
      });
    });

    it('should display an error message on failure', (done) => {
      const enrollmentId = 'mock_id';
      const course = { id: 'course_id', enrollment: { id: enrollmentId } } as Course;

      coursesEnrollmentsApiMock.finishCourseEnrollment.mockReturnValueOnce(throwError(() => new Error()));

      service.finishEnrollment(course).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('CLASSROOM.FINISH_ENROLLMENT_ERROR');
          done();
        },
      });
    });
  });

  describe('openLeaveConfirmationDialog', () => {
    it('should return an observable of true when viewing as an user, or when the enrollment status is COMPLETED', (done) => {
      const course = { enrollment: { status: EnrollmentStatuses.COMPLETED } } as Course;

      const viewingAsUserResult = service.openLeaveConfirmationDialog(null as Course, true);
      const enrollmentCompleteResult = service.openLeaveConfirmationDialog(course, false);

      forkJoin([viewingAsUserResult, enrollmentCompleteResult]).subscribe((results) => {
        expect(results).toEqual([true, true]);
        done();
      });
    });
  });
});
