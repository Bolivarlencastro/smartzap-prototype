import { ApplicationsApi, ApplicationWithRoles, UsersApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of } from 'rxjs';
import { UserRolesService } from './user-roles.service';
import { Chance } from 'chance';

const applicationsWithRoles = [
  { name: 'Konquest' },
  { name: 'Smartzap' },
  { name: 'Learn Analytics' },
  { name: 'My Account' },
  { name: 'GameUP' },
] as ApplicationWithRoles[];

describe('UserRolesService', () => {
  let service: UserRolesService;
  let mockApplicationsApi: jest.Mocked<ApplicationsApi>;
  let mockUsersApi: jest.Mocked<UsersApi>;
  const chance = new Chance();

  beforeEach(() => {
    mockUsersApi = {
      getUserApplicationRoles: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<UsersApi>;

    mockApplicationsApi = {
      getApplicationsWithRoles: jest.fn().mockReturnValue(of(applicationsWithRoles)),
    } as unknown as jest.Mocked<ApplicationsApi>;

    service = new UserRolesService(mockApplicationsApi, mockUsersApi);
  });

  it('should get user application roles', (done) => {
    const userId = chance.guid();
    service.getUserRoles(userId).subscribe(() => {
      expect(mockUsersApi.getUserApplicationRoles).toHaveBeenCalledWith(userId);
      done();
    });
  });
});
