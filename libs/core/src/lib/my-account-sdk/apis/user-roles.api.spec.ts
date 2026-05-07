import { UserRolesApi } from './user-roles-api';
import { MyAccountV2Client } from './my-account-v2.client';
import { EMPTY, of } from 'rxjs';

describe('UserRolesApi', () => {
  let service: UserRolesApi;
  let myAccountClientMock: jest.Mocked<MyAccountV2Client>;

  beforeEach(() => {
    myAccountClientMock = { get: jest.fn().mockReturnValue(of(EMPTY)) } as any;
    service = new UserRolesApi(myAccountClientMock);
  });

  describe('findUsersByRoleId', () => {
    it('should call get on the myAccount client', (done) => {
      service.findUsersByRoleId('mock_id').subscribe({
        next: () => {
          expect(myAccountClientMock.get).toHaveBeenCalledWith('/users-roles', { roleId: 'mock_id' });
          done();
        },
      });
    });
  });
});
