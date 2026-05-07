import { TestBed } from '@angular/core/testing';
import { CanActivateFn, UrlTree } from '@angular/router';

import { workspaceGuardActivate } from './workspace.guard';
import { CheckInService } from '../services/check-in.service';
import { SessionData } from '../models/session-data';
import { signal } from '@angular/core';

describe('workspaceGuard', () => {
  const executeCanActivateGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => workspaceGuardActivate(...guardParameters));

  const checkInServiceMock: jest.Mocked<CheckInService> = {
    sessionData: signal<SessionData | undefined>(undefined),
  } as unknown as jest.Mocked<CheckInService>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: CheckInService, useValue: checkInServiceMock }] });
  });

  describe('canActivateGuard', () => {
    it('should allow access when there is an workspace ID defined', () => {
      checkInServiceMock.sessionData.set({ workspaceId: 'mock_workspace_id' } as SessionData);

      const canActivate = executeCanActivateGuard(null, {} as any);

      expect(canActivate).toBe(true);
    });

    it('should return an UrlTree with unauthorized route when there is no workspace id defined', () => {
      checkInServiceMock.sessionData.set(undefined);

      const urlTree = executeCanActivateGuard(null, {} as any) as UrlTree;

      expect(urlTree.toString()).toBe('/unauthorized');
    });
  });
});
