import { KpFilterOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const cycleEnrollmentsFilterOptions: KpFilterOption[] = [
  {
    filterKey: 'deadline',
    type: 'dateRange',
    rangeConfig: { fromKey: 'deadlineGte', toKey: 'deadlineLte' },
    label: marker('REGULATORY_COMPLIANCE.FILTERS_PLACEHOLDERS.EXPIRATION_DATE'),
  },
  {
    filterKey: 'complianceId',
    type: 'autoComplete',
    customTemplate: 'normativeAc',
    label: marker('REGULATORY_COMPLIANCE.FILTERS_PLACEHOLDERS.NORMATIVE'),
  },
  {
    filterKey: 'learningObjectId',
    type: 'autoComplete',
    customTemplate: 'learningObjectAc',
    label: marker('REGULATORY_COMPLIANCE.FILTERS_PLACEHOLDERS.LEARNING_OBJECT'),
  },
  {
    filterKey: 'userId',
    type: 'autoComplete',
    customTemplate: 'userAc',
    label: marker('REGULATORY_COMPLIANCE.FILTERS_PLACEHOLDERS.USER'),
  },
  {
    filterKey: 'relatedUserLeaderId',
    type: 'autoComplete',
    customTemplate: 'leaderAc',
    label: marker('REGULATORY_COMPLIANCE.FILTERS_PLACEHOLDERS.LEADER'),
  },
  {
    filterKey: 'status',
    label: marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.TABLE.STATUS'),
    type: 'selectMultiple',
    options: [
      { label: marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.EXPIRED'), value: 'EXPIRED' },
      { label: marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.EXPIRING'), value: 'EXPIRING' },
      { label: marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.IN_PROGRESS'), value: 'IN_PROGRESS' },
      { label: marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.RENEWED'), value: 'COMPLETED' },
      { label: marker('REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.STATUS.INACTIVE'), value: 'DISABLED' },
    ],
  },
];
