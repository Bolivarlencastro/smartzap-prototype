import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concat, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Pagination } from '@core/model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { ChannelAPI } from '../../../../channel.api';
import { ChannelComment, ChannelCommentsFilters } from '../../../../channel.model';
import { ChannelDetailCommentActions } from '../actions';

@Injectable()
export class ChannelDetailCommentEffects {
  postChannelComment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelDetailCommentActions.postChannelComment),
      mergeMap(({ payload }) => {
        return this._channelAPI.postChannelComment(payload).pipe(
          mergeMap((comment: ChannelComment) => {
            const params: ChannelCommentsFilters = {
              channel_id: comment.channel,
            };

            this._messageService.success(marker('CHANNEL.MESSAGES.COMMENT.CREATED'));

            return concat(
              of(
                ChannelDetailCommentActions.postChannelCommentSuccess({
                  comment,
                }),
              ),
              of(
                ChannelDetailCommentActions.getChannelComments({
                  payload: params,
                }),
              ),
            );
          }),
          catchError((err) => {
            this._messageService.error(marker('CHANNEL.MESSAGES.COMMENT.CREATE_ERROR'));
            return of(
              ChannelDetailCommentActions.postChannelCommentFailure({
                errorMsg: err.message,
              }),
            );
          }),
        );
      }),
    );
  });

  putChannelComment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelDetailCommentActions.putChannelComment),
      mergeMap(({ id, payload }) => {
        return this._channelAPI.putChannelComment(id, payload).pipe(
          mergeMap((comment: ChannelComment) => {
            const params: ChannelCommentsFilters = {
              channel_id: comment.channel,
            };

            this._messageService.success(marker('CHANNEL.MESSAGES.COMMENT.UPDATED'));

            return concat(
              of(
                ChannelDetailCommentActions.putChannelCommentSuccess({
                  comment,
                }),
              ),
              of(
                ChannelDetailCommentActions.getChannelComments({
                  payload: params,
                }),
              ),
            );
          }),
          catchError((err) => {
            this._messageService.error(marker('CHANNEL.MESSAGES.COMMENT.UPDATE_ERROR'));
            return of(
              ChannelDetailCommentActions.putChannelCommentFailure({
                errorMsg: err.message,
              }),
            );
          }),
        );
      }),
    );
  });

  deleteChannelComment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelDetailCommentActions.deleteChannelComment),
      mergeMap(({ id, channel_id }) => {
        return this._channelAPI.deleteChannelComment(id).pipe(
          mergeMap(() => {
            const params: ChannelCommentsFilters = {
              channel_id,
            };

            this._messageService.info(marker('CHANNEL.MESSAGES.COMMENT.DELETED'));

            return concat(
              of(ChannelDetailCommentActions.deleteChannelCommentSuccess()),
              of(
                ChannelDetailCommentActions.getChannelComments({
                  payload: params,
                }),
              ),
            );
          }),
          catchError((err) => {
            this._messageService.error(marker('CHANNEL.MESSAGES.COMMENT.DELETE_ERROR'));
            return of(
              ChannelDetailCommentActions.deleteChannelCommentFailure({
                errorMsg: err.message,
              }),
            );
          }),
        );
      }),
    );
  });

  getChannelComments$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelDetailCommentActions.getChannelComments),
      switchMap(({ payload, page }) => {
        return this._channelAPI.getChannelComments(payload || {}, page).pipe(
          map((commentResponse: Pagination<ChannelComment>) =>
            ChannelDetailCommentActions.getChannelCommentsSuccess({
              payload: commentResponse,
            }),
          ),
          catchError((err) =>
            of(
              ChannelDetailCommentActions.getChannelCommentsFailure({
                errorMsg: err.message,
              }),
            ),
          ),
        );
      }),
    );
  });

  getChannelPulsesPagination$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ChannelDetailCommentActions.getChannelCommentsPagination),
      map(({ payload, paginationParams }) => {
        const { nextPage } = paginationParams;

        return ChannelDetailCommentActions.getChannelComments({
          payload,
          page: nextPage || '',
        });
      }),
    );
  });

  constructor(
    private _actions$: Actions,
    private _channelAPI: ChannelAPI,
    private _messageService: KpMessageService,
  ) {}
}
