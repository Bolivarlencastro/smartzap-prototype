import { inject, Injectable } from '@angular/core';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { AbstractNavigationService, KEEPS_NAVIGATION_ITEMS } from '@keeps-platform-frontend-workspace/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from 'environments/environment';
import { filter } from 'rxjs';

@Injectable()
export class NavigationService extends AbstractNavigationService {
  private workspaceServices: string[] = [];
  private readonly workspaceService = inject(WorkspaceService);

  constructor() {
    super(inject(KEEPS_NAVIGATION_ITEMS));
    this.checkOnWorkspaceChange();
  }

  protected override getHiddenItemsIds(): string[] {
    const navigationItems = this.currentNavigationItems;
    const itemsHiddenByFeatureFlag = this.getHiddenItemsIdsByFeatureFlags(navigationItems, environment.featureFlags);
    const itemsHiddenByServiceNotFound = this.getHiddenItemsIdsByService(navigationItems, this.workspaceServices);

    return [...itemsHiddenByServiceNotFound, ...itemsHiddenByFeatureFlag];
  }

  private checkOnWorkspaceChange() {
    this.workspaceService.workspaceServices$
      .pipe(
        filter((services) => services?.length > 0),
        takeUntilDestroyed(),
      )
      .subscribe((services) => {
        this.workspaceServices = services.map((service) => service.id);
        this.updateAllItemsVisibility();
      });
  }
}
