import { EMPTY, of } from 'rxjs';
import { SmartzapConfiguration, SmartzapConfigurationResponse, Workspace } from '../models';
import { WorkspaceApi } from './workspace-api';
import { MyAccountV2Client } from './my-account-v2.client';

describe('WorkspaceApiTsService', () => {
  let service: WorkspaceApi;
  let myAccountV2ClientMock: jest.Mocked<MyAccountV2Client>;

  beforeEach(() => {
    myAccountV2ClientMock = {
      patch: jest.fn().mockReturnValue(of(EMPTY)),
      get: jest.fn().mockReturnValue(of(EMPTY)),
    } as any;
    service = new WorkspaceApi(myAccountV2ClientMock);
  });

  describe('updateWorkspace', () => {
    it('should call patch on the myAccountClient', () => {
      const mockWorkspace: Partial<Workspace> = { notify_slack: true, notify_teams: true };

      service.updateWorkspace('mock_id', mockWorkspace);

      expect(myAccountV2ClientMock.patch).toHaveBeenCalledWith('/workspaces/mock_id', mockWorkspace);
    });
  });

  describe('missionListingConfig', () => {
    it('should call get for mission listing config', () => {
      service.getMissionListingConfig();
      expect(myAccountV2ClientMock.get).toHaveBeenCalledWith('/workspaces-filter-settings');
    });

    it('should call patch for mission listing config', () => {
      const mock_id = 'mock_config_id';
      service.updateMissionListingConfig(mock_id, true);
      expect(myAccountV2ClientMock.patch).toHaveBeenCalledWith(`/workspaces-filter-settings/${mock_id}/toggle-status`, {
        isEnabled: true,
      });
    });
  });

  describe('getWorkspaces', () => {
    it('should fetch the workspaces with the correct parameters', () => {
      const expectedParams = {
        select:
          'id,name,logoUrl,iconUrl,hashId,themeDark,customColor,logoutUrl,notifyTeams,notifySlack,defaultFederatedIdentityProviderAlias',
        'filter.serviceWorkspaces.status': true,
      };

      service.getWorkspaces();
      expect(myAccountV2ClientMock.get).toHaveBeenCalledWith('/workspaces', expectedParams);
    });

    it('should filter by application id', () => {
      const applicationId = 'mock_applicationId';
      const expectedParams = {
        select:
          'id,name,logoUrl,iconUrl,hashId,themeDark,customColor,logoutUrl,notifyTeams,notifySlack,defaultFederatedIdentityProviderAlias',
        'filter.serviceWorkspaces.status': true,
        'filter.userRoleWorkspaces.role.applicationId': `$eq:${applicationId}`,
      };

      service.getWorkspaces(applicationId);
      expect(myAccountV2ClientMock.get).toHaveBeenCalledWith('/workspaces', expectedParams);
    });
  });

  describe('getAdminWorkspaces', () => {
    it('should fetch the admin workspaces with the correct parameters', () => {
      const expectedParams = {
        select: 'id,name',
        'filter.serviceWorkspaces.status': true,
        'filter.userRoleWorkspaces.role.id': '77e3a833-94b5-4c37-891d-988513eabb67',
      };

      service.getAdminWorkspaces();

      expect(myAccountV2ClientMock.get).toHaveBeenCalledWith('/workspaces', expectedParams);
    });
  });

  describe('getWorkspacesWithQuery', () => {
    it('should fetch the workspaces with the provided query parameters', () => {
      const query = {
        'filter.name': '$ilike:test',
        limit: '10',
      };

      service.getWorkspacesWithQuery(query);

      expect(myAccountV2ClientMock.get).toHaveBeenCalledWith('/workspaces', query);
    });
  });

  describe('updateUserTokenExpiration', () => {
    it('should call patch with user_token_expiration payload', () => {
      const workspaceId = 'mock_workspace_id';
      const user_token_expiration = 20;
      const mockWorkspace = { id: workspaceId, user_token_expiration } as unknown as Workspace;
      myAccountV2ClientMock.patch.mockReturnValue(of(mockWorkspace));

      service.updateUserTokenExpiration(user_token_expiration, workspaceId).subscribe();

      expect(myAccountV2ClientMock.patch).toHaveBeenCalledWith(`/workspaces/${workspaceId}`, { user_token_expiration });
    });
  });

  describe('updateSmartzapConfiguration', () => {
    const workspaceId = 'mock_workspace_id';
    const mockResponse: SmartzapConfigurationResponse = {
      messages_content_embed: false,
      send_courses_recommendation_message: false,
      send_course_reminder_message: true,
      interact_with_random_messages: false,
      enrollment_idle_days_limit: 17,
      courses_portal_url: 'https://www.something.com',
    };
    const expectedConfiguration: SmartzapConfiguration = {
      messagesContentEmbed: false,
      sendCoursesRecommendationMessage: false,
      sendCourseReminderMessage: true,
      interactWithRandomMessages: false,
      enrollmentIdleDaysLimit: 17,
      coursesPortalUrl: 'https://www.something.com',
    };

    it('should call patch with the correct URL and payload', () => {
      myAccountV2ClientMock.patch.mockReturnValue(of(mockResponse));
      const config: SmartzapConfiguration = { ...expectedConfiguration };

      service.updateSmartzapConfiguration(config, workspaceId).subscribe();

      expect(myAccountV2ClientMock.patch).toHaveBeenCalledWith(
        `/workspaces/${workspaceId}/smartzap-configuration`,
        expect.objectContaining({
          enrollmentIdleDaysLimit: 17,
          coursesPortalUrl: 'https://www.something.com',
        }),
      );
    });

    it('should convert empty coursesPortalUrl to null', () => {
      myAccountV2ClientMock.patch.mockReturnValue(of(mockResponse));
      const config: SmartzapConfiguration = { ...expectedConfiguration, coursesPortalUrl: '' };

      service.updateSmartzapConfiguration(config, workspaceId).subscribe();

      expect(myAccountV2ClientMock.patch).toHaveBeenCalledWith(
        `/workspaces/${workspaceId}/smartzap-configuration`,
        expect.objectContaining({ coursesPortalUrl: null }),
      );
    });

    it('should map the snake_case response to camelCase SmartzapConfiguration', (done) => {
      myAccountV2ClientMock.patch.mockReturnValue(of(mockResponse));
      const config: SmartzapConfiguration = { ...expectedConfiguration };

      service.updateSmartzapConfiguration(config, workspaceId).subscribe((result) => {
        expect(result).toEqual(expectedConfiguration);
        done();
      });
    });
  });

  describe('fetchSmartzapConfiguration', () => {
    const workspaceId = 'mock_workspace_id';
    const mockResponse: SmartzapConfigurationResponse = {
      messages_content_embed: true,
      send_courses_recommendation_message: false,
      send_course_reminder_message: true,
      interact_with_random_messages: false,
      enrollment_idle_days_limit: 7,
      courses_portal_url: 'https://portal.example.com',
    };
    const expectedConfiguration: SmartzapConfiguration = {
      messagesContentEmbed: true,
      sendCoursesRecommendationMessage: false,
      sendCourseReminderMessage: true,
      interactWithRandomMessages: false,
      enrollmentIdleDaysLimit: 7,
      coursesPortalUrl: 'https://portal.example.com',
    };

    it('should call get with the correct URL', () => {
      myAccountV2ClientMock.get.mockReturnValue(of(mockResponse));

      service.fetchSmartzapConfiguration(workspaceId).subscribe();

      expect(myAccountV2ClientMock.get).toHaveBeenCalledWith(`/workspaces/${workspaceId}/smartzap-configuration`);
    });

    it('should map the snake_case response to camelCase SmartzapConfiguration', (done) => {
      myAccountV2ClientMock.get.mockReturnValue(of(mockResponse));

      service.fetchSmartzapConfiguration(workspaceId).subscribe((result) => {
        expect(result).toEqual(expectedConfiguration);
        done();
      });
    });
  });
});
