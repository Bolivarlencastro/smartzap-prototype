import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { EnrollmentStatusGuard } from './enrollment-status.guard';
import { of } from 'rxjs';
import { CourseSelectors } from 'app/main/courses/store/selectors';

describe('EnrollmentStatusGuard', () => {
  let guard: EnrollmentStatusGuard;
  let storeMock: { select: jest.Mock };

  beforeEach(() => {
    storeMock = { select: jest.fn() };

    TestBed.configureTestingModule({
      providers: [EnrollmentStatusGuard, { provide: Store, useValue: storeMock }],
    });

    guard = TestBed.inject(EnrollmentStatusGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('return true if the course is finished', (done) => {
    storeMock.select.mockReturnValueOnce(of(true));

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(true);
      expect(storeMock.select).toHaveBeenCalledWith(CourseSelectors.selectCourseFinished);
      done();
    });
  });

  it('return false if the course is not finished', (done) => {
    storeMock.select.mockReturnValueOnce(of(false));

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(false);
      expect(storeMock.select).toHaveBeenCalledWith(CourseSelectors.selectCourseFinished);
      done();
    });
  });
});
