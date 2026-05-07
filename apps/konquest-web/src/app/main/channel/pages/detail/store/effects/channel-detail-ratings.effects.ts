import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concat, of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { ChannelRating } from '../../../../channel.model';
import { ChannelDetailActions, ChannelDetailRatingsActions } from '../actions';
import { RatingService } from '@core/api';

@Injectable()
export class ChannelDetailRatingsEffects {
  postRatings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChannelDetailRatingsActions.postChannelRatings),
      switchMap(({ payload }) => {
        return this._ratingService.rateChannel(payload).pipe(
          mergeMap((channelRating: ChannelRating) => {
            return concat(
              of(
                ChannelDetailRatingsActions.postChannelRatingsSuccess({
                  payload: channelRating,
                }),
              ),
              of(
                ChannelDetailActions.updateChannelRating({
                  rating: channelRating.rating_avg || 0,
                }),
              ),
            );
          }),
          catchError((err) =>
            of(
              ChannelDetailRatingsActions.postChannelRatingsFailure({
                errorMsg: err.message,
              }),
            ),
          ),
        );
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private _ratingService: RatingService,
  ) {}
}
