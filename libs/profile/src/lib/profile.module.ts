import { NgModule } from '@angular/core';
import { AccountFormComponent, AvatarUploadComponent, ProfileViewInfoComponent } from './components';
import {
  ProfileAccountComponent,
  ProfileAdditionalInfoComponent,
  ProfileAvatarComponent,
  ProfileComponent,
  ProfilePasswordComponent,
} from './containers';
import { ProfileRoutingModule } from './profile.router';
import { ProfileService } from './services';
import { PROFILE_CONFIG, ProfileConfig } from './types';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';

function ConfigFactory() {
  return ProfileModule.moduleConfig;
}

const loader: InlineLoader = ['en', 'es', 'pt-BR', 'pt-PT'].reduce((acc, lang) => {
  acc[lang] = () => import(`../assets/i18n/${lang}.json`);
  return acc;
}, {} as InlineLoader);

@NgModule({
  imports: [
    ProfileRoutingModule,
    ProfileComponent,
    ProfileAccountComponent,
    ProfileAvatarComponent,
    ProfileAdditionalInfoComponent,
    ProfilePasswordComponent,
    AccountFormComponent,
    AvatarUploadComponent,
    ProfileViewInfoComponent,
  ],
  providers: [
    ProfileService,
    { provide: PROFILE_CONFIG, useFactory: ConfigFactory },
    provideTranslocoScope({
      scope: 'profile',
      alias: 'PROFILE_FEATURE',
      loader,
    }),
  ],
  exports: [AccountFormComponent],
})
export class ProfileModule {
  private static _moduleConfig: ProfileConfig;

  static get moduleConfig(): ProfileConfig {
    return this._moduleConfig;
  }

  static set moduleConfig(config: ProfileConfig) {
    this._moduleConfig = config;
  }
}
