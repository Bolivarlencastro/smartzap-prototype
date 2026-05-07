import { AluraIntegrationsApi } from './alura-integrations.api';
import { AluraIntegrationClient } from './alura-integration.client';
import { EMPTY, of } from 'rxjs';
import { CoursesListFilter, IntegrationTokensDto, UpdateActiveStatusBatchDto } from '../models';
import { UserProfileService } from '../../services';
import { UserProfile } from '../../my-account-sdk';

describe('AluraIntegrationsApiService', () => {
  let service: AluraIntegrationsApi;
  let http: jest.Mocked<AluraIntegrationClient>;
  let userProfileServiceMock: jest.Mocked<UserProfileService>;

  beforeEach(() => {
    http = {
      get: jest.fn().mockReturnValue(of(EMPTY)),
      post: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<AluraIntegrationClient>;
    userProfileServiceMock = { getProfile: jest.fn() } as unknown as jest.Mocked<UserProfileService>;
    service = new AluraIntegrationsApi(http, userProfileServiceMock);
  });

  it('should fetch the mirrored courses with the provided filter and correct endpoint', () => {
    const mockFilter: CoursesListFilter = { name: 'mock_filter' };
    service.getMirroredCourses(mockFilter);

    expect(http.get).toHaveBeenCalledWith('/mirrored-courses', mockFilter);
  });

  it('should fetch the workspace tokens', () => {
    service.getWorkspaceTokens();

    expect(http.get).toHaveBeenCalledWith('/tokens/workspace');
  });

  it('should validate an integration token', () => {
    service.validateIntegrationToken('sso', 'mock_token');

    expect(http.post).toHaveBeenCalledWith('/integrations/sso/validate', { token: 'mock_token' });
  });

  it('should save the integration tokens', () => {
    const mockPayload = { sso: 'mock_token' } as IntegrationTokensDto;
    service.saveTokens(mockPayload);

    expect(http.post).toHaveBeenCalledWith('/tokens/workspace', mockPayload);
  });

  it('should batch disable mirrored courses', () => {
    const mockIds = ['mock_id_1', 'mock_id_2'];
    const payload: UpdateActiveStatusBatchDto = { courseIds: mockIds, isActive: true };
    service.batchUpdateActiveStatus(payload);
    expect(http.post).toHaveBeenCalledWith('/mirrored-courses/batch-update-active-status', payload);
  });

  it('should batch delete mirrored courses', () => {
    const mockIds = ['mock_id_1', 'mock_id_2'];
    service.batchDeleteCourses(mockIds);
    expect(http.post).toHaveBeenCalledWith('/mirrored-courses/delete-batch', { ids: mockIds });
  });

  it('should retrieve the access url for a course', () => {
    const email = 'mock_email';
    const missionIdStub = 'mission_id';

    userProfileServiceMock.getProfile.mockReturnValueOnce({ email } as UserProfile);

    service.getAccessUrlByMissionId(missionIdStub);
    expect(http.get).toHaveBeenCalledWith(`/courses/${missionIdStub}/sso-link/${email}`);
  });
});
