import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Tracking } from '../../model/tracking';
import { TrackingActions } from '../actions';

export const featureKey = 'tracking';
export interface State extends EntityState<Tracking> {
  isLoading: boolean;
}

export const adapter: EntityAdapter<Tracking> = createEntityAdapter<Tracking>({
  selectId: (nameofclass) => nameofclass.idGenerated,
});

export const initialState: State = adapter.getInitialState({
  isLoading: false,
});

export const reducer = createReducer(
  initialState,

  on(TrackingActions.clear, (): State => {
    return { ...initialState };
  }),

  on(TrackingActions.loadTrackingEnrolment, (state): State => {
    return { ...state, isLoading: true };
  }),

  on(TrackingActions.loadTrackingEnrolmentFailure, (): State => {
    return { ...initialState };
  }),

  on(TrackingActions.loadTrackingEnrolmentSuccess, (state, { trackings }): State => {
    return adapter.setAll(applyIdByCollection(trackings), {
      ...state,
      isLoading: false,
    });
  }),
);

export const applyIdByCollection = (trackings: Tracking[]) => {
  return trackings.map((tracking) => ({
    ...tracking,
    idGenerated: Math.random(),
  }));
};

export const { selectAll } = adapter.getSelectors();
