import { ApplicationServicesApi, WorkspaceApi, WorkspaceBasicDto, WorkspaceWithServices } from '../my-account-sdk';
import { of } from 'rxjs';
import { getWorkspaces, initializer, localeInitializer, redirectToLogin, registerRolesInitializer } from './app-init';
import { KeepsPathLocationStrategy, UserProfileService, WorkspaceService } from '../services';
import Keycloak from 'keycloak-js';
import { TranslocoService } from '@jsverse/transloco';

const mockLoginUrl = 'https://idp.keepsdev.com';
const mockKeycloakLoginUrl = 'https://iam.keepsdev.com';
const mockWorkspacesResult: WorkspaceWithServices[] = [
  {
    name: 'mock_workspace',
    hash_id: 'mock_workspace_hash',
  },
  { name: 'mock_workspace#2', hash_id: 'mock_workspace_hash#2' },
];
const mockWorkspaceHash = 'mock_workspace_hash';

describe('app-init', () => {
  let mockWorkspaceApi: jest.Mocked<WorkspaceApi>;
  let keycloakMock: jest.Mocked<Keycloak>;
  let locationMock: jest.Mocked<Location>;
  let userProfileServiceMock: jest.Mocked<UserProfileService>;
  let translateServiceMock: jest.Mocked<TranslocoService>;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;
  let locationStrategyMock: jest.Mocked<KeepsPathLocationStrategy>;
  let mockApplicationServicesApi: jest.Mocked<ApplicationServicesApi>;

  beforeEach(() => {
    mockWorkspaceApi = {
      getLoginUrl: jest.fn(() => of(mockLoginUrl)),
      getWorkspaces: jest.fn(() => of(mockWorkspacesResult)),
    } as unknown as jest.Mocked<WorkspaceApi>;

    keycloakMock = {
      init: jest.fn(),
      createLoginUrl: jest.fn(() => mockKeycloakLoginUrl),
      idTokenParsed: { locale: 'en-US' },
      authenticated: false,
    } as unknown as jest.Mocked<Keycloak>;

    userProfileServiceMock = {
      initializeProfile: jest.fn(),
    } as unknown as jest.Mocked<UserProfileService>;

    translateServiceMock = {
      setDefaultLang: jest.fn(),
      setActiveLang: jest.fn(),
    } as unknown as jest.Mocked<TranslocoService>;

    workspaceServiceMock = {
      clearCurrentWorkspace: jest.fn(),
      getCurrentWorkspace: jest.fn(),
      setCurrentWorkspace: jest.fn(),
      storeAvailableWorkspaces: jest.fn(),
      setWorkspaceServices: jest.fn(),
    } as unknown as jest.Mocked<WorkspaceService>;

    locationStrategyMock = {
      getHashFromUrl: jest.fn(() => mockWorkspaceHash),
    } as unknown as jest.Mocked<KeepsPathLocationStrategy>;

    locationMock = {
      href: 'mock_href',
      replace: jest.fn(),
      origin: 'mock_origin',
    } as unknown as jest.Mocked<Location>;

    mockApplicationServicesApi = {
      getApplicationServices: jest.fn(() => of([])),
    } as unknown as jest.Mocked<ApplicationServicesApi>;

    delete (window as any).location;
    (window.location as any) = locationMock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('redirectToLogin', () => {
    const mockWorkspaceHash = 'mock_hash';

    it('should redirect to the retrieved url with the current url as redirect_uri', async () => {
      await redirectToLogin(mockWorkspaceHash, mockWorkspaceApi, keycloakMock);
      const expectedURL = 'https://idp.keepsdev.com/?redirect_uri=mock_href';

      expect(locationMock.replace).toHaveBeenCalledWith(expectedURL);
    });

    it('should redirect to the keycloak default url if there is no login url with the current url as redirect_uri', async () => {
      mockWorkspaceApi.getLoginUrl.mockReturnValueOnce(of(''));
      const expectedURL = 'https://iam.keepsdev.com/?redirect_uri=mock_href';

      await redirectToLogin(mockWorkspaceHash, mockWorkspaceApi, keycloakMock);
      expect(locationMock.replace).toHaveBeenCalledWith(expectedURL);
    });

    it('should redirect to the keycloak default url if there is no workspaceHash url with the current url as redirect_uri', async () => {
      mockWorkspaceApi.getLoginUrl.mockReturnValueOnce(of(''));
      const expectedURL = 'https://iam.keepsdev.com/?redirect_uri=mock_href';

      await redirectToLogin('', mockWorkspaceApi, keycloakMock);
      expect(locationMock.replace).toHaveBeenCalledWith(expectedURL);
    });
  });

  describe('localeInitializer', () => {
    it('should register the language returned from the keycloak service', async () => {
      await localeInitializer(translateServiceMock, keycloakMock);

      expect(translateServiceMock.setDefaultLang).toHaveBeenCalledWith('en-US');
      expect(translateServiceMock.setActiveLang).toHaveBeenCalledWith('en-US');
    });

    it('should register the default language it none is returned from the keycloak service', async () => {
      keycloakMock.idTokenParsed = { locale: null };
      await localeInitializer(translateServiceMock, keycloakMock);

      expect(translateServiceMock.setDefaultLang).toHaveBeenCalledWith('pt-BR');
      expect(translateServiceMock.setActiveLang).toHaveBeenCalledWith('pt-BR');
    });
  });

  describe('registerRolesInitializer', () => {
    it('should call fetchProfile on the userProfileService', () => {
      registerRolesInitializer(userProfileServiceMock);

      expect(userProfileServiceMock.initializeProfile).toHaveBeenCalled();
    });
  });

  describe('getWorkspaces', () => {
    it('should resolve the result of the workspaces request', async () => {
      const result = await getWorkspaces(mockWorkspaceApi);

      expect(result).toBe(mockWorkspacesResult);
    });
  });

  describe('initializer', () => {
    let initPromise: () => Promise<void>;

    beforeEach(() => {
      keycloakMock.authenticated = true;

      initPromise = initializer(
        keycloakMock,
        mockWorkspaceApi,
        workspaceServiceMock,
        userProfileServiceMock,
        translateServiceMock,
        locationStrategyMock,
        mockApplicationServicesApi,
      );
    });

    it('should initialize the keyCloakInstance', async () => {
      const expectedInitOptions = {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: 'mock_origin/assets/silent-check-sso.html',
        pkceMethod: 'S256',
      };

      await initPromise();

      expect(keycloakMock.init).toHaveBeenCalledWith(expectedInitOptions);
    });

    it('should set the current workspace', async () => {
      await initPromise();

      expect(workspaceServiceMock.setCurrentWorkspace).toHaveBeenCalledWith(mockWorkspacesResult[0]);
    });

    it('should set the current workspace if there is only one available', async () => {
      const expectedWorkspace = { name: 'mock_workspace#2', hash_id: 'mock_workspace_hash#2' } as WorkspaceBasicDto;
      mockWorkspaceApi.getWorkspaces.mockReturnValueOnce(of([expectedWorkspace]));

      await initPromise();

      expect(workspaceServiceMock.setCurrentWorkspace).toHaveBeenCalledWith(expectedWorkspace);
      expect(mockApplicationServicesApi.getApplicationServices).toHaveBeenCalled();
      expect(workspaceServiceMock.setWorkspaceServices).toHaveBeenCalled();
    });

    it('should store the available workspaces', async () => {
      const mockWorkspaces = [{ name: 'mock_workspace#2', hash_id: 'mock_workspace_hash#2' }] as WorkspaceBasicDto[];
      mockWorkspaceApi.getWorkspaces.mockReturnValueOnce(of(mockWorkspaces));

      await initPromise();

      expect(workspaceServiceMock.storeAvailableWorkspaces).toHaveBeenCalledWith(mockWorkspaces);
    });

    it('should load the services from the current workspace if the hash does not match one of the users workspaces', async () => {
      const mockWorkspaces = [{ name: 'mock_workspace#2', hash_id: 'mock_workspace_hash#2' }] as WorkspaceBasicDto[];
      mockWorkspaceApi.getWorkspaces.mockReturnValueOnce(of(mockWorkspaces));
      workspaceServiceMock.getCurrentWorkspace.mockReturnValueOnce({
        hash_id: 'mock_workspace_hash#3',
      } as WorkspaceBasicDto);

      await initPromise();

      expect(mockApplicationServicesApi.getApplicationServices).toHaveBeenCalled();
      expect(workspaceServiceMock.setWorkspaceServices).toHaveBeenCalled();
    });

    it('should set the current locale', async () => {
      await initPromise();

      expect(translateServiceMock.setDefaultLang).toHaveBeenCalledWith('en-US');
    });

    it('should initialize the roles fetch request', async () => {
      await initPromise();

      expect(userProfileServiceMock.initializeProfile).toHaveBeenCalled();
    });

    it('should not fetch the workspaces if the user is not logged in', async () => {
      keycloakMock.authenticated = false;

      await initPromise();

      expect(locationMock.replace).toHaveBeenCalled();
      expect(workspaceServiceMock.getCurrentWorkspace).not.toHaveBeenCalled();
    });

    it('should redirect to login if the user is not authenticated', async () => {
      keycloakMock.authenticated = false;
      const expectedURL = 'https://idp.keepsdev.com/?redirect_uri=mock_href';

      await initPromise();

      expect(locationMock.replace).toHaveBeenCalledWith(expectedURL);
    });
  });
});
