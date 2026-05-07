import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ReportService } from '../../services';
import { ReportActions } from '../actions';

@Injectable()
export class ReportEffects {
  getReport$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(ReportActions.getReport),
      mergeMap(({ filter }) =>
        this._reportService.getReport(filter).pipe(
          map((report: any) => {
            this._reportService.downloadReport(report.url);
            return ReportActions.getReportSuccess();
          }),
          catchError(() => of(ReportActions.getReportFailure())),
        ),
      ),
    );
  });

  constructor(
    private _actions$: Actions,
    private _reportService: ReportService,
  ) {}
}
