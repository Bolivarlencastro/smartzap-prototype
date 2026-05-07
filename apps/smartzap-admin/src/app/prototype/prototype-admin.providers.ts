import { inject, Provider, provideAppInitializer } from '@angular/core';
import { UserProfileService, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoService } from '@jsverse/transloco';
import Keycloak from 'keycloak-js';
import { PrototypeAdminStateService } from './prototype-admin-state.service';
import { prototypeAuthServiceProvider } from './prototype-admin-auth.service';
import { PrototypeAdminUserProfileService, prototypeUserProfileProvider } from './prototype-admin-user-profile.service';

export const prototypeKeycloak = {
  authenticated: true,
  token: 'prototype-token',
  tokenParsed: { sub: 'user-prototype-admin' },
  idTokenParsed: { locale: 'pt-BR', sub: 'user-prototype-admin' },
  realmAccess: { roles: [] },
  resourceAccess: {},
  init: async () => true,
  updateToken: async () => true,
  createLoginUrl: async () => window.location.href,
  logout: async () => undefined,
} as unknown as Keycloak;

function prototypeInitializerFactory(
  state: PrototypeAdminStateService,
  workspaceService: WorkspaceService,
  translateService: TranslocoService,
  userProfileService: PrototypeAdminUserProfileService,
) {
  return async () => {
    workspaceService.storeAvailableWorkspaces(state.getWorkspaceBasicList() as any);
    workspaceService.setCurrentWorkspace(state.getWorkspaceBasicList()[0]);
    workspaceService.setWorkspaceServices(state.getWorkspaceServices() as any);
    translateService.setDefaultLang('pt-BR');
    translateService.setActiveLang('pt-BR');
    await userProfileService.initializeProfile();
  };
}

export function providePrototypeAdminMode() {
  return [
    { provide: Keycloak, useValue: prototypeKeycloak },
    prototypeAuthServiceProvider,
    prototypeUserProfileProvider,
    provideAppInitializer(() => {
      return prototypeInitializerFactory(
        inject(PrototypeAdminStateService),
        inject(WorkspaceService),
        inject(TranslocoService),
        inject(UserProfileService) as unknown as PrototypeAdminUserProfileService,
      )();
    }),
  ];
}
