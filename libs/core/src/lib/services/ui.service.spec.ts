import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CoreConfig } from '../core-config';
import { UserApplication, UserRoleV2, Workspace } from '../my-account-sdk';
import { UiService } from './ui.service';
import { UserProfileService } from './user-profile.service';
import { ThemingService } from './theming/theming.service';

const mockAppId = '0abf08ea-d252-4d7c-ab45-ab3f9135c288';

const mockKonquestApplication: UserApplication = {
  id: mockAppId,
  name: 'Konquest',
};

const mockMyAccountApplication: UserApplication = {
  id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
  name: 'My Account',
};

const mockSmartzap: UserApplication = {
  id: '84d6715e-9b75-436d-ad44-b74c5a7f6729',
  name: 'Smartzap',
};

const mockKonquestSuperAdminRole: UserRoleV2 = {
  id: '',
  role_id: 'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6',
  role_name: 'Konquest Super Admin',
  key: 'super_admin',
  application_id: mockKonquestApplication.id,
  application_name: mockKonquestApplication.name,
  workspace_id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
};
const mockKonquestAdminRole: UserRoleV2 = {
  id: '',
  role_id: '297a88de-c34b-4661-be8a-7090fa9a89e5',
  role_name: 'Konquest Admin',
  application_id: mockKonquestApplication.id,
  application_name: mockKonquestApplication.name,
  key: 'admin',
  workspace_id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
};

const mockSmartZapAdminRole: UserRoleV2 = {
  id: '',
  role_id: '3d010792-7119-4e14-bea3-5258a31f1ddc',
  role_name: 'Smartzap Admin',
  key: 'admin',
  application_id: mockSmartzap.id,
  application_name: mockSmartzap.name,
  workspace_id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
};

const mockMyAccountAdminRole: UserRoleV2 = {
  id: '',
  role_id: '3b16b975-0297-4edf-950b-e3700b0d0d01',
  role_name: 'My Account Admin',
  key: 'account_admin',
  application_id: mockMyAccountApplication.id,
  application_name: mockMyAccountApplication.name,
  workspace_id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
};

describe('UiService', () => {
  let service: UiService;
  let userProfileService: jest.Mocked<UserProfileService>;
  let mockRolesSubject: BehaviorSubject<any[]>;
  let workspaceSubject: Subject<Workspace>;
  let workspaceService: { currentWorkspace$: Observable<Workspace> };
  let themingServiceMock: jest.Mocked<ThemingService>;
  let mockCoreConfig: CoreConfig;

  beforeEach(() => {
    mockRolesSubject = new BehaviorSubject<any>([
      mockKonquestAdminRole,
      mockKonquestSuperAdminRole,
      mockMyAccountAdminRole,
    ]);
    userProfileService = {
      roles$: mockRolesSubject.asObservable(),
      hasRoles: jest.fn(),
      isKeepsAdmin: jest.fn(),
    } as unknown as jest.Mocked<UserProfileService>;

    workspaceSubject = new Subject<Workspace>();
    workspaceService = { currentWorkspace$: workspaceSubject.asObservable() };
    themingServiceMock = { setThemeColor: jest.fn() } as unknown as jest.Mocked<ThemingService>;

    mockCoreConfig = {
      apis: { apiKonquestUrl: '' },
      appId: mockSmartzap.id,
      production: false,
    };

    service = new UiService(userProfileService, workspaceService as any, mockCoreConfig, themingServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit the user applications as an observable, excluding the current', (done) => {
    service.userApplications$.subscribe((apps) => {
      const expectedApps = [
        {
          id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
          url: 'https://konquest-stage.keepsdev.com/',
          productionUrl: 'https://konquest.keepsdev.com/',
          icon: 'personal_video',
          name: 'Konquest',
        },
      ];

      expect(apps).toEqual(expectedApps);
      done();
    });
  });

  it('should emit the user applications as an observable, excluding itself and MyAccount if the current application is Konquest', (done) => {
    mockCoreConfig.appId = mockKonquestApplication.id;
    mockRolesSubject.next([mockKonquestAdminRole, mockKonquestSuperAdminRole, mockSmartZapAdminRole]);
    const expectedApps = [
      {
        id: '84d6715e-9b75-436d-ad44-b74c5a7f6729',
        url: 'https://smartzap-stage.keepsdev.com/',
        productionUrl: 'https://smartzap.keepsdev.com/',
        icon: 'done_all',
        name: 'Smartzap',
      },
    ];

    service.userApplications$.subscribe((apps) => {
      expect(apps).toEqual(expectedApps);
      done();
    });
  });

  it('should set the theme color, scheme and icon when the workspace changes', (done) => {
    const mockWorkspace = {
      custom_color: '#FFFFFF',
      theme_dark: true,
      icon_url: 'mock_icon',
    } as unknown as Workspace;

    workspaceSubject.next(mockWorkspace);

    service.workspaceIcon$.subscribe((icon) => {
      expect(icon).toEqual(mockWorkspace.icon_url);
      expect(themingServiceMock.setThemeColor).toHaveBeenCalledWith(
        mockWorkspace.custom_color,
        mockWorkspace.theme_dark,
      );
      done();
    });
  });
});
