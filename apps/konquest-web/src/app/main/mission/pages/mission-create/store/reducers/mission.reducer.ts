import { createReducer, on } from '@ngrx/store';
import { Mission, MissionInformationDate, MissionModel } from 'app/main/mission/mission.model';
import { MissionActions, MissionScormContentsActions } from '../actions';

export const missionFeatureKey = 'mission';

export interface MissionState {
  loading: boolean;
  mission: Mission | undefined;
  missionModel: MissionModel | undefined;
  missionLoaded: boolean;
  presentialLiveDates: MissionInformationDate[];
}

export const initialState: MissionState = {
  loading: false,
  mission: undefined,
  missionModel: undefined,
  missionLoaded: false,
  presentialLiveDates: [],
};

export const missionReducer = createReducer(
  initialState,

  on(MissionActions.setLoading, (state, { loading }): MissionState => ({ ...state, loading })),

  on(MissionActions.setMissionModel, (state, { missionModel }): MissionState => ({ ...initialState, missionModel })),

  on(MissionActions.setMission, MissionActions.setMissionAfterCreation, (state, { mission }): MissionState => {
    return {
      ...state,
      mission: { ...state.mission, ...mission },
      missionModel: mission.mission_model,
      missionLoaded: true,
    };
  }),

  on(MissionActions.setMissionDates, (state, { dates }): MissionState => {
    return { ...state, presentialLiveDates: dates };
  }),

  on(MissionScormContentsActions.setScormContent, (state, { content }): MissionState => {
    return { ...state, mission: { ...state.mission, name: content.course_title } };
  }),

  on(MissionActions.resetStore, (): MissionState => initialState),
);
