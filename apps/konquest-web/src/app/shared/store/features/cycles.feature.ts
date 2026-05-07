import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, on } from '@ngrx/store';
import { CyclesActions } from '../actions';

export interface CyclesFeatureState extends EntityState<CycleDto> {
  isNormativeActive: boolean;
}

export const adapter: EntityAdapter<CycleDto> = createEntityAdapter<CycleDto>();

export const cyclesFeatureInitialState: CyclesFeatureState = adapter.getInitialState({
  isNormativeActive: false,
});

const featureReducer = createReducer(
  cyclesFeatureInitialState,
  on(CyclesActions.filterCyclesSuccess, (state, { results }): CyclesFeatureState => {
    return adapter.setAll(results, state);
  }),

  on(CyclesActions.reset, (state): CyclesFeatureState => {
    return adapter.removeAll(state);
  }),

  on(
    CyclesActions.fetchNormativeModuleSuccess,
    (state, { isNormativeActive }): CyclesFeatureState => ({ ...state, isNormativeActive }),
  ),
);

export const cyclesFeature = createFeature({
  name: 'enrollmentsNormativeCycles',
  reducer: featureReducer,
  extraSelectors: ({ selectEnrollmentsNormativeCyclesState }) => ({
    ...adapter.getSelectors(selectEnrollmentsNormativeCyclesState),
  }),
});
