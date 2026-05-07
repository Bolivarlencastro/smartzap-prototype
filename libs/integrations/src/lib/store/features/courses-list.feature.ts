import { createEntityAdapter, EntityState, Update } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CoursesListActions } from '../actions';
import { MirroredCoursesViewModel } from '../../models';
import { CoursesListFilter, MirroredCourse } from '@keeps-platform-frontend-workspace/kp-keeps';

export const COURSES_LIST_FEATURE_NAME = 'aluraCoursesList';

export interface CoursesListFeatureState extends EntityState<MirroredCourse> {
  categories: string[];
  loading: boolean;
  filter: CoursesListFilter;
  totalItems: number;
}

export const adapter = createEntityAdapter<MirroredCourse>();

export const coursesListInitialState: CoursesListFeatureState = adapter.getInitialState({
  categories: null,
  loading: false,
  filter: { page: 1, perPage: 10 },
  totalItems: 0,
});

export const coursesListReducer = createReducer(
  coursesListInitialState,

  on(
    CoursesListActions.loadCategoriesSuccess,
    (state, { categories }): CoursesListFeatureState => ({ ...state, categories }),
  ),

  on(
    CoursesListActions.loadCoursesList,
    (state): CoursesListFeatureState => adapter.removeAll({ ...state, loading: true }),
  ),

  on(
    CoursesListActions.loadCoursesListSuccess,
    (state, { response }): CoursesListFeatureState =>
      adapter.setAll(response.items, { ...state, loading: false, totalItems: response.total }),
  ),

  on(
    CoursesListActions.setPagination,
    (state, { pagination }): CoursesListFeatureState => ({
      ...state,
      filter: { ...state.filter, page: pagination.currentPage, perPage: pagination.perPage },
    }),
  ),

  on(
    CoursesListActions.sort,
    (state, { sort }): CoursesListFeatureState => ({
      ...state,
      filter: { ...state.filter, sort },
    }),
  ),

  on(
    CoursesListActions.filter,
    (state, { filter }): CoursesListFeatureState => ({
      ...state,
      filter: { ...state.filter, ...filter, page: 1 },
    }),
  ),

  on(
    CoursesListActions.search,
    (state, { search }): CoursesListFeatureState => ({
      ...state,
      filter: { ...state.filter, name: search, page: 1 },
    }),
  ),

  on(
    CoursesListActions.deleteCourse,
    CoursesListActions.toggleActiveCourse,
    (state): CoursesListFeatureState => ({ ...state, loading: true }),
  ),

  on(
    CoursesListActions.deleteCourseSuccess,
    (state, { courseIds }): CoursesListFeatureState => adapter.removeMany(courseIds, { ...state, loading: false }),
  ),

  on(CoursesListActions.toggleActiveCourseSuccess, (state, { data }): CoursesListFeatureState => {
    const updates: Update<MirroredCourse>[] = data.map((course) => ({
      id: course.id,
      changes: { isActive: course.isActive },
    }));
    return adapter.updateMany(updates, { ...state, loading: false });
  }),

  on(
    CoursesListActions.deleteCourseFailure,
    CoursesListActions.toggleActiveCourseFailure,
    (state): CoursesListFeatureState => ({ ...state, loading: false }),
  ),
);

export const coursesListFeature = createFeature({
  name: COURSES_LIST_FEATURE_NAME,
  reducer: coursesListReducer,
  extraSelectors: ({
    selectAluraCoursesListState,
    selectLoading,
    selectFilter,
    selectTotalItems,
    selectCategories,
  }) => ({
    selectViewModel: createSelector(
      adapter.getSelectors(selectAluraCoursesListState).selectAll,
      selectLoading,
      selectFilter,
      selectTotalItems,
      selectCategories,
      (items, loading, filter, totalItems, categories): MirroredCoursesViewModel => ({
        items,
        loading,
        pagination: {
          perPage: filter.perPage,
          currentPage: filter.page - 1, // MatPaginator current page is zero index based
          totalItems,
        },
        hasAppliedFilter:
          !!filter.name ||
          !!filter.category?.length ||
          !!filter.status?.length ||
          !!filter.created_date_gte ||
          !!filter.created_date_lte,
        categories,
      }),
    ),
  }),
});
