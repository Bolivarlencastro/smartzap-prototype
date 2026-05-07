import { HttpParams } from '@angular/common/http';
import { BatchActionsApi, UsersV2Api } from '@keeps-platform-frontend-workspace/kp-keeps';
import { of } from 'rxjs';
import { ActivityLogService } from './activity-log.service';

describe('ActivityLogService', () => {
  let service: ActivityLogService;
  let mockUsersApi: jest.Mocked<UsersV2Api>;
  let mockBatchActionsApi: jest.Mocked<BatchActionsApi>;

  beforeEach(() => {
    mockUsersApi = {
      fetchByQuery: jest.fn().mockReturnValue(
        of({
          data: [{ id: '123', name: 'User 1' }],
        }),
      ),
    } as unknown as jest.Mocked<UsersV2Api>;

    mockBatchActionsApi = {
      getActions: jest.fn().mockReturnValue(of({ items: [] })),
      exportLog: jest.fn().mockReturnValue(of({ url: 'hhtps://something.com' })),
    } as unknown as jest.Mocked<BatchActionsApi>;

    service = new ActivityLogService(mockUsersApi, mockBatchActionsApi);
  });

  it('should call getActions to get activity log data', (done) => {
    const filter = { page: 1, perPage: 10 };
    const expectedParams = new HttpParams()
      .append('page', 1)
      .append('perPage', 10)
      .append('actionKeys', 'MYACCOUNT.INVITE_USERS')
      .append('actionKeys', 'MYACCOUNT.UPDATE_USERS_STATUS');

    service.getData(filter).subscribe(() => {
      expect(mockBatchActionsApi.getActions).toHaveBeenCalledWith(expectedParams);
      done();
    });
  });

  it('should call fetchByQuery to fill users filter', (done) => {
    service.getUsers().subscribe((result) => {
      expect(mockUsersApi.fetchByQuery).toHaveBeenCalledWith({
        limit: 999,
        sortBy: 'name:ASC',
        'filter.roles.role.id': `$in:77e3a833-94b5-4c37-891d-988513eabb67,e67234f4-957b-483d-badc-2fbcd6cd4173`,
      });
      expect(result).toEqual([{ value: '123', label: 'User 1' }]);
      done();
    });
  });

  it('should call exportLog to download the report', (done) => {
    const id = '777';
    const openSpy = (window.open = jest.fn());

    service.exportLog(id).subscribe((result) => {
      expect(mockBatchActionsApi.exportLog).toHaveBeenCalledWith(id);
      expect(openSpy).toHaveBeenCalledWith(result.url, '_blank');
      done();
    });
  });
});
