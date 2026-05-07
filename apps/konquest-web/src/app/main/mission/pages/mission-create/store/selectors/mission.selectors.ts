import { marker } from '@jsverse/transloco-keys-manager/marker';
import { createSelector } from '@ngrx/store';
import { MissionLive, MissionModel, MissionPresential } from 'app/main/mission/mission.model';
import { MissionCreateState, MissionReducer } from '../reducers';
import { selectMissionCreateState } from './feature.selectors';

const NAV_TITLE_MAP = {
  [MissionModel.INTERNAL]: marker('MISSION.CREATE.NAVIGATION.NAV_MENU_TITLE.INTERNAL'),
  [MissionModel.EXTERNAL_PROVIDER]: marker('MISSION.CREATE.NAVIGATION.NAV_MENU_TITLE.EXTERNAL_PROVIDER'),
  [MissionModel.PRESENTIAL]: marker('MISSION.CREATE.NAVIGATION.NAV_MENU_TITLE.PRESENTIAL'),
  [MissionModel.LIVE]: marker('MISSION.CREATE.NAVIGATION.NAV_MENU_TITLE.LIVE'),
  [MissionModel.SCORM]: marker('MISSION.CREATE.NAVIGATION.NAV_MENU_TITLE.SCORM'),
};

const selectMissionState = createSelector(
  selectMissionCreateState,
  (state: MissionCreateState) => state[MissionReducer.missionFeatureKey],
);

export const selectMission = createSelector(selectMissionState, (state) => state.mission);

export const selectMissionId = createSelector(selectMission, (mission) => mission?.id);

export const selectIsIntegrationMission = createSelector(selectMission, (mission) => !!mission?.is_integration);

export const selectMissionModel = createSelector(selectMissionState, (state) => state.missionModel);

export const selectMissionDevelopmentStatus = createSelector(selectMission, (mission) => mission?.development_status);

export const selectLoading = createSelector(selectMissionState, (state) => state.loading);

export const selectMissionLoaded = createSelector(selectMissionState, (state) => state.missionLoaded);

export const selectNavTitle = createSelector(selectMissionModel, (missionModel) => NAV_TITLE_MAP[missionModel]);

export const selectBannerImage = createSelector(selectMission, (mission) => mission?.holder_image);

export const selectCardImage = createSelector(selectMission, (mission) => mission?.thumb_image);

export const selectPresentialLiveTitle = createSelector(selectMissionModel, (missionModel) => {
  const titlesMap = {
    [MissionModel.LIVE]: marker('MISSION.CREATE.NAVIGATION.TITLE.LIVE'),
    [MissionModel.PRESENTIAL]: marker('MISSION.CREATE.NAVIGATION.TITLE.PRESENTIAL'),
  };

  return titlesMap[missionModel] || '';
});

export const selectIsEvent = createSelector(selectMissionModel, (missionModel) => {
  return missionModel === MissionModel.LIVE || missionModel === MissionModel.PRESENTIAL;
});

export const selectImagesHeaderSubtitle = createSelector(selectIsEvent, (isEvent) => {
  const eventSubtitle = marker('MISSION.CREATE.NAVIGATION.SUBTITLE.IMAGES_EVENT');
  const missionSubtitle = marker('MISSION.CREATE.NAVIGATION.SUBTITLE.IMAGES');
  return isEvent ? eventSubtitle : missionSubtitle;
});

export const selectPublishButtonLabel = createSelector(selectIsEvent, (isEvent) => {
  const eventPublishLabel = marker('MISSION.CREATE.CREATED.PUBLISH_EVENT');
  const missionPublishLabel = marker('MISSION.CREATE.CREATED.PUBLISH_MISSION');
  return isEvent ? eventPublishLabel : missionPublishLabel;
});

export const selectAccessButtonLabel = createSelector(selectIsEvent, (isEvent) => {
  const eventAccessLabel = marker('MISSION.CREATE.CREATED.ACCESS_EVENT');
  const missionAccessLabel = marker('MISSION.CREATE.CREATED.ACCESS_MISSION');

  return isEvent ? eventAccessLabel : missionAccessLabel;
});

export const selectPresentialLiveDates = createSelector(selectMissionState, (state) => state.presentialLiveDates);

export const selectPresentialLiveInfo = createSelector(
  selectMission,
  selectMissionModel,
  selectPresentialLiveDates,
  (mission, missionModel, dates) => {
    if (!mission) {
      return undefined;
    }
    const presentialLiveInfo: MissionLive | MissionPresential = mission[missionModel?.toLowerCase()];
    return { ...presentialLiveInfo, dates, users_enrolled: mission?.users_enrolled };
  },
);
