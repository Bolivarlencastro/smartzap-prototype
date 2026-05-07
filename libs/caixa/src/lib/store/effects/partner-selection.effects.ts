import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PartnerSelectionService } from '../../services/partner-selection.service';
import { PartnerSelectionActions } from '../actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { concatLatestFrom } from '@ngrx/operators';
import { partnerSelectionFeature } from '../features';

@Injectable()
export class PartnerSelectionEffects {
  openDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PartnerSelectionActions.openDialog),
        tap(() => this.partnerSelectionService.openDialog()),
      );
    },
    { dispatch: false },
  );

  searchPartner$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PartnerSelectionActions.searchPartner),
      concatLatestFrom(() => this.store.select(partnerSelectionFeature.selectPartnerType)),
      switchMap(([{ search }, partnerType]) =>
        this.partnerSelectionService.searchPartner(search, partnerType).pipe(
          map((result) => PartnerSelectionActions.searchPartnerSuccess({ result })),
          catchError((error) => of(PartnerSelectionActions.searchPartnerFailure({ error }))),
        ),
      ),
    );
  });

  selectPartner$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PartnerSelectionActions.selectPartner),
        tap(() => this.partnerSelectionService.closeDialog()),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly partnerSelectionService: PartnerSelectionService,
  ) {}
}
