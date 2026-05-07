import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { SectionContentItemEvent } from 'app/main/section-contents/models/section-content-item-event';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';

export const executeActionNoopResult = createAction('[Section Content Item] Execute Action Noop Result');

export const executeActionErrorResult = createAction(
  '[Section Content Item] Execute Action Error Result',
  props<{
    error: unknown;
  }>(),
);

export const executeAction = createAction(
  '[Section Content Item] Execute Action',
  props<{ event: SectionContentItemEvent }>(),
);

export const updateItemActionResult = createAction(
  '[Section Content Item] Update Item Action Result',
  props<{ update: Update<LearnContentCardData> }>(),
);
