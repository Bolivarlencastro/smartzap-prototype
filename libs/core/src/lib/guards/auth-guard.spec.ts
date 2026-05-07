const redirectToLoginMock = jest.fn();

jest.mock('../shared', () => ({
  redirectToLogin: redirectToLoginMock,
}));

import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { canActivateAuthGuard } from './auth-guard';
import Keycloak from 'keycloak-js';
import { KeepsPathLocationStrategy } from '../services';
import { WorkspaceApi } from '../my-account-sdk';
import { LazyRolesChecker } from './lazy-roles-checker/lazy-roles-checker.service';
import { of } from 'rxjs';

describe('canActivateAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => canActivateAuthGuard(...guardParameters));
  let keycloakMock: jest.Mocked<Keycloak>;
  let locationStrategyMock: jest.Mocked<KeepsPathLocationStrategy>;
  let workspaceApiMock: jest.Mocked<WorkspaceApi>;
  let routerMock: jest.Mocked<Router>;
  let lazyRolesCheckerMock: jest.Mocked<LazyRolesChecker>;

  beforeEach(() => {
    keycloakMock = {
      authenticated: true,
    } as unknown as jest.Mocked<Keycloak>;
    locationStrategyMock = {
      getHashFromUrl: jest.fn().mockReturnValue('mock_hash'),
    } as unknown as jest.Mocked<KeepsPathLocationStrategy>;
    workspaceApiMock = {} as unknown as jest.Mocked<WorkspaceApi>;
    routerMock = { parseUrl: jest.fn() } as unknown as jest.Mocked<Router>;
    lazyRolesCheckerMock = {
      lazyCheckRoles: jest.fn().mockReturnValue(of(true)),
    } as unknown as jest.Mocked<LazyRolesChecker>;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Keycloak,
          useValue: keycloakMock,
        },
        { provide: KeepsPathLocationStrategy, useValue: locationStrategyMock },
        {
          provide: WorkspaceApi,
          useValue: workspaceApiMock,
        },
        { provide: LazyRolesChecker, useValue: lazyRolesCheckerMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should redirect the user to the login page if not authenticated', async () => {
    keycloakMock.authenticated = false;
    const canActivate = await executeGuard(null, { url: '' } as any);

    expect(redirectToLoginMock).toHaveBeenCalledWith('mock_hash', workspaceApiMock, keycloakMock);
    expect(canActivate).toBe(false);
  });

  it('should return true if the route does not have any role configured for it', async () => {
    const canActivate = await executeGuard({ data: {} } as ActivatedRouteSnapshot, { url: '' } as any);

    expect(canActivate).toBe(true);
  });

  it('should check if the user has the route roles when they are defined, allowing access when the lazy roles checker returns true', async () => {
    const canActivate = await executeGuard(
      { data: { roles: ['admin'] } } as unknown as ActivatedRouteSnapshot,
      { url: '' } as any,
    );

    expect(canActivate).toBe(true);
    expect(lazyRolesCheckerMock.lazyCheckRoles).toHaveBeenCalledWith('admin');
  });

  it('should return an UrlTree when the user does not have the authorized roles for the route', async () => {
    lazyRolesCheckerMock.lazyCheckRoles.mockReturnValue(of(false));
    const mockUrlTree = { toString: jest.fn() } as unknown as UrlTree;
    routerMock.parseUrl.mockReturnValue(mockUrlTree);

    const canActivate = await executeGuard(
      { data: { roles: ['admin'] } } as unknown as ActivatedRouteSnapshot,
      { url: '' } as any,
    );

    expect(routerMock.parseUrl).toHaveBeenCalledWith('/');
    expect(canActivate).toBe(mockUrlTree);
  });
});
