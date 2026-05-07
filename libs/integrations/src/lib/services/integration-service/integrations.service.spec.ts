import { IntegrationsService } from './integrations.service';
import { Workspace, WorkspaceApi, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { BehaviorSubject, EMPTY, of, throwError } from 'rxjs';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { skip } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Integration } from '../../models/integrations-model';
import { IntegrationsConfig } from '../../integrations.module';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { TeamsInstructionsDialogComponent } from '../../containers/teams-instructions-dialog/teams-instructions-dialog.component';

const mockIntegrationsConfig: IntegrationsConfig = {
  environment: {
    production: true,
    integrationsUrls: {
      teams:
        'https://teams.microsoft.com/l/app/0b3ce6e5-c418-4aee-9d05-851ed135933b?installAppPackage=true&webjoin=true&appTenantId=d4e2f73f-a5a4-41e6-abe2-e6ffd0809d6d',
      slack: 'https://learning-platform-api-stage.keepsdev.com/slack/slack/install',
    },
  },
};

describe('IntegrationsService', () => {
  let service: IntegrationsService;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;
  let workspaceApiMock: jest.Mocked<WorkspaceApi>;
  let currentWorkspaceSubject: BehaviorSubject<Partial<Workspace>>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let dialogMock: jest.Mocked<MatDialog>;

  beforeEach(() => {
    currentWorkspaceSubject = new BehaviorSubject<Partial<Workspace>>({ notify_slack: true, notify_teams: true });
    workspaceServiceMock = {
      currentWorkspace$: currentWorkspaceSubject.asObservable(),
      setCurrentWorkspace: jest.fn(),
      getCurrentWorkspace: jest.fn(() => ({ id: 'mock_id' })),
    } as unknown as jest.Mocked<WorkspaceService>;
    workspaceApiMock = { updateWorkspace: jest.fn(() => of(EMPTY)) } as unknown as jest.Mocked<WorkspaceApi>;
    messageServiceMock = { success: jest.fn(), error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;
    const componentInstanceMock = {
      confirmTitle: null,
      confirmMessage: null,
      positiveButtonLabel: null,
      negativeButtonLabel: null,
    } as Record<string, any>;
    dialogMock = {
      open: jest.fn(() => ({
        componentInstance: componentInstanceMock,
        afterClosed: jest.fn(() => EMPTY),
      })),
    } as unknown as jest.Mocked<MatDialog>;

    service = new IntegrationsService(
      workspaceServiceMock,
      workspaceApiMock,
      messageServiceMock,
      dialogMock,
      mockIntegrationsConfig,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getIntegrations', () => {
    it('should return the integrations list, setting the active status on those that depend on the workspace', (done) => {
      const expectedToggleableIntegrations: Integration[] = [
        {
          id: 'teams',
          type: 'toggle',
          link: 'https://teams.microsoft.com/l/app/0b3ce6e5-c418-4aee-9d05-851ed135933b?installAppPackage=true&webjoin=true&appTenantId=d4e2f73f-a5a4-41e6-abe2-e6ffd0809d6d',
          name: 'Teams',
          active: true,
          workspaceKey: 'notify_teams',
          hasInstallInstructions: true,
          description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.TEAMS'),
        },
        {
          id: 'slack',
          type: 'toggle',
          active: true,
          link: 'https://learning-platform-api-stage.keepsdev.com/slack/slack/install',
          name: 'Slack',
          workspaceKey: 'notify_slack',
          description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.SLACK'),
        },
      ];

      service.getIntegrations().subscribe((integrationGroups) => {
        const integrations = integrationGroups.flatMap((item) => item.items);

        expect(integrations).toEqual(expect.arrayContaining(expectedToggleableIntegrations));
        done();
      });
    });

    it('should emit when the current workspace changes', (done) => {
      const expectedToggleableIntegrations: Integration[] = [
        {
          id: 'slack',
          type: 'toggle',
          active: false,
          link: 'https://learning-platform-api-stage.keepsdev.com/slack/slack/install',
          name: 'Slack',
          workspaceKey: 'notify_slack',
          description: marker('INTEGRATIONS.INTEGRATION_LIST.DESCRIPTIONS.SLACK'),
        },
      ];

      service
        .getIntegrations()
        .pipe(skip(1))
        .subscribe((integrationGroups) => {
          const integrations = integrationGroups.flatMap((item) => item.items);

          expect(integrations).toEqual(expect.arrayContaining(expectedToggleableIntegrations));
          done();
        });

      currentWorkspaceSubject.next({ notify_slack: false });
    });
  });

  describe('toggleIntegration', () => {
    it('should toggle teams integration', (done) => {
      service.toggleIntegration({ id: 'teams' } as Integration, true).subscribe(() => {
        expect(workspaceApiMock.updateWorkspace).toHaveBeenCalledWith('mock_id', { notify_teams: true });

        done();
      });
    });

    it('should toggle slack integration', (done) => {
      service.toggleIntegration({ id: 'slack' } as Integration, true).subscribe(() => {
        expect(workspaceApiMock.updateWorkspace).toHaveBeenCalledWith('mock_id', { notify_slack: true });

        done();
      });
    });

    it('should set the current workspace on success', (done) => {
      service.toggleIntegration({ id: 'teams' } as Integration, true).subscribe(() => {
        expect(workspaceServiceMock.setCurrentWorkspace).toHaveBeenCalledWith({ id: 'mock_id', notify_teams: true });

        done();
      });
    });

    it('should open the integration link on success when enabling it', (done) => {
      const windowOpenSpy = (window.open = jest.fn());

      service.toggleIntegration({ id: 'teams', link: 'connection_link' } as Integration, true).subscribe(() => {
        expect(windowOpenSpy).toHaveBeenCalledWith('connection_link', 'blank');

        done();
      });
    });

    it('should not open the integration link when enabling if it does not exists', (done) => {
      const windowOpenSpy = (window.open = jest.fn());

      service.toggleIntegration({ id: 'teams' } as Integration, false).subscribe(() => {
        expect(windowOpenSpy).not.toHaveBeenCalled();

        done();
      });
    });

    it('should not open the integration link when disabling it', (done) => {
      const windowOpenSpy = (window.open = jest.fn());

      service.toggleIntegration({ id: 'teams', link: 'connection_link' } as Integration, false).subscribe(() => {
        expect(windowOpenSpy).not.toHaveBeenCalled();

        done();
      });
    });

    it('should display a success message when enabled successfully', (done) => {
      service.toggleIntegration({ id: 'teams' } as Integration, true).subscribe(() => {
        expect(messageServiceMock.success).toHaveBeenCalled();

        done();
      });
    });

    it('should display an error message on failure', (done) => {
      workspaceApiMock.updateWorkspace.mockReturnValueOnce(throwError(() => new Error()));

      service.toggleIntegration({ id: 'teams' } as Integration, true).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalled();

          done();
        },
      });
    });
  });

  describe('openInstructionsDialog', () => {
    it('should open TeamsInstructionsDialogComponent when integration id is teams', () => {
      const integration = { id: 'teams' } as Integration;

      service.openInstructionsDialog(integration);

      expect(dialogMock.open).toHaveBeenCalledWith(
        TeamsInstructionsDialogComponent,
        expect.objectContaining({ autoFocus: 'dialog', width: '600px' }),
      );
    });

    it('should not open any dialog when integration id is not teams', () => {
      const integration = { id: 'slack' } as Integration;

      service.openInstructionsDialog(integration);

      expect(dialogMock.open).not.toHaveBeenCalled();
    });
  });
});
