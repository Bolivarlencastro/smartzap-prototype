import { Routes } from '@angular/router';
import { GroupUsersPageComponent } from './containers';
import { GROUP_USER_PROVIDERS } from './group-user.providers';

export default [
  {
    path: '',
    component: GroupUsersPageComponent,
    providers: GROUP_USER_PROVIDERS,
  },
] as Routes;
