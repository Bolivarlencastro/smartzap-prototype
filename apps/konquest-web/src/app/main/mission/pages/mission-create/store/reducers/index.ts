import { combineReducers } from '@ngrx/store';
import * as MissionContributorsReducer from './contributors.reducer';
import * as MissionGroupsReducer from './groups.reducer';
import * as MissionInstructorsReducer from './instructors.reducer';
import * as MissionReducer from './mission.reducer';
import * as MissionProvidersReducer from './providers.reducer';
import * as MissionScormStepsReducer from './scorm-contents.reducer';
import * as MissionStagesReducer from './stages.reducer';
import * as MissionTypesReducer from './types.reducer';

interface MissionCreateState {
  [MissionReducer.missionFeatureKey]: MissionReducer.MissionState;
  [MissionStagesReducer.stagesFeatureKey]: MissionStagesReducer.MissionStagesState;
  [MissionTypesReducer.typesFeatureKey]: MissionTypesReducer.MissionTypesState;
  [MissionInstructorsReducer.instructorsFeatureKey]: MissionInstructorsReducer.MissionInstructorsState;
  [MissionGroupsReducer.groupsFeatureKey]: MissionGroupsReducer.MissionGroupsState;
  [MissionContributorsReducer.contributorsFeatureKey]: MissionContributorsReducer.MissionContributorsState;
  [MissionProvidersReducer.providersFeatureKey]: MissionProvidersReducer.MissionProvidersState;
  [MissionScormStepsReducer.scormContentsFeatureKey]: MissionScormStepsReducer.MissionScormContentsState;
}

const missionCreateInitialState: MissionCreateState = {
  [MissionReducer.missionFeatureKey]: MissionReducer.initialState,
  [MissionStagesReducer.stagesFeatureKey]: MissionStagesReducer.initialState,
  [MissionTypesReducer.typesFeatureKey]: MissionTypesReducer.initialState,
  [MissionInstructorsReducer.instructorsFeatureKey]: MissionInstructorsReducer.initialState,
  [MissionGroupsReducer.groupsFeatureKey]: MissionGroupsReducer.initialState,
  [MissionContributorsReducer.contributorsFeatureKey]: MissionContributorsReducer.initialState,
  [MissionProvidersReducer.providersFeatureKey]: MissionProvidersReducer.initialState,
  [MissionScormStepsReducer.scormContentsFeatureKey]: MissionScormStepsReducer.initialState,
};

const missionCreateReducer = combineReducers(
  {
    [MissionReducer.missionFeatureKey]: MissionReducer.missionReducer,
    [MissionStagesReducer.stagesFeatureKey]: MissionStagesReducer.stagesReducer,
    [MissionTypesReducer.typesFeatureKey]: MissionTypesReducer.typesReducer,
    [MissionInstructorsReducer.instructorsFeatureKey]: MissionInstructorsReducer.instructorsReducer,
    [MissionGroupsReducer.groupsFeatureKey]: MissionGroupsReducer.groupsReducer,
    [MissionContributorsReducer.contributorsFeatureKey]: MissionContributorsReducer.contributorsReducer,
    [MissionProvidersReducer.providersFeatureKey]: MissionProvidersReducer.providersReducer,
    [MissionScormStepsReducer.scormContentsFeatureKey]: MissionScormStepsReducer.scormContentsReducer,
  },
  missionCreateInitialState,
);

const missionCreateFeatureKey = 'mission-create';

export {
  missionCreateFeatureKey,
  missionCreateReducer,
  MissionCreateState,
  missionCreateInitialState,
  MissionReducer,
  MissionStagesReducer,
  MissionTypesReducer,
  MissionInstructorsReducer,
  MissionGroupsReducer,
  MissionContributorsReducer,
  MissionProvidersReducer,
  MissionScormStepsReducer,
};
