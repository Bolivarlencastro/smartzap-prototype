import { Inject, Injectable } from '@angular/core';
import {
  AbstractNavigationService,
  KEEPS_NAVIGATION_ITEMS,
  KeepsNavigationItem,
} from '@keeps-platform-frontend-workspace/layout';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { filter } from 'rxjs';

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
      const userRoles = this.userProfileService.getApplicationRoles();
      const canManageUsers = this.userProfileService.hasRoles(['manage-users']);
      if (canManageUsers) {
        userRoles.push('manage-users');
      }
      this.userRoles = userRoles;
      this.updateAllItemsVisibility();
    });
  }
}
