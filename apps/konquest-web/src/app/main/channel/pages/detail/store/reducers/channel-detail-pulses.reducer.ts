import { createReducer, on } from '@ngrx/store';
import { ChannelDetailActions, ChannelDetailPulsesActions } from '../actions';
import { PulseCardDto } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export interface ChannelPulsesState extends EntityState<PulseCardDto> {
  loading: boolean;
  finished: boolean;
  currentPage: number;
}

export const channelPulsesAdapter: EntityAdapter<PulseCardDto> = createEntityAdapter<PulseCardDto>();

export const initialState: ChannelPulsesState = channelPulsesAdapter.getInitialState({
  loading: false,
  finished: false,
  currentPage: 1,
});

export const reducers = createReducer(
  initialState,

  on(ChannelDetailPulsesActions.getChannelPulses, (state): ChannelPulsesState => {
    return channelPulsesAdapter.removeAll({ ...state, loading: true });
  }),

  on(ChannelDetailPulsesActions.getChannelPulsesSuccess, (state, { payload }): ChannelPulsesState => {
    const { items, page, last_page } = payload;
    const finished = page === last_page;
    return channelPulsesAdapter.setAll(items, { ...state, loading: false, finished, currentPage: page });
  }),

  on(ChannelDetailPulsesActions.loadMorePulses, (state): ChannelPulsesState => {
    return { ...state, loading: !state.finished };
  }),

  on(ChannelDetailPulsesActions.loadMorePulsesSuccess, (state, { payload }): ChannelPulsesState => {
    const { items, page, last_page } = payload;
    const finished = page === last_page;
    return channelPulsesAdapter.addMany(items, { ...state, loading: false, finished, currentPage: page });
  }),

  on(ChannelDetailPulsesActions.getChannelPulsesFailure, (state): ChannelPulsesState => ({ ...state, loading: false })),

  on(ChannelDetailActions.createNewPulseUploadSuccess, (state, { pulse }): ChannelPulsesState => {
    return channelPulsesAdapter.addOne(pulse, state);
  }),

  on(
    ChannelDetailPulsesActions.addPulseBookmarkSuccess,
    ChannelDetailPulsesActions.removePulseBookmarkSuccess,
    (state, { payload }): ChannelPulsesState => channelPulsesAdapter.updateOne(payload, state),
  ),

  on(ChannelDetailPulsesActions.resetState, (): ChannelPulsesState => initialState),
);

export const { selectAll } = channelPulsesAdapter.getSelectors();
