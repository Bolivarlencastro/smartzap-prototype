import { Routes } from '@angular/router';
import { GroupChannelsPageComponent } from './containers';
import { GROUP_CHANNEL_PROVIDERS } from './group-channel.providers';

export default [
  {
    path: '',
    component: GroupChannelsPageComponent,
    providers: GROUP_CHANNEL_PROVIDERS,
  },
] as Routes;
