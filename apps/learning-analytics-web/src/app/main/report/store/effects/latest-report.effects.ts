import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ReportService } from '../../services';
import { LatestReportService } from '../../services/latest-report.service';
import { LatestReportActions } from '../actions';
import { LatestReportListSelectors } from '../selectors';

@Injectable()
export class LatestReportEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private reportService: ReportService,
    private latestResport: LatestReportService,
  ) {}

  loadLatestReports$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LatestReportActions.loadLatestReports),
      switchMap(({ filter }) =>
        this.reportService.getLatestReports(filter).pipe(
          map(LatestReportActions.loadLatestReportsSuccess),
          catchError((error) => of(LatestReportActions.loadLatestReportsFailure({ error }))),
        ),
      ),
    );
  });

  loadMoreLatestReports$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LatestReportActions.loadMoreLatestReports),
      switchMap(({ filter }) =>
        this.reportService.getLatestReports(filter).pipe(
          map(LatestReportActions.loadMoreLatestReportsSuccess),
          catchError((error) => of(LatestReportActions.loadMoreLatestReportsFailure({ error }))),
        ),
      ),
    );
  });

  loadMoreItemsReport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LatestReportActions.loadMoreItemsReport),
      concatLatestFrom(() => [
        this.store.select(LatestReportListSelectors.selectFilter),
        this.store.select(LatestReportListSelectors.selectIsLastPage),
        this.store.select(LatestReportListSelectors.selectIsLoading),
      ]),
      filter(([_, isLastPage, isLoading]) => !isLastPage && !isLoading),
      map(([_, filter]) => {
        const updatedFilterfilter = this.latestResport.updateFilter({
          ...filter,
          page: filter?.page ? filter.page + 1 : 1,
        });
        return LatestReportActions.loadMoreLatestReports({ filter: updatedFilterfilter });
      }),
    );
  });

  refreshResult$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LatestReportActions.refreshResult),
      concatLatestFrom(() => [
        this.store.select(LatestReportListSelectors.selectFilter),
        this.store.select(LatestReportListSelectors.selectIsLoading),
      ]),
      filter(([_action, _filter, isLoading]) => !isLoading),
      map(([_, filter]) => {
        const updatedFilter = this.latestResport.updateFilter({ ...filter, page: 1 });
        return LatestReportActions.loadLatestReports({ filter: updatedFilter });
      }),
    );
  });

  openChatbotDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LatestReportActions.openChatbotDialog),
        tap(({ data }) => this.latestResport.openChatbotDialog(data)),
      );
    },
    { dispatch: false },
  );
}
