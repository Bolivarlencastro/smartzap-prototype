import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AluraIntegrationsApi, AuthService, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Mission, MissionLive, MissionModel } from 'app/main/mission/mission.model';
import { of } from 'rxjs';
import { MissionOptionsMenuService } from './mission-options-menu.service';

describe('MissionOptionsMenuService', () => {
  let service: MissionOptionsMenuService;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;
  let routerMock: jest.Mocked<Router>;
  const dialogMock: jest.Mocked<MatDialog> = {} as unknown as jest.Mocked<MatDialog>;
  const messageServiceMock: jest.Mocked<KpMessageService> = {} as unknown as jest.Mocked<KpMessageService>;
  let authServiceMock: jest.Mocked<AuthService>;
  let aluraIntegrationApiMock: jest.Mocked<AluraIntegrationsApi>;
  const accessUrlStub = 'https://integration-course-access-url';

  const currentWorkspaceIdStub = 'stub_workspace_id';
  const mockUserId = 'mock_user_id';

  beforeEach(() => {
    workspaceServiceMock = { currentWorkspaceId: currentWorkspaceIdStub } as unknown as jest.Mocked<WorkspaceService>;
    routerMock = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;
    authServiceMock = { userId: mockUserId } as unknown as jest.Mocked<AuthService>;
    aluraIntegrationApiMock = {
      getAccessUrlByMissionId: jest.fn().mockReturnValue(of({ url: accessUrlStub })),
    } as unknown as jest.Mocked<AluraIntegrationsApi>;

    const mockNow = new Date('2024-01-27T12:15:00-03:00');
    jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

    service = new MissionOptionsMenuService(
      workspaceServiceMock,
      dialogMock,
      routerMock,
      messageServiceMock,
      authServiceMock,
      aluraIntegrationApiMock,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('redirectTo', () => {
    it('should open a external mission on a new tab', () => {
      window.open = jest.fn();
      const mockMission = {
        mission_model: MissionModel.EXTERNAL_PROVIDER,
        external_course_url: 'https://mock_external_url',
      } as unknown as Mission;

      service.redirectTo('open-mission', mockMission);

      expect(window.open).toHaveBeenCalledWith(mockMission.external_course_url, '_blank');
    });

    it('should open a integration mission in a new tab with the returned access url', () => {
      window.open = jest.fn();
      const missionIdStub = 'mock_mission_id';
      const mockMission = {
        mission_model: MissionModel.EXTERNAL_PROVIDER,
        external_course_url: 'https://mock_external_url',
        is_integration: true,
        id: missionIdStub,
      } as unknown as Mission;

      service.redirectTo('open-mission', mockMission);

      expect(aluraIntegrationApiMock.getAccessUrlByMissionId).toHaveBeenCalledWith(missionIdStub);
      expect(window.open).toHaveBeenCalledWith(accessUrlStub, '_blank');
    });

    it('should redirect to classroom page', () => {
      const mockMission = { id: 'mock_mission_id' } as unknown as Mission;

      service.redirectTo('open-mission', mockMission);

      expect(routerMock.navigate).toHaveBeenCalledWith(['/course', mockMission.id]);
    });
  });

  describe('buildMissionActions', () => {
    describe('for LIVE mission model', () => {
      const createLiveMission = (liveData?: Partial<MissionLive>, enrollmentData?: any): Mission =>
        ({
          id: 'live-mission-1',
          mission_model: MissionModel.LIVE,
          development_status: 'DONE',
          enrollment: enrollmentData,
          workspace_source_id: currentWorkspaceIdStub,
          is_owner: false,
          is_contributor: false,
          required_evaluation: false,
          live: {
            dates: [
              {
                start_at: '2024-01-27T12:00:00-03:00',
                end_at: '2024-01-27T12:30:00-03:00',
                id: 'event-1',
                count_users_attending: 0,
                allow_self_attendance: true,
                live: 5242,
                is_today: true,
              },
              {
                start_at: '2024-01-28T11:00:00-03:00',
                end_at: '2024-01-28T12:00:00-03:00',
                id: 'event-2',
                count_users_attending: 0,
                allow_self_attendance: true,
                live: 5242,
                is_today: false,
              },
            ],
            ...liveData,
          },
        }) as unknown as Mission;

      it('should build actions for enrolled user when live event is in progress', () => {
        const mockMission = createLiveMission(
          {},
          {
            status: 'ENROLLED',
            required: false,
            attended: false,
            evaluated: false,
          },
        );

        const actions = service.buildMissionActions(mockMission, false, false);

        expect(actions).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: 'enter-live-event-enrolled' }),
            expect.objectContaining({ id: 'give-up' }),
          ]),
        );
      });

      it('should build actions for enrolled user when no live event is in progress', () => {
        const mockNow = new Date('2024-01-27T13:00:00-03:00');
        jest.spyOn(global, 'Date').mockImplementation(() => mockNow as any);

        const mockMission = createLiveMission(
          {},
          {
            status: 'ENROLLED',
            required: false,
            attended: false,
            evaluated: false,
          },
        );

        const actions = service.buildMissionActions(mockMission, false, false);

        expect(actions).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: 'enter-live-event-enrolled' }),
            expect.objectContaining({ id: 'give-up' }),
          ]),
        );
      });

      it('should build actions for NOT enrolled user when live event is in progress', () => {
        const mockMission = createLiveMission({}, null);

        const actions = service.buildMissionActions(mockMission, false, false);

        expect(actions).toEqual(
          expect.arrayContaining([expect.objectContaining({ id: 'enter-live-event-not-enrolled' })]),
        );
        expect(actions).not.toEqual(
          expect.arrayContaining([expect.objectContaining({ id: 'enroll-presential-live-mission' })]),
        );
      });

      it('should return null for liveInProgress when mission has no live data', () => {
        const mockMission = {
          mission_model: MissionModel.LIVE,
          live: null,
          enrollment: null,
        } as unknown as Mission;

        const actions = service.buildMissionActions(mockMission, false, false);

        expect(actions).toBeDefined();
      });
    });

    describe('for PRESENTIAL mission model', () => {
      const createPresentialMission = (enrollmentData?: any): Mission =>
        ({
          id: 'presential-mission-1',
          mission_model: MissionModel.PRESENTIAL,
          development_status: 'DONE',
          enrollment: enrollmentData,
          workspace_source_id: currentWorkspaceIdStub,
          is_owner: false,
          is_contributor: false,
          required_evaluation: false,
        }) as unknown as Mission;

      it('should build give-up action for enrolled user', () => {
        const mockMission = createPresentialMission({
          status: 'ENROLLED',
          required: false,
          attended: false,
          evaluated: false,
        });

        const actions = service.buildMissionActions(mockMission, false, false);

        expect(actions).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'give-up' })]));
      });

      it('should build enroll action for NOT enrolled user', () => {
        const mockMission = createPresentialMission(null);

        const actions = service.buildMissionActions(mockMission, false, false);

        expect(actions).toEqual(
          expect.arrayContaining([expect.objectContaining({ id: 'enroll-presential-live-mission' })]),
        );
      });
    });

    describe('mission instructor check', () => {
      it('should return true when user is instructor in LIVE mission', () => {
        const mockMission = {
          mission_model: MissionModel.LIVE,
          live: {
            instructors: [
              { id: mockUserId, name: 'Instructor 1' },
              { id: 'other-user', name: 'Instructor 2' },
            ],
            dates: [],
          },
          enrollment: null,
        } as unknown as Mission;

        const settings = (service as any).getMissionActionsSettings(mockMission, 'USER', currentWorkspaceIdStub);
        expect(settings.isInstructor).toBe(true);
      });

      it('should return false when user is not instructor', () => {
        const mockMission = {
          mission_model: MissionModel.LIVE,
          live: {
            instructors: [
              { id: 'other-user-1', name: 'Instructor 1' },
              { id: 'other-user-2', name: 'Instructor 2' },
            ],
            dates: [],
          },
          enrollment: null,
        } as unknown as Mission;

        const settings = (service as any).getMissionActionsSettings(mockMission, 'USER', currentWorkspaceIdStub);
        expect(settings.isInstructor).toBe(false);
      });
    });
  });

  describe('isNowInLiveEventRange', () => {
    it('should return null when live data is null or undefined', () => {
      expect((service as any).isNowInLiveEventRange(null)).toBeNull();
      expect((service as any).isNowInLiveEventRange(undefined)).toBeNull();
    });

    it('should return true when current time is within an event range', () => {
      const mockLive = {
        dates: [
          {
            start_at: '2024-01-27T12:00:00-03:00',
            end_at: '2024-01-27T12:30:00-03:00',
            id: 'event-1',
          },
          {
            start_at: '2024-01-28T11:00:00-03:00',
            end_at: '2024-01-28T12:00:00-03:00',
            id: 'event-2',
          },
        ],
      } as MissionLive;

      expect((service as any).isNowInLiveEventRange(mockLive)).toBe(true);
    });

    it('should handle multiple events and find the active one', () => {
      const mockLive = {
        dates: [
          {
            start_at: '2024-01-27T10:00:00-03:00',
            end_at: '2024-01-27T11:00:00-03:00',
            id: 'event-1',
          },
          {
            start_at: '2024-01-27T12:00:00-03:00',
            end_at: '2024-01-27T12:30:00-03:00',
            id: 'event-2',
          },
          {
            start_at: '2024-01-27T14:00:00-03:00',
            end_at: '2024-01-27T15:00:00-03:00',
            id: 'event-3',
          },
        ],
      } as MissionLive;

      expect((service as any).isNowInLiveEventRange(mockLive)).toBe(true);
    });
  });

  describe('getAction', () => {
    it('should return correct action for give-up', () => {
      const action = MissionOptionsMenuService.getAction('give-up');
      expect(action.type).toBe('[MISSION DETAILS] Give Up on Mission');
    });

    it('should return correct action for enter-live-event-enrolled', () => {
      const action = MissionOptionsMenuService.getAction('enter-live-event-enrolled');
      expect(action.type).toBe('[MISSION DETAILS] Enter To Live Event Enrolled');
    });

    it('should return correct action for enter-live-event-not-enrolled', () => {
      const action = MissionOptionsMenuService.getAction('enter-live-event-not-enrolled');
      expect(action.type).toBe('[MISSION DETAILS] Enter To Live Event Not Enrolled');
    });

    it('should return correct action for enroll-presential-live-mission', () => {
      const action = MissionOptionsMenuService.getAction('enroll-presential-live-mission');
      expect(action.type).toBe('[MISSION DETAILS] Enroll To Presential/Live Mission');
    });
  });
});
