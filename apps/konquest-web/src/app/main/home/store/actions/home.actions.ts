import { createAction, props } from '@ngrx/store';
import { HomePageType, HomeSection } from '../../models/home';

export const init = createAction('[Home] Init');

export const setActiveFeatures = createAction(
  '[Home] Set Active Features',
  props<{ highlights: boolean; trails: boolean; courses: boolean; events: boolean }>(),
);

export const loadSections = createAction('[Home] Load Sections', props<{ id: HomePageType }>());
export const loadSectionsSuccess = createAction('[Home] Load Sections Success', props<{ sections: HomeSection[] }>());
export const loadSectionsFailure = createAction('[Home] Load Sections Failure');
