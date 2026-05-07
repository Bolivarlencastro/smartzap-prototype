import { Routes } from '@angular/router';
import { MissionContentComponent } from './containers/mission-content/mission-content.component';
import { MissionCreateComponent } from './containers/mission-create/mission-create.component';
import { MissionCreatedComponent } from './containers/mission-created/mission-created.component';
import { MissionImagesComponent } from './containers/mission-images/mission-images.component';
import { MissionInfoComponent } from './containers/mission-info/mission-info.component';
import { MissionPresentialLiveComponent } from './containers/mission-presential-live/mission-presential-live.component';
import { MissionProviderComponent } from './containers/mission-provider/mission-provider.component';
import { MissionSettingsComponent } from './containers/mission-settings/mission-settings.component';
import { missionCreatedGuard } from './guards/mission-created.guard';
import { missionDeactivateGuard } from './guards/mission-deactivate.guard';
import { SupportMaterialComponent } from './containers/support-material/support-material.component';

export const missionCreateRoutes: Routes = [
  { path: '', redirectTo: 'internal', pathMatch: 'full' },
  {
    component: MissionCreateComponent,
    path: ':mission-model-id',
    children: [
      {
        path: 'info',
        component: MissionInfoComponent,
        canDeactivate: [missionDeactivateGuard],
      },
      {
        path: 'images',
        component: MissionImagesComponent,
        canActivate: [missionCreatedGuard],
      },
      {
        path: 'settings',
        component: MissionSettingsComponent,
        canActivate: [missionCreatedGuard],
      },
      {
        path: 'content',
        component: MissionContentComponent,
        canActivate: [missionCreatedGuard],
      },
      {
        path: 'support-material',
        component: SupportMaterialComponent,
        canActivate: [missionCreatedGuard],
      },
      {
        path: 'presential',
        component: MissionPresentialLiveComponent,
        canActivate: [missionCreatedGuard],
        canDeactivate: [missionDeactivateGuard],
      },
      {
        path: 'live',
        component: MissionPresentialLiveComponent,
        canActivate: [missionCreatedGuard],
        canDeactivate: [missionDeactivateGuard],
      },
      {
        path: 'finish',
        component: MissionCreatedComponent,
        canActivate: [missionCreatedGuard],
      },
      {
        path: 'provider',
        component: MissionProviderComponent,
        canActivate: [missionCreatedGuard],
        canDeactivate: [missionDeactivateGuard],
      },
      { path: '', redirectTo: 'info', pathMatch: 'full' },
    ],
  },
];
