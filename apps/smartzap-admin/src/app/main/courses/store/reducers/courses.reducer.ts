import { SortParams } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Page } from 'app/shared/model';
import { Course } from '../../model';
import * as CoursesActions from '../actions/courses.actions';

export const featureKey = 'collection';
export interface State extends EntityState<Course> {
  isLoading: boolean;
  term: string;
  page: Page;
  filters: CoursesFilter;
  sort?: SortParams;
}

export interface CoursesFilter {
  languages: string[];
  categories: string[];
  statuses: string[];
  createdByMe: boolean;
}

export const adapter: EntityAdapter<Course> = createEntityAdapter<Course>();

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  term: '',
  page: {
    count: 0,
    per_page: 10,
    page: 1,
    total_pages: 0,
  },
  filters: {
    languages: [],
    categories: [],
    statuses: [],
    createdByMe: false,
  },
  sort: undefined,
});

export const reducer = createReducer(
  initialState,

  on(
    CoursesActions.reset,
    (state): State =>
      adapter.removeAll({
        state,
        ...initialState,
      }),
  ),

  on(CoursesActions.setFilter, (state, { filters }): State => {
    return { ...state, filters };
  }),

  on(CoursesActions.setSort, (state, { sort }): State => {
    return { ...state, sort };
  }),

  on(CoursesActions.loadCourses, (state): State => {
    return { ...state, isLoading: true };
  }),

  on(CoursesActions.loadCoursesSuccess, (state, { payload }): State => {
    const { collection, page } = payload;
    return adapter.setAll(collection, {
      ...state,
      page,
      isLoading: false,
    });
  }),

  on(CoursesActions.loadCoursesFailure, (state): State => {
    return { ...state, ...initialState };
  }),

  on(CoursesActions.searchCourses, (state, { term }): State => {
    return { ...state, term };
  }),
);

// get the selectors
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
