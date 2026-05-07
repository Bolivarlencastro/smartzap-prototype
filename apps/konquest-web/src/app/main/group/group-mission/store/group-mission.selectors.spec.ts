import * as fromGroupMission from './group-mission.reducer';
import { selectGroupMissionState } from './group-mission.selectors';

describe('GroupMission Selectors', () => {
  it('should select the feature state', () => {
    const result = selectGroupMissionState({
      [fromGroupMission.groupMissionsFeatureKey]: fromGroupMission.initialState,
    });

    expect(result).toEqual(fromGroupMission.initialState);
  });
});
