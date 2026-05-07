import { Routes } from '@angular/router';
import { DashboardComponent } from './containers/dashboard.component';
import { DASHBOARD_PROVIDERS } from './dashboard.providers';

export default [
  {
    path: '',
    component: DashboardComponent,
    providers: DASHBOARD_PROVIDERS,
  },
] as Routes;
