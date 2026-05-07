const mockFeatureFlags = { mission: false };
jest.mock('environments/environment', () => ({
  environment: { featureFlags: mockFeatureFlags, apps: { konquest: { id: '123' } } },
}));

import { TestBed } from '@angular/core/testing';
import { NavigationService } from './navigation.service';
import { Subject } from 'rxjs';
import { Service, UserProfileService, UserRoleV2, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KEEPS_NAVIGATION_ITEMS, KeepsNavigationItem } from '@keeps-platform-frontend-workspace/layout';

const mockNavigationItems: KeepsNavigationItem[] = [
  {
    id: 'dashboard',
    type: 'basic',
    servicesIds: ['0d3752f0-15d7-402a-8628-04ed47bcbf43'],
  },
  {
    id: 'learning-trail',
    type: 'basic',
    roles: ['admin'],
  },
  {
    id: 'mission',
    type: 'basic',
  },
];

describe('NavigationService', () => {
  let service: NavigationService;
  let rolesSubject: Subject<UserRoleV2[]>;
  let workspaceServicesSubject: Subject<Service[]>;

  beforeEach(() => {
    rolesSubject = new Subject();
    workspaceServicesSubject = new Subject<Service[]>();

    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: KEEPS_NAVIGATION_ITEMS, useValue: mockNavigationItems },
        { provide: UserProfileService, useValue: { roles$: rolesSubject.asObservable() } },
        { provide: WorkspaceService, useValue: { workspaceServices$: workspaceServicesSubject.asObservable() } },
      ],
    });

    service = TestBed.inject(NavigationService);
  });

  const emitChanges = (roleKey: string, serviceIds: string[]) => {
    rolesSubject.next([{ application_id: '123', key: roleKey } as UserRoleV2]);
    workspaceServicesSubject.next(serviceIds.map((id) => ({ id }) as Service));
  };

  const hiddenIds = () =>
    service
      .navigationItems()
      .filter((item) => item.hidden)
      .map((item) => item.id);

  it('should hide items the user has no roles to access', () => {
    emitChanges('mock_role', ['some-other-service']);
    expect(hiddenIds()).toEqual(['dashboard', 'learning-trail', 'mission']);
  });

  it('should display the items that the workspace has as active services', () => {
    const dashboardServiceId = '0d3752f0-15d7-402a-8628-04ed47bcbf43';
    emitChanges('mock_role', [dashboardServiceId]);
    expect(hiddenIds()).toEqual(['learning-trail', 'mission']);
  });

  it('should display the items that have enabled feature flags', () => {
    mockFeatureFlags.mission = true;
    emitChanges('mock_role', ['some-other-service']);
    expect(hiddenIds()).toEqual(['dashboard', 'learning-trail']);
  });
});
