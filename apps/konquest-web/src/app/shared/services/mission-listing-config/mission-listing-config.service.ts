import { Injectable } from '@angular/core';
import { MissionListingConfig, WorkspaceApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MissionListingConfigService {
  constructor(
    private messageService: KpMessageService,
    private workspaceApi: WorkspaceApi,
  ) {}

  getConfig(): Observable<Partial<MissionListingConfig>[]> {
    return this.workspaceApi.getMissionListingConfig();
  }

  updateConfig(config: Partial<MissionListingConfig>, checked: boolean) {
    return this.workspaceApi.updateMissionListingConfig(config.id, checked).pipe(
      tap({
        next: () => this.messageService.success('WORKSPACE_CONFIGURATIONS.SETTINGS_UPDATED_SUCCESS'),
        error: () => this.messageService.error('WORKSPACE_CONFIGURATIONS.SETTINGS_UPDATED_FAILURE'),
      }),
    );
  }
}
