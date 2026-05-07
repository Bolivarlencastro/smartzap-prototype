import { marker } from '@jsverse/transloco-keys-manager/marker';
import { FilterGroupConfig, FilterGroupType } from '@keeps-platform-frontend-workspace/ui/kp-report-filter-dialog';

export const usersOverviewConfiguration: FilterGroupConfig[] = [
  {
    disabled: true,
    label: marker('USERS.FILTER.JOB'),
    value: 'job',
    icon: 'workspaces',
    type: FilterGroupType.AUTOCOMPLETE_SELECT,
    multiple: true,
  },
  {
    label: marker('USERS.FILTER.USER_LEADER'),
    value: 'leader',
    icon: 'group_add',
    type: FilterGroupType.AUTOCOMPLETE_SELECT,
    multiple: true,
  },
  {
    label: marker('USERS.FILTER.COMPLETION_RANGE'),
    value: 'completion_rate',
    icon: 'donut_large',
    type: FilterGroupType.PERCENT_RANGE,
  },
];

export const userDetailFilterConfiguration: FilterGroupConfig[] = [
  {
    label: marker('USERS.FILTER.PERFORMANCE'),
    value: 'performance',
    icon: 'donut_large',
    type: FilterGroupType.PERCENT_RANGE,
  },
  {
    label: marker('USERS.FILTER.MISSION_CATEGORY'),
    value: 'course_category',
    icon: 'label',
    type: FilterGroupType.AUTOCOMPLETE_SELECT,
    multiple: true,
  },
  {
    label: marker('USERS.FILTER.START_DATE'),
    value: 'start_date',
    icon: 'date_range',
    type: FilterGroupType.DATE_RANGE,
  },
  {
    label: marker('USERS.FILTER.END_DATE'),
    value: 'end_date',
    icon: 'date_range',
    type: FilterGroupType.DATE_RANGE,
  },
];
