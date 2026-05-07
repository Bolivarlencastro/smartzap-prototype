import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { ProfileBaseComponent } from './profile-base.component';
import { ProfileViewInfoComponent } from '../components/profile-view-info/profile-view-info.component';
import { AsyncPipe } from '@angular/common';

marker('PROFILE_FEATURE.GENERAL.PROFILE.ein');
marker('PROFILE_FEATURE.GENERAL.PROFILE.job');
marker('PROFILE_FEATURE.GENERAL.PROFILE.area_of_activity');
marker('PROFILE_FEATURE.GENERAL.PROFILE.director');
marker('PROFILE_FEATURE.GENERAL.PROFILE.manager');
marker('PROFILE_FEATURE.GENERAL.PROFILE.leader_email');

@Component({
  selector: 'app-profile-additional-info',
  template: ` <app-profile-view-info [profile]="service.user$ | async"></app-profile-view-info>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ProfileViewInfoComponent, AsyncPipe],
})
export class ProfileAdditionalInfoComponent extends ProfileBaseComponent {}
