import Keycloak from 'keycloak-js';
import { of, Subject } from 'rxjs';
import { CoreConfig } from '../core-config';
import { UserApplication, UserProfile, UserRoleV2, UsersApi, UserWorkspace } from '../my-account-sdk';
import { UsersV2Api } from '../my-account-sdk/apis/users-v2.api';
import { MyAccountV2Client } from '../public-api';
import { UserProfileService } from './user-profile.service';
import { WorkspaceService } from './workspace.service';

const mockAppId = '0abf08ea-d252-4d7c-ab45-ab3f9135c288';
const mockCoreConfig: CoreConfig = {
  apis: { apiKonquestUrl: '' },
  appId: mockAppId,
  production: false,
};
const mockWorkspaceId = 'e76b5082-f4fe-4f41-be79-1977840e16a8';
const mockUserId = 'mock_user_id';

const mockWorkspace: UserWorkspace = {
  id: mockWorkspaceId,
  name: 'Keeps',
};

const mockKonquestApplication: UserApplication = {
  id: mockAppId,
  name: 'Konquest',
};
const mockMyAccountApplication: UserApplication = {
  id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
  name: 'My Account',
};

const mockKonquestSuperAdminRole: UserRoleV2 = {
  id: '',
  role_id: 'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6',
  role_name: 'Konquest Super Admin',
  key: 'super_admin',
  application_id: mockKonquestApplication.id,
  application_name: mockKonquestApplication.name,
  workspace_id: mockWorkspace.id,
};
const mockKonquestAdminRole: UserRoleV2 = {
  id: '',
  role_id: '297a88de-c34b-4661-be8a-7090fa9a89e5',
  role_name: 'Konquest Admin',
  application_id: mockKonquestApplication.id,
  application_name: mockKonquestApplication.name,
  key: 'admin',
  workspace_id: mockWorkspace.id,
};

const mockAccountAdminRole: UserRoleV2 = {
  id: '',
  role_id: '3b16b975-0297-4edf-950b-e3700b0d0d01',
  role_name: 'My Account Admin',
  key: 'account_admin',
  application_id: mockMyAccountApplication.id,
  application_name: mockMyAccountApplication.name,
  workspace_id: mockWorkspace.id,
};

const mockCuratorRole: UserRoleV2 = {
  id: '',
  role_id: 'mock_curator_role_id',
  role_name: 'Content curator',
  key: 'curator',
  application_id: mockKonquestApplication.id,
  application_name: mockKonquestApplication.name,
  workspace_id: mockWorkspace.id,
};

const mockContentRole: UserRoleV2 = {
  id: '',
  role_id: 'mock_content_role_id',
  role_name: 'Content role',
  key: 'content',
  application_id: mockKonquestApplication.id,
  application_name: mockKonquestApplication.name,
  workspace_id: mockWorkspace.id,
};

const mockUserRole: UserRoleV2 = {
  id: '',
  role_id: 'mock_user_role_id',
  role_name: 'Basic user',

  key: 'konquest_user',
  application_id: mockKonquestApplication.id,
  application_name: mockKonquestApplication.name,
  workspace_id: mockWorkspace.id,
};

const mockUserRoles: UserRoleV2[] = [mockKonquestSuperAdminRole, mockKonquestAdminRole, mockAccountAdminRole];

const mockUserProfile: Partial<UserProfile> = { id: mockUserId, name: 'mock_user', roles: mockUserRoles };

const mockLocale = 'mock_locale';

describe('UserProfileService', () => {
  let service: UserProfileService;
  const workspaceSubject = new Subject<void>();
  const workspaceServiceMock: jest.Mocked<WorkspaceService> = {
    currentWorkspaceId: mockWorkspaceId,
    currentWorkspace$: workspaceSubject.asObservable(),
  } as any;
  const keycloakMock: jest.Mocked<Keycloak> = {
    authenticated: true,
    realmAccess: { roles: ['keeps_admin', 'keeps_platform_admin'] },
    idTokenParsed: { locale: mockLocale },
    resourceAccess: { konquest: { roles: ['mock_role'] } },
    getUserRoles: jest.fn().mockReturnValue(['keeps_admin', 'mock_role', 'keeps_platform_admin']),
  } as any;
  let usersApiMock: jest.Mocked<UsersApi>;
  let usersV2ApiMock: jest.Mocked<UsersV2Api>;
  let myAccV2ApiMock: jest.Mocked<MyAccountV2Client>;

  beforeEach(() => {
    usersApiMock = {
      fetchProfile: jest.fn().mockReturnValue(of(mockUserProfile)),
    } as any;

    usersV2ApiMock = {
      userInfo: jest.fn().mockReturnValue(of(mockUserProfile)),
    } as unknown as jest.Mocked<UsersV2Api>;

    myAccV2ApiMock = {
      postFormData: jest.fn().mockReturnValue(of(true)),
      patch: jest.fn().mockReturnValue(of(true)),
    } as unknown as jest.Mocked<MyAccountV2Client>;

    service = new UserProfileService(
      workspaceServiceMock,
      keycloakMock,
      usersApiMock,
      usersV2ApiMock,
      myAccV2ApiMock,
      mockCoreConfig,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchProfile', () => {
    it('should call fetchProfile on the UsersV2APi with the logged user id', () => {
      service.fetchProfile();

      expect(usersV2ApiMock.userInfo).toHaveBeenCalled();
    });

    it('should set emit the user profile', (done) => {
      service.fetchProfile();

      service.profile$.subscribe((profile) => {
        expect(profile).toEqual(mockUserProfile);
        done();
      });
    });

    it('should set emit the user roles', (done) => {
      service.fetchProfile();

      service.roles$.subscribe((roles) => {
        expect(roles).toEqual(mockUserRoles);
        done();
      });
    });

    it('should call fetchProfile when the current workspace changes', () => {
      const fetchProfileSpy = jest.spyOn(service, 'fetchProfile');

      workspaceSubject.next();

      expect(fetchProfileSpy).toHaveBeenCalled();
    });
  });

  describe('getApplicationRoles', () => {
    it('should return the list of roles the user has in the current workspace and application', () => {
      service.fetchProfile();
      const expectedRoles = [mockKonquestSuperAdminRole.key, mockKonquestAdminRole.key];

      expect(service.getApplicationRoles()).toEqual(expectedRoles);
    });

    it('should return the list of roles the user has in the current workspace and specified application', () => {
      service.fetchProfile();
      const expectedRoles = [mockAccountAdminRole.key];

      expect(service.getApplicationRoles(mockMyAccountApplication.id)).toEqual(expectedRoles);
    });
  });

  describe('isApplicationAdmin', () => {
    it('should return true if the user has the admin role in the specified application', () => {
      service.fetchProfile();

      expect(service.isApplicationAdmin(mockKonquestApplication.id)).toBe(true);
    });
  });

  describe('isKeepsAdmin', () => {
    it('should return whether the user has the keeps_admin keycloak role', () => {
      expect(service.isKeepsAdmin()).toBe(true);
    });
  });

  describe('isKeepsAdmin$', () => {
    it('should return an observable of whether the user has the keeps_admin keycloak role', (done) => {
      service.isKeepsAdmin$().subscribe((isKeepsAdmin) => {
        expect(isKeepsAdmin).toBe(true);
        done();
      });
    });
  });

  describe('isKeepsPlatformAdmin', () => {
    it('should return whether the user has the keeps_platform_admin keycloak role', () => {
      expect(service.isKeepsPlatformAdmin()).toBe(true);
    });
  });

  describe('hasRoles', () => {
    it('should return true if the user has at least one of the provided roles', () => {
      service.fetchProfile();
      const mockRoles = ['admin', 'mock_role', 'another_mock_role'];

      expect(service.hasRoles(mockRoles)).toBe(true);
    });

    it('should return true if the user has at least one of the provided KeyCloak roles', () => {
      service.fetchProfile();
      const mockRoles = ['keeps_platform_admin'];

      expect(service.hasRoles(mockRoles)).toBe(true);
    });
  });

  describe('hasRoles$', () => {
    it('should return an observable of true if the user has at least one of the provided roles', (done) => {
      service.fetchProfile();
      const mockRoles = ['admin', 'mock_role', 'another_mock_role'];

      service.hasRoles$(mockRoles).subscribe((hasRoles) => {
        expect(hasRoles).toBe(true);
        done();
      });
    });

    it('should return an observable of false if the user has none of the provided roles', (done) => {
      usersV2ApiMock.userInfo.mockReturnValue(of({ ...mockUserProfile, roles: [mockUserRole] } as any));
      service.fetchProfile();
      const mockRoles = ['admin', 'super_admin'];

      service.hasRoles$(mockRoles).subscribe((hasRoles) => {
        expect(hasRoles).toBe(false);
        done();
      });
    });
  });

  describe('isAdmin', () => {
    it('should return true if the user has one of the current application admin roles', () => {
      service.fetchProfile();

      expect(service.isAdmin()).toBe(true);
    });

    it('should return false if the user has none of the current application admin roles', () => {
      usersV2ApiMock.userInfo.mockReturnValue(of({ ...mockUserProfile, roles: [mockAccountAdminRole] } as any));
      service.fetchProfile();

      expect(service.isAdmin()).toBe(false);
    });
  });

  describe('isAdmin$', () => {
    it('should return an observable of true if the user has one of the current application admin roles', (done) => {
      service.fetchProfile();

      service.isAdmin$().subscribe((isAdmin) => {
        expect(isAdmin).toBe(true);
        done();
      });
    });

    it('should return an observable of false if the user has none of the current application admin roles', (done) => {
      usersV2ApiMock.userInfo.mockReturnValue(of({ ...mockUserProfile, roles: [mockAccountAdminRole] } as any));
      service.fetchProfile();

      service.isAdmin$().subscribe((isAdmin) => {
        expect(isAdmin).toBe(false);
        done();
      });
    });
  });

  describe('isSuperAdmin', () => {
    it('should return true if the user has the superAdmin role', () => {
      service.fetchProfile();

      expect(service.isSuperAdmin()).toBe(true);
    });

    it('should return false if the user does not have the superAdmin role', () => {
      usersV2ApiMock.userInfo.mockReturnValue(of({ ...mockUserProfile, roles: [mockAccountAdminRole] } as any));
      service.fetchProfile();

      expect(service.isSuperAdmin()).toBe(false);
    });
  });

  describe('isSuperAdmin$', () => {
    it('should return an observable of true if the user has the superAdmin role', (done) => {
      service.fetchProfile();

      service.isSuperAdmin$().subscribe((isSuperAdmin) => {
        expect(isSuperAdmin).toBe(true);
        done();
      });
    });

    it('should return an observable of false if the user does not have the superAdmin role', (done) => {
      usersV2ApiMock.userInfo.mockReturnValue(of({ ...mockUserProfile, roles: [mockAccountAdminRole] } as any));
      service.fetchProfile();

      service.isSuperAdmin$().subscribe((isSuperAdmin) => {
        expect(isSuperAdmin).toBe(false);
        done();
      });
    });
  });

  describe('isContentCreator', () => {
    it('should return true if the user has the content creator role', () => {
      usersV2ApiMock.userInfo.mockReturnValue(
        of({
          ...mockUserProfile,
          roles: [mockContentRole],
        } as any),
      );
      service.fetchProfile();

      expect(service.isContentCreator()).toBe(true);
    });
  });

  describe('isContentCreator$', () => {
    it('should return an observable of true if the user has the content creator role', (done) => {
      usersV2ApiMock.userInfo.mockReturnValue(
        of({
          ...mockUserProfile,
          roles: [mockContentRole],
        } as any),
      );
      service.fetchProfile();

      service.isContentCreator$().subscribe((isContentCreator) => {
        expect(isContentCreator).toBe(true);
        done();
      });
    });

    it('should return an observable of false if the user has not the content creator role', (done) => {
      usersV2ApiMock.userInfo.mockReturnValue(
        of({
          ...mockUserProfile,
          roles: [mockUserRole],
        } as any),
      );
      service.fetchProfile();

      service.isContentCreator$().subscribe((isContentCreator) => {
        expect(isContentCreator).toBe(false);
        done();
      });
    });
  });

  describe('isCurator', () => {
    it('should return true if the user has the curator role', () => {
      usersV2ApiMock.userInfo.mockReturnValue(
        of({
          ...mockUserProfile,
          roles: [mockCuratorRole],
        } as any),
      );
      service.fetchProfile();

      expect(service.isCurator()).toBe(true);
    });
  });

  describe('isCurator$', () => {
    it('should return an observable of true if the user has the curator role', (done) => {
      usersV2ApiMock.userInfo.mockReturnValue(
        of({
          ...mockUserProfile,
          roles: [mockCuratorRole],
        } as any),
      );
      service.fetchProfile();

      service.isCurator$().subscribe((isCurator) => {
        expect(isCurator).toBe(true);
        done();
      });
    });

    it('should return an observable of false if the user has not the curator role', (done) => {
      usersV2ApiMock.userInfo.mockReturnValue(
        of({
          ...mockUserProfile,
          roles: [mockUserRole],
        } as any),
      );
      service.fetchProfile();

      service.isCurator$().subscribe((isCurator) => {
        expect(isCurator).toBe(false);
        done();
      });
    });
  });

  describe('hasRequiredRoles', () => {
    it('should return true if the user has all provided roles', () => {
      service.fetchProfile();

      const requiredRoles = ['admin', 'super_admin'];

      expect(service.hasRequiredRoles(requiredRoles)).toBe(true);
    });

    it('should return false if the user does not have all provided roles', () => {
      service.fetchProfile();

      const requiredRoles = ['admin', 'super_admin', 'mock_missing_role'];

      expect(service.hasRequiredRoles(requiredRoles)).toBe(false);
    });
  });

  describe('getUserLocale', () => {
    it('should return the userLocale', () => {
      const locale = service.getUserLocale();

      expect(locale).toBe(mockLocale);
    });

    it('should return the default locale', () => {
      keycloakMock.idTokenParsed = undefined;

      const locale = service.getUserLocale();

      expect(locale).toBe('pt-BR');
    });
  });

  describe('uploadAvatar', () => {
    it('should upload avatar image and update user profile with the returned URL', () => {
      const mockFile = new File([''], 'avatar.png', { type: 'image/png' });
      const mockAvatarUrl = 'https://example.com/avatar.png';
      const mockUpdatedUser = { ...mockUserProfile, avatar: mockAvatarUrl } as UserProfile;

      jest.spyOn(service, 'getProfile').mockReturnValue(mockUserProfile as UserProfile);
      myAccV2ApiMock.postFormData.mockReturnValue(of({ url: mockAvatarUrl }));
      myAccV2ApiMock.patch.mockReturnValue(of(mockUpdatedUser));

      service.uploadAvatar(mockFile);

      expect(myAccV2ApiMock.postFormData).toHaveBeenCalledWith('/user-avatar', expect.any(FormData));
      expect(myAccV2ApiMock.patch).toHaveBeenCalledWith(`/users/${mockUserId}`, { avatar: mockAvatarUrl });
    });
  });
});
