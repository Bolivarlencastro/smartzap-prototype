import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';

import { ChannelDetailActions } from './store/actions';
import { ChannelCommentsFilters } from '../../channel.model';

@Injectable()
export class ChannelDetailGuard {
  constructor(private store: Store) {}

  /**
   * Can activate
   *
   * @param route
   * @returns
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore(route).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false)),
    );
  }

  /**
   * Check store
   *
   * @returns
   */
  checkStore(route: ActivatedRouteSnapshot): Observable<any> {
    return this.getChannel(route);
  }

  /**
   * Get Channel
   *
   * @returns
   */
  getChannel(route: ActivatedRouteSnapshot): any {
    return this.store.pipe(
      take(1),
      tap(() => {
        // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
        const channel_id = route.params['id'];
        const params: ChannelCommentsFilters = {
          channel_id,
          per_page: 15,
        };
        this.store.dispatch(ChannelDetailActions.getChannelOnLoadRoute({ channel_id, params }));
      }),
    );
  }
}
