import { filter, map, Observable, of, take } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { UserProfileService } from '../../services';

export type RoleGuardFn = (...roles: string[]) => Observable<boolean>;

@Injectable({ providedIn: 'root' })
export class LazyRolesChecker {
  private readonly userProfileService = inject(UserProfileService);

  /**
   * Checks if the user has at least one of the provided roles, if the roles aren't loaded, waits for them to load.
   * @param roles The user roles to check against.
   * @returns Observable An observable of true if the check passes.
   */
  lazyCheckRoles: RoleGuardFn = (...roles: string[]): Observable<boolean> => {
    const rolesDefined = !!this.userProfileService.getApplicationRoles()?.length;
    if (!rolesDefined) {
      return this.checkAfterLoad(this.userProfileService, roles);
    }

    return of(this.checkRoles(this.userProfileService, roles));
  };

  private checkAfterLoad(userProfileService: UserProfileService, roles: string[]): Observable<boolean> {
    return userProfileService.roles$.pipe(
      filter((userRoles) => !!userRoles.length),
      take(1),
      map(() => this.checkRoles(userProfileService, roles)),
    );
  }

  private checkRoles(userProfileService: UserProfileService, roles: string[]): boolean {
    return userProfileService.hasRoles(roles);
  }
}
