import { Route } from '@angular/router';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { CheckInComponent } from './components/check-in/check-in.component';
import { workspaceGuardActivate } from './guards/workspace.guard';

export const appRoutes: Route[] = [
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '', redirectTo: 'check-in', pathMatch: 'full' },
  { path: ':data', redirectTo: 'check-in/:data' },
  { path: 'check-in/:data', component: CheckInComponent, canActivate: [workspaceGuardActivate] },
  { path: 'check-in', component: CheckInComponent, canActivate: [workspaceGuardActivate] },
  {
    path: '**',
    redirectTo: 'unauthorized',
  },
];
