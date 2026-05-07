import { Pagination } from '@core/model';
import { createAction, props } from '@ngrx/store';
import { ChannelType } from '../../channel.model';

export const getChannelTypes = createAction('[ChannelTypes] Get Channel Types');

export const getChannelTypesSuccess = createAction(
  '[ChannelTypes] Get Channel Types Success',
  props<{ payload: Pagination<ChannelType> }>(),
);

export const getChannelTypesFailure = createAction(
  '[ChannelTypes] Get Channel Types Failure',
  props<{ errorMsg: string }>(),
);
