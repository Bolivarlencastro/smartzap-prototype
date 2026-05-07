import { CaixaCourse, CaixaCourseCategory, CourseListFilter } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CourseListActions } from '../actions';
import { CoursesListViewModel } from '../../models';

export interface CourseListFeatureState extends EntityState<CaixaCourse> {
  filter: CourseListFilter;
  currentOpenCourse: CaixaCourse;
  courseIdToOpen: string;
  isLoading: boolean;
  categories: CaixaCourseCategory[];
}

export const adapter = createEntityAdapter<CaixaCourse>();

export const courseListInitialState: CourseListFeatureState = adapter.getInitialState<CourseListFeatureState>({
  filter: { page: 1, perPage: 999 },
  courseIdToOpen: null,
  currentOpenCourse: null,
  isLoading: true,
  categories: [],
});

export const courseListReducer = createReducer(
  courseListInitialState,

  on(CourseListActions.loadCoursesSuccess, (state, { response }): CourseListFeatureState => {
    return adapter.setAll(response, {
      ...state,
      isLoading: false,
    });
  }),

  on(CourseListActions.loadCategoriesSuccess, (state, { categories }): CourseListFeatureState => {
    return { ...state, categories };
  }),

  on(
    CourseListActions.filterCourses,
    (state, { filter }): CourseListFeatureState => ({
      ...state,
      filter: { ...state.filter, search: filter.search, category_id: filter.category_id },
      isLoading: true,
    }),
  ),

  on(
    CourseListActions.saveCourseIdToOpenDetails,
    (state, { courseId }): CourseListFeatureState => ({ ...state, courseIdToOpen: courseId }),
  ),

  on(CourseListActions.openCourseDetails, (state, { course }): CourseListFeatureState => {
    return {
      ...state,
      currentOpenCourse: course,
      courseIdToOpen: null,
    };
  }),

  on(CourseListActions.detailsDialogClosed, (state): CourseListFeatureState => ({ ...state, currentOpenCourse: null })),
);

export const courseListFeature = createFeature({
  name: 'courseList',
  reducer: courseListReducer,
  extraSelectors: ({ selectCourseListState }) => {
    const { selectAll } = adapter.getSelectors(selectCourseListState);

    return {
      selectCourses: createSelector(selectAll, (courses) => courses),
      selectOpenCourse: createSelector(selectCourseListState, (state) => state.currentOpenCourse),
      selectCourseById: (id: string) =>
        createSelector(selectAll, (courses) => courses.find((course) => course.id === id)),
      selectVM: createSelector(
        selectCourseListState,
        (state): CoursesListViewModel => ({
          categories: state.categories,
          loading: state.isLoading,
        }),
      ),
    };
  },
});
