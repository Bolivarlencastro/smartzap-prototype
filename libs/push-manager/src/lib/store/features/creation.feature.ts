import {
  CoursesFilterModel,
  PushTemplate,
  SmartzapCourse,
  ValidateCampaignResponseModel,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CreationViewModel, ValidatedWith } from '../../models/creation';
import { CreationActions } from '../actions';

export interface CreationFeatureState {
  templates: PushTemplate[];
  loading: boolean;
  courses: SmartzapCourse[];
  coursesFilter: CoursesFilterModel;
  validationResult: ValidateCampaignResponseModel | null;
  validatedWith: ValidatedWith | null;
  validating: boolean;
  submitting: boolean;
}

export const creationInitialState: CreationFeatureState = {
  templates: [],
  loading: false,
  courses: [],
  coursesFilter: {
    page: 1,
    per_page: 50,
  },
  validationResult: null,
  validatedWith: null,
  validating: false,
  submitting: false,
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

  on(CreationActions.validateCampaign, (state): CreationFeatureState => ({ ...state, validating: true })),
  on(
    CreationActions.validateCampaignSuccess,
    (state, { validationResult, validatedWith }): CreationFeatureState => ({
      ...state,
      validating: false,
      validationResult,
      validatedWith,
    }),
  ),
  on(CreationActions.validateCampaignFailure, (state): CreationFeatureState => ({ ...state, validating: false })),

  on(CreationActions.createCampaign, (state): CreationFeatureState => ({ ...state, submitting: true })),
  on(CreationActions.createCampaignSuccess, (state): CreationFeatureState => ({ ...state, submitting: false })),
  on(CreationActions.createCampaignFailure, (state): CreationFeatureState => ({ ...state, submitting: false })),

  on(CreationActions.reset, (): CreationFeatureState => creationInitialState),
);

export const creationFeature = createFeature({
  name: 'pm-creation',
  reducer,
  extraSelectors: ({
    selectTemplates,
    selectLoading,
    selectCourses,
    selectValidationResult,
    selectValidatedWith,
    selectValidating,
    selectSubmitting,
  }) => ({
    selectViewModel: createSelector(
      selectTemplates,
      selectLoading,
      selectCourses,
      selectValidationResult,
      selectValidatedWith,
      selectValidating,
      selectSubmitting,
      (templates, loading, courses, validationResult, validatedWith, validating, submitting): CreationViewModel => ({
        templates,
        loading,
        courses,
        validationResult,
        validatedWith,
        validating,
        submitting,
      }),
    ),
  }),
});
