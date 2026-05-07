const mockFeatureFlags = { 'push-manager': false };
jest.mock('environments/environment', () => ({
  environment: { featureFlags: mockFeatureFlags },
}));

import { TestBed } from '@angular/core/testing';
import { Service, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KEEPS_NAVIGATION_ITEMS, KeepsNavigationItem } from '@keeps-platform-frontend-workspace/layout';
import { Subject } from 'rxjs';
import { NavigationService } from './navigation.service';

const mockNavigationItems: KeepsNavigationItem[] = [
  { id: 'courses', type: 'basic' },
  { id: 'users', type: 'basic' },
  { id: 'settings', type: 'basic' },
  { id: 'push-manager', type: 'basic' },
];

describe('NavigationService', () => {
  let service: NavigationService;
  let workspaceServicesSubject: Subject<Service[]>;

  beforeEach(() => {
    workspaceServicesSubject = new Subject<Service[]>();

    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: KEEPS_NAVIGATION_ITEMS, useValue: mockNavigationItems },
        { provide: WorkspaceService, useValue: { workspaceServices$: workspaceServicesSubject.asObservable() } },
      ],
    });

    service = TestBed.inject(NavigationService);
  });

  const hiddenIds = () =>
    service
      .navigationItems()
      .filter((item) => item.hidden)
      .map((item) => item.id);

  it('should display the items that have enabled feature flags', () => {
    workspaceServicesSubject.next([{ id: 'any-service' } as Service]);
    expect(hiddenIds()).toEqual(['push-manager']);
  });
});
