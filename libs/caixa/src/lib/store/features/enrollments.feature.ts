import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { CaixaSmartZapCourseEnrollmentDto, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { EnrollmentsActions } from '../actions';

const skippedEnrollmentStatuses = ['CANCELED', 'REFUSED'] as EnrollmentStatuses[];

export interface EnrollmentsFeatureState extends EntityState<CaixaSmartZapCourseEnrollmentDto> {
  isLoading: boolean;
}

const adapter = createEntityAdapter<CaixaSmartZapCourseEnrollmentDto>();

const enrollmentsInitialState = adapter.getInitialState<EnrollmentsFeatureState>({ isLoading: true });

const enrollmentsReducer = createReducer(
  enrollmentsInitialState,
  on(
    EnrollmentsActions.loadEnrollmentsSuccess,
    (state, { enrollments }): EnrollmentsFeatureState => adapter.setAll(enrollments, { ...state, isLoading: false }),
  ),

  on(EnrollmentsActions.reset, (state): EnrollmentsFeatureState => adapter.removeAll(state)),
);

export const enrollmentsFeature = createFeature({
  name: 'enrollments',
  reducer: enrollmentsReducer,
  extraSelectors: ({ selectEnrollmentsState }) => {
    const { selectAll } = adapter.getSelectors(selectEnrollmentsState);

    return {
      selectEnrollments: createSelector(selectAll, (enrollments) => {
        const enrollmentsMap: Record<string, CaixaSmartZapCourseEnrollmentDto> = {};

        for (const enrollment of enrollments) {
          if (skippedEnrollmentStatuses.includes(enrollment.status)) {
            continue;
          }
          enrollmentsMap[enrollment.course_id] = enrollment;
        }

        return enrollmentsMap;
      }),
      selectEnrollmentByCourseId: (courseId: string) =>
        createSelector(selectAll, (enrollments) =>
          enrollments.find(
            (enrollment) => enrollment.course_id === courseId && !skippedEnrollmentStatuses.includes(enrollment.status),
          ),
        ),
    };
  },
});
