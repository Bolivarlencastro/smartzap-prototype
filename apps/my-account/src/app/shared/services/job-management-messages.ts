import { JobEnum } from 'app/main/job-management/models';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export type JobOperation = 'create' | 'edit' | 'delete' | 'batchDelete';

const CREATION_SUCCESS_MESSAGES: Record<JobEnum, string> = {
  [JobEnum.JOB_FUNCTION]: marker('JOB_MANAGEMENT.JOB_FUNCTION.CREATION_SUCCESSFUL_MESSAGE'),
  [JobEnum.JOB_POSITION]: marker('JOB_MANAGEMENT.JOB_POSITION.CREATION_SUCCESSFUL_MESSAGE'),
};

const CREATION_FAILURE_MESSAGES: Record<JobEnum, string> = {
  [JobEnum.JOB_FUNCTION]: marker('JOB_MANAGEMENT.JOB_FUNCTION.CREATION_FAILURE_MESSAGE'),
  [JobEnum.JOB_POSITION]: marker('JOB_MANAGEMENT.JOB_POSITION.CREATION_FAILURE_MESSAGE'),
};

const EDITION_SUCCESS_MESSAGES: Record<JobEnum, string> = {
  [JobEnum.JOB_FUNCTION]: marker('JOB_MANAGEMENT.JOB_FUNCTION.EDITION_SUCCESSFUL_MESSAGE'),
  [JobEnum.JOB_POSITION]: marker('JOB_MANAGEMENT.JOB_POSITION.EDITION_SUCCESSFUL_MESSAGE'),
};

const EDITION_FAILURE_MESSAGES: Record<JobEnum, string> = {
  [JobEnum.JOB_FUNCTION]: marker('JOB_MANAGEMENT.JOB_FUNCTION.EDITION_FAILURE_MESSAGE'),
  [JobEnum.JOB_POSITION]: marker('JOB_MANAGEMENT.JOB_POSITION.EDITION_FAILURE_MESSAGE'),
};

const DELETION_SUCCESS_MESSAGES: Record<JobEnum, string> = {
  [JobEnum.JOB_FUNCTION]: marker('JOB_MANAGEMENT.JOB_FUNCTION.DELETION_SUCCESSFUL_MESSAGE'),
  [JobEnum.JOB_POSITION]: marker('JOB_MANAGEMENT.JOB_POSITION.DELETION_SUCCESSFUL_MESSAGE'),
};

const DELETION_FAILURE_MESSAGES: Record<JobEnum, string> = {
  [JobEnum.JOB_FUNCTION]: marker('JOB_MANAGEMENT.JOB_FUNCTION.DELETION_FAILURE_MESSAGE'),
  [JobEnum.JOB_POSITION]: marker('JOB_MANAGEMENT.JOB_POSITION.DELETION_FAILURE_MESSAGE'),
};

export function getSuccessMessage(jobType: JobEnum, operation: JobOperation) {
  switch (operation) {
    case 'create':
      return CREATION_SUCCESS_MESSAGES[jobType];
    case 'edit':
      return EDITION_SUCCESS_MESSAGES[jobType];
    case 'delete':
      return DELETION_SUCCESS_MESSAGES[jobType];
    case 'batchDelete':
      return marker('JOB_MANAGEMENT.DELETE_SELECTION_SUCCESSFUL_MESSAGE');
  }
}

export function getErrorMessage(jobType: JobEnum, operation: JobOperation) {
  switch (operation) {
    case 'create':
      return CREATION_FAILURE_MESSAGES[jobType];
    case 'edit':
      return EDITION_FAILURE_MESSAGES[jobType];
    case 'delete':
      return DELETION_FAILURE_MESSAGES[jobType];
    case 'batchDelete':
      return marker('JOB_MANAGEMENT.DELETE_SELECTION_FAILURE_MESSAGE');
  }
}
