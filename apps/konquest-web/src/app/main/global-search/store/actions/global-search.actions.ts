import { PulseType } from '@core/model/pulse.model';
import { createAction, props } from '@ngrx/store';
import { GlobalSearchContentNavigate, ItemsResponse } from '../../model/global-search.model';
import {
  GlobalSearchFilter,
  GlobalSearchFilterOptions,
} from '@keeps-platform-frontend-workspace/ui/kp-global-search-side-filter';
import { ContentTypeTab } from '@keeps-platform-frontend-workspace/ui/kp-global-search-list';

export const loadItems = createAction('[Global Search] Load Items');

export const loadItemsSuccess = createAction(
  '[Global Search] Load Items Success',
  props<{ response: ItemsResponse }>(),
);

export const loadItemsFailure = createAction('[Global Search] Load Items Failure', props<{ error: Error }>());

export const updateFilter = createAction(
  '[Global Search] Update Filter',
  props<{ filter: GlobalSearchFilter; filterOptions?: GlobalSearchFilterOptions }>(),
);

export const fetchMoreItems = createAction('[Global Search] Fetch More Items');

export const fetchMoreItemsSuccess = createAction(
  '[Global Search] Fetch More Items Success',
  props<{ response: ItemsResponse }>(),
);

export const fetchMoreItemsFailure = createAction(
  '[Global Search] Fetch More Items Failure',
  props<{ error: Error }>(),
);

export const openDialog = createAction('[Global Search] Open Dialog');

export const closeDialog = createAction('[Global Search] Close Dialog');

export const openMissionDetails = createAction('[Global Search] Open Mission Details', props<{ id: string }>());

export const openEventDetails = createAction('[Global Search] Open Event Details', props<{ id: string }>());

export const openTrailDetails = createAction('[Global Search] Open Trail Details', props<{ id: string }>());

export const openChannelDetails = createAction('[Global Search] Open Channel Details', props<{ id: string }>());

export const openPulseDetails = createAction(
  '[Global Search] Open Pulse Details',
  props<{ id: string; pulse_type: PulseType }>(),
);

export const resetState = createAction('[Global Search] Reset State');

export const cleanFilter = createAction('[Global Search] Clean Filter');

export const openContentOnTrail = createAction('[Global Search] Open Content On Trail', props<{ id: string }>());

export const openContent = createAction('[Global Search] Open Content', props<{ item: GlobalSearchContentNavigate }>());

export const getTabs = createAction('[Global Search] Get Tabs', props<{ tabs: ContentTypeTab[] }>());
