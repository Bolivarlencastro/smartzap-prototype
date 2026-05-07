import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './containers/profile.component';
import {
  ProfileAccountComponent,
  ProfileAdditionalInfoComponent,
  ProfileAvatarComponent,
  ProfilePasswordComponent,
} from './containers';
import { marker } from '@jsverse/transloco-keys-manager/marker';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full',
      },
      {
        path: 'account',
        component: ProfileAccountComponent,
        data: {
          title: marker('PROFILE_FEATURE.GENERAL.PROFILE.ACCOUNT'),
          subtitle: marker('PROFILE_FEATURE.GENERAL.PROFILE.ACCOUNT_DESC'),
        },
      },
      {
        path: 'avatar',
        component: ProfileAvatarComponent,
        data: {
          title: marker('PROFILE_FEATURE.GENERAL.PROFILE.AVATAR'),
          subtitle: marker('PROFILE_FEATURE.GENERAL.PROFILE.AVATAR_DESC'),
        },
      },
      {
        path: 'additional-info',
        component: ProfileAdditionalInfoComponent,
        data: {
          title: marker('PROFILE_FEATURE.GENERAL.PROFILE.ADDITIONAL_INFO'),
          subtitle: marker('PROFILE_FEATURE.GENERAL.PROFILE.ADDITIONAL_INFO_DESC'),
        },
      },
      {
        path: 'password',
        component: ProfilePasswordComponent,
        data: {
          title: marker('PROFILE_FEATURE.GENERAL.PROFILE.PASSWORD'),
          subtitle: marker('PROFILE_FEATURE.GENERAL.PROFILE.PASSWORD_DESC'),
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
