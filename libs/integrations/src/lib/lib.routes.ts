import { Route } from '@angular/router';
import { ManagementComponent } from './containers';
import { IntegrationsComponent } from './containers/integrations/integrations.component';

export const integrationsRoutes: Route[] = [
  {
    path: '',
    component: IntegrationsComponent,
  },
  {
    path: 'alura',
    component: ManagementComponent,
  },
];
