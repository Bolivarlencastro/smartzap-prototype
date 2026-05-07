import { CoursesFilterModel, PushTemplate, SmartzapCourse } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CreationViewModel } from '../../models/creation';
import { CreationActions } from '../actions';

export interface CreationFeatureState {
  templates: PushTemplate[];
  loading: boolean;
  courses: SmartzapCourse[];
  coursesFilter: CoursesFilterModel;
}

export const creationInitialState: CreationFeatureState = {
  templates: [],
  loading: false,
  courses: [],
  coursesFilter: {
    page: 1,
    per_page: 50,
  },
};

const reducer = createReducer(
  creationInitialState,

  on(CreationActions.loadData, (state): CreationFeatureState => ({ ...state, loading: true })),
  on(
    CreationActions.loadDataSuccess,
    (state, { templates }): CreationFeatureState => ({ ...state, templates, loading: false }),
  ),
  on(CreationActions.loadDataFailure, (state): CreationFeatureState => ({ ...state, loading: false })),

  on(CreationActions.loadCourses, (state, { term }): CreationFeatureState => {
    const filter = term ? { ...state.coursesFilter, name__ilike: term } : { ...creationInitialState.coursesFilter };

    return {
      ...state,
      coursesFilter: filter,
    };
  }),
  on(CreationActions.loadCoursesSuccess, (state, { courses }): CreationFeatureState => ({ ...state, courses })),
);

export const creationFeature = createFeature({
  name: 'pm-creation',
  reducer,
  extraSelectors: ({ selectTemplates, selectLoading, selectCourses }) => ({
    selectViewModel: createSelector(
      selectTemplates,
      selectLoading,
      selectCourses,
      (templates, loading, courses): CreationViewModel => ({
        templates,
        loading,
        courses,
      }),
    ),
  }),
});
