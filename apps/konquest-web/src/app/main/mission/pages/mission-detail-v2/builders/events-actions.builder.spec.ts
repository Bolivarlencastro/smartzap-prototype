import { MissionModel } from '@app/main/mission/mission.model';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EventsActionsBuilder } from './events-actions.builder';
import { MISSION_USER_TYPE, MissionActions, MissionActionsSettings } from './models';
import { MissionAction, MissionActionId } from './models/mission-action';

describe('EventsActionsBuilder', () => {
  describe('open mission', () => {
    describe('user actions', () => {
      it('should build the actions for an user that is not enrolled', () => {
        const settings: MissionActionsSettings = {
          userType: MISSION_USER_TYPE.USER,
          enrollmentStatus: undefined,
          missionDevelopmentStatus: DevelopmentStatus.DONE,
        };
        const expectedActions = new Map<MissionActionId, MissionAction>([
          [MissionActions.enrollToPresentialLiveMission.id, MissionActions.enrollToPresentialLiveMission],
        ]);

        const actions = new EventsActionsBuilder(settings).build();

        expect(actions).toMatchObject(expectedActions);
      });

      it('should build the actions for an enrolled user', () => {
        const settings: MissionActionsSettings = {
          userType: MISSION_USER_TYPE.USER,
          enrollmentStatus: EnrollmentStatuses.ENROLLED,
          missionDevelopmentStatus: DevelopmentStatus.DONE,
        };
        const expectedActions = new Map<MissionActionId, MissionAction>([
          [MissionActions.giveUpOnMission.id, MissionActions.giveUpOnMission],
        ]);

        const actions = new EventsActionsBuilder(settings).build();

        expect(actions).toMatchObject(expectedActions);
      });

      describe('live mission model', () => {
        it('should build actions for enrolled user when live event is in progress', () => {
          const settings: MissionActionsSettings = {
            userType: MISSION_USER_TYPE.USER,
            enrollmentStatus: EnrollmentStatuses.ENROLLED,
            missionDevelopmentStatus: DevelopmentStatus.DONE,
            mission_model: MissionModel.LIVE,
            liveInProgress: true,
          };
          const expectedActions = new Map<MissionActionId, MissionAction>([
            [MissionActions.enterToLiveEventEnrolled.id, MissionActions.enterToLiveEventEnrolled],
            [MissionActions.giveUpOnMission.id, MissionActions.giveUpOnMission],
          ]);

          const actions = new EventsActionsBuilder(settings).build();

          expect(actions).toMatchObject(expectedActions);
        });

        it('should build actions for enrolled user when live event is NOT in progress', () => {
          const settings: MissionActionsSettings = {
            userType: MISSION_USER_TYPE.USER,
            enrollmentStatus: EnrollmentStatuses.ENROLLED,
            missionDevelopmentStatus: DevelopmentStatus.DONE,
            mission_model: MissionModel.LIVE,
            liveInProgress: false,
          };
          const expectedActions = new Map<MissionActionId, MissionAction>([
            [MissionActions.enterToLiveEventEnrolled.id, MissionActions.enterToLiveEventEnrolled],
            [MissionActions.giveUpOnMission.id, MissionActions.giveUpOnMission],
          ]);

          const actions = new EventsActionsBuilder(settings).build();

          expect(actions).toMatchObject(expectedActions);
        });

        it('should build actions for NOT enrolled user when live event is in progress', () => {
          const settings: MissionActionsSettings = {
            userType: MISSION_USER_TYPE.USER,
            enrollmentStatus: undefined,
            missionDevelopmentStatus: DevelopmentStatus.DONE,
            mission_model: MissionModel.LIVE,
            liveInProgress: true,
          };
          const expectedActions = new Map<MissionActionId, MissionAction>([
            [MissionActions.enterToLiveEventNotEnrolled.id, MissionActions.enterToLiveEventNotEnrolled],
          ]);

          const actions = new EventsActionsBuilder(settings).build();

          expect(actions).toMatchObject(expectedActions);
        });

        it('should build enroll action for NOT enrolled user when live event is NOT in progress', () => {
          const settings: MissionActionsSettings = {
            userType: MISSION_USER_TYPE.USER,
            enrollmentStatus: undefined,
            missionDevelopmentStatus: DevelopmentStatus.DONE,
            mission_model: MissionModel.LIVE,
            liveInProgress: false,
          };
          const expectedActions = new Map<MissionActionId, MissionAction>([
            [MissionActions.enrollToPresentialLiveMission.id, MissionActions.enrollToPresentialLiveMission],
          ]);

          const actions = new EventsActionsBuilder(settings).build();

          expect(actions).toMatchObject(expectedActions);
        });
      });

      describe('presential mission model', () => {
        it('should build give up action for enrolled user in presential mission', () => {
          const settings: MissionActionsSettings = {
            userType: MISSION_USER_TYPE.USER,
            enrollmentStatus: EnrollmentStatuses.ENROLLED,
            missionDevelopmentStatus: DevelopmentStatus.DONE,
            mission_model: MissionModel.PRESENTIAL,
          };
          const expectedActions = new Map<MissionActionId, MissionAction>([
            [MissionActions.giveUpOnMission.id, MissionActions.giveUpOnMission],
          ]);

          const actions = new EventsActionsBuilder(settings).build();

          expect(actions).toMatchObject(expectedActions);
        });

        it('should build give up action for started user in presential mission', () => {
          const settings: MissionActionsSettings = {
            userType: MISSION_USER_TYPE.USER,
            enrollmentStatus: EnrollmentStatuses.STARTED,
            missionDevelopmentStatus: DevelopmentStatus.DONE,
            mission_model: MissionModel.PRESENTIAL,
          };
          const expectedActions = new Map<MissionActionId, MissionAction>([
            [MissionActions.giveUpOnMission.id, MissionActions.giveUpOnMission],
          ]);

          const actions = new EventsActionsBuilder(settings).build();

          expect(actions).toMatchObject(expectedActions);
        });

        it('should build enroll action for NOT enrolled user in presential mission', () => {
          const settings: MissionActionsSettings = {
            userType: MISSION_USER_TYPE.USER,
            enrollmentStatus: undefined,
            missionDevelopmentStatus: DevelopmentStatus.DONE,
            mission_model: MissionModel.PRESENTIAL,
          };
          const expectedActions = new Map<MissionActionId, MissionAction>([
            [MissionActions.enrollToPresentialLiveMission.id, MissionActions.enrollToPresentialLiveMission],
          ]);

          const actions = new EventsActionsBuilder(settings).build();

          expect(actions).toMatchObject(expectedActions);
        });
      });
    });

    describe('admin actions', () => {
      it('should build the actions for an workspace admin that is not enrolled', () => {
        const settings: MissionActionsSettings = {
          userType: MISSION_USER_TYPE.ADMIN,
          enrollmentStatus: undefined,
          missionDevelopmentStatus: DevelopmentStatus.DONE,
        };
        const expectedActions = new Map<MissionActionId, MissionAction>([
          [MissionActions.enrollToPresentialLiveMission.id, MissionActions.enrollToPresentialLiveMission],
        ]);

        const actions = new EventsActionsBuilder(settings).build();

        expect(actions).toMatchObject(expectedActions);
      });

      it('should build the actions for an enrolled workspace admin', () => {
        const settings: MissionActionsSettings = {
          userType: MISSION_USER_TYPE.ADMIN,
          enrollmentStatus: EnrollmentStatuses.ENROLLED,
          missionDevelopmentStatus: DevelopmentStatus.DONE,
        };
        const expectedActions = new Map<MissionActionId, MissionAction>([
          [MissionActions.giveUpOnMission.id, MissionActions.giveUpOnMission],
        ]);

        const actions = new EventsActionsBuilder(settings).build();

        expect(actions).toMatchObject(expectedActions);
      });

      it('should build actions for enrolled admin when live event is in progress', () => {
        const settings: MissionActionsSettings = {
          userType: MISSION_USER_TYPE.ADMIN,
          enrollmentStatus: EnrollmentStatuses.ENROLLED,
          missionDevelopmentStatus: DevelopmentStatus.DONE,
          mission_model: MissionModel.LIVE,
          liveInProgress: true,
        };
        const expectedActions = new Map<MissionActionId, MissionAction>([
          [MissionActions.enterToLiveEventEnrolled.id, MissionActions.enterToLiveEventEnrolled],
          [MissionActions.giveUpOnMission.id, MissionActions.giveUpOnMission],
        ]);

        const actions = new EventsActionsBuilder(settings).build();

        expect(actions).toMatchObject(expectedActions);
      });
    });
  });

  describe('closed mission', () => {
    describe('user actions', () => {
      it('should include only the evaluate mission action if required evaluation is true and attendedMission is true', () => {
        const settings: MissionActionsSettings = {
          userType: MISSION_USER_TYPE.USER,
          missionDevelopmentStatus: DevelopmentStatus.CLOSED,
          attendedMission: true,
          requiredEvaluation: true,
          userHasEvaluated: false,
        };
        const expectedActions = new Map<MissionActionId, MissionAction>([
          [MissionActions.evaluateMission.id, MissionActions.evaluateMission],
        ]);

        const actions = new EventsActionsBuilder(settings).build();

        expect(actions).toMatchObject(expectedActions);
      });

      it('should include only the generate certificate actions if required evaluation is false and attendedMission is true', () => {
        const settings: MissionActionsSettings = {
          userType: MISSION_USER_TYPE.USER,
          missionDevelopmentStatus: DevelopmentStatus.CLOSED,
          attendedMission: true,
        };
        const expectedActions = new Map<MissionActionId, MissionAction>([
          [MissionActions.generateCertificate.id, MissionActions.generateCertificate],
        ]);

        const actions = new EventsActionsBuilder(settings).build();

        expect(actions).toMatchObject(expectedActions);
      });

      it('should not include any action if attendedMission is false', () => {
        const settings: MissionActionsSettings = {
          userType: MISSION_USER_TYPE.USER,
          missionDevelopmentStatus: DevelopmentStatus.CLOSED,
          attendedMission: false,
        };

        const actions = new EventsActionsBuilder(settings).build();

        expect(actions.size).toBe(0);
      });
    });

    describe('admin actions', () => {
      it('should include only the evaluate mission action if required evaluation is true and attendedMission is true', () => {
        const settings: MissionActionsSettings = {
          userType: MISSION_USER_TYPE.ADMIN,
          missionDevelopmentStatus: DevelopmentStatus.CLOSED,
          attendedMission: true,
          requiredEvaluation: true,
          userHasEvaluated: false,
        };
        const expectedActions = new Map<MissionActionId, MissionAction>([
          [MissionActions.evaluateMission.id, MissionActions.evaluateMission],
        ]);

        const actions = new EventsActionsBuilder(settings).build();

        expect(actions).toMatchObject(expectedActions);
      });

      it('should include only the generate certificate actions if required evaluation is false and attendedMission is true', () => {
        const settings: MissionActionsSettings = {
          userType: MISSION_USER_TYPE.ADMIN,
          missionDevelopmentStatus: DevelopmentStatus.CLOSED,
          attendedMission: true,
        };
        const expectedActions = new Map<MissionActionId, MissionAction>([
          [MissionActions.generateCertificate.id, MissionActions.generateCertificate],
        ]);

        const actions = new EventsActionsBuilder(settings).build();

        expect(actions).toMatchObject(expectedActions);
      });

      it('should not include any action if attendedMission is false', () => {
        const settings: MissionActionsSettings = {
          userType: MISSION_USER_TYPE.ADMIN,
          missionDevelopmentStatus: DevelopmentStatus.CLOSED,
          attendedMission: false,
        };

        const actions = new EventsActionsBuilder(settings).build();

        expect(actions.size).toBe(0);
      });
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

      const actions = new EventsActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });
  });

  describe('contributor actions', () => {
    it('should build the actions for a mission contributor', () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.USER,
        missionDevelopmentStatus: DevelopmentStatus.DONE,
        isContributor: true,
      };
      const expectedActions = new Map<MissionActionId, MissionAction>([]);

      const actions = new EventsActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });
  });

  describe('instructor actions', () => {
    it('should build the actions for a mission instructor', () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.USER,
        missionDevelopmentStatus: DevelopmentStatus.DONE,
        isInstructor: true,
      };
      const expectedActions = new Map<MissionActionId, MissionAction>([]);

      const actions = new EventsActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });
  });

  describe('super admin actions', () => {
    it('should build the actions for a super admin', () => {
      const settings: MissionActionsSettings = {
        userType: MISSION_USER_TYPE.SUPER_ADMIN,
        enrollmentStatus: undefined,
        missionDevelopmentStatus: DevelopmentStatus.DONE,
      };
      const expectedActions = new Map<MissionActionId, MissionAction>([
        [MissionActions.enrollToPresentialLiveMission.id, MissionActions.enrollToPresentialLiveMission],
      ]);

      const actions = new EventsActionsBuilder(settings).build();

      expect(actions).toMatchObject(expectedActions);
    });
  });
});
