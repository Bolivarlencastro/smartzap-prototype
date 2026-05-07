import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { CourseSelectors } from '../store/selectors';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable()
export class CourseEditGuard {
  constructor(
    private store: Store,
    private userProfileService: UserProfileService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (state.url === '/courses/new/form') {
      return of(true);
    }

    return combineLatest([
      this.userProfileService.isAdmin$(),
      this.store.select(CourseSelectors.selectIsLoaded),
      this.store.select(CourseSelectors.selectIsOwner),
    ]).pipe(
      filter(([isAdmin, isLoaded]) => isAdmin || isLoaded),
      map(([isAdmin, , isOwner]) => isAdmin || isOwner),
      take(1),
    );
  }
}
