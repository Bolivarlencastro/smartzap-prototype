import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { OverviewService } from '../../services/overview.service';
import { OverviewActions } from './overview.actions';

@Injectable()
export class OverviewEffects {
  init$ = createEffect(() => {
    return this.actions.pipe(
      ofType(OverviewActions.init),
      map(() => {
        const activatedServices = this.overviewService.getActivatedServices();
        return OverviewActions.setActivatedServices({ ...activatedServices });
      }),
    );
  });

  fetchSummary$ = createEffect(() => {
    return this.actions.pipe(
      ofType(OverviewActions.init),
      switchMap(() =>
        this.overviewService.getOverviewSummary().pipe(
          map((summary) => OverviewActions.fetchSummarySuccess({ summary })),
          catchError(() => of(OverviewActions.fetchSummaryFailure())),
        ),
      ),
    );
  });

  fetchTeamSummary$ = createEffect(() => {
    return this.actions.pipe(
      ofType(OverviewActions.init),
      switchMap(() =>
        this.overviewService.getOverviewTeamSummary().pipe(
          map((teamSummary) => OverviewActions.fetchTeamSummarySuccess({ teamSummary })),
          catchError(() => of(OverviewActions.fetchTeamSummaryFailure())),
        ),
      ),
    );
  });

  constructor(
    private readonly actions: Actions,
    private readonly overviewService: OverviewService,
  ) {}
}
