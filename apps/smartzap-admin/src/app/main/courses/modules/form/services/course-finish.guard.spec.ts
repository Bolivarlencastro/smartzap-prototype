import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { CourseFinishGuard } from './course-finish.guard';
import { LessonsSelectors } from 'app/main/courses/store/selectors';

describe('CourseFinishGuard', () => {
  let guard: CourseFinishGuard;
  let storeMock: { select: jest.Mock; dispatch: jest.Mock };

  beforeEach(() => {
    storeMock = { select: jest.fn(), dispatch: jest.fn() };

    TestBed.configureTestingModule({
      providers: [CourseFinishGuard, { provide: Store, useValue: storeMock }],
    });

    guard = TestBed.inject(CourseFinishGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if the contents form is filled', (done) => {
    storeMock.select.mockReturnValueOnce(of(true));

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(true);
      expect(storeMock.select).toHaveBeenCalledWith(LessonsSelectors.selectIsContentsFormCompleted);
      done();
    });
  });

  it('should not allow access if the contents form is not filled', (done) => {
    storeMock.select.mockReturnValueOnce(of(false));

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(false);
      expect(storeMock.select).toHaveBeenCalledWith(LessonsSelectors.selectIsContentsFormCompleted);
      done();
    });
  });
});
