import { EMPTY, of } from 'rxjs';
import { UserProfile } from '../models';

import { UsersApi } from './users.api';
import { MyAccountV2Client } from './my-account-v2.client';

describe('UsersApi', () => {
  let service: UsersApi;
  let myAccountV2Api: jest.Mocked<MyAccountV2Client>;

  beforeEach(() => {
    myAccountV2Api = { get: jest.fn(), patch: jest.fn().mockReturnValue(of(EMPTY)) } as any;
    service = new UsersApi(myAccountV2Api);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchProfile', () => {
    it('should call get on the myAccountClient using the provided userId', () => {
      const expectedPath = `/users/info`;

      service.fetchProfile();

      expect(myAccountV2Api.get).toHaveBeenCalledWith(expectedPath);
    });
  });

  describe('updateProfile', () => {
    it('should call patch on the myAccountClient using the provided userId and profile', () => {
      const mockId = 'mock_id';
      const mockUserProfile: UserProfile = { id: mockId, name: '' } as any;

      service.updateProfile(mockId, mockUserProfile);
      const expectedPath = `/users/${mockId}`;

      expect(myAccountV2Api.patch).toHaveBeenCalledWith(expectedPath, mockUserProfile);
    });
  });
});
