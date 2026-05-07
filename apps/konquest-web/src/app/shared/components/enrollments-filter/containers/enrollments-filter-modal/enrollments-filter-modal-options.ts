import { KpFilterOption, KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { EnrollmentType } from '../../model/enrollment-filter';

export function enrollmentsFilterOptions(
  type: EnrollmentType,
  statusOptions: KpFilterSelectOption[],
): KpFilterOption[] {
  const options: KpFilterOption[] = [
    {
      filterKey: 'start_date',
      type: 'dateRange',
      label: marker('ENROLLMENTS.FILTER.START_DATE'),
      rangeConfig: {
        fromKey: 'start_date__gte',
        toKey: 'start_date__lte',
      },
      rangeOptions: ['less', 'more', 'between'],
    },
    {
      filterKey: 'end_date',
      type: 'dateRange',
      label: marker('ENROLLMENTS.FILTER.END_DATE'),
      rangeConfig: {
        fromKey: 'end_date__gte',
        toKey: 'end_date__lte',
      },
      rangeOptions: ['less', 'more', 'between'],
    },
    {
      filterKey: 'performance',
      type: 'percentRange',
      rangeConfig: { fromKey: 'performance__gte', toKey: 'performance__lte' },
      rangeOptions: ['less', 'more', 'between'],
      label: marker('ENROLLMENTS.FILTER.PERFORMANCE'),
    },
    {
      filterKey: 'status',
      type: 'selectMultiple',
      label: marker('ENROLLMENTS.FILTER.STATUS'),
      options: statusOptions,
    },
  ];

  if (type === 'EVENT') {
    options.unshift(
      {
        filterKey: 'created_date',
        type: 'dateRange',
        label: marker('ENROLLMENTS.FILTER.ENROLLMENT_CREATION_DATE'),
        rangeConfig: {
          fromKey: 'created_date__gte',
          toKey: 'created_date__lte',
        },
        rangeOptions: ['less', 'more', 'between'],
      },
      {
        filterKey: 'event_date',
        type: 'dateRange',
        label: marker('ENROLLMENTS.FILTER.ENROLLMENT_OCCURRENCE_DATE'),
        rangeConfig: {
          fromKey: 'event_date__gte',
          toKey: 'event_date__lte',
        },
        rangeOptions: ['less', 'more', 'between'],
      },
    );

    options.push(
      {
        filterKey: 'mission_category',
        type: 'autoComplete',
        customTemplate: 'categoriesAc',
        label: marker('ENROLLMENTS.FILTER.CATEGORY'),
      },
      {
        filterKey: 'instructor',
        type: 'autoComplete',
        customTemplate: 'instructorsAc',
        label: marker('ENROLLMENTS.FILTER.INSTRUCTOR'),
      },
    );
  }

  return options;
}
