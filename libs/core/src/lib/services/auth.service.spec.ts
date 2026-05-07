import { Workspace } from '../my-account-sdk';
import { WorkspaceService } from './workspace.service';

import { AuthService } from './auth.service';
import Keycloak from 'keycloak-js';
import { TestBed } from '@angular/core/testing';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';
import { signal } from '@angular/core';

const mockWorkspace: Partial<Workspace> = { logout_url: 'mock_logout_url' };

describe('AuthService', () => {
  let service: AuthService;
  let keycloakMock: jest.Mocked<Keycloak>;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;

  beforeEach(() => {
    keycloakMock = {
      logout: jest.fn().mockResolvedValue(null),
    } as unknown as jest.Mocked<Keycloak>;
    workspaceServiceMock = { getCurrentWorkspace: jest.fn().mockReturnValue(mockWorkspace) } as any;

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: WorkspaceService,
          useValue: workspaceServiceMock,
        },
        { provide: Keycloak, useValue: keycloakMock },
        { provide: KEYCLOAK_EVENT_SIGNAL, useValue: signal(null) },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logout', () => {
    it('should clear the localStorage on logout', () => {
      localStorage.setItem('randomKey', 'true');
      localStorage.setItem('hideOnboardingTutorial', 'true');
      localStorage.setItem('CLASSROOM_THEME', 'dark');

      global.Storage.prototype.removeItem = jest.fn();
      const removeItemSpy = jest.spyOn(localStorage, 'removeItem');

      service.logout();

      expect(removeItemSpy).toHaveBeenCalledWith('randomKey');
      expect(removeItemSpy).not.toHaveBeenCalledWith('hideOnboardingTutorial');
      expect(removeItemSpy).not.toHaveBeenCalledWith('CLASSROOM_THEME');
    });

    it('should call logout on the KeycloakService with the workspace logout url', () => {
      service.logout();

      expect(keycloakMock.logout).toHaveBeenCalledWith({ redirectUri: mockWorkspace.logout_url });
    });
  });
});
