import { inject, Injectable } from '@angular/core';
import { AbstractNavigationService, KEEPS_NAVIGATION_ITEMS } from '@keeps-platform-frontend-workspace/layout';
import { UserProfileService, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { combineLatest, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from 'environments/environment';

const CUSTOM_SECTIONS_SERVICE_ID = '8d572fd1-cca9-4979-9e72-f3871ac8ee97';
const SERVICES_TO_HIDE_WHEN_CUSTOM_SECTIONS_ENABLED = ['dashboard', 'learning-trail', 'mission', 'event'];

@Injectable()
export class NavigationService extends AbstractNavigationService {
  private userRoles: string[] = [];
  private workspaceServices: string[] = [];

  private readonly userProfileService = inject(UserProfileService);
  private readonly workspaceService = inject(WorkspaceService);

  constructor() {
    super(inject(KEEPS_NAVIGATION_ITEMS));
    this.checkOnUserOrWorkspaceChange();
  }

  protected override getHiddenItemsIds(): string[] {
    const navigationItems = this.currentNavigationItems;
    const customSectionsEnabled = this.workspaceServices.includes(CUSTOM_SECTIONS_SERVICE_ID);
    const customSectionsHidden = customSectionsEnabled ? SERVICES_TO_HIDE_WHEN_CUSTOM_SECTIONS_ENABLED : [];
    const itemsHiddenByUserRolesNotFound = this.getHiddenItemsIdsByRole(navigationItems, this.userRoles);
    const itemsHiddenByServiceNotFound = this.getHiddenItemsIdsByService(navigationItems, this.workspaceServices);
    const itemsHiddenByFeatureFlag = this.getHiddenItemsIdsByFeatureFlags(navigationItems, environment.featureFlags);
    return [
      ...itemsHiddenByUserRolesNotFound,
      ...itemsHiddenByServiceNotFound,
      ...itemsHiddenByFeatureFlag,
      ...customSectionsHidden,
    ];
  }

  private checkOnUserOrWorkspaceChange() {
    const workspaceServicesChanges = this.workspaceService.workspaceServices$.pipe(
      filter((services) => services?.length > 0),
    );
    const userProfileChanges = this.userProfileService.roles$.pipe(filter((roles) => !!roles.length));
    combineLatest([workspaceServicesChanges, userProfileChanges])
      .pipe(takeUntilDestroyed())
      .subscribe(([services, roles]) => {
        const konquestAppId = environment.apps.konquest.id;
        this.userRoles = roles.filter((role) => role.application_id === konquestAppId).map((role) => role.key);
        this.workspaceServices = services.map((service) => service.id);
        this.updateAllItemsVisibility();
      });
  }
}
