import { CustomSectionModel } from '@app/main/custom-sections/models/custom-sections';
import { PageResponse } from '@core/model/search-api';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { createAction, props } from '@ngrx/store';
import { SectionContentsFilter } from '../../models/section-contents-filter';
import { SECTION_CONTENT_TYPE } from '../../models/section-contents-type';

export const init = createAction('[Section Contents Page] Init', props<{ sectionId: string }>());

export const setInitialConfig = createAction(
  '[Section Contents Page] Set Initial Config',
  props<{ section: CustomSectionModel; contentType: SECTION_CONTENT_TYPE }>(),
);

export const loadSectionContents = createAction('[Section Contents Page] Load Section Contents');
export const loadSectionContentsSuccess = createAction(
  '[Section Contents Page] Load Section Contents Success',
  props<{ result: PageResponse<LearnContentCardData> }>(),
);
export const loadSectionContentsFailure = createAction('[Section Contents Page] Load Section Contents Failure');

export const loadMoreSectionContents = createAction('[Section Contents Page] Load More Section Contents]');
export const loadMoreSectionContentsSuccess = createAction(
  '[Section Contents Page] Load More Section Contents Success',
  props<{ result: PageResponse<LearnContentCardData> }>(),
);
export const loadMoreSectionContentsFailure = createAction(
  '[Section Contents Page] Load More Section Contents Failure',
);

export const filter = createAction('[Section Contents Page] Filter', props<{ filter: SectionContentsFilter }>());

export const resetState = createAction('[Section Contents Page] Reset State');
