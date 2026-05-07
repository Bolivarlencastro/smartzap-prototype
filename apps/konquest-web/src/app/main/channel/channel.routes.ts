import { Routes } from '@angular/router';
import { CURATOR_ROLES } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ChannelDetailComponent } from './pages/detail/channel-detail.component';
import { ChannelDetailGuard } from './pages/detail/channel-detail.guard';
import { ChannelFormComponent } from './pages/form/channel-form.component';
import { ChannelFormGuard } from './pages/form/channel-form.guard';
import { CHANNEL_DETAIL_PROVIDERS } from './pages/detail/channel-detail.providers';
import { CHANNEL_FORM_PROVIDERS } from 'app/main/channel/pages/form/channel-form.providers';

export default [
  {
    path: 'details/:id',
    component: ChannelDetailComponent,
    canActivate: [ChannelDetailGuard],
    providers: CHANNEL_DETAIL_PROVIDERS,
  },
  {
    path: 'edit/:id',
    component: ChannelFormComponent,
    canActivate: [ChannelFormGuard],
    providers: CHANNEL_FORM_PROVIDERS,
    data: {
      roles: CURATOR_ROLES,
    },
  },
  {
    path: 'new',
    component: ChannelFormComponent,
    canActivate: [ChannelFormGuard],
    providers: CHANNEL_FORM_PROVIDERS,
    data: {
      roles: CURATOR_ROLES,
    },
  },
] as Routes;
