import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { CourseStatusGuard } from './course-status.guard';
import { CourseSelectors } from 'app/main/courses/store/selectors';

describe('CourseStatusGuard', () => {
  let guard: CourseStatusGuard;
  let storeMock: { select: jest.Mock; dispatch: jest.Mock };

  beforeEach(() => {
    storeMock = { select: jest.fn(), dispatch: jest.fn() };

    TestBed.configureTestingModule({
      providers: [CourseStatusGuard, { provide: Store, useValue: storeMock }],
    });

    guard = TestBed.inject(CourseStatusGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if the course is not processing', (done) => {
    storeMock.select.mockReturnValueOnce(of(true));

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(true);
      expect(storeMock.select).toHaveBeenCalledWith(CourseSelectors.selectIsNotProcessing);
      done();
    });
  });

  it('should not allow access if the course is processing', (done) => {
    storeMock.select.mockReturnValueOnce(of(false));

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(false);
      expect(storeMock.select).toHaveBeenCalledWith(CourseSelectors.selectIsNotProcessing);
      done();
    });
  });
});
