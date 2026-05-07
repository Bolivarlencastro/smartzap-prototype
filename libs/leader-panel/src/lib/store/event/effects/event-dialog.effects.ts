import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { EventDialogService } from '../../../services/event-dialog.service';
import { EventDialogActions } from '../actions';
import { eventDialogFeature } from '../features';

@Injectable()
export class EventDialogEffects {
  openDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(EventDialogActions.openDialog),
        tap(() => this.eventDialogService.openDialog()),
      );
    },
    { dispatch: false },
  );

  fetchData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventDialogActions.fetchData),
      concatLatestFrom(() => this.store.select(eventDialogFeature.selectEventId)),
      switchMap(([_, eventId]) =>
        this.eventDialogService.fetchData(eventId).pipe(
          map((data) => EventDialogActions.fetchDataSuccess({ data })),
          catchError(() => of(EventDialogActions.fetchDataFailure())),
        ),
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly eventDialogService: EventDialogService,
  ) {}
}
