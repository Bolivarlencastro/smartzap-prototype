import { UsersV2Api } from './users-v2.api';
import { MyAccountV2Client } from './my-account-v2.client';
import { EMPTY, of } from 'rxjs';

describe('UsersV2Api', () => {
  let service: UsersV2Api;
  let myAccountApiV2ClientMock: jest.Mocked<MyAccountV2Client>;

  beforeEach(() => {
    myAccountApiV2ClientMock = {
      get: jest.fn(() => of(EMPTY)),
      patch: jest.fn(() => of(EMPTY)),
      delete: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<MyAccountV2Client>;
    service = new UsersV2Api(myAccountApiV2ClientMock);
  });

  it('should fetch users', (done) => {
    service.fetchByQuery({ search: 'mock_search', page: 1 }).subscribe({
      next: () => {
        expect(myAccountApiV2ClientMock.get).toHaveBeenCalledWith('/users', {
          search: 'mock_search',
          page: 1,
          limit: 30,
          sortBy: 'createdDate:DESC',
        });
        done();
      },
    });
  });

  it('should fetch users with basic information', (done) => {
    service.listBasicUsers({ search: 'mock_search', page: 1 }).subscribe({
      next: () => {
        expect(myAccountApiV2ClientMock.get).toHaveBeenCalledWith('/users/basic', {
          search: 'mock_search',
          page: 1,
          limit: 30,
          sortBy: 'createdDate:DESC',
        });
        done();
      },
    });
  });

  it('should get user info', (done) => {
    service.userInfo().subscribe({
      next: () => {
        expect(myAccountApiV2ClientMock.get).toHaveBeenCalledWith('/users/info');
        done();
      },
    });
  });

  it('should get user workspaces', (done) => {
    const userId = 'user-1';
    service.getUserWorkspaces(userId).subscribe({
      next: () => {
        expect(myAccountApiV2ClientMock.get).toHaveBeenCalledWith(`/users/${userId}/workspaces`);
        done();
      },
    });
  });

  describe('application roles', () => {
    const userId = 'user-1';
    const workspaceId = 'ws-123';

    it('should get user application roles without x-client header', (done) => {
      service.getUserApplicationRoles(userId).subscribe({
        next: () => {
          expect(myAccountApiV2ClientMock.get).toHaveBeenCalledWith(`/user-roles/${userId}`, null, null, false, null);
          done();
        },
      });
    });

    it('should get user application roles with x-client header', (done) => {
      service.getUserApplicationRoles(userId, workspaceId).subscribe({
        next: () => {
          expect(myAccountApiV2ClientMock.get).toHaveBeenCalledWith(`/user-roles/${userId}`, null, null, false, {
            'x-client': workspaceId,
          });
          done();
        },
      });
    });

    it('should set user application roles without x-client header', (done) => {
      const roles: any[] = [{ application: 'app', roles: ['ADMIN'] }];
      service.setUserApplicationRoles(userId, roles).subscribe({
        next: () => {
          expect(myAccountApiV2ClientMock.patch).toHaveBeenCalledWith(
            `/user-roles/${userId}`,
            roles,
            null,
            null,
            false,
            null,
          );
          done();
        },
      });
    });

    it('should set user application roles with x-client header', (done) => {
      const roles: any[] = [{ application: 'app', roles: ['ADMIN'] }];
      service.setUserApplicationRoles(userId, roles, workspaceId).subscribe({
        next: () => {
          expect(myAccountApiV2ClientMock.patch).toHaveBeenCalledWith(
            `/user-roles/${userId}`,
            roles,
            null,
            null,
            false,
            { 'x-client': workspaceId },
          );
          done();
        },
      });
    });

    it('should remove user from workspace without x-client header', (done) => {
      service.removeUserFromWorkspace(userId).subscribe({
        next: () => {
          expect(myAccountApiV2ClientMock.delete).toHaveBeenCalledWith(`/user-roles/${userId}`, null, false, null);
          done();
        },
      });
    });

    it('should remove user from workspace with x-client header', (done) => {
      service.removeUserFromWorkspace(userId, workspaceId).subscribe({
        next: () => {
          expect(myAccountApiV2ClientMock.delete).toHaveBeenCalledWith(`/user-roles/${userId}`, null, false, {
            'x-client': workspaceId,
          });
          done();
        },
      });
    });
  });
});
