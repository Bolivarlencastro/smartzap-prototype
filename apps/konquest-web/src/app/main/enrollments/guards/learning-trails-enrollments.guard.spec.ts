import { TestBed } from '@angular/core/testing';
import { CanMatchFn, provideRouter, UrlTree } from '@angular/router';

import { learningTrailsEnrollmentsGuard } from './learning-trails-enrollments.guard';
import { EnrollmentsService } from 'app/main/enrollments/services/enrollments.service';
import { environment } from 'environments/environment';

describe('learningTrailsEnrollmentsGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => learningTrailsEnrollmentsGuard(...guardParameters));

  const enrollmentsServiceMock: jest.Mocked<EnrollmentsService> = {
    hasService: jest.fn(),
  } as unknown as jest.Mocked<EnrollmentsService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: EnrollmentsService, useValue: enrollmentsServiceMock }],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true when it has the learningTrails service', () => {
    enrollmentsServiceMock.hasService.mockReturnValueOnce(true);

    const canMatch = executeGuard({ path: 'learning-trails' }, null);

    expect(canMatch).toBe(true);
  });

  it(`should return an UrlTree to ${environment.routeHome} when it does not have the learningTrails service`, () => {
    enrollmentsServiceMock.hasService.mockReturnValueOnce(false);

    const canMatch = executeGuard({ path: 'learning-trails' }, null) as UrlTree;

    expect(canMatch.toString()).toBe(`/${environment.routeHome}`);
  });
});
