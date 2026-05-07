import { importProvidersFrom } from '@angular/core';
import { provideNgxMask } from 'ngx-mask';
import { WorkspaceConfigurationAPI } from './services/workspace-configuration.api';
import { WorkspaceConfigurationsService } from './services/workspace-configurations.service';
import { EffectsModule } from '@ngrx/effects';
import { WorkspaceConfigurationsEffects } from 'app/main/workspace-configuration/store/workspace-configurations.effects';
import { StoreModule } from '@ngrx/store';
import * as fromWorkspaceConfigurations from 'app/main/workspace-configuration/store/workspace-configurations.reducer';

export const WORKSPACE_CONFIGURATION_PROVIDERS = [
  WorkspaceConfigurationAPI,
  WorkspaceConfigurationsService,
  provideNgxMask(),
  importProvidersFrom(
    EffectsModule.forFeature([WorkspaceConfigurationsEffects]),
    StoreModule.forFeature(fromWorkspaceConfigurations.workspaceConfigurationsKey, fromWorkspaceConfigurations.reducer),
  ),
];
