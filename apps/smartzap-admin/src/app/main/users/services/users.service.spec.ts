import { SmartzapAPI } from '@core/api';
import { of } from 'rxjs';

import { UsersService } from './users.service';
import { UserRolesApi } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('UsersService', () => {
  let usersService: UsersService;
  let smartzapApi: SmartzapAPI;
  let usersRolesApi: UserRolesApi;

  beforeEach(() => {
    smartzapApi = {
      get: jest.fn().mockReturnValue(of({})),
      delete: jest.fn().mockReturnValue(of({})),
      patch: jest.fn().mockReturnValue(of({})),
    } as any;
    usersRolesApi = {
      findUsersByRoleId: jest.fn().mockReturnValue(of({ items: [] })),
    } as any;
    usersService = new UsersService(smartzapApi, usersRolesApi);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('fetchUsers', () => {
    it('should request users with default params', (done) => {
      const path = '/user';
      const params = {} as any;
      const expectedParams = {
        page: 1,
        per_page: 10,
      };

      usersService.fetchUsers(params).subscribe(() => {
        expect(smartzapApi.get).toHaveBeenCalledWith(path, expectedParams);
        done();
      });
    });

    it('should request users with pagination params', (done) => {
      const path = '/user';
      const params = {
        page: 1,
        per_page: 10,
        searchTerm: '',
        sort: '',
      };
      const expectedParams = {
        page: params.page,
        per_page: params.per_page,
      };

      usersService.fetchUsers(params).subscribe(() => {
        expect(smartzapApi.get).toHaveBeenCalledWith(path, expectedParams);
        done();
      });
    });

    it('should request users with pagination and search term params', (done) => {
      const path = '/user';
      const params = {
        page: 1,
        per_page: 10,
        searchTerm: 'query',
        sort: '',
      };
      const expectedParams = {
        page: params.page,
        per_page: params.per_page,
        name__ilike: params.searchTerm,
      };

      usersService.fetchUsers(params).subscribe(() => {
        expect(smartzapApi.get).toHaveBeenCalledWith(path, expectedParams);
        done();
      });
    });

    it('should request users with pagination and sort params', (done) => {
      const path = '/user';
      const params = {
        page: 1,
        per_page: 10,
        searchTerm: '',
        sort: 'id:asc',
      };
      const expectedParams = {
        page: params.page,
        per_page: params.per_page,
        sort: params.sort,
      };

      usersService.fetchUsers(params).subscribe(() => {
        expect(smartzapApi.get).toHaveBeenCalledWith(path, expectedParams);
        done();
      });
    });

    it('should request users with filter email', (done) => {
      const path = '/user';
      const params = {
        page: 1,
        per_page: 10,
        searchTerm: 'test@test.com',
        sort: '',
      };
      const expectedParams = {
        page: params.page,
        per_page: params.per_page,
        email__ilike: params.searchTerm,
      };

      usersService.fetchUsers(params).subscribe(() => {
        expect(smartzapApi.get).toHaveBeenCalledWith(path, expectedParams);
        done();
      });
    });

    it('should request users with phone number', (done) => {
      const path = '/user';
      const params = {
        page: 1,
        per_page: 10,
        searchTerm: '55(99) 9 9999-9999',
        sort: '',
      };
      const expectedParams = {
        page: params.page,
        per_page: params.per_page,
        phone__ilike: params.searchTerm.replace(/[-+()\s]/g, ''),
      };

      usersService.fetchUsers(params).subscribe(() => {
        expect(smartzapApi.get).toHaveBeenCalledWith(path, expectedParams);
        done();
      });
    });
  });

  describe('fetchUsersByRoleId', () => {
    it('should request users by role id', (done) => {
      const roleId = 'roleId';

      usersService.fetchUsersByRoleId(roleId).subscribe(() => {
        expect(usersRolesApi.findUsersByRoleId).toHaveBeenCalledWith(roleId);
        done();
      });
    });
  });

  describe('removeUser', () => {
    it('should request remove user', (done) => {
      const userId = 'userId';
      const path = '/user';
      const expectedPath = `${path}/${userId}`;

      usersService.removeUser(userId).subscribe(() => {
        expect(smartzapApi.delete).toHaveBeenCalledWith(expectedPath);
        done();
      });
    });
  });

  describe('updateUser', () => {
    it('should request update user', (done) => {
      const userId = 'userId';
      const userPayload = {
        name: 'name',
        email: 'email',
        phone: 'phone',
        tags: 'tags',
      };
      const path = '/user';
      const expectedPath = `${path}/${userId}`;

      usersService.updateUser(userId, userPayload).subscribe(() => {
        expect(smartzapApi.patch).toHaveBeenCalledWith(expectedPath, userPayload);
        done();
      });
    });
  });
});
