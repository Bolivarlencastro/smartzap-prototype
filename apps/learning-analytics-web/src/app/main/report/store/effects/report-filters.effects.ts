import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ReportActions, ReportFiltersActions } from 'app/main/report/store/actions';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ReportFiltersService } from '../../services';

@Injectable()
export class ReportFiltersEffects {
  filterOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportFiltersActions.filterSelectOptions),
      mergeMap(({ search }) =>
        this.reportFiltersService.getSelectOptions(search).pipe(
          map((results) =>
            ReportFiltersActions.filterSelectOptionsSuccess({
              searchType: search.searchType,
              results,
            }),
          ),
          catchError(() => of(ReportFiltersActions.filterSelectOptionsFailure())),
        ),
      ),
    );
  });

  openDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportFiltersActions.openDialog),
      switchMap(({ reportType }) =>
        this.reportFiltersService.openDialog(reportType).pipe(
          filter((result) => !!result),
          map((result) =>
            ReportActions.getReport({
              filter: {
                reportType: reportType,
                data: result,
              },
            }),
          ),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private reportFiltersService: ReportFiltersService,
  ) {}
}
