import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KpFilterOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';

export const evaluationsFilterOptions: KpFilterOption[] = [
  {
    filterKey: 'created_date',
    type: 'dateRange',
    label: marker('EVALUATIONS_FILTER.EVALUATION_DATE'),
    rangeConfig: {
      fromKey: 'created_date__gte',
      toKey: 'created_date__lte',
    },
    rangeOptions: ['less', 'more', 'between'],
  },
  {
    filterKey: 'sentiment_analysis',
    type: 'select',
    label: marker('EVALUATIONS_FILTER.COMMENT_TYPE'),
    options: [
      {
        value: 'POSITIVE',
        label: marker('EVALUATIONS_FILTER.COMMENT_TYPE_OPTIONS.POSITIVE'),
      },
      {
        value: 'NEGATIVE',
        label: marker('EVALUATIONS_FILTER.COMMENT_TYPE_OPTIONS.NEGATIVE'),
      },
      {
        value: 'NEUTRAL',
        label: marker('EVALUATIONS_FILTER.COMMENT_TYPE_OPTIONS.NEUTRAL'),
      },
    ],
  },
];
