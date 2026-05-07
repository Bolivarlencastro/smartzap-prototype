import { NavigationService } from './navigation.service';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Subject } from 'rxjs';
import { NAVIGATION_ITEMS } from './navigation-items';

describe('NavigationService', () => {
  let service: NavigationService;
  let rolesSubject: Subject<string[]>;
  let userProfileServiceMock: jest.Mocked<UserProfileService>;

  beforeEach(() => {
    rolesSubject = new Subject();
    userProfileServiceMock = {
      roles$: rolesSubject.asObservable(),
      getApplicationRoles: jest.fn().mockReturnValue(['user']),
      hasRoles: jest.fn(),
    } as unknown as jest.Mocked<UserProfileService>;
    service = new NavigationService(NAVIGATION_ITEMS, userProfileServiceMock);
  });

  it('should update the items visibility after user login', () => {
    rolesSubject.next(['mock_roles']);
    expect(service.getHiddenItemsIds()).toEqual([
      'workspace',
      'users',
      'profile',
      'backoffice',
      'activity-log',
      'tools-hub',
    ]);
  });

  it('should display the backoffice item if the user has the manage-users role', () => {
    userProfileServiceMock.hasRoles.mockReturnValueOnce(true);

    rolesSubject.next(['mock_roles']);

    expect(service.getHiddenItemsIds()).toEqual(expect.not.arrayContaining(['backoffice']));
  });
});
