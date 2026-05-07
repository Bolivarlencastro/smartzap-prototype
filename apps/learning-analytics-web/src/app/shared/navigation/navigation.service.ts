import { Inject, Injectable } from '@angular/core';
import {
  AbstractNavigationService,
  KEEPS_NAVIGATION_ITEMS,
  KeepsNavigationItem,
} from '@keeps-platform-frontend-workspace/layout';
import { filter } from 'rxjs';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable()
export class NavigationService extends AbstractNavigationService {
  private userRoles: string[];

  constructor(
    @Inject(KEEPS_NAVIGATION_ITEMS) navigationItems: KeepsNavigationItem[],
    private userProfileService: UserProfileService,
  ) {
    super(navigationItems);
    this.checkNavigationAfterUserLogin();
  }

  override getHiddenItemsIds(): string[] {
    const navigationItems = this.currentNavigationItems;
    return this.getHiddenItemsIdsByRole(navigationItems, this.userRoles);
  }

  private checkNavigationAfterUserLogin() {
    this.userProfileService.roles$.pipe(filter((roles) => !!roles.length)).subscribe(() => {
      this.userRoles = this.userProfileService.getApplicationRoles();
      const isAnalyticsAdmin = this.userProfileService.hasRoles(['basic_analytics_admin']);
      if (!isAnalyticsAdmin) {
        this.updateItemTitle('user-dashboard', 'NAVIGATION.MY_DASHBOARD');
      }
      this.updateAllItemsVisibility();
    });
  }
}
