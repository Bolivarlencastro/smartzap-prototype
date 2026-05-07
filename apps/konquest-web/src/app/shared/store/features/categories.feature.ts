import { ChannelCategory } from '@app/main/channel/channel.model';
import { MissionCategory } from '@app/main/mission/mission.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { CategoriesActions } from '../actions';

export interface CategoriesFeatureState {
  missionsFiltered: MissionCategory[];
  channels: ChannelCategory[];
  missions: MissionCategory[];
}

export const categoriesInitialState: CategoriesFeatureState = {
  missionsFiltered: [],
  channels: [],
  missions: [],
};

const categoriesReducer = createReducer(
  categoriesInitialState,

  on(
    CategoriesActions.loadCategoriesSuccess,
    (state, { missionsFiltered, channels }): CategoriesFeatureState => ({ ...state, missionsFiltered, channels }),
  ),
  on(
    CategoriesActions.loadAllMissionCategoriesSuccess,
    (state, { missions }): CategoriesFeatureState => ({ ...state, missions: missions }),
  ),
);

export const categoriesFeature = createFeature({
  name: 'categoriesFeature',
  reducer: categoriesReducer,
});
