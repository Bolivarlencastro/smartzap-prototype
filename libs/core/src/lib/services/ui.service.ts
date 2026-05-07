import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { CORE_CONFIG, CoreConfig } from '../core-config';
import { UserApplication, UserRoleV2 } from '../my-account-sdk';
import { UserProfileService } from './user-profile.service';
import { WorkspaceService } from './workspace.service';
import { ThemingService } from './theming/theming.service';

interface KeepsApp extends UserApplication {
  productionUrl: string;
  url: string;
  icon: string;
}

export const KONQUEST_APP: Readonly<KeepsApp> = {
  id: '0abf08ea-d252-4d7c-ab45-ab3f9135c288',
  url: 'https://konquest-stage.keepsdev.com/',
  productionUrl: 'https://konquest.keepsdev.com/',
  icon: 'personal_video',
  name: 'Konquest',
};
export const MY_ACCOUNT_APP: Readonly<KeepsApp> = {
  id: 'ad7e5ad2-1552-43ab-a471-710954f0e66a',
  url: 'https://myaccount-stage.keepsdev.com/',
  productionUrl: 'https://myaccount.keepsdev.com/',
  icon: 'assignment_ind',
  name: 'My Account',
};
export const SMARTZAP_ADMIN_APP: Readonly<KeepsApp> = {
  id: '84d6715e-9b75-436d-ad44-b74c5a7f6729',
  url: 'https://smartzap-stage.keepsdev.com/',
  productionUrl: 'https://smartzap.keepsdev.com/',
  icon: 'done_all',
  name: 'Smartzap',
};
export const LEARN_ANALYTICS_APP: Readonly<KeepsApp> = {
  id: 'c2928f23-a5a6-4f59-94a7-7e409cf1d4f4',
  url: 'https://analytics-stage.keepsdev.com/',
  productionUrl: 'https://analytics.keepsdev.com/',
  icon: 'analytics',
  name: 'Learn Analytics',
};

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private readonly KEEPS_APPS: KeepsApp[] = [KONQUEST_APP, MY_ACCOUNT_APP, SMARTZAP_ADMIN_APP, LEARN_ANALYTICS_APP];

  private readonly _userApplications = new BehaviorSubject<KeepsApp[]>([]);
  private readonly _workspaceIconUrl = new BehaviorSubject<string | undefined>(undefined);

  // An observable of the applications the user can access, minus the current one
  readonly userApplications$ = this._userApplications.asObservable();

  readonly workspaceIcon$: Observable<string | undefined> = this._workspaceIconUrl.asObservable();

  constructor(
    private _userProfileService: UserProfileService,
    private _workspaceService: WorkspaceService,
    @Inject(CORE_CONFIG) private _coreConfig: CoreConfig,
    private themingService: ThemingService,
  ) {
    this._userProfileService.roles$.pipe(filter((roles) => !!roles?.length)).subscribe((roles) => {
      const appMenuItems = this.buildApplicationMenu(roles);
      this._userApplications.next(appMenuItems);
    });
    this.registerWorkspaceChangeListener();
  }

  /**
   * Emits a new workspace theme value if the provided is different from the current one
   */
  setWorkspaceIcon(iconUrl: string): void {
    if (!iconUrl) {
      return;
    }

    this._workspaceIconUrl.next(iconUrl);
  }

  private registerWorkspaceChangeListener(): void {
    this._workspaceService.currentWorkspace$
      .pipe(filter((workspace) => !!workspace))
      .subscribe(({ custom_color, theme_dark, icon_url }) => this.updateTheme(custom_color, theme_dark, icon_url));
  }

  private updateTheme(custom_color: string, theme_dark: boolean, icon_url: string): void {
    this.setWorkspaceIcon(icon_url);
    const isAnalytics = this._coreConfig.appId === LEARN_ANALYTICS_APP.id;
    this.themingService.setThemeColor(custom_color, isAnalytics ? false : theme_dark);
  }

  private buildApplicationMenu(roles: UserRoleV2[] | undefined): KeepsApp[] {
    const excludedApps = this.getHiddenAppsIds(roles);
    const isProduction = this._coreConfig.production;

    return (
      this.KEEPS_APPS.slice()
        // Remove excluded apps by id
        .filter((app) => !excludedApps.includes(app.id))
        // Filter apps that the user has access
        .filter((app) => roles?.some((role) => role.application_id === app.id))
        // Map app object to include the URL
        .map((app) => {
          return {
            ...app,
            url: isProduction ? app.productionUrl : app.url,
          };
        })
    );
  }

  private getHiddenAppsIds(roles: UserRoleV2[]): string[] {
    const currentAppId = this._coreConfig.appId;
    const isCurrentAppKonquest = KONQUEST_APP.id === currentAppId;

    if (isCurrentAppKonquest) {
      return [KONQUEST_APP.id, ...this.getAppsHiddenInKonquest(roles)];
    }

    return [currentAppId, MY_ACCOUNT_APP.id];
  }

  private getAppsHiddenInKonquest(roles: UserRoleV2[]) {
    // Show all apps for users with the Keeps Admin role
    if (this._userProfileService.isKeepsAdmin()) {
      return [];
    }

    const canAccessMyAccount = this.canAccessMyAccount(roles);
    const canAccessSmartZapAdmin = this.canAccessSmartZap(roles);
    const canAccessAnalytics = this.canAccessAnalytics(roles);
    const excludedApps: string[] = [];

    if (!canAccessMyAccount) {
      excludedApps.push(MY_ACCOUNT_APP.id);
    }

    if (!canAccessSmartZapAdmin) {
      excludedApps.push(SMARTZAP_ADMIN_APP.id);
    }

    if (!canAccessAnalytics) {
      excludedApps.push(LEARN_ANALYTICS_APP.id);
    }

    return excludedApps;
  }

  private canAccessMyAccount(roles: UserRoleV2[]): boolean {
    return roles
      .filter((role) => role.application_id === MY_ACCOUNT_APP.id)
      .some((role) => role.key === 'company_admin' || role.key === 'keeps_admin');
  }

  private canAccessSmartZap(roles: UserRoleV2[]): boolean {
    return roles.filter((role) => role.application_id === SMARTZAP_ADMIN_APP.id).some((role) => role.key === 'admin');
  }

  private canAccessAnalytics(roles: UserRoleV2[]): boolean {
    const allowedAccessRoles = ['basic_analytics_leader', 'basic_analytics_admin'];
    return roles
      .filter((role) => role.application_id === LEARN_ANALYTICS_APP.id)
      .some((role) => allowedAccessRoles.includes(role.key));
  }
}
