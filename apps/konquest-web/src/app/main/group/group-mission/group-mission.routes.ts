import { Routes } from '@angular/router';
import { GroupMissionsPageComponent } from './containers';
import { GROUP_MISSION_PROVIDERS } from './group-mission.providers';

export default [
  {
    path: '',
    component: GroupMissionsPageComponent,
    providers: GROUP_MISSION_PROVIDERS,
  },
] as Routes;
