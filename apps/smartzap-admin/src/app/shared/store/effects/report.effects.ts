import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import { ReportService } from '../../services/report-service';
import { ReportActions } from '../actions';

@Injectable()
export class ReportEffects {
  generateReport$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(ReportActions.generateReport),
        switchMap(({ id, reportType }) => this._reportService.downloadReport(reportType, id)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private _reportService: ReportService,
    private _actions$: Actions,
  ) {}
}
