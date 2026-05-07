import { Course, EnrollmentResume, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ProgressPanelViewModel } from '../../models';
import { CourseActions } from '../actions';
import { format } from 'date-fns';

export const classroomCourseFeatureKey = 'classroomCourse';

export interface CourseFeatureState {
  course: Course | null;
  loading: boolean;
  rollbackPath: string | null;
  isGoalDateMenuOpen: boolean;
  enrollmentResume: EnrollmentResume;
  certificateUrl: string | null;
  hasGamification: boolean;
  isViewingAsUser: boolean;
}

export const classroomCourseInitialState: CourseFeatureState = {
  course: null,
  loading: false,
  rollbackPath: null,
  isGoalDateMenuOpen: false,
  enrollmentResume: null,
  certificateUrl: null,
  hasGamification: false,
  isViewingAsUser: false,
};

const classroomCourseReducer = createReducer(
  classroomCourseInitialState,

  on(
    CourseActions.loadCourse,
    (state, { rollbackPath, isViewingAsUser }): CourseFeatureState => ({
      ...state,
      loading: true,
      rollbackPath,
      isViewingAsUser,
    }),
  ),

  on(CourseActions.loadCourseSuccess, (state, { course }): CourseFeatureState => {
    return {
      ...state,
      loading: false,
      course,
    };
  }),

  on(
    CourseActions.loadGamification,
    (state, { hasGamification }): CourseFeatureState => ({ ...state, hasGamification }),
  ),

  on(CourseActions.toggleGoalDateMenu, (state, { value }): CourseFeatureState => {
    return {
      ...state,
      isGoalDateMenuOpen: value,
    };
  }),

  on(CourseActions.updateGoalDateSuccess, (state, { date }): CourseFeatureState => {
    const goal_date = format(date, 'yyyy-MM-dd');

    return {
      ...state,
      course: {
        ...state.course,
        enrollment: {
          ...state.course.enrollment,
          goal_date,
        },
      },
    };
  }),

  on(CourseActions.finishCourseSuccess, (state, { enrollmentResult }): CourseFeatureState => {
    const updatedEnrollment = enrollmentResult.enrollment;
    const enrollmentResume = enrollmentResult.resume;
    return { ...state, course: { ...state.course, enrollment: updatedEnrollment }, enrollmentResume };
  }),

  on(CourseActions.loadCertificateSuccess, (state, { certificateUrl }): CourseFeatureState => {
    return { ...state, certificateUrl };
  }),

  on(CourseActions.reset, (): CourseFeatureState => classroomCourseInitialState),
);

export const classroomCourseFeature = createFeature({
  name: classroomCourseFeatureKey,
  reducer: classroomCourseReducer,
  extraSelectors: ({ selectClassroomCourseState, selectIsGoalDateMenuOpen }) => ({
    selectCourseName: createSelector(selectClassroomCourseState, ({ course }) => course?.name),
    selectEnrollment: createSelector(selectClassroomCourseState, ({ course }) => course?.enrollment),
    selectCertificateAvailable: createSelector(selectClassroomCourseState, ({ course, isViewingAsUser }) =>
      isViewingAsUser ? false : course?.enrollment?.status === EnrollmentStatuses.COMPLETED,
    ),
    selectProgressPanel: createSelector(
      selectClassroomCourseState,
      selectIsGoalDateMenuOpen,
      ({ course, isGoalDateMenuOpen, isViewingAsUser }): ProgressPanelViewModel => {
        const goalDate = isViewingAsUser ? null : parseGoalDate(course);
        return {
          isGoalDateMenuOpen,
          displayGoalDateEdit: isViewingAsUser ? false : displayGoalDateEdit(course, goalDate),
          cards: [
            {
              id: 'goal-date',
              title: marker('CLASSROOM.PROGRESS_PANEL.GOAL_DATE.TITLE'),
              infoDialogData: {
                title: marker('CLASSROOM.PROGRESS_PANEL.GOAL_DATE.DIALOG_TITLE'),
                description: marker('CLASSROOM.PROGRESS_PANEL.GOAL_DATE.DIALOG_DESCRIPTION'),
              },
              referenceValue: goalDate,
              value: goalDate,
            },
          ],
        };
      },
    ),
    selectMinTimePercentage: createSelector(
      selectClassroomCourseState,
      (state) => state?.course?.min_time_in_content || 0.1,
    ),
  }),
});

function parseGoalDate(course: Course): Date | null {
  if (!course?.enrollment?.goal_date) {
    return null;
  }
  return new Date(`${course?.enrollment?.goal_date}T00:00:00`);
}

function displayGoalDateEdit(course: Course, goalDate: Date | null): boolean {
  const allowedStatuses = [EnrollmentStatuses.STARTED, EnrollmentStatuses.ENROLLED];
  return goalDate && !course?.enrollment?.required && allowedStatuses.includes(course?.enrollment?.status);
}
