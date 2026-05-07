import { KpFilterOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import {
  AREA_OF_ACTIVITY_OPTION,
  DIRECTORATE_OPTION,
  LANGUAGE_DEFAULT_OPTION,
  LEARNING_TRAIL_LANGUAGE_DEFAULT_OPTION,
  MISSION_MODEL_DEFAULT_OPTION,
  MISSION_PROVIDER_DEFAULT_OPTION,
  SIMPLE_SELECTION_OPTION,
  SUBDIRECTORATE_OPTION,
} from './default-options';
import { environment } from 'environments/environment';

export const WORKSPACE_MISSION_OPTIONS: KpFilterOption[] = [
  {
    filterKey: 'mission_category_id__in',
    type: 'autoComplete',
    customTemplate: 'categoriesAc',
    label: marker('GENERAL.CATEGORIES'),
  },
  {
    filterKey: 'updated_date',
    rangeOptions: ['less', 'more', 'between'],
    type: 'dateRange',
    label: marker('REPORT.FILTERS.updated_date'),
    rangeConfig: {
      fromKey: 'updated_date__gte',
      toKey: 'updated_date__lte',
    },
  },
  {
    filterKey: 'created_date',
    type: 'dateRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.CREATION_DATE'),
    rangeConfig: {
      fromKey: 'created_date__gte',
      toKey: 'created_date__lte',
    },
  },
  {
    filterKey: 'deleted_date',
    rangeOptions: ['less', 'more', 'between'],
    type: 'dateRange',
    label: marker('GENERAL.DELETION_DATE'),
    rangeConfig: {
      fromKey: 'deleted_date__gte',
      toKey: 'deleted_date__lte',
    },
  },
  {
    filterKey: 'expiration_date',
    rangeOptions: ['less', 'more', 'between'],
    type: 'dateRange',
    label: marker('GENERAL.EXPIRATION_DATE'),
    rangeConfig: {
      fromKey: 'expiration_date__gte',
      toKey: 'expiration_date__lte',
    },
  },
  {
    filterKey: 'duration_time',
    type: 'numericRange',
    label: marker('GENERAL.DURATION'),
    rangeConfig: {
      fromKey: 'duration_time__gte',
      toKey: 'duration_time__lte',
    },
    rangeOptions: ['less', 'more', 'between'],
    numericRangeConfig: {
      mask: 'Hh:m0',
      startPlaceHolder: 'HH:MM',
      endPlaceHolder: 'HH:MM',
      keepSpecialCharacters: true,
    },
  },
  LANGUAGE_DEFAULT_OPTION,
  {
    filterKey: 'id__in',
    type: 'autoComplete',
    customTemplate: 'missionsAc',
    label: marker('GENERAL.MISSION'),
  },
  SIMPLE_SELECTION_OPTION('deleted', marker('GENERAL.DELETED_MISSIONS')),
  MISSION_MODEL_DEFAULT_OPTION,
  MISSION_PROVIDER_DEFAULT_OPTION,
  {
    filterKey: 'development_status__in',
    label: marker('GENERAL.MISSION_STATUS'),
    type: 'selectMultiple',
    options: [
      {
        label: marker('MISSION.STATUS.PUBLISHED'),
        value: 'DONE',
      },
      {
        label: marker('MISSION.STATUS.IN_REVIEW'),
        value: 'IN_REVIEW',
      },
      {
        label: marker('MISSION.STATUS.IN_PROGRESS'),
        value: 'IN_PROGRESS',
      },
    ],
  },
  {
    filterKey: 'mission_type_id__in',
    label: marker('GENERAL.MISSION_TYPE'),
    type: 'selectMultiple',
    options: [
      {
        label: marker('MISSION.TYPE.OPEN'),
        value: '94176ccd-d3bd-4ee1-a4ae-c08798125617',
      },
      {
        label: marker('MISSION.TYPE.CLOSED'),
        value: '9e15d7f9-ef11-428b-9c14-5a5c31552a39',
      },
    ],
  },
  {
    filterKey: 'assessment_type__in',
    label: marker('GENERAL.ASSESSMENT_TYPE'),
    type: 'selectMultiple',
    options: [
      {
        label: marker('GENERAL.ASSESSMENTS.CONTENT'),
        value: 'CONTENT',
      },
      {
        label: marker('GENERAL.ASSESSMENTS.FULL'),
        value: 'FULL',
      },
      {
        label: marker('GENERAL.ASSESSMENTS.QUIZ'),
        value: 'QUIZ',
      },
    ],
  },
  {
    filterKey: 'user_creator_id__in',
    type: 'autoComplete',
    customTemplate: 'creatorsAc',
    label: marker('GENERAL.USER_CREATOR'),
  },
];

export const MISSION_ENROLLMENTS_OPTIONS: KpFilterOption[] = [
  AREA_OF_ACTIVITY_OPTION(),
  {
    filterKey: 'end_date',
    type: 'dateRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.CONCLUSION_DATE'),
    rangeConfig: {
      fromKey: 'end_date__gte',
      toKey: 'end_date__lte',
    },
  },
  {
    filterKey: 'mission__deleted_date',
    type: 'dateRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.DELETION_DATE'),
    rangeConfig: {
      fromKey: 'mission__deleted_date__gte',
      toKey: 'mission__deleted_date__lte',
    },
  },
  {
    filterKey: 'mission__expiration_date',
    type: 'dateRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.EXPIRATION_DATE'),
    rangeConfig: {
      fromKey: 'mission__expiration_date__gte',
      toKey: 'mission__expiration_date__lte',
    },
  },
  {
    filterKey: 'start_date',
    type: 'dateRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.ENROLLMENT_START_DATE'),
    rangeConfig: {
      fromKey: 'start_date__gte',
      toKey: 'start_date__lte',
    },
  },
  {
    filterKey: 'created_date',
    type: 'dateRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.ENROLLMENT_DATE'),
    rangeConfig: {
      fromKey: 'created_date__gte',
      toKey: 'created_date__lte',
    },
  },
  {
    filterKey: 'goal_date',
    type: 'dateRange',
    label: marker('GENERAL.OBJECTIVE_DATE'),
    rangeOptions: ['less', 'more', 'between'],
    rangeConfig: {
      fromKey: 'goal_date__gte',
      toKey: 'goal_date__lte',
    },
  },
  {
    filterKey: 'performance',
    type: 'percentRange',
    label: marker('GENERAL.PERFORMANCE'),
    rangeOptions: ['less', 'more', 'between'],
    rangeConfig: {
      fromKey: 'performance__gte',
      toKey: 'performance__lte',
    },
  },
  SIMPLE_SELECTION_OPTION('give_up', marker('GENERAL.WAIVER')),
  DIRECTORATE_OPTION(),
  { ...LANGUAGE_DEFAULT_OPTION, filterKey: 'mission__language__in' },
  {
    filterKey: 'user__related_user_leader_id__in',
    type: 'autoComplete',
    customTemplate: 'leadersAc',
    label: marker('GENERAL.USER_LEADER'),
  },
  {
    filterKey: 'mission_id__in',
    type: 'autoComplete',
    customTemplate: 'missionsAc',
    label: marker('GENERAL.MISSION'),
  },
  SIMPLE_SELECTION_OPTION('mission__deleted', marker('GENERAL.DELETED_MISSIONS')),
  { ...MISSION_MODEL_DEFAULT_OPTION, filterKey: 'mission__mission_model__in' },
  {
    filterKey: 'user__country__in',
    type: 'search',
    label: marker('GENERAL.USER_COUNTRY'),
  },
  {
    filterKey: 'progress',
    type: 'percentRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.PROGRESS'),
    rangeConfig: {
      fromKey: 'progress__gte',
      toKey: 'progress__lte',
    },
  },
  MISSION_PROVIDER_DEFAULT_OPTION,
  {
    filterKey: 'status__in',
    label: marker('GENERAL.ENROLLMENT_STATUS'),
    type: 'selectMultiple',
    options: [
      { label: marker('ENROLLMENT_STATUSES.COMPLETED'), value: 'COMPLETED' },
      { label: marker('ENROLLMENT_STATUSES.ENROLLED'), value: 'ENROLLED' },
      { label: marker('ENROLLMENT_STATUSES.REFUSED'), value: 'REFUSED' },
      { label: marker('ENROLLMENT_STATUSES.REPROVED'), value: 'REPROVED' },
      { label: marker('ENROLLMENT_STATUSES.STARTED'), value: 'STARTED' },
      { label: marker('ENROLLMENT_STATUSES.VALIDATION_PENDING'), value: 'VALIDATION_PENDING' },
    ],
  },
  SUBDIRECTORATE_OPTION(),
  {
    filterKey: 'required',
    label: marker('GENERAL.ENROLLMENT_TYPE'),
    type: 'select',
    options: [
      { label: marker('ENROLLMENT_TYPES.FREE'), value: false },
      { label: marker('ENROLLMENT_TYPES.REQUIRED'), value: true },
    ],
  },
  {
    filterKey: 'learning_trail_step__learning_trail_id__in',
    type: 'autoComplete',
    customTemplate: 'trailsAc',
    label: marker('GENERAL.TRAIL'),
    disabled: environment.production,
  },
  {
    filterKey: 'user_id__in',
    type: 'autoComplete',
    customTemplate: 'usersAc',
    label: marker('GENERAL.USER'),
  },
  SIMPLE_SELECTION_OPTION('mission_enrollment_active', marker('GENERAL.ACTIVE_USERS')),
  SIMPLE_SELECTION_OPTION('user__status', marker('GENERAL.ENABLED_USERS')),
  SIMPLE_SELECTION_OPTION('user_deleted_from_workspace', marker('GENERAL.REMOVED_USERS')),
  {
    filterKey: 'job__name__in',
    type: 'autoComplete',
    customTemplate: 'jobsAc',
    label: marker('GENERAL.JOB'),
  },
  {
    filterKey: 'job_function__name__in',
    type: 'autoComplete',
    customTemplate: 'jobFunctionsAc',
    label: marker('GENERAL.JOB_FUNCTION'),
  },
];

export const MISSION_ENROLLMENTS_QUIZZES_OPTIONS: KpFilterOption[] = [
  {
    filterKey: 'mission_id__in',
    type: 'autoComplete',
    customTemplate: 'missionsAc',
    label: marker('GENERAL.MISSION'),
    placeholder: marker('FILTER.FILTER.SELECT_MAX_MISSIONS'),
    selectionLengthConfig: {
      min: 1,
      max: 3,
    },
  },
  {
    filterKey: 'user_id__in',
    type: 'autoComplete',
    customTemplate: 'usersAc',
    label: marker('GENERAL.USER'),
    placeholder: marker('FILTER.FILTER.SELECT_MAX_USERS'),
    selectionLengthConfig: {
      min: 1,
      max: 3,
    },
  },
];

export const TRAILS_LIST_OPTIONS: KpFilterOption[] = [
  {
    filterKey: 'created_date',
    type: 'dateRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.ENROLLMENT_DATE'),
    rangeConfig: {
      fromKey: 'created_date__gte',
      toKey: 'created_date__lte',
    },
  },
  {
    filterKey: 'duration_time',
    type: 'numericRange',
    label: marker('GENERAL.DURATION'),
    rangeConfig: {
      fromKey: 'duration_time__gte',
      toKey: 'duration_time__lte',
    },
    rangeOptions: ['less', 'more', 'between'],
    numericRangeConfig: {
      mask: 'Hh:m0',
      startPlaceHolder: 'HH:MM',
      endPlaceHolder: 'HH:MM',
      keepSpecialCharacters: true,
    },
  },
  {
    filterKey: 'user_creator_id__in',
    type: 'autoComplete',
    customTemplate: 'creatorsAc',
    label: marker('GENERAL.USER_CREATOR'),
  },
  LANGUAGE_DEFAULT_OPTION,
];

export const TRAILS_ENROLLMENTS_OPTIONS: KpFilterOption[] = [
  {
    filterKey: 'start_date',
    type: 'dateRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.ENROLLMENT_START_DATE'),
    rangeConfig: {
      fromKey: 'start_date__gte',
      toKey: 'start_date__lte',
    },
  },
  {
    filterKey: 'created_date',
    type: 'dateRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.ENROLLMENT_DATE'),
    rangeConfig: {
      fromKey: 'created_date__gte',
      toKey: 'created_date__lte',
    },
  },
  {
    filterKey: 'goal_date',
    type: 'dateRange',
    label: marker('GENERAL.OBJECTIVE_DATE'),
    rangeOptions: ['less', 'more', 'between'],
    rangeConfig: {
      fromKey: 'goal_date__gte',
      toKey: 'goal_date__lte',
    },
  },
  {
    filterKey: 'end_date',
    type: 'dateRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.CONCLUSION_DATE'),
    rangeConfig: {
      fromKey: 'end_date__gte',
      toKey: 'end_date__lte',
    },
  },
  SIMPLE_SELECTION_OPTION('give_up', marker('GENERAL.WAIVER')),
  {
    filterKey: 'learning_trail_id__in',
    type: 'autoComplete',
    customTemplate: 'trailsAc',
    label: marker('GENERAL.TRAIL'),
  },
  {
    filterKey: 'user_id__in',
    type: 'autoComplete',
    customTemplate: 'usersAc',
    label: marker('GENERAL.USER'),
  },
  {
    filterKey: 'status__in',
    label: marker('GENERAL.ENROLLMENT_STATUS'),
    type: 'selectMultiple',
    options: [
      { label: marker('ENROLLMENT_STATUSES.COMPLETED'), value: 'COMPLETED' },
      { label: marker('ENROLLMENT_STATUSES.ENROLLED'), value: 'ENROLLED' },
      { label: marker('ENROLLMENT_STATUSES.REFUSED'), value: 'REFUSED' },
      { label: marker('ENROLLMENT_STATUSES.REPROVED'), value: 'REPROVED' },
      { label: marker('ENROLLMENT_STATUSES.STARTED'), value: 'STARTED' },
      { label: marker('ENROLLMENT_STATUSES.VALIDATION_PENDING'), value: 'VALIDATION_PENDING' },
    ],
  },
  {
    filterKey: 'progress',
    type: 'percentRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.PROGRESS'),
    rangeConfig: {
      fromKey: 'progress__gte',
      toKey: 'progress__lte',
    },
  },
  {
    filterKey: 'user__related_user_leader_id__in',
    type: 'autoComplete',
    customTemplate: 'leadersAc',
    label: marker('GENERAL.USER_LEADER'),
  },
  LEARNING_TRAIL_LANGUAGE_DEFAULT_OPTION,
  {
    filterKey: 'user__country__in',
    type: 'search',
    label: marker('GENERAL.USER_COUNTRY'),
  },
  DIRECTORATE_OPTION(),
  SUBDIRECTORATE_OPTION(),
  AREA_OF_ACTIVITY_OPTION(),
  SIMPLE_SELECTION_OPTION('user__status', marker('GENERAL.ENABLED_USERS')),
  SIMPLE_SELECTION_OPTION('user_deleted_from_workspace', marker('GENERAL.REMOVED_USERS')),
  {
    filterKey: 'required',
    label: marker('GENERAL.ENROLLMENT_TYPE'),
    type: 'select',
    options: [
      { label: marker('ENROLLMENT_TYPES.FREE'), value: false },
      { label: marker('ENROLLMENT_TYPES.REQUIRED'), value: true },
    ],
  },
  SIMPLE_SELECTION_OPTION('learning_trail__deleted', marker('GENERAL.DELETED_TRAILS')),
  {
    filterKey: 'learning_trail__deleted_date',
    type: 'dateRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.DELETION_DATE'),
    rangeConfig: {
      fromKey: 'learning_trail__deleted_date__gte',
      toKey: 'learning_trail__deleted_date__lte',
    },
  },
];

export const TRAIL_CONCLUSION_RATE_OPTIONS: KpFilterOption[] = [
  {
    filterKey: 'learning_trail_step__learning_trail_id__in',
    type: 'autoComplete',
    customTemplate: 'trailsAc',
    label: marker('GENERAL.TRAIL'),
  },
];

export const ALL_USERS_OPTIONS: KpFilterOption[] = [
  SIMPLE_SELECTION_OPTION('status', marker('GENERAL.ENABLED_USERS')),
  {
    filterKey: 'country__in',
    type: 'search',
    label: marker('GENERAL.USER_COUNTRY'),
  },
  DIRECTORATE_OPTION(),
  SUBDIRECTORATE_OPTION(),
  AREA_OF_ACTIVITY_OPTION(),
  {
    filterKey: 'related_user_leader_id__in',
    type: 'autoComplete',
    customTemplate: 'leadersAc',
    label: marker('GENERAL.USER_LEADER'),
  },
  {
    filterKey: 'created_date',
    type: 'dateRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.REGISTRATION_DATE'),
    rangeConfig: {
      fromKey: 'created_date__gte',
      toKey: 'created_date__lte',
    },
  },
  {
    filterKey: 'activity',
    type: 'dateRange',
    rangeOptions: ['less', 'more', 'between'],
    label: 'Usuários ativos no período',
    rangeConfig: {
      fromKey: 'activity_gte_date',
      toKey: 'activity_lte_date',
    },
  },
];

export const USERS_ACCESS_OPTIONS: KpFilterOption[] = [
  AREA_OF_ACTIVITY_OPTION(),
  DIRECTORATE_OPTION(),
  {
    filterKey: 'learning_object_id__in',
    type: 'autoComplete',
    customTemplate: 'missionsAc',
    label: marker('GENERAL.MISSION'),
  },
  {
    filterKey: 'time_start',
    type: 'dateRange',
    rangeOptions: ['less', 'more', 'between'],
    label: marker('GENERAL.PERIOD'),
    rangeConfig: {
      fromKey: 'time_start__gte',
      toKey: 'time_start__lte',
    },
  },
  SUBDIRECTORATE_OPTION(),
  {
    filterKey: 'user_id__in',
    type: 'autoComplete',
    customTemplate: 'usersAc',
    label: marker('GENERAL.USER'),
  },
];
