import { Routes } from '@angular/router';
import { GroupListComponent } from './containers';
import { GROUPS_PROVIDERS } from './groups.providers';

export default [
  {
    path: '',
    component: GroupListComponent,
    providers: GROUPS_PROVIDERS,
  },
  {
    path: ':id',
    loadChildren: () => import('../group-detail/group-detail.routes'),
  },
] as Routes;
