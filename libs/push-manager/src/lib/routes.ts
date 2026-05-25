import { Routes } from '@angular/router';
import { CreationComponent } from './containers/creation/creation.component';
import { PanelComponent } from './containers/panel/panel.component';
import { PUSH_MANAGER_PROVIDERS } from './push-manager.providers';

export const pushManagerRoutes: Routes = [
  {
    path: '',
    providers: PUSH_MANAGER_PROVIDERS,
    children: [
      { path: '', redirectTo: 'panel', pathMatch: 'full' },
      {
        path: 'panel',
        component: PanelComponent,
      },
      {
        path: 'creation',
        component: CreationComponent,
      },
    ],
  },
] as Routes;
