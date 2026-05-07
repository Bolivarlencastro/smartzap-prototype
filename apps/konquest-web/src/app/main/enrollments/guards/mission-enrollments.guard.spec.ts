import { TestBed } from '@angular/core/testing';
import { CanActivateFn, provideRouter, UrlTree } from '@angular/router';

import { missionEnrollmentsGuard } from './mission-enrollments.guard';
import { EnrollmentsService } from 'app/main/enrollments/services/enrollments.service';

describe('missionEnrollmentsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => missionEnrollmentsGuard(...guardParameters));

  const enrollmentsServiceMock: jest.Mocked<EnrollmentsService> = {
    hasService: jest.fn(),
  } as unknown as jest.Mocked<EnrollmentsService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: EnrollmentsService, useValue: enrollmentsServiceMock }, provideRouter([])],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if has the missions service', () => {
    enrollmentsServiceMock.hasService.mockReturnValueOnce(true);

    const canActivate = executeGuard(null, { url: '' } as any);

    expect(canActivate).toBe(true);
  });

  it('should return an UrlTree to learning trail enrollments if does not have the missions service', () => {
    enrollmentsServiceMock.hasService.mockReturnValueOnce(false);

    const canActivate = executeGuard(null, { url: '' } as any) as UrlTree;

    expect(canActivate.toString()).toBe('/enrollments/learning-trails');
  });
});
