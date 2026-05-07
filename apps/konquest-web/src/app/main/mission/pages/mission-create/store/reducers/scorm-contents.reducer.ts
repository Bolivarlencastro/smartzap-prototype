import { createReducer, on } from '@ngrx/store';
import { ScormContent } from 'app/main/mission/models';
import { MissionActions, MissionScormContentsActions } from '../actions';
import { MissionModel } from 'app/main/mission/mission.model';

export const scormContentsFeatureKey = 'scorm-contents';

export interface MissionScormContentsState {
  content: ScormContent | undefined;
}

export const initialState: MissionScormContentsState = {
  content: undefined,
};

export const scormContentsReducer = createReducer(
  initialState,

  on(MissionScormContentsActions.setScormContent, (state, { content }): MissionScormContentsState => {
    return { content };
  }),

  on(MissionActions.setMissionModel, (state, { missionModel }): MissionScormContentsState => {
    return missionModel !== MissionModel.SCORM ? initialState : state;
  }),

  on(MissionActions.resetStore, MissionActions.createMissionSuccess, (): MissionScormContentsState => initialState),
);
