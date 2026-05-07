import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localePtBR from '@angular/common/locales/pt';
import localePT from '@angular/common/locales/pt-PT';
import { TranslocoService } from '@jsverse/transloco';
import { setDefaultOptions } from 'date-fns';
import { enUS, es, pt, ptBR } from 'date-fns/locale';
import { lastValueFrom } from 'rxjs';
import { ApplicationServicesApi, WorkspaceApi, WorkspaceBasicDto } from '../my-account-sdk';
import { KeepsPathLocationStrategy, UserProfileService, WorkspaceService } from '../services';
import Keycloak from 'keycloak-js';

export const KEEPS_DATE_FORMATS = {
  parse: {
    dateInput: 'P',
  },
  display: {
    dateInput: 'P',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'PPPP',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

type KpLocaleData = {
  cldrIdentifier: string;
  dateFnsLocale: any;
  angularLocale?: any;
};

export async function getWorkspaces(workspaceApi: WorkspaceApi) {
  return lastValueFrom(workspaceApi.getWorkspaces());
}

const workspaceInitializer = async (
  workspaceApi: WorkspaceApi,
  workspaceService: WorkspaceService,
  locationStrategy: KeepsPathLocationStrategy,
  applicationServicesApi: ApplicationServicesApi,
) => {
  const urlHash = locationStrategy.getHashFromUrl();
  const currentWorkspace = workspaceService.getCurrentWorkspace();
  const workspaces = await getWorkspaces(workspaceApi);
  workspaceService.storeAvailableWorkspaces(workspaces);

  if (urlHash && urlHash === currentWorkspace?.hash_id) {
    await loadWorkspaceServices(applicationServicesApi, workspaceService);
    return;
  }

  await checkBaseHrefWorkspace(urlHash, workspaces, workspaceService, applicationServicesApi);
};

async function checkBaseHrefWorkspace(
  urlHash: string,
  workspaces: WorkspaceBasicDto[],
  workspaceService: WorkspaceService,
  applicationServicesApi: ApplicationServicesApi,
): Promise<void> {
  if (workspaces?.length === 1) {
    workspaceService.setCurrentWorkspace(workspaces[0]);
    await loadWorkspaceServices(applicationServicesApi, workspaceService);
    return;
  }

  const workspaceFromUrlHash = workspaces?.find((workspace) => workspace.hash_id === urlHash);
  if (workspaceFromUrlHash) {
    workspaceService.setCurrentWorkspace(workspaceFromUrlHash);
    await loadWorkspaceServices(applicationServicesApi, workspaceService);
    return;
  }

  const currentWorkspace = workspaceService.getCurrentWorkspace();
  if (currentWorkspace) {
    await loadWorkspaceServices(applicationServicesApi, workspaceService);
  }
}

async function loadWorkspaceServices(
  applicationServicesApi: ApplicationServicesApi,
  workspaceService: WorkspaceService,
) {
  const applicationServices = await lastValueFrom(applicationServicesApi.getApplicationServices());
  workspaceService.setWorkspaceServices(applicationServices);
}

export async function registerRolesInitializer(userProfileService: UserProfileService) {
  return await userProfileService.initializeProfile();
}

/**
 * Sets the application language using the transloco library.
 */
export const localeInitializer = (translateService: TranslocoService, keycloak: Keycloak) => {
  const tokenParsed = keycloak.idTokenParsed;
  const currentLocale = tokenParsed?.['locale'] || 'pt-BR';
  translateService.setDefaultLang(currentLocale);
  translateService.setActiveLang(currentLocale);
};

/**
 * Initializes the application by configuring Keycloak, setting up the workspace,
 * initializing localization, and loading the user profile.
 *
 * @return {Promise<void>} A promise that resolves when the initialization process is complete.
 */
async function initialize(
  keycloak: Keycloak,
  workspaceApi: WorkspaceApi,
  workspaceService: WorkspaceService,
  userProfileService: UserProfileService,
  translate: TranslocoService,
  locationStrategy: KeepsPathLocationStrategy,
  applicationServicesApi: ApplicationServicesApi,
): Promise<void> {
  try {
    await keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      pkceMethod: 'S256',
    });

    if (!keycloak.authenticated) {
      await redirectToLogin(locationStrategy.getHashFromUrl(), workspaceApi, keycloak);
      return;
    }

    await workspaceInitializer(workspaceApi, workspaceService, locationStrategy, applicationServicesApi);
    localeInitializer(translate, keycloak);

    await registerRolesInitializer(userProfileService);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function initializer(
  keycloak: Keycloak,
  workspaceApi: WorkspaceApi,
  workspaceService: WorkspaceService,
  userProfileService: UserProfileService,
  translate: TranslocoService,
  locationStrategy: KeepsPathLocationStrategy,
  applicationServicesApi: ApplicationServicesApi,
): () => Promise<void> {
  return () =>
    initialize(
      keycloak,
      workspaceApi,
      workspaceService,
      userProfileService,
      translate,
      locationStrategy,
      applicationServicesApi,
    );
}

export async function redirectToLogin(workspaceHash: string, workspaceApi: WorkspaceApi, keycloak: Keycloak) {
  let loginUrl = await getLoginUrl(workspaceHash, workspaceApi);

  if (!loginUrl) {
    loginUrl = keycloak.createLoginUrl();
  }

  const redirectURL = new URL(loginUrl);
  redirectURL.searchParams.set('redirect_uri', window.location.href);
  window.location.replace(redirectURL.toString());
}

async function getLoginUrl(workspaceHash: string, workspaceApi: WorkspaceApi): Promise<string | undefined> {
  if (!workspaceHash) {
    return undefined;
  }

  try {
    return await lastValueFrom(workspaceApi.getLoginUrl(workspaceHash));
  } catch (_) {
    return undefined;
  }
}

export function getDateAdapterLocale(keycloak: Keycloak) {
  const { locale } = keycloak.idTokenParsed;
  return getLocaleInfo(locale).dateFnsLocale;
}

/**
 * Get the current locale to use with angular pipes
 *
 * @param keycloak The current keycloak instance
 */
export function initializeAngularLocale(keycloak: Keycloak): string {
  const locale = keycloak.idTokenParsed?.['locale'] ?? 'pt-BR';
  const localeInfo: KpLocaleData = getLocaleInfo(locale);

  if (localeInfo.angularLocale) {
    registerLocaleData(localeInfo.angularLocale);
  }

  // Sets the date-fns locale globally
  setDefaultOptions({ locale: localeInfo.dateFnsLocale });

  // We need to return the locale string identifier as per the CLDR specification
  return localeInfo.cldrIdentifier;
}

/**
 * Returns the correct locale information
 * @param locale the Keycloak user locale
 */
function getLocaleInfo(locale: string) {
  const localeMaps = new Map<string, KpLocaleData>([
    ['pt-BR', { cldrIdentifier: 'pt-BR', angularLocale: localePtBR, dateFnsLocale: ptBR }],
    ['es', { cldrIdentifier: 'en-ES', angularLocale: localeEs, dateFnsLocale: es }],
    ['pt-PT', { cldrIdentifier: 'pt-PT', angularLocale: localePT, dateFnsLocale: pt }],
    ['en', { cldrIdentifier: 'en-US', dateFnsLocale: enUS }],
  ]);

  return localeMaps.get(locale) ?? localeMaps.get('pt-BR');
}
