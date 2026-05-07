import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Workspace, WorkspaceApi, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { combineLatest, filter, map, of, switchMap, tap } from 'rxjs';
import { INTEGRATIONS_CONFIG, IntegrationsConfig } from '../../integrations.module';
import { Integration, IntegrationGroup } from '../../models/integrations-model';
import { getIntegrations } from '../../utils';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { TeamsInstructionsDialogComponent } from '../../containers/teams-instructions-dialog/teams-instructions-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsService {
  constructor(
    private workspaceService: WorkspaceService,
    private workspaceApi: WorkspaceApi,
    private messageService: KpMessageService,
    private dialog: MatDialog,
    @Inject(INTEGRATIONS_CONFIG) private config: IntegrationsConfig,
  ) {}

  getIntegrations() {
    const currentWorkspace$ = this.workspaceService.currentWorkspace$;
    const integrations$ = of(getIntegrations(this.config.environment));

    return combineLatest([integrations$, currentWorkspace$]).pipe(
      map(([integrations, currentWorkspace]) =>
        integrations.map((group) => this.mapActiveIntegrations(group, currentWorkspace)),
      ),
    );
  }

  toggleIntegration(integration: Integration, enabled: boolean) {
    if (integration.id === 'alura' && !enabled) {
      return this.openAluraDeactivationConfirmDialog(integration, enabled);
    }

    return this.updateWorkspace(integration, enabled);
  }

  openAluraDeactivationConfirmDialog(integration: Integration, enabled: boolean) {
    const dialogRef = this.dialog.open(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
    dialogRef.componentInstance.confirmTitle = marker('INTEGRATIONS.INTEGRATION_LIST.DEACTIVATION_DIALOG.TITLE');
    dialogRef.componentInstance.confirmMessage = marker('INTEGRATIONS.INTEGRATION_LIST.DEACTIVATION_DIALOG.MESSAGE');
    dialogRef.componentInstance.positiveButtonLabel = marker(
      'INTEGRATIONS.INTEGRATION_LIST.DEACTIVATION_DIALOG.POSITIVE_BUTTON',
    );
    dialogRef.componentInstance.negativeButtonLabel = marker(
      'INTEGRATIONS.INTEGRATION_LIST.DEACTIVATION_DIALOG.NEGATIVE_BUTTON',
    );

    return dialogRef.afterClosed().pipe(
      filter((result) => !!result),
      switchMap(() => this.updateWorkspace(integration, enabled)),
    );
  }

  private updateWorkspace(integration: Integration, enabled: boolean) {
    const currentWorkspace = this.workspaceService.getCurrentWorkspace();
    const workspacePayload = this.buildUpdateWorkspace(integration.id, enabled);

    return this.workspaceApi.updateWorkspace(currentWorkspace.id, workspacePayload).pipe(
      tap({
        next: () => {
          this.openIntegrationConnection(integration, enabled);
          this.displaySuccessToggleMessage(enabled);
        },
        error: () => this.displayFailureToggleMessage(enabled),
      }),
      map(() => {
        this.workspaceService.setCurrentWorkspace({ ...currentWorkspace, ...workspacePayload });
      }),
    );
  }

  private openIntegrationConnection(integration: Integration, enabling: boolean) {
    if (!enabling || !integration.link) {
      return;
    }

    window.open(integration.link, 'blank');
  }

  private buildUpdateWorkspace(integrationId: string, enabled: boolean): Partial<Workspace> {
    const map = new Map<string, Partial<Workspace>>([
      ['teams', { notify_teams: enabled }],
      ['slack', { notify_slack: enabled }],
      ['alura', { alura_integration_active: enabled }],
    ]);

    return map.get(integrationId);
  }

  private mapActiveIntegrations(integrationGroup: IntegrationGroup, workspace: Workspace) {
    const updatedIntegrations: Integration[] = integrationGroup.items.map((integration) => {
      return { ...integration, active: workspace[integration.workspaceKey] };
    });

    return { ...integrationGroup, items: updatedIntegrations } as IntegrationGroup;
  }

  private displaySuccessToggleMessage(enabling: boolean) {
    const message = enabling
      ? marker('INTEGRATIONS.INTEGRATION_LIST.TOGGLE.ENABLE_SUCCESS')
      : marker('INTEGRATIONS.INTEGRATION_LIST.TOGGLE.DISABLE_SUCCESS');

    this.messageService.success(message);
  }

  private displayFailureToggleMessage(enabling: boolean) {
    const message = enabling
      ? marker('INTEGRATIONS.INTEGRATION_LIST.TOGGLE.ENABLE_FAILURE')
      : marker('INTEGRATIONS.INTEGRATION_LIST.TOGGLE.DISABLE_FAILURE');

    this.messageService.error(message);
  }

  openInstructionsDialog(integration: Integration) {
    if (integration.id === 'teams') {
      this.openTeamsInstructionsDialog();
    }
  }

  private openTeamsInstructionsDialog() {
    this.dialog.open(TeamsInstructionsDialogComponent, { autoFocus: 'dialog', width: '600px' });
  }
}
