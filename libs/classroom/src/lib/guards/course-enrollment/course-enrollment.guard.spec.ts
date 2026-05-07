import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, provideRouter, UrlTree } from '@angular/router';
import { courseEnrollmentGuard } from './course-enrollment.guard';
import { Course, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable, of } from 'rxjs';
import { ClassroomFacade } from '../../facades';

describe('courseEnrollmentGuard', () => {
  let classroomFacadeMock: jest.Mocked<ClassroomFacade>;
  let routeStub: jest.Mocked<ActivatedRouteSnapshot>;
  const courseId = 'course_id';
  const rollbackPath = 'C/rollback_path';

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => courseEnrollmentGuard(...guardParameters));

  beforeEach(() => {
    classroomFacadeMock = {
      loadCourse: jest.fn(),
      course$: of({ id: courseId }),
      clearCourse: jest.fn(),
    } as unknown as jest.Mocked<ClassroomFacade>;

    const paramMap = new Map([['id', courseId]]);
    const queryParamMap = new Map([['rollbackPath', rollbackPath]]);

    routeStub = {
      paramMap,
      queryParamMap,
    } as unknown as jest.Mocked<ActivatedRouteSnapshot>;

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: ClassroomFacade,
          useValue: classroomFacadeMock,
        },
      ],
    });
  });

  it('should load the course', () => {
    executeGuard(routeStub, {} as any);
    expect(classroomFacadeMock.loadCourse).toHaveBeenCalledWith(courseId, rollbackPath);
  });

  it('should redirect to view-as-user if the user is the course owner or contributor', (done) => {
    jest.replaceProperty(
      classroomFacadeMock,
      'course$',
      of({
        id: courseId,
        is_owner: true,
      } as Course),
    );

    const canActivate = executeGuard(routeStub, {} as any) as Observable<boolean | UrlTree>;

    canActivate.subscribe((result) => {
      expect((result as UrlTree).toString()).toBe(`/view-as-user/${courseId}`);
      done();
    });
  });

  it('should redirect to view-as-user if the user is a contributor', (done) => {
    jest.replaceProperty(
      classroomFacadeMock,
      'course$',
      of({
        id: courseId,
        is_contributor: true,
      } as Course),
    );

    const canActivate = executeGuard(routeStub, {} as any) as Observable<boolean | UrlTree>;

    canActivate.subscribe((result) => {
      expect((result as UrlTree).toString()).toBe(`/view-as-user/${courseId}`);
      done();
    });
  });

  describe('access by enrollment status', () => {
    const cases: any[] = [
      { enrollmentStatus: EnrollmentStatuses.ENROLLED },
      { enrollmentStatus: EnrollmentStatuses.STARTED },
      { enrollmentStatus: EnrollmentStatuses.COMPLETED },
    ];

    test.each(cases)('should allow access when the mission enrollment status is %p', ({ enrollmentStatus }, done) => {
      const enrollment = { status: enrollmentStatus } as any;
      jest.replaceProperty(
        classroomFacadeMock,
        'course$',
        of({
          id: courseId,
          enrollment,
        } as Course),
      );

      const canActivate = executeGuard(routeStub, {} as any) as Observable<boolean | UrlTree>;
      canActivate.subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });
  });

  it('should return an UrlTree to the mission details page if access is denied and reset the classroom state', (done) => {
    jest.replaceProperty(
      classroomFacadeMock,
      'course$',
      of({
        id: courseId,
        enrollment: undefined,
      } as Course),
    );
    const redirectRoute = `/C/${courseId}?rti=true`;

    const canActivate = executeGuard(routeStub, {} as any) as Observable<UrlTree>;
    canActivate.subscribe((result) => {
      expect(result.toString()).toBe(redirectRoute);
      expect(classroomFacadeMock.clearCourse).toHaveBeenCalled();
      done();
    });
  });
});
