import { Routes } from '@angular/router';
import { AdminAccessGuard } from 'app/shared/auth/guard';
import { UserDetailsComponent } from './details/user-details.component';
import { UsersOverviewComponent } from './overview/users-overview.component';

export default [
  {
    path: '',
    component: UsersOverviewComponent,
    canActivate: [AdminAccessGuard],
  },
  {
    path: ':id',
    component: UserDetailsComponent,
  },
] as Routes;
