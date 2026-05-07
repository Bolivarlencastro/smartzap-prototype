import { createAction, props } from '@ngrx/store';
import { Mission, MissionInformationDate, MissionModel } from 'app/main/mission/mission.model';
import { ImageDefinition, MissionImageUpload } from '../../services/mission-create.service';

export const setMission = createAction(
  '[MISSION CREATION] Set Mission',
  props<{
    mission: Mission;
    skipNavigation?: boolean;
  }>(),
);

export const setMissionAfterCreation = createAction(
  '[MISSION CREATION] Set Mission After Creation',
  props<{
    mission: Mission;
    skipNavigation?: boolean;
  }>(),
);

export const setLoading = createAction('[MISSION CREATION] Set Loading', props<{ loading: boolean }>());

export const loadMission = createAction('[MISSION CREATION] Load Mission', props<{ missionId: string }>());

export const loadMissionSuccess = createAction(
  '[MISSION CREATION] Load Mission Success',
  props<{
    mission: Mission;
  }>(),
);

export const loadMissionFailure = createAction('[MISSION CREATION] Load Mission Failure', props<{ error: any }>());

export const saveMission = createAction(
  '[MISSION CREATION] Save Mission',
  props<{
    mission: Mission;
    skipNavigation?: boolean;
  }>(),
);

export const saveCompleteMission = createAction(
  '[MISSION CREATION] Save Complete Mission',
  props<{ mission: Partial<Mission>; dates: MissionInformationDate[]; skipNavigation: boolean }>(),
);

export const saveMissionFailure = createAction(
  '[MISSION CREATION] Save Mission Failure',
  props<{
    error: any;
  }>(),
);

export const setMissionModel = createAction(
  '[MISSION CREATION] Set Mission Model',
  props<{
    missionModel: MissionModel;
  }>(),
);

export const createMission = createAction(
  '[MISSION CREATION] Create Mission',
  props<{
    mission: Mission;
  }>(),
);

export const createMissionSuccess = createAction(
  '[MISSION CREATION] Create Mission Success',
  props<{
    mission: Mission;
  }>(),
);

export const updateMission = createAction(
  '[MISSION CREATION] Update Mission',
  props<{
    mission: Mission;
    skipNavigation: boolean;
  }>(),
);

export const updateMissionSuccess = createAction(
  '[MISSION CREATION] Update Mission Success',
  props<{
    mission: Mission;
    skipNavigation: boolean;
  }>(),
);

export const publishMission = createAction('[MISSION CREATION] Publish Mission');

export const publishMissionSuccess = createAction(
  '[MISSION CREATION] Publish Mission Success',
  props<{
    missionId: string;
  }>(),
);

export const publishMissionFailure = createAction(
  '[MISSION CREATION] Publish Mission Failure',
  props<{
    error: any;
  }>(),
);

export const navigateToMissions = createAction('[MISSION CREATION] Navigate to Missions');

export const navigateToMission = createAction('[MISSION CREATION] Navigate to Mission');

export const resetStore = createAction('[MISSION CREATION] Reset Store');

export const updateMissionImage = createAction(
  '[MISSION CREATION] Update Mission Image',
  props<{
    file: File;
    definitions: ImageDefinition[];
    rootImage: File | string;
    uploadImageType: 'banner' | 'card';
  }>(),
);

export const updateMissionImageSuccess = createAction(
  '[MISSION CREATION] Update Mission Image Success',
  props<{ images: MissionImageUpload[] }>(),
);

export const updateMissionImageFailure = createAction(
  '[MISSION CREATION] Update Mission Image Failure',
  props<{ error: any }>(),
);

export const saveMissionDates = createAction(
  '[MISSION CREATION] Save Mission Dates',
  props<{
    dates: MissionInformationDate[];
  }>(),
);

export const setMissionDates = createAction(
  '[MISSION CREATION] Set Mission Dates',
  props<{
    dates: MissionInformationDate[];
  }>(),
);

export const saveMissionDatesFailure = createAction(
  '[MISSION CREATION] Save Mission Dates Failure',
  props<{ error: any }>(),
);

export const nextStep = createAction('[MISSION CREATION] Navigate to Next Step');

export const previousStep = createAction('[MISSION CREATION] Navigate to Previous Step');

export const openImageGenerationDialog = createAction(
  '[MISSION CREATION] Open Image Generation Dialog',
  props<{ uploadImageType: 'banner' | 'card'; rootImage?: File | string }>(),
);
