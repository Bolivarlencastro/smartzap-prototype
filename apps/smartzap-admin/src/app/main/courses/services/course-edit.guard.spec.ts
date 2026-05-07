import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CourseEditGuard } from './course-edit-guard.service';
import { of } from 'rxjs';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('CourseEditGuard', () => {
  let guard: CourseEditGuard;
  let storeMock: { select: jest.Mock; dispatch: jest.Mock };
  let routerMock: { navigate: jest.Mock };
  let userProfileServiceMock: jest.Mocked<UserProfileService>;
  const routeSnapshotMock = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    userProfileServiceMock = {
      isAdmin$: jest.fn().mockReturnValue(of(false)),
    } as unknown as jest.Mocked<UserProfileService>;
    storeMock = { select: jest.fn(), dispatch: jest.fn() };
    routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        CourseEditGuard,
        { provide: Store, useValue: storeMock },
        {
          provide: Router,
          useValue: routerMock,
        },
        { provide: UserProfileService, useValue: userProfileServiceMock },
      ],
    });

    guard = TestBed.inject(CourseEditGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if the URL is /courses/new/form', (done) => {
    const routerStateSnapshotMock = { url: '/courses/new/form' } as RouterStateSnapshot;

    guard.canActivate(routeSnapshotMock, routerStateSnapshotMock).subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('return false if the user is not the owner', (done) => {
    const routerStateSnapshotMock = { url: '/courses/details' } as RouterStateSnapshot;

    storeMock.select.mockReturnValueOnce(of(false));

    guard.canActivate(routeSnapshotMock, routerStateSnapshotMock).subscribe((result) => {
      expect(result).toBe(false);
      done();
    });
  });

  it('allow access if the user is an admin and not the owner', (done) => {
    const routerStateSnapshotMock = { url: '/courses/details' } as RouterStateSnapshot;

    storeMock.select.mockReturnValueOnce(of(false));
    userProfileServiceMock.isAdmin$.mockReturnValueOnce(of(true));

    guard.canActivate(routeSnapshotMock, routerStateSnapshotMock).subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });
});
