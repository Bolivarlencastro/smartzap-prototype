import { of } from 'rxjs';

import { ApplicationsApi } from './applications.api';
import { MyAccountV2Client } from './my-account-v2.client';

describe('MyAccountApi', () => {
  let service: ApplicationsApi;
  let myAccountClientV2Mock: jest.Mocked<MyAccountV2Client>;

  beforeEach(() => {
    myAccountClientV2Mock = { get: jest.fn().mockReturnValue(of([])) } as any;
    service = new ApplicationsApi(myAccountClientV2Mock);
  });

  it('retrieve the applications with roles', (done) => {
    service.getApplicationsWithRoles().subscribe(() => {
      expect(myAccountClientV2Mock.get).toHaveBeenCalledWith(
        '/applications/workspace-applications',
        null,
        false,
        false,
        null,
      );
      done();
    });
  });

  it('should retrieve the applications with roles for another workspace', (done) => {
    const mockWorkspaceId = 'mock_workspace_id';

    service.getApplicationsWithRoles(mockWorkspaceId).subscribe(() => {
      expect(myAccountClientV2Mock.get).toHaveBeenCalledWith(
        '/applications/workspace-applications',
        null,
        false,
        false,
        { 'x-client': mockWorkspaceId },
      );

      done();
    });
  });

  it('should filter the GameUP application from the response', (done) => {
    myAccountClientV2Mock.get.mockReturnValueOnce(
      of([
        { id: 'gameup', name: 'GameUP' },
        { id: 'my-account', name: 'My Account' },
      ]),
    );

    service.getApplicationsWithRoles().subscribe((result) => {
      expect(result).toEqual([{ id: 'my-account', name: 'My Account' }]);

      done();
    });
  });
});
