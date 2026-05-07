import { Routes } from '@angular/router';
import { WorkspaceConfigurationsComponent } from './workspace-configurations.component';
import { WORKSPACE_CONFIGURATION_PROVIDERS } from './workspace-configurations.providers';

export default [
  {
    path: '',
    component: WorkspaceConfigurationsComponent,
    providers: WORKSPACE_CONFIGURATION_PROVIDERS,
  },
] as Routes;
