import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Params, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { CourseGuard } from './course.guard';
import { of } from 'rxjs';
import { CourseActions } from 'app/main/courses/store/actions';

describe('CourseGuard', () => {
  let guard: CourseGuard;
  let storeMock: { select: jest.Mock; dispatch: jest.Mock };
  const routeSnapshotMock = { params: { id: 'mock_id' } as Params } as ActivatedRouteSnapshot;

  beforeEach(() => {
    storeMock = { select: jest.fn(), dispatch: jest.fn() };

    TestBed.configureTestingModule({
      providers: [CourseGuard, { provide: Store, useValue: storeMock }],
    });

    guard = TestBed.inject(CourseGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should dispatch the clear selected course action', (done) => {
    const routerStateSnapshotMock = { url: '/courses/new/form' } as RouterStateSnapshot;

    guard.canActivate(routeSnapshotMock, routerStateSnapshotMock).subscribe(() => {
      expect(storeMock.dispatch).toHaveBeenCalledWith(CourseActions.clearSelectedCourse());
      done();
    });
  });

  it('should allow access if the URL is /courses/new/form', (done) => {
    const routerStateSnapshotMock = { url: '/courses/new/form' } as RouterStateSnapshot;

    guard.canActivate(routeSnapshotMock, routerStateSnapshotMock).subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('return true if the current course is loaded', (done) => {
    const routerStateSnapshotMock = { url: '/courses/details' } as RouterStateSnapshot;

    storeMock.select.mockReturnValueOnce(of(true));

    guard.canActivate(routeSnapshotMock, routerStateSnapshotMock).subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });
});
