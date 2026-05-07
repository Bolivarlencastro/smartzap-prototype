import { ChangeDetectionStrategy, Component, DOCUMENT, Inject, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../services';
import { ProfileBaseComponent } from './profile-base.component';

import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { PROFILE_CONFIG, ProfileConfig } from '../types';

@Component({
  selector: 'app-profile-password',
  template: `
    <a mat-flat-button type="button" class="mt-3 xxs:mt-12 button-bg" [href]="keycloakUrl" target="_blank">
      <span>{{ 'PROFILE_FEATURE.GENERAL.CHANGE_PASSWORD' | transloco }}</span>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatButton, TranslocoPipe],
})
export class ProfilePasswordComponent extends ProfileBaseComponent {
  keycloakUrl: string;

  constructor(
    @Inject(PROFILE_CONFIG) public config: ProfileConfig,
    service: ProfileService,
    route: ActivatedRoute,
    @Inject(DOCUMENT) document: Document,
  ) {
    super(service, route);
    this.keycloakUrl = `${config?.keycloak?.url}/realms/${config?.keycloak?.realm}/protocol/openid-connect/auth?client_id=${config?.keycloak?.clientId}&redirect_uri=${document.URL}&response_type=code&scope=openid&kc_action=UPDATE_PASSWORD`;
  }
}
