import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CourseSelectors } from '../store/selectors';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable()
export class CourseEditGuard {
  constructor(
    private store: Store,
    private _router: Router,
    private userProfileService: UserProfileService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (state.url === '/courses/new/form') {
      return of(true);
    }

    return combineLatest([
      this.userProfileService.isAdmin$(),
      this.store.select(CourseSelectors.selectIsOwner).pipe(take(1)),
    ]).pipe(map(([isAdmin, isOwner]) => isAdmin || isOwner));
  }
}
