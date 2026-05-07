export interface ActivityLogFilter {
  createdDateGte: Date;
  createdDateLte: Date;
  userId: string;
  actionKey: string;
  status: ActivityLogStatus;
}

export interface ActivityLogOptions {
  status: string[];
  users: ActivityLogOption[];
  actionKey: string[];
}

export interface ActivityLogOption {
  label: string;
  value: string;
}

export interface ActivityLogPagination {
  totalItems: number;
  perPage: number;
  currentPage: number;
}

export interface ActivityLogItem {
  id: string;
  date: Date;
  time: string;
  user: string;
  action: string;
  actionParams: any;
  status: ActivityLogStatus;
}

export interface ActivityLogViewModel {
  items: ActivityLogItem[];
  loading: boolean;
  pagination: ActivityLogPagination;
  filterOptions: ActivityLogOptions;
}

export interface ActivityLogStoreFilter {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  userId?: string;
  actionKey?: string;
  createdDateGte?: Date;
  createdDateLte?: Date;
}

export type ActivityLogList = Pick<ActivityLogViewModel, 'loading' | 'items' | 'pagination'>;
export type ActivityLogStatus =
  | 'CREATED'
  | 'READY'
  | 'PROCESSING'
  | 'DONE'
  | 'DONE_WITH_EXCEPTIONS'
  | 'ERROR'
  | 'INVALID';

export const ACTIVITY_LOG_STATUS_TAG_COLOR: Record<ActivityLogStatus, string> = {
  CREATED: '#92d2d2',
  READY: '#2294e5',
  PROCESSING: '#ff800b',
  DONE: '#00b400',
  DONE_WITH_EXCEPTIONS: '#9306B5',
  ERROR: '#ff0000',
  INVALID: '#cccccc',
};

export interface ActionReportDTO {
  id: string;
  analyticsReportId: string;
  status: string;
  url: string;
  batchId: string;
  createdDate: string;
  updatedDate: string;
}
