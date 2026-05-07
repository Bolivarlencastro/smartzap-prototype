// These are temporary selectors, they will be removed as soon as we refactor the details dialog to support all types
// of courses.
import { createSelector } from '@ngrx/store';
import { selectMission } from './mission-detail.selectors';
import { Mission, MissionInformationDate, MissionModelInformation } from 'app/main/mission/mission.model';

export const selectIsOwner = createSelector(selectMission, (mission) => mission?.is_owner);

export const selectIsContributor = createSelector(selectMission, (mission) => mission?.is_contributor);

export const selectMissionModelInformation = createSelector(selectMission, (mission) => {
  const missionModelInformation: MissionModelInformation =
    mission[mission?.mission_model?.toLowerCase() as keyof Mission];
  return missionModelInformation;
});

export const selectMissionEnrollment = createSelector(selectMission, (mission) => mission?.enrollment);

export const selectMissionDates = createSelector(
  selectMissionModelInformation,
  (missionModelInfo) => missionModelInfo?.dates ?? [],
);

export const selectHasPastDate = createSelector(selectMissionDates, (dates) =>
  dates.some((date: MissionInformationDate) => new Date(date.start_at).getTime() <= Date.now()),
);
