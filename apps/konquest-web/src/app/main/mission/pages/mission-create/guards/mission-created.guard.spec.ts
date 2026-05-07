import { TestBed } from '@angular/core/testing';
import { CanActivateFn, provideRouter, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { MissionModel } from 'app/main/mission/mission.model';
import { EMPTY, Observable, of } from 'rxjs';

import { missionCreatedGuard } from './mission-created.guard';

describe('missionCreatedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => missionCreatedGuard(...guardParameters));

  const storeMock = { select: jest.fn().mockReturnValue(of(EMPTY)) };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: storeMock }, provideRouter([])],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if a mission id is returned by the selectRouteNestedParam selector', (done) => {
    const mockMissionId = '8adc262c-e65d-42b3-9302-2c1e50d09537';
    storeMock.select.mockReturnValue(of(mockMissionId));

    const canActivate = executeGuard(null, { url: '' } as any) as Observable<boolean>;

    canActivate.subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should return an UrlTree to missions if a mission model is returned by the selectRouteNestedParam selector', (done) => {
    storeMock.select.mockReturnValue(of(MissionModel.PRESENTIAL));

    const canActivate = executeGuard(null, { url: '' } as any) as Observable<UrlTree>;

    canActivate.subscribe((result) => {
      expect(result.toString()).toBe('/missions');
      done();
    });
  });
});
