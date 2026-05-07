import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChannelDetailPulsesReducers } from '../reducers';

export const getPulsesFeatureKey = 'channel-pulses-app';

export const selectPulsesAppstate =
  createFeatureSelector<ChannelDetailPulsesReducers.ChannelPulsesState>(getPulsesFeatureKey);

export const selectChannelPulses = createSelector(selectPulsesAppstate, ChannelDetailPulsesReducers.selectAll);

export const selectChannelPulsesFinished = createSelector(
  selectPulsesAppstate,
  (state: ChannelDetailPulsesReducers.ChannelPulsesState) => state.finished,
);

export const selectChannelPulsesPage = createSelector(
  selectPulsesAppstate,
  (state: ChannelDetailPulsesReducers.ChannelPulsesState) => state.currentPage,
);

export const selectChannelPulsesLoading = createSelector(
  selectPulsesAppstate,
  (state: ChannelDetailPulsesReducers.ChannelPulsesState) => state.loading,
);

export const selectPulsesEmpty = createSelector(
  selectChannelPulsesLoading,
  selectChannelPulses,
  (loading: boolean, pulses) => !loading && !pulses?.length,
);
