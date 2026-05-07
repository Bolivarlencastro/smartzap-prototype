import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { CourseEditGuard } from './course-edit-guard.service';
import { BehaviorSubject, of } from 'rxjs';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CourseSelectors } from '../store/selectors';

describe('CourseEditGuard', () => {
  let guard: CourseEditGuard;
  let storeMock: { select: jest.Mock; dispatch: jest.Mock };
  let userProfileServiceMock: jest.Mocked<UserProfileService>;
  const routeSnapshotMock = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    userProfileServiceMock = {
      isAdmin$: jest.fn().mockReturnValue(of(false)),
    } as unknown as jest.Mocked<UserProfileService>;
    storeMock = { select: jest.fn(), dispatch: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        CourseEditGuard,
        { provide: Store, useValue: storeMock },
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

    storeMock.select.mockImplementation((selector) => {
      if (selector === CourseSelectors.selectIsLoaded) {
        return of(true);
      }

      if (selector === CourseSelectors.selectIsOwner) {
        return of(false);
      }

      return of(false);
    });

    guard.canActivate(routeSnapshotMock, routerStateSnapshotMock).subscribe((result) => {
      expect(result).toBe(false);
      done();
    });
  });

  it('allow access if the user is an admin and not the owner', (done) => {
    const routerStateSnapshotMock = { url: '/courses/details' } as RouterStateSnapshot;

    userProfileServiceMock.isAdmin$.mockReturnValueOnce(of(true));
    storeMock.select.mockImplementation((selector) => {
      if (selector === CourseSelectors.selectIsLoaded) {
        return of(false);
      }

      if (selector === CourseSelectors.selectIsOwner) {
        return of(false);
      }

      return of(false);
    });

    guard.canActivate(routeSnapshotMock, routerStateSnapshotMock).subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('waits for the course to load before allowing an owner', (done) => {
    const routerStateSnapshotMock = { url: '/courses/details' } as RouterStateSnapshot;
    const isLoaded$ = new BehaviorSubject(false);
    const isOwner$ = new BehaviorSubject(false);

    storeMock.select.mockImplementation((selector) => {
      if (selector === CourseSelectors.selectIsLoaded) {
        return isLoaded$.asObservable();
      }

      if (selector === CourseSelectors.selectIsOwner) {
        return isOwner$.asObservable();
      }

      return of(false);
    });

    guard.canActivate(routeSnapshotMock, routerStateSnapshotMock).subscribe((result) => {
      expect(result).toBe(true);
      done();
    });

    isOwner$.next(true);
    isLoaded$.next(true);
  });
});
