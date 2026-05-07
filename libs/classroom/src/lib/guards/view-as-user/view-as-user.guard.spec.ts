import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, provideRouter, UrlTree } from '@angular/router';
import { viewAsUserGuard } from './view-as-user.guard';
import { ClassroomFacade } from '../../facades';
import { Course, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable, of } from 'rxjs';

describe('viewAsUserGuard', () => {
  let classroomFacadeMock: jest.Mocked<ClassroomFacade>;
  let routeStub: jest.Mocked<ActivatedRouteSnapshot>;
  const courseId = 'course_id';
  const rollbackPath = 'C/rollback_path';

  const userProfileStub = {
    isAdmin: jest.fn(),
    roles$: of(['stub_role']),
  } as unknown as jest.Mocked<UserProfileService>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => viewAsUserGuard(...guardParameters));

  beforeEach(() => {
    classroomFacadeMock = {
      course$: of({ id: courseId }),
      loadCourse: jest.fn(),
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
        { provide: ClassroomFacade, useValue: classroomFacadeMock },
        { provide: UserProfileService, useValue: userProfileStub },
      ],
    });
  });

  it('should load the course with viewAsUser with a true value', () => {
    executeGuard(routeStub, {} as any);

    expect(classroomFacadeMock.loadCourse).toHaveBeenCalledWith(courseId, rollbackPath, true);
  });

  it('should allow access when user is admin', (done) => {
    userProfileStub.isAdmin.mockReturnValueOnce(true);

    const canActivate = executeGuard(routeStub, {} as any) as Observable<boolean | UrlTree>;

    canActivate.subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should allow access when user is course owner', (done) => {
    jest.replaceProperty(classroomFacadeMock, 'course$', of({ id: courseId, is_owner: true } as Course));
    userProfileStub.isAdmin.mockReturnValueOnce(false);

    const canActivate = executeGuard(routeStub, {} as any) as Observable<boolean | UrlTree>;

    canActivate.subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should allow access when user is contributor', (done) => {
    jest.replaceProperty(classroomFacadeMock, 'course$', of({ id: courseId, is_contributor: true } as Course));
    userProfileStub.isAdmin.mockReturnValueOnce(false);

    const canActivate = executeGuard(routeStub, {} as any) as Observable<boolean | UrlTree>;

    canActivate.subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect to course details when access denied', (done) => {
    jest.replaceProperty(classroomFacadeMock, 'course$', of({ id: courseId } as Course));
    userProfileStub.isAdmin.mockReturnValueOnce(false);
    const redirectRoute = `/C/${courseId}?rti=true`;

    const canActivate = executeGuard(routeStub, {} as any) as Observable<UrlTree>;

    canActivate.subscribe((result) => {
      expect(result.toString()).toBe(redirectRoute);
      expect(classroomFacadeMock.clearCourse).toHaveBeenCalled();
      done();
    });
  });
});
