import { createAction, props } from '@ngrx/store';
import { BannerMode, BannerSettings, CustomSettings, LearningResource } from '../../models/banner-settings';

export const openDialog = createAction('[Banner Settings] Open Dialog');

export const loadCustomSettings = createAction('[Banner Settings] Load Custom Settings');

export const setInitialSettings = createAction(
  '[Banner Settings] Set Initial Settings',
  props<{ data: BannerSettings }>(),
);

export const loadInternalContents = createAction(
  '[Banner Settings] Load Internal Contents',
  props<{ search?: string }>(),
);
export const loadInternalContentsSuccess = createAction(
  '[Banner Settings] Load Internal Contents Success',
  props<{ internalContents: LearningResource[] }>(),
);

export const setMode = createAction('[Banner Settings] Set Mode', props<{ mode: BannerMode }>());

export const confirmSaveRecommendationMode = createAction('[Banner Settings] Confirm Save Recommendation Mode');

export const saveRecommendationMode = createAction('[Banner Settings] Save Recommendation Mode');
export const saveRecommendationModeSuccess = createAction('[Banner Settings] Save Recommendation Mode Success');

export const publish = createAction('[Banner Settings] Publish', props<{ data: CustomSettings }>());
export const publishSuccess = createAction('[Banner Settings] Publish Success');
export const publishFailure = createAction('[Banner Settings] Publish Failure');

export const close = createAction('[Banner Settings] Close', props<{ dirtyForm: boolean }>());

export const reset = createAction('[Banner Settings] Reset');
