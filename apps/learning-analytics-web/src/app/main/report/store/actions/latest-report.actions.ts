import { createAction, props } from '@ngrx/store';
import { Report } from '@core/api/model';
import { LatestReportFilter } from '../../interfaces';
import { ChatbotDialogData } from '@keeps-platform-frontend-workspace/kp-keeps';

export const loadLatestReports = createAction(
  '[Latest Report] Load latest reports',
  props<{ filter: LatestReportFilter }>(),
);

export const loadLatestReportsSuccess = createAction(
  '[Latest Report] Load latest reports success',
  props<{ result: Report[]; total_pages: number }>(),
);

export const loadLatestReportsFailure = createAction(
  '[Latest Report] Load latest reports failure',
  props<{ error: Error }>(),
);

export const loadMoreLatestReports = createAction(
  '[Latest Report] Load more latest reports',
  props<{ filter: LatestReportFilter }>(),
);

export const loadMoreLatestReportsSuccess = createAction(
  '[Latest Report] Load more latest reports success',
  props<{ result: Report[]; total_pages: number }>(),
);

export const loadMoreLatestReportsFailure = createAction(
  '[Latest Report] Load more latest reports failure',
  props<{ error: Error }>(),
);

export const loadMoreItemsReport = createAction('[Latest Report] Load more Itens');

export const refreshResult = createAction('[Latest Resport] Load refresh result');

export const openChatbotDialog = createAction(
  '[Latest Report] Open Chatbot Dialog',
  props<{ data: ChatbotDialogData }>(),
);
