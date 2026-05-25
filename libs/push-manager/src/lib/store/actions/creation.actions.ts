import {
  CreateCampaignParamsModel,
  PushTemplate,
  SmartzapCourse,
  ValidateCampaignResponseModel,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { createAction, props } from '@ngrx/store';

const loadData = createAction('[Push Manager - Creation] Load Data');
const loadDataSuccess = createAction(
  '[Push Manager - Creation] Load Data Success',
  props<{ templates: PushTemplate[] }>(),
);
const loadDataFailure = createAction('[Push Manager - Creation] Load Data Failure');

const loadCourses = createAction('[Push Manager - Creation] Load Courses', props<{ term: string }>());
const loadCoursesSuccess = createAction(
  '[Push Manager - Creation] Load Courses Success',
  props<{ courses: SmartzapCourse[] }>(),
);

const validateCampaign = createAction(
  '[Push Manager - Creation] Validate Campaign',
  props<{ template_id: string; file: File; template_variables?: string }>(),
);
const validateCampaignSuccess = createAction(
  '[Push Manager - Creation] Validate Campaign Success',
  props<{
    validationResult: ValidateCampaignResponseModel;
    validatedWith: { templateId: string; templateVariables: string; fileName: string };
  }>(),
);
const validateCampaignFailure = createAction('[Push Manager - Creation] Validate Campaign Failure');

const createCampaign = createAction(
  '[Push Manager - Creation] Create Campaign',
  props<{ params: CreateCampaignParamsModel }>(),
);
const createCampaignSuccess = createAction('[Push Manager - Creation] Create Campaign Success');
const createCampaignFailure = createAction('[Push Manager - Creation] Create Campaign Failure');

const reset = createAction('[Push Manager - Creation] Reset');

export const CreationActions = {
  loadData,
  loadDataSuccess,
  loadDataFailure,
  loadCourses,
  loadCoursesSuccess,
  validateCampaign,
  validateCampaignSuccess,
  validateCampaignFailure,
  createCampaign,
  createCampaignSuccess,
  createCampaignFailure,
  reset,
};
