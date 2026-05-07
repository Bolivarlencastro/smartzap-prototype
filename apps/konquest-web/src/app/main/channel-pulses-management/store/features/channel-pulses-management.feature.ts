import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import {
  ChannelPulsesManagementFilter,
  ChannelPulsesManagementViewModel,
  PulseManagementItem,
} from '../../models/channel-pulses-management.model';
import { ChannelPulsesManagementActions } from '../actions';

export interface ChannelPulsesManagementFeatureState {
  channelId: string;
  channelName: string;
  pulsesLoading: boolean;
  pulses: PulseManagementItem[];
  filter: ChannelPulsesManagementFilter;
  totalItems: number;
}

const initialState: ChannelPulsesManagementFeatureState = {
  channelId: null,
  channelName: null,
  pulsesLoading: false,
  pulses: [],
  filter: { page: 1, per_page: 10 },
  totalItems: 0,
};

const reducer = createReducer(
  initialState,

  on(
    ChannelPulsesManagementActions.init,
    (state, { channelId }): ChannelPulsesManagementFeatureState => ({
      ...state,
      channelId,
      channelName: null,
      pulsesLoading: true,
    }),
  ),

  on(
    ChannelPulsesManagementActions.loadChannelSuccess,
    (state, { channelName }): ChannelPulsesManagementFeatureState => ({ ...state, channelName }),
  ),

  on(
    ChannelPulsesManagementActions.loadPulses,
    (state): ChannelPulsesManagementFeatureState => ({ ...state, pulsesLoading: true }),
  ),

  on(
    ChannelPulsesManagementActions.loadPulsesSuccess,
    (state, { pulses, total }): ChannelPulsesManagementFeatureState => ({
      ...state,
      pulses,
      totalItems: total,
      pulsesLoading: false,
    }),
  ),

  on(
    ChannelPulsesManagementActions.loadPulsesFailure,
    (state): ChannelPulsesManagementFeatureState => ({ ...state, pulsesLoading: false }),
  ),

  on(
    ChannelPulsesManagementActions.setPagination,
    (state, { page, perPage }): ChannelPulsesManagementFeatureState => ({
      ...state,
      filter: { ...state.filter, page, per_page: perPage },
    }),
  ),

  on(
    ChannelPulsesManagementActions.setFilter,
    (state, { filter }): ChannelPulsesManagementFeatureState => ({
      ...state,
      filter: { ...state.filter, ...filter, page: 1 },
    }),
  ),

  on(ChannelPulsesManagementActions.reset, (): ChannelPulsesManagementFeatureState => initialState),
);

export const channelPulsesManagementFeature = createFeature({
  name: 'channelPulsesManagement',
  reducer,
  extraSelectors: ({
    selectChannelId,
    selectChannelName,
    selectPulsesLoading,
    selectPulses,
    selectFilter,
    selectTotalItems,
  }) => ({
    selectViewModel: createSelector(
      selectChannelId,
      selectChannelName,
      selectPulsesLoading,
      selectPulses,
      selectFilter,
      selectTotalItems,
      (channelId, channelName, pulsesLoading, pulses, filter, totalItems): ChannelPulsesManagementViewModel => ({
        channelId,
        channelName,
        pulsesLoading,
        pulses,
        filter,
        totalItems,
      }),
    ),
  }),
});
