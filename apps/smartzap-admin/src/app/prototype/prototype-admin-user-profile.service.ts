import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  CORE_CONFIG,
  CoreConfig,
  LanguageTypes,
  UserProfile,
  UserProfileService,
  UserRoleV2,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { PrototypeAdminStateService } from './prototype-admin-state.service';

@Injectable()
export class PrototypeAdminUserProfileService {
  private readonly _profile = new BehaviorSubject<UserProfile>(this.state.getUserProfile());
  private readonly _user = new BehaviorSubject<UserProfile>(this.state.getUserProfile());
  private readonly _roles = new BehaviorSubject<UserRoleV2[]>(this.state.getUserRoles());

  readonly profile$ = this._profile.asObservable();
  readonly user$ = this._user.asObservable();
  readonly roles$ = this._roles.asObservable();

  constructor(
    private readonly state: PrototypeAdminStateService,
    @Inject(CORE_CONFIG) private readonly coreConfig: CoreConfig,
  ) {}

  get userRoles(): UserRoleV2[] {
    return this._roles.getValue();
  }

  get currentApplicationId(): string {
    return this.coreConfig.appId;
  }

  initializeProfile(): Promise<UserProfile> {
    this.fetchProfile();
    return Promise.resolve(this.getProfile());
  }

  fetchProfile(): void {
    const profile = this.state.getUserProfile();
    this._profile.next(profile);
    this._user.next(profile);
    this._roles.next(this.state.getUserRoles());
  }

  fetchUserData(): void {
    this.fetchProfile();
  }

  getApplicationRoles(applicationId?: string): string[] {
    const appId = applicationId || this.coreConfig.appId;
    return this.userRoles.filter((role) => role.application_id === appId).map((role) => role.key);
  }

  hasRoles(roles: string[], appId?: string): boolean {
    if (!roles?.length) {
      return false;
    }
    return this.getApplicationRoles(appId).some((role) => roles.includes(role));
  }

  hasRoles$(roles: string[], appId?: string): Observable<boolean> {
    return this.roles$.pipe(map(() => this.hasRoles(roles, appId)));
  }

  hasRequiredRoles(requiredRoles: string[]): boolean {
    if (!requiredRoles?.length) {
      return false;
    }
    return requiredRoles.every((role) => this.getApplicationRoles().includes(role));
  }

  isAdmin(): boolean {
    return this.hasRoles(['admin', 'super_admin']);
  }

  isAdmin$(): Observable<boolean> {
    return this.roles$.pipe(map(() => this.isAdmin()));
  }

  isKeepsAdmin(): boolean {
    return false;
  }

  isKeepsAdmin$(): Observable<boolean> {
    return this.roles$.pipe(map(() => false));
  }

  isKeepsPlatformAdmin(): boolean {
    return false;
  }

  isSuperAdmin(): boolean {
    return this.hasRoles(['super_admin']);
  }

  isSuperAdmin$(): Observable<boolean> {
    return this.roles$.pipe(map(() => this.isSuperAdmin()));
  }

  isContentCreator(): boolean {
    return this.hasRoles(['content', 'admin', 'super_admin']);
  }

  isContentCreator$(): Observable<boolean> {
    return this.roles$.pipe(map(() => this.isContentCreator()));
  }

  isCurator(): boolean {
    return this.hasRoles(['curator', 'content', 'admin', 'super_admin']);
  }

  isCurator$(): Observable<boolean> {
    return this.roles$.pipe(map(() => this.isCurator()));
  }

  isAnalyticsLeader(): boolean {
    return this.hasRoles(['basic_analytics_leader']) && !this.hasRoles(['basic_analytics_admin']);
  }

  isApplicationAdmin(applicationId: string): boolean {
    return this.getApplicationRoles(applicationId).some((role) => ['admin', 'super_admin'].includes(role));
  }

  getUserLocale(): LanguageTypes {
    return 'pt-BR';
  }

  getProfile(): UserProfile {
    return this._profile.getValue();
  }

  updateProfile(profile: Partial<UserProfile>): void {
    const updatedProfile = { ...this.getProfile(), ...profile };
    this._profile.next(updatedProfile);
    this._user.next(updatedProfile);
  }
}

export const prototypeUserProfileProvider = {
  provide: UserProfileService,
  useClass: PrototypeAdminUserProfileService,
};
