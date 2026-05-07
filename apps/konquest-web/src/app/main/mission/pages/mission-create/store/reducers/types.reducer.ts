import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { MissionType } from 'app/main/mission/mission.model';
import { MissionTypesActions } from '../actions';

export const typesFeatureKey = 'types';

export interface MissionTypesState extends EntityState<MissionType> {
  loaded: boolean;
}

export const adapter = createEntityAdapter<MissionType>();

export const initialState: MissionTypesState = adapter.getInitialState({ loaded: false });

export const typesReducer = createReducer(
  initialState,

  on(MissionTypesActions.loadTypesSuccess, (state, { types }): MissionTypesState => {
    return adapter.setAll(types, { ...state, loaded: true });
  }),
);

export const { selectAll } = adapter.getSelectors();
