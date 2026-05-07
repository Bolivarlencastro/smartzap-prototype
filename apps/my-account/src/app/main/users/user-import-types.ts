export enum USER_IMPORT_STATUS {
  PENDING = 'PENDING',
  READING = 'READING',
  PROCESSING = 'PROCESSING',
  CONSOLIDATING = 'CONSOLIDATING',
  COMPLETED = 'COMPLETED',
  COMPLETED_WITH_ERRORS = 'COMPLETED_WITH_ERRORS',
  FAILED = 'FAILED',
}

export type UserImportItemDto = {
  id: string;
  status: USER_IMPORT_STATUS;
  status_message: string;
  file_url: string;
  error_report_url: string;
  total_to_import: number;
  success_count: number;
  error_count: number;
  created_date: Date;
  updated_date: Date;
  progress: number;
};

export type UserImportErrorItemDto = {
  id: string;
  line_number: string;
  message: string;
  details: Record<string, any>;
};

export type UserImportViewModel = {
  items: UserImportItemDto[];
  isLoading: boolean;
};

export type UserImportErrorsViewModel = {
  items: UserImportErrorItemDto[];
  isLoading: boolean;
};

export type UserImportErrorCode =
  | 'INVALID_FILE_TYPE'
  | 'FILE_SIZE_EXCEEDED'
  | 'UNREADABLE_CSV'
  | 'INVALID_CSV_STRUCTURE'
  | 'MISSING_MANDATORY_COLUMNS'
  | 'ANOTHER_IMPORT_IN_PROGRESS';
