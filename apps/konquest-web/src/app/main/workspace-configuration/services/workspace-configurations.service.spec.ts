import { TestBed } from '@angular/core/testing';
import { ModuleService, RawModuleService } from '@core/model/workspace-configuration.model';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { of, throwError } from 'rxjs';
import { WorkspaceConfigurationAPI } from './workspace-configuration.api';
import { WorkspaceConfigurationsService } from './workspace-configurations.service';
import { Chance } from 'chance';
import { Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

const SERVICE_DASHBOARD_ID = '0d3752f0-15d7-402a-8628-04ed47bcbf43';

const APPLICATION_SERVICES = [
  {
    id: '525e39e2-8054-45f4-93c5-2f132fa4d73a',
    name: 'Basic Analytics',
    status: true,
  },
  {
    id: 'ab9f3185-a033-4e74-81ac-d83dc5afec22',
    name: 'Quiz Game',
    status: true,
  },
  {
    id: 'a5f81d74-de2c-4576-984c-fcb236d636ea',
    name: 'Admin Platform',
    status: true,
  },
  {
    id: '0d3752f0-15d7-402a-8628-04ed47bcbf41',
    name: 'Mission',
    status: true,
  },
  {
    id: '0d3752f0-15d7-402a-8628-04ed47bcbf42',
    name: 'Learning Trail',
    status: true,
  },
  {
    id: 'f9743ebc-c159-4dec-9600-cf1f9f0537b3',
    name: 'Smartzap ADMIN',
    status: true,
  },
  {
    id: '786f7dc6-5b82-4834-a7a4-6a938ed7dafc',
    name: 'Gamification',
    status: true,
  },
  {
    id: 'f19a1f71-82fb-46df-ab88-bdd3700da124',
    name: 'Pulse',
    status: true,
  },
  {
    id: '8064f5d7-e9cb-4bb8-8cb5-09030a14bf52',
    name: 'Event',
    status: true,
  },
  {
    id: '0d3752f0-15d7-402a-8628-04ed47bcbf43',
    name: 'Dashboard',
    status: true,
  },
  {
    id: '6064f5d7-e9cb-4bb8-8cb5-09030a14bf5f',
    name: 'Regulatory Compliance',
    status: true,
  },
  {
    id: '8d572fd1-cca9-4979-9e72-f3871ac8ee97',
    name: 'Custom Sections',
    status: true,
  },
];

const EXPECTED_SERVICES = [
  {
    label: 'Dashboard',
    field: SERVICE_DASHBOARD_ID,
    status: true,
  },
  {
    label: 'Learning Trail',
    field: '0d3752f0-15d7-402a-8628-04ed47bcbf42',
    status: true,
  },
  {
    label: 'Mission',
    field: '0d3752f0-15d7-402a-8628-04ed47bcbf41',
    status: true,
  },
  {
    label: 'Event',
    field: '8064f5d7-e9cb-4bb8-8cb5-09030a14bf52',
    status: true,
  },
  {
    label: 'Pulse',
    field: 'f19a1f71-82fb-46df-ab88-bdd3700da124',
    status: true,
  },
  {
    label: 'Regulatory Compliance',
    field: '6064f5d7-e9cb-4bb8-8cb5-09030a14bf5f',
    status: true,
  },
  {
    label: 'Custom Sections',
    field: '8d572fd1-cca9-4979-9e72-f3871ac8ee97',
    status: true,
  },
  {
    label: 'Gamification',
    field: '786f7dc6-5b82-4834-a7a4-6a938ed7dafc',
    status: true,
  },
];

const MOCK_WORKSPACE: Workspace = {
  allow_list_public_categories: true,
  min_performance_certificate: 10,
  block_reenrollment: false,
  enrollment_goal_duration_days: 14,
};

describe('WorkspaceConfigurationsService', () => {
  let service: WorkspaceConfigurationsService;
  let api: WorkspaceConfigurationAPI;
  let fuseLoadingService: FuseLoadingService;
  let messageService: KpMessageService;
  const chance = new Chance();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [
        WorkspaceConfigurationsService,
        {
          provide: WorkspaceConfigurationAPI,
          useValue: {
            getAllServices: jest.fn().mockReturnValue(of(APPLICATION_SERVICES)),
            enableService: jest.fn(),
            disableService: jest.fn(),
            getWorkspace: jest.fn().mockReturnValue(of(MOCK_WORKSPACE)),
            updateWorkspace: jest.fn(),
          },
        },
        { provide: FuseLoadingService, useValue: { hide: jest.fn(), show: jest.fn() } },
        { provide: KpMessageService, useValue: { success: jest.fn(), error: jest.fn() } },
      ],
    });
    service = TestBed.inject(WorkspaceConfigurationsService);
    api = TestBed.inject(WorkspaceConfigurationAPI);
    fuseLoadingService = TestBed.inject(FuseLoadingService);
    messageService = TestBed.inject(KpMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWorkspaceSettingsWithServices', () => {
    it('should fetch both services and workspace configurations', (done) => {
      const workspaceId = chance.guid();

      service.getWorkspaceSettingsWithServices(workspaceId).subscribe({
        next: ({ services, settings }) => {
          expect(api.getWorkspace).toHaveBeenCalledWith(workspaceId);
          expect(api.getAllServices).toHaveBeenCalled();
          expect(services).toStrictEqual(EXPECTED_SERVICES);
          expect(settings).toEqual(MOCK_WORKSPACE);

          done();
        },
      });
    });
  });

  it('enableService() should call api.enableService and messageService.success with the ENABLED and right service name', (done) => {
    const givenWorkspaceId = 'test';
    const givenRawService: RawModuleService = {
      id: '123',
      service: {
        id: SERVICE_DASHBOARD_ID,
        name: 'Dashboard',
      },
      status: true,
    };
    const givenModuleService: ModuleService = { field: SERVICE_DASHBOARD_ID, label: 'Dashboard' };

    const expectedMessage = 'WORKSPACE_CONFIGURATIONS.ENABLED_SERVICE_SUCCESS';
    const expectedServiceName = 'WORKSPACE_CONFIGURATIONS.MODULES.Dashboard';

    jest.spyOn(api, 'enableService').mockReturnValue(of(givenRawService));

    service.enableService(givenWorkspaceId, givenModuleService).subscribe(() => {
      expect(api.enableService).toHaveBeenCalledWith(givenWorkspaceId, givenModuleService.field);
      expect(messageService.success).toHaveBeenCalledWith(expectedMessage, {
        serviceName: expectedServiceName,
      });
      done();
    });
  });

  it('disableService() should call api.disableService and messageService.success with the DISABLED and right service name', (done) => {
    const givenWorkspaceId = 'workspace-test';
    const givenModuleService: ModuleService = { field: SERVICE_DASHBOARD_ID, label: 'Dashboard' };

    const expectedMessage = 'WORKSPACE_CONFIGURATIONS.DISABLED_SERVICE_SUCCESS';
    const expectedServiceName = 'WORKSPACE_CONFIGURATIONS.MODULES.Dashboard';

    jest.spyOn(api, 'disableService').mockReturnValue(of(undefined));

    service.disableService(givenWorkspaceId, givenModuleService).subscribe(() => {
      expect(api.disableService).toHaveBeenCalledWith(givenWorkspaceId, givenModuleService.field);
      expect(messageService.success).toHaveBeenCalledWith(expectedMessage, {
        serviceName: expectedServiceName,
      });
      done();
    });
  });

  it('getPassMarkAndGoalDate() should call api.getWorkspace and rescale minimum performance', (done) => {
    const givenWorkspaceId = 'workspace-test';
    const givenWorkspaceMark = 0.25;
    const expectedResponse = { passMark: 25, goal_date: 30 };

    jest.spyOn(api, 'getWorkspace').mockReturnValue(
      of({
        min_performance_certificate: givenWorkspaceMark,
        enrollment_goal_duration_days: 30,
      }),
    );

    service.getPassMarkAndGoalDate(givenWorkspaceId).subscribe((response) => {
      expect(api.getWorkspace).toHaveBeenCalledWith(givenWorkspaceId);
      expect(response).toEqual(expectedResponse);
      done();
    });
  });

  it('savePassMark() should call api.updateWorkspace with correct mark scale and messageService.success with save pass mark success', (done) => {
    const givenWorkspaceId = 'workspace-test';
    const givenMark = 50;

    const expectedRescaledMark = 0.5;
    const expectedMessage = 'WORKSPACE_CONFIGURATIONS.SAVE_PASS_MARK_SUCCESS';

    jest.spyOn(api, 'updateWorkspace').mockReturnValue(of({}));

    service.savePassMark(givenWorkspaceId, givenMark).subscribe(() => {
      expect(api.updateWorkspace).toHaveBeenCalledWith(givenWorkspaceId, {
        min_performance_certificate: expectedRescaledMark,
      });
      expect(messageService.success).toHaveBeenCalledWith(expectedMessage);
      done();
    });
  });

  it('should call fuse progress bar hide', () => {
    service.displayLoading(false);

    expect(fuseLoadingService.hide).toHaveBeenCalled();
    expect(fuseLoadingService.show).not.toHaveBeenCalled();
  });

  it('should call fuse progress bar show', () => {
    service.displayLoading(true);

    expect(fuseLoadingService.show).toHaveBeenCalled();
    expect(fuseLoadingService.hide).not.toHaveBeenCalled();
  });

  describe('updateGoalDate', () => {
    it('should call updateWorkspace on updateGoalDate and show success message', (done) => {
      const [id, enrollment_goal_duration_days] = ['test-id', 30];
      jest.spyOn(api, 'updateWorkspace').mockReturnValue(of({}));

      service.updateGoalDate(id, enrollment_goal_duration_days).subscribe(() => {
        expect(api.updateWorkspace).toHaveBeenCalledWith(id, { enrollment_goal_duration_days });
        expect(messageService.success).toHaveBeenCalledWith('WORKSPACE_CONFIGURATIONS.GOAL_DATE_SUCCESS');
        done();
      });
    });

    it('should show error message on updateWorkspace failure', (done) => {
      const [id, enrollment_goal_duration_days] = ['test-id', 30];
      jest.spyOn(api, 'updateWorkspace').mockReturnValue(
        throwError(() => ({
          error: {
            status_code: 400,
          },
        })),
      );

      service.updateGoalDate(id, enrollment_goal_duration_days).subscribe({
        error: () => {
          expect(api.updateWorkspace).toHaveBeenCalledWith(id, { enrollment_goal_duration_days });
          expect(messageService.error).toHaveBeenCalledWith('WORKSPACE_CONFIGURATIONS.GOAL_DATE_ERROR');
          done();
        },
      });
    });
  });
});
