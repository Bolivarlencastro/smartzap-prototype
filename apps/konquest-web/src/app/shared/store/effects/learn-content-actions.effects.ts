import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { catchError, of } from 'rxjs';
import { LearnContentActionsService } from '../../services';
import { LearnContentActions } from '../actions';

@Injectable()
export class LearnContentActionsEffects {
  onCardAction$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearnContentActions.learnContentAction),
      map(({ learnContentAction }) => LearnContentActionsService.getDashboardAction(learnContentAction)),
    );
  });

  onDetail$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(LearnContentActions.showDetails),
        map(({ learnContentAction }) => this.actionsService.openDetails(learnContentAction)),
      );
    },
    { dispatch: false },
  );

  redirectTo$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(LearnContentActions.redirectTo, LearnContentActions.enrollSuccess),
        map(({ learnContentAction }) => this.actionsService.redirectTo(learnContentAction)),
      );
    },
    { dispatch: false },
  );

  enrollToMission$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearnContentActions.enroll),
      switchMap(({ learnContentAction }) =>
        this.actionsService.enrollToMission(learnContentAction.learnContent.contentId).pipe(
          map((enrollment) => {
            return LearnContentActions.enrollSuccess({ learnContentAction, enrollment });
          }),
        ),
      ),
    );
  });

  share$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(LearnContentActions.share),
        map(({ learnContentAction }) => this.actionsService.shareContent(learnContentAction)),
      );
    },
    { dispatch: false },
  );

  requestNewDeadline$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearnContentActions.requestNewDeadline),
      switchMap(({ learnContentAction }) =>
        this.actionsService.requestNewDeadline(learnContentAction.learnContent.enrollmentId).pipe(
          map(() => LearnContentActions.requestNewDeadlineSuccess({ learnContentAction })),
          catchError(() => of(LearnContentActions.requestNewDeadlineFailure())),
        ),
      ),
    );
  });

  addBookmark$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearnContentActions.addBookmark),
      switchMap(({ learnContentAction }) =>
        this.actionsService.addBookmark(learnContentAction.learnContent.contentId).pipe(
          map(({ id }) => {
            return LearnContentActions.addBookmarkSuccess({
              learnContent: learnContentAction.learnContent,
              bookmarkId: id,
            });
          }),
          catchError(() => of(LearnContentActions.toggleBookmarkFailure())),
        ),
      ),
    );
  });

  removeBookmark$ = createEffect(() => {
    return this.actions.pipe(
      ofType(LearnContentActions.removeBookmark),
      switchMap(({ learnContentAction }) =>
        this.actionsService.removeBookmark(learnContentAction.learnContent.bookmarkId).pipe(
          map(() => {
            return LearnContentActions.removeBookmarkSuccess({
              learnContent: learnContentAction.learnContent,
            });
          }),
          catchError(() => of(LearnContentActions.toggleBookmarkFailure())),
        ),
      ),
    );
  });

  constructor(
    private actions: Actions,
    private actionsService: LearnContentActionsService,
  ) {}
}
