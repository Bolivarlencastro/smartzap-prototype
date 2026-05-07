import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { CourseActions } from '../store/actions';
import { CourseSelectors } from '../store/selectors';

@Injectable()
export class CourseGuard {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivateChild(route, state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const { id } = route.params;

    if (id === 'new') {
      this.store.dispatch(CourseActions.clearSelectedCourse());
      return of(true);
    }

    return this.store.select(CourseSelectors.selectCourse).pipe(
      tap((course) => {
        if (course?.id !== id) {
          this.store.dispatch(CourseActions.loadCourse({ id }));
        }
      }),
      filter((course) => course?.id === id),
      map(() => true),
      take(1),
    );
  }
}
