import { MISSION_USER_TYPE, MissionActions, MissionActionsSettings } from './models';
import { InternalMissionActionsBuilder } from './internal-mission-actions.builder';
import { MissionAction, MissionActionId } from './models/mission-action';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('InternalMissionActionsBuilder', () => {
  describe('user actions', () => {
    it('should build the actions for an user that is not enrolled', () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.USER,
        enrollmentStatus: undefined,
        missionDevelopmentStatus: DevelopmentStatus.DONE,
      };
      const expectedActions = new Map<MissionActionId, MissionAction>([
        [MissionActions.enrollToMission.id, MissionActions.enrollToMission],
      ]);

      const actions = new InternalMissionActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });

    it('should build the actions for an user that is enrolled', () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.USER,
        enrollmentStatus: EnrollmentStatuses.ENROLLED,
        missionDevelopmentStatus: DevelopmentStatus.DONE,
      };
      const expectedActions = new Map<MissionActionId, MissionAction>([
        [MissionActions.openMission.id, MissionActions.openMission],
        [MissionActions.giveUpOnMission.id, MissionActions.giveUpOnMission],
      ]);

      const actions = new InternalMissionActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });

    it('should build the actions for an user that is enrolled and started the mission', () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.USER,
        enrollmentStatus: EnrollmentStatuses.STARTED,
        missionDevelopmentStatus: DevelopmentStatus.DONE,
      };
      const expectedActions = new Map<MissionActionId, MissionAction>([
        [MissionActions.openMission.id, MissionActions.openMission],
        [MissionActions.giveUpOnMission.id, MissionActions.giveUpOnMission],
      ]);

      const actions = new InternalMissionActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });

    it('should not have the give up action if the mission is required and the user is enrolled', () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.USER,
        enrollmentStatus: EnrollmentStatuses.ENROLLED,
        missionDevelopmentStatus: DevelopmentStatus.DONE,
        requiredMission: true,
      };
      const expectedActions = new Map<MissionActionId, MissionAction>([
        [MissionActions.openMission.id, MissionActions.openMission],
      ]);

      const actions = new InternalMissionActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });

    it('should build the actions for an user that gave up', () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.USER,
        enrollmentStatus: EnrollmentStatuses.GIVE_UP,
        missionDevelopmentStatus: DevelopmentStatus.DONE,
      };
      const expectedActions = new Map<MissionActionId, MissionAction>([
        [MissionActions.retakeMission.id, MissionActions.retakeMission],
      ]);

      const actions = new InternalMissionActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });

    it(`should build the actions for an user with enrollment status ${EnrollmentStatuses.COMPLETED}`, () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.USER,
        enrollmentStatus: EnrollmentStatuses.COMPLETED,
        missionDevelopmentStatus: DevelopmentStatus.DONE,
      };
      const expectedActions = new Map<MissionActionId, MissionAction>([
        [MissionActions.openMission.id, MissionActions.openMission],
      ]);

      const actions = new InternalMissionActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });

    it(`should build disabled actions actions when the mission development status is different from ${DevelopmentStatus.DONE}`, () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.USER,
        missionDevelopmentStatus: DevelopmentStatus.IN_PROGRESS,
      };
      const expectedActions = new Map<MissionActionId, MissionAction>([
        [MissionActions.enrollToMission.id, { ...MissionActions.enrollToMission, disabled: true }],
      ]);

      const actions = new InternalMissionActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });
  });

  describe('owner actions', () => {
    it('should build the actions for the mission owner', () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.USER,
        missionDevelopmentStatus: DevelopmentStatus.DONE,
        isOwner: true,
      };
      const expectedActions = new Map<MissionActionId, MissionAction>([]);

      const actions = new InternalMissionActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });
  });

  describe('contributor actions', () => {
    it('should build the actions for a contributor', () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.USER,
        missionDevelopmentStatus: DevelopmentStatus.DONE,
        isContributor: true,
      };

      const expectedActions = new Map<MissionActionId, MissionAction>([]);

      const actions = new InternalMissionActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });
  });

  describe('super admin actions', () => {
    it('should build the actions for the workspace super admin', () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.SUPER_ADMIN,
        missionDevelopmentStatus: DevelopmentStatus.DONE,
      };
      const expectedActions = new Map<MissionActionId, MissionAction>([
        [MissionActions.enrollToMission.id, MissionActions.enrollToMission],
      ]);

      const actions = new InternalMissionActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });

    it('should build the actions for the workspace super admin whe it is a shared mission', () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.SUPER_ADMIN,
        missionDevelopmentStatus: DevelopmentStatus.DONE,
        sharedMission: true,
      };
      const expectedActions = new Map<MissionActionId, MissionAction>([
        [MissionActions.enrollToMission.id, MissionActions.enrollToMission],
      ]);

      const actions = new InternalMissionActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });

    it(`should include the publish action when super admin is not owner and the mission development status is ${DevelopmentStatus.IN_REVIEW}`, () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.SUPER_ADMIN,
        missionDevelopmentStatus: DevelopmentStatus.IN_REVIEW,
        isOwner: false,
      };
      const expectedActions = new Map<MissionActionId, MissionAction>([
        [MissionActions.enrollToMission.id, { ...MissionActions.enrollToMission, disabled: true }],
      ]);

      const actions = new InternalMissionActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });
  });
});
