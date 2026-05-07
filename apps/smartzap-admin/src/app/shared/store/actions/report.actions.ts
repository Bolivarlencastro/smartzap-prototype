import { createAction, props } from '@ngrx/store';
import { ReportType } from 'app/shared/model';

export const generateReport = createAction(
  '[Report] Generate Report',
  props<{
    id?: string;
    reportType: ReportType;
  }>(),
);
