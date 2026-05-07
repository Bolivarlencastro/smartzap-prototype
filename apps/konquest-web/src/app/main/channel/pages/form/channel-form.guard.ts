import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import { forkJoin, Observable, of } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';

import { ChannelFormSelectors } from './store/selectors';
import { ChannelFormActions } from './store/actions';

import * as ChannelTypesActions from '../../store/channel-types/channel-types.actions';
import * as ChannelTypesSelectors from '../../store/channel-types/channel-types.selectors';

@Injectable({ providedIn: 'root' })
export class ChannelFormGuard {
  constructor(private store: Store) {}

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
    return forkJoin({
      channel: this.getChannel(route),
      channelTypes: this.getChannelTypes(),
    });
  }

  /**
   * Get Channel
   *
   * @returns
   */
  getChannel(route: ActivatedRouteSnapshot): any {
    return this.store.select(ChannelFormSelectors.selectChannelFormLoaded).pipe(
      tap(() => {
        // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
        const channel_id = route.params['id'];
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        channel_id && this.store.dispatch(ChannelFormActions.getChannel({ channel_id }));
      }),
      take(1),
    );
  }

  /**
   * Get Channel Types
   *
   * @returns
   */
  getChannelTypes(): any {
    return this.store.select(ChannelTypesSelectors.selectChannelTypesLoaded).pipe(
      tap(() => this.store.dispatch(ChannelTypesActions.getChannelTypes())),
      take(1),
    );
  }
}
