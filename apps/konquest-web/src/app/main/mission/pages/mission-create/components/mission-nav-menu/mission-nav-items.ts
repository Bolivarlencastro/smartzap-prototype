import { marker } from '@jsverse/transloco-keys-manager/marker';
import { MissionModel } from 'app/main/mission/mission.model';

export interface MissionNavItem {
  title: string;
  label: string;
  route: string;
}

const MissionInfoNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.INFO'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.INFO'),
  route: 'info',
};

const PresentialInfoNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.INFO'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.INFO_PRESENTIAL'),
  route: 'info',
};

const LiveInfoNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.INFO'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.INFO_LIVE'),
  route: 'info',
};

const MissionImagesNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.IMAGES'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.IMAGES'),
  route: 'images',
};

const PresentialImagesNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.IMAGES'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.IMAGES_PRESENTIAL'),
  route: 'images',
};

const LiveImagesNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.IMAGES'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.IMAGES_LIVE'),
  route: 'images',
};

const MissionContentsNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.CONTENTS'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.CONTENTS'),
  route: 'content',
};

const EventSupportMaterialNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.SUPPORT_MATERIAL'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.SUPPORT_MATERIAL'),
  route: 'support-material',
};

const MissionSettingsNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.SETTINGS'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.SETTINGS'),
  route: 'settings',
};

const PresentialSettingsNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.SETTINGS'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.SETTINGS_PRESENTIAL'),
  route: 'settings',
};

const LiveSettingsNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.SETTINGS'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.SETTINGS_LIVE'),
  route: 'settings',
};

const MissionLiveNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.LIVE'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.LIVE'),
  route: 'live',
};

const MissionPresentialNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.PRESENTIAL'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.PRESENTIAL'),
  route: 'presential',
};

const MissionExternalNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.EXTERNAL'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.EXTERNAL'),
  route: 'provider',
};

const MissionFinishNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.FINISH'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.FINISH'),
  route: 'finish',
};

const PresentialFinishNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.FINISH'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.FINISH_PRESENTIAL'),
  route: 'finish',
};

const LiveFinishNavItem: MissionNavItem = {
  title: marker('MISSION.CREATE.NAVIGATION.TITLE.FINISH'),
  label: marker('MISSION.CREATE.NAVIGATION.LABEL.FINISH_LIVE'),
  route: 'finish',
};

export function getNavItems(missionModel: MissionModel): MissionNavItem[] {
  const navMap = {
    [MissionModel.INTERNAL]: [
      MissionInfoNavItem,
      MissionImagesNavItem,
      MissionSettingsNavItem,
      MissionContentsNavItem,
      MissionFinishNavItem,
    ],
    [MissionModel.LIVE]: [
      LiveInfoNavItem,
      LiveImagesNavItem,
      LiveSettingsNavItem,
      MissionLiveNavItem,
      EventSupportMaterialNavItem,
      LiveFinishNavItem,
    ],
    [MissionModel.PRESENTIAL]: [
      PresentialInfoNavItem,
      PresentialImagesNavItem,
      PresentialSettingsNavItem,
      MissionPresentialNavItem,
      EventSupportMaterialNavItem,
      PresentialFinishNavItem,
    ],
    [MissionModel.EXTERNAL_PROVIDER]: [
      MissionInfoNavItem,
      MissionImagesNavItem,
      MissionSettingsNavItem,
      MissionExternalNavItem,
      MissionFinishNavItem,
    ],
    [MissionModel.SCORM]: [
      MissionInfoNavItem,
      MissionImagesNavItem,
      MissionSettingsNavItem,
      MissionContentsNavItem,
      MissionFinishNavItem,
    ],
  };

  return navMap[missionModel];
}
