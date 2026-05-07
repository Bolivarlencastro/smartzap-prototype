import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Course } from '../../../models/course';
import { ListFilter, ListViewModel } from '../../../models/list';
import { CourseListActions } from '../actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export const COURSES_LIST_FEATURE_KEY = 'lpCoursesList';

export interface CourseListFeatureState extends EntityState<Course> {
  loading: boolean;
  filter: ListFilter;
  count: number;
}

const adapter: EntityAdapter<Course> = createEntityAdapter<Course>({ selectId: (c) => c.course_id });

export const courseListInitialState: CourseListFeatureState = adapter.getInitialState({
  loading: false,
  filter: { page: 1, per_page: 10 },
  count: null,
});

export const courseListReducer = createReducer(
  courseListInitialState,

  on(CourseListActions.fetchCourses, (state): CourseListFeatureState => ({ ...state, loading: true })),

  on(CourseListActions.fetchCoursesSuccess, (state, { response }): CourseListFeatureState => {
    return adapter.setAll(response.items, { ...state, loading: false, count: response.total });
  }),

  on(CourseListActions.fetchCoursesFailure, (state): CourseListFeatureState => ({ ...state, loading: false })),

  on(
    CourseListActions.search,
    (state, { search }): CourseListFeatureState => ({ ...state, filter: { ...state.filter, search, page: 1 } }),
  ),

  on(
    CourseListActions.sort,
    (state, { sort }): CourseListFeatureState => ({ ...state, filter: { ...state.filter, sort } }),
  ),

  on(
    CourseListActions.setPagination,
    (state, { page, per_page }): CourseListFeatureState => ({ ...state, filter: { ...state.filter, page, per_page } }),
  ),
);

export const courseListFeature = createFeature({
  name: COURSES_LIST_FEATURE_KEY,
  reducer: courseListReducer,
  extraSelectors: ({ selectLpCoursesListState, selectLoading, selectFilter, selectCount }) => ({
    selectViewModel: createSelector(
      adapter.getSelectors(selectLpCoursesListState).selectAll,
      selectLoading,
      selectFilter,
      selectCount,
      (courses, loading, filter, count): ListViewModel<Course> => ({
        data: courses,
        loading,
        filter,
        count,
      }),
    ),
    selectLoaded: createSelector(adapter.getSelectors(selectLpCoursesListState).selectAll, (items) => !!items?.length),
  }),
});
