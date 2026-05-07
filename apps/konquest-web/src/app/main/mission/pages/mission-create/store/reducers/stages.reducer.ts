import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { MissionStage } from 'app/main/mission/mission.model';
import { MissionActions, MissionStageActions } from '../actions';

export const stagesFeatureKey = 'stages';

export type MissionStagesState = EntityState<MissionStage>;

export const adapter = createEntityAdapter<MissionStage>();

export const initialState: MissionStagesState = adapter.getInitialState();

export const stagesReducer = createReducer(
  initialState,

  on(MissionStageActions.loadStagesSuccess, (state, { stages }): MissionStagesState => {
    return adapter.setAll(stages, { ...state });
  }),

  on(MissionStageActions.saveStageSuccess, (state, { stage }): MissionStagesState => {
    return adapter.addOne(stage, { ...state });
  }),

  on(MissionStageActions.editStageSuccess, (state, { payload }): MissionStagesState => {
    return adapter.updateOne(payload, { ...state });
  }),

  on(MissionActions.resetStore, MissionActions.setMissionModel, (): MissionStagesState => initialState),
);

export const { selectAll } = adapter.getSelectors();
