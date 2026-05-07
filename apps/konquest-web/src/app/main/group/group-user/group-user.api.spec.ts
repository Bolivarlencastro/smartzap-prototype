import { KonquestAPI } from '@core/api/base';
import { EnrollmentType } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { EMPTY, of } from 'rxjs';
import { GroupUserAPI } from './group-user.api';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

const konquestAPIMock: jest.Mocked<KonquestAPI> = {
  post: jest.fn(() => of(EMPTY)),
  get: jest.fn(),
  delete: jest.fn(),
} as unknown as jest.Mocked<KonquestAPI>;

const messageServiceMock: jest.Mocked<KpMessageService> = {
  error: jest.fn(),
} as unknown as jest.Mocked<KpMessageService>;

const URL = '/groups';

describe('GroupUserAPI', () => {
  let service: GroupUserAPI;

  beforeEach(() => {
    service = new GroupUserAPI(konquestAPIMock, messageServiceMock);
  });

  it('should fetch user group', () => {
    const groupId = '123';
    const queryParams = { page: 1, per_page: 15, search: 'test', ordering: 'job' };
    service.fetchByQuery(groupId, queryParams);
    expect(konquestAPIMock.get).toHaveBeenCalledWith(`${URL}/${groupId}/users`, {
      ...queryParams,
    });
  });

  it('should add many users in the group', () => {
    const payload = {
      groupId: '123',
      userIds: ['1', '2', '3'],
      enrollment: { date: '01/01/2024', enrollmentType: EnrollmentType.FREE, cycle: { id: 'mock_cycle_id' } as any },
    };
    service.addMany(payload);
    expect(konquestAPIMock.post).toHaveBeenCalledWith(`${URL}/${payload.groupId}/users`, {
      users: payload.userIds,
      enrollment_goal_date: payload.enrollment.date,
      enrollment_required_mission: false,
      regulatory_compliance_cycle_id: 'mock_cycle_id',
    });
  });

  describe('deleteUser', () => {
    const cases: any[] = [
      [{ groupId: '123', userId: '1', removeEnrollments: false }, null],
      [{ groupId: '123', userId: '1', removeEnrollments: true }, 'True'],
    ];

    test.each(cases)('for this configuration " %p " should return this: %p', (data, expectedValue) => {
      service.delete(data.groupId, data.userId, data.removeEnrollments);
      expect(konquestAPIMock.delete).toHaveBeenCalledWith(`${URL}/${data.groupId}/users/${data.userId}`, {
        delete_enrollment: expectedValue,
      });
    });
  });
});
