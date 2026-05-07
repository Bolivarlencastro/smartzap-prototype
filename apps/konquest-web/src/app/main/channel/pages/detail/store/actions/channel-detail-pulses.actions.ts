import { createAction, props } from '@ngrx/store';
import { PulseCardDto } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';
import { PageResponse } from '@core/model/search-api';
import { Update } from '@ngrx/entity';

export const getChannelPulses = createAction('[Channel Detail] Get Pulses', props<{ channelId: string }>());

export const getChannelPulsesSuccess = createAction(
  '[Channel Detail] Get Pulses Success',
  props<{ payload: PageResponse<PulseCardDto> }>(),
);

export const getChannelPulsesFailure = createAction('[Channel Detail] Get Pulses Failure');

export const loadMorePulses = createAction('[Channel Detail] Load More Pulses');

export const loadMorePulsesSuccess = createAction(
  '[Channel Detail] Load More Pulses Success',
  props<{ payload: PageResponse<PulseCardDto> }>(),
);

export const addPulseBookmark = createAction('[Channel Detail] Add Pulse Bookmark', props<{ pulse: PulseCardDto }>());

export const addPulseBookmarkSuccess = createAction(
  '[Channel Detail] Add Pulse Bookmark Success',
  props<{ payload: Update<PulseCardDto> }>(),
);

export const addPulseBookmarkFailure = createAction(
  '[Channel Detail] Add Pulse Bookmark Failure',
  props<{ error: Error }>(),
);

export const removePulseBookmark = createAction(
  '[Channel Detail] Remove Pulse Bookmark',
  props<{ pulse: PulseCardDto }>(),
);

export const removePulseBookmarkSuccess = createAction(
  '[Channel Detail] Remove Pulse Bookmark Success',
  props<{ payload: Update<PulseCardDto> }>(),
);

export const removePulseBookmarkFailure = createAction(
  '[Channel Detail] Remove Pulse Bookmark Failure',
  props<{ error: Error }>(),
);

/******************************/
/*****    Reset State    ******/
/******************************/
export const resetState = createAction('[Channel Detail Pulse] Reset State');
