import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, defaultIfEmpty, lastValueFrom, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { CORE_CONFIG, CoreConfig } from '../core-config';
import {
  LanguageTypes,
  UserCreateDTO,
  UserProfile,
  UserRoleV2,
  UsersApi,
  UsersV2Api,
  UserUpdateDTO,
} from '../my-account-sdk';
import { WorkspaceService } from './workspace.service';
import Keycloak from 'keycloak-js';
import { MyAccountV2Client } from '../public-api';

export const SUPER_ADMIN_ROLE = 'super_admin';
export const ADMIN_ROLES = ['admin', SUPER_ADMIN_ROLE];
export const CONTENT_CREATOR_ROLES = ['content', ...ADMIN_ROLES];
export const CURATOR_ROLES = ['curator', 'content', ...ADMIN_ROLES];

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private _fetchProfile = new Subject<void>();
  private _user = new BehaviorSubject<UserProfile>(null);
  private _profile = new BehaviorSubject<UserProfile>(undefined);
  private _roles = new BehaviorSubject<UserRoleV2[]>([]);

  readonly profile$ = this._profile.asObservable();
  readonly user$ = this._user.asObservable();
  readonly roles$ = this._roles.asObservable();

  /**
   * Return an unfiltered list of all the user's roles
   */
  get userRoles(): UserRoleV2[] {
    return this._roles.getValue();
  }

  get currentApplicationId(): string {
    return this._coreConfig.appId;
  }

  constructor(
    private readonly _workspaceService: WorkspaceService,
    private readonly _keycloak: Keycloak,
    private readonly _usersApi: UsersApi,
    private readonly _usersV2Api: UsersV2Api,
    private readonly _http: MyAccountV2Client,
    @Inject(CORE_CONFIG) private readonly _coreConfig: CoreConfig,
  ) {
    this.registerWorkspaceChange();
    this.registerFetchProfileSub();
  }

  private registerFetchProfileSub(): void {
    this._fetchProfile
      .asObservable()
      .pipe(switchMap(() => this._usersV2Api.userInfo()))
      .subscribe({
        next: (user) => {
          this._profile.next(user);
          this._user.next({ ...(user as any) });
          this._roles.next(user.roles);
        },
      });
  }

  private registerWorkspaceChange(): void {
    this._workspaceService.currentWorkspace$.subscribe(() => this.fetchProfile());
  }

  /**
   * Loads the current user's profile
   */
  fetchProfile(): void {
    this._fetchProfile.next();
  }

  initializeProfile() {
    return lastValueFrom(
      this._usersV2Api.userInfo().pipe(
        tap({
          next: (user) => {
            this._profile.next(user);
            this._user.next({ ...(user as any) });
            this._roles.next(user.roles);
          },
        }),
        defaultIfEmpty(null),
      ),
    );
  }

  /**
   * Loads the current user's profile
   */
  fetchUserData(): void {
    this._usersApi.fetchProfile().subscribe((user) => this._user.next(user));
  }

  /**
   * Returns a list of the user roles has in the current application and workspace
   * @param applicationId If provided, overrides which application the roles are evaluated from
   */
  getApplicationRoles(applicationId?: string): string[] {
    const appId = applicationId || this._coreConfig.appId;
    return this._roles
      .getValue()
      .filter((role) => role.application_id === appId)
      .map((item: any) => item?.key);
  }

  /**
   * Returns whether the current user has the keeps_admin keyCloak role
   */
  isKeepsAdmin(): boolean {
    return this.hasRoles(['keeps_admin']);
  }

  /**
   * Returns an observable of whether the current user has the keeps_admin keyCloak role
   */
  isKeepsAdmin$(): Observable<boolean> {
    return this.roles$.pipe(map(() => this.isKeepsAdmin()));
  }

  /**
   * Returns whether the current user has the keeps_platform_admin keyCloak role
   */
  isKeepsPlatformAdmin(): boolean {
    return this.hasRoles(['keeps_platform_admin']);
  }

  /**
   * Returns whether the current user has at least one of the informed roles in the current application and workspace or
   * Keycloak
   */
  hasRoles(roles: string[], appId?: string): boolean {
    if (!roles) {
      return false;
    }

    if (!this._keycloak?.authenticated) {
      return false;
    }

    const userRoles = this.getApplicationRoles(appId);
    const keycloakRoles = this.getKeycloakRoles();
    return [...userRoles, ...keycloakRoles].some((role) => roles.includes(role));
  }

  hasRoles$(roles: string[], appId?: string): Observable<boolean> {
    return this.roles$.pipe(map(() => this.hasRoles(roles, appId)));
  }

  /**
   * Returns whether the current user has at least one of the admin roles
   */
  isAdmin(): boolean {
    return this.hasRoles(ADMIN_ROLES);
  }

  /**
   * Returns an observable of whether the current user has at least one of the admin roles
   */
  isAdmin$(): Observable<boolean> {
    return this.roles$.pipe(map(() => this.isAdmin()));
  }

  /**
   * Returns whether the current user has the super admin role
   */
  isSuperAdmin(): boolean {
    return this.hasRoles([SUPER_ADMIN_ROLE]);
  }

  /**
   * Returns an observable of whether the current user has the super admin role
   */
  isSuperAdmin$(): Observable<boolean> {
    return this.roles$.pipe(map(() => this.isSuperAdmin()));
  }

  /**
   * Returns whether the current user has the content creator role
   */
  isContentCreator(): boolean {
    return this.hasRoles(CONTENT_CREATOR_ROLES);
  }

  /**
   * Returns an observable of whether the current user has the content creator role
   */
  isContentCreator$(): Observable<boolean> {
    return this.roles$.pipe(map(() => this.isContentCreator()));
  }

  /**
   * Returns whether the current user has the curator role
   */
  isCurator(): boolean {
    return this.hasRoles(CURATOR_ROLES);
  }

  /**
   * Returns an observable of whether the current user has the curator role
   */
  isCurator$(): Observable<boolean> {
    return this.roles$.pipe(map(() => this.isCurator()));
  }

  /**
   * Returns whether the current user has all the informed roles in the current application
   */
  hasRequiredRoles(requiredRoles: string[]): boolean {
    if (!requiredRoles) {
      return false;
    }

    const userRoles = this.getApplicationRoles();
    return requiredRoles?.every((role) => userRoles.includes(role));
  }

  /**
   * Returns whether the user is an analytics leader but not an admin
   */
  isAnalyticsLeader(): boolean {
    const roles = this.getApplicationRoles();
    const ROLE_ADMIN = 'basic_analytics_admin';
    const ROLE_LEADER = 'basic_analytics_leader';
    return roles.includes(ROLE_LEADER) && !roles.includes(ROLE_ADMIN);
  }

  /**
   * Returns whether the user has the admin role in a specific application
   */
  isApplicationAdmin(applicationId: string): boolean {
    const roles = this.getApplicationRoles(applicationId);
    return roles?.some((role) => ADMIN_ROLES.includes(role));
  }

  /**
   * Returns the user's current locale
   */
  getUserLocale(): LanguageTypes {
    const locale = this._keycloak?.idTokenParsed?.['locale'];
    return locale || 'pt-BR';
  }

  /**
   * Returns the current user profile.
   */
  getProfile() {
    return this._profile.getValue();
  }

  updateProfile(profile: UserUpdateDTO): void {
    const userId = this.getProfile().id;
    this._usersApi.updateProfile(userId, profile).subscribe((user) => {
      this._user.next({ ...user });
    });
  }

  uploadAvatar(image: File) {
    const id = this.getProfile().id;

    this.saveUserAvatar(image)
      .pipe(
        switchMap(({ url }) => {
          const avatar = { avatar: url };
          return this.updateUserProfile(id, avatar);
        }),
      )
      .subscribe();
  }

  private saveUserAvatar(image: File) {
    const formData = new FormData();
    formData.append('file', image);

    return this._http.postFormData<{ url: string }>(`/user-avatar`, formData);
  }

  private updateUserProfile(userId: string, user: UserCreateDTO): Observable<UserProfile> {
    return this._http.patch<UserProfile>(`/users/${userId}`, user).pipe(
      tap((res) => {
        const updatedUser = { ...this._profile.getValue(), avatar: res?.avatar };
        this._profile.next(updatedUser);
      }),
    );
  }

  private getKeycloakRoles() {
    let roles: string[] = [];
    const keycloakResourceAccess = this._keycloak.resourceAccess;
    const realmAccess = this._keycloak.realmAccess;

    if (keycloakResourceAccess) {
      Object.keys(keycloakResourceAccess).forEach((key) => {
        const resourceAccess = keycloakResourceAccess[key];
        const clientRoles = resourceAccess.roles ?? [];
        roles = roles.concat(clientRoles);
      });
    }

    if (realmAccess) {
      const realmRoles = realmAccess.roles ?? [];
      roles.push(...realmRoles);
    }

    return roles;
  }
}
