import { MyAccountV2API } from 'app/shared/api/myaccount-v2.api';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { UsersServiceV2 } from './users-v2.service';
import { EMPTY, of, throwError } from 'rxjs';
import { Chance } from 'chance';
import { TranslocoService } from '@jsverse/transloco';
import { JobManagementService } from 'app/shared/services/job-management.service';
import { EmployeeInfosApi } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('UsersV2Service', () => {
  let myAccountApiStub: jest.Mocked<MyAccountV2API>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  const translateServiceMock: jest.Mocked<TranslocoService> = {} as unknown as jest.Mocked<TranslocoService>;
  const jobManagementServiceMock: jest.Mocked<JobManagementService> =
    {} as unknown as jest.Mocked<JobManagementService>;
  const employeeInfosApiMock: jest.Mocked<EmployeeInfosApi> = {} as unknown as jest.Mocked<EmployeeInfosApi>;

  let service: UsersServiceV2;
  const chance = new Chance();

  beforeEach(() => {
    myAccountApiStub = {
      get: jest.fn().mockReturnValue(of(EMPTY)),
      patch: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<MyAccountV2API>;
    messageServiceMock = { error: jest.fn(), success: jest.fn() } as unknown as jest.Mocked<KpMessageService>;

    service = new UsersServiceV2(
      myAccountApiStub,
      messageServiceMock,
      translateServiceMock,
      jobManagementServiceMock,
      employeeInfosApiMock,
    );
  });

  it('should display an error message on failure', (done) => {
    myAccountApiStub.get.mockReturnValueOnce(throwError(() => ''));

    service
      .fetchWorkspaceUsers({
        pageEvent: { pageIndex: 0, pageSize: 0, length: 0 },
        search: '',
        sort: undefined,
      })
      .subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith(`COULD_NOT_LOAD_USERS`);
          done();
        },
      });
  });

  describe('updateUserStatus', () => {
    const userId = chance.guid();
    const newStatus = true;

    it('should update an user status', (done) => {
      service.updateUserStatus(userId, newStatus).subscribe(() => {
        expect(myAccountApiStub.patch).toHaveBeenCalledWith(`/users/${userId}/update-status`, { status: newStatus });
        expect(messageServiceMock.success).toHaveBeenCalledWith('USERS.UPDATED_SUCCESS');
        done();
      });
    });
  });
});
