import { NavigationService } from './navigation.service';
import { Subject } from 'rxjs';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { NAVIGATION_ITEMS } from 'app/shared/navigation/navigation-items';

describe('NavigationService', () => {
  let service: NavigationService;
  let rolesSubject: Subject<string[]>;
  let userProfileServiceMock: jest.Mocked<UserProfileService>;

  beforeEach(() => {
    rolesSubject = new Subject();
    userProfileServiceMock = {
      roles$: rolesSubject.asObservable(),
      getApplicationRoles: jest.fn().mockReturnValue(['user']),
      hasRoles: jest.fn(() => false),
    } as unknown as jest.Mocked<UserProfileService>;
    service = new NavigationService(NAVIGATION_ITEMS, userProfileServiceMock);
  });

  it('should update the user-dashboard item title if the user is not an analytics admin', () => {
    rolesSubject.next(['mock_roles']);
    const item = service.getNavigationItemById(service.currentNavigationItems, 'user-dashboard');
    expect(item.title).toBe('NAVIGATION.MY_DASHBOARD');
  });
});
