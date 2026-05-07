import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Language, UserCreateDTO, UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable } from 'rxjs';
import { ProfileService } from '../services/profile.service';
import { ProfileBaseComponent } from './profile-base.component';
import { AccountFormComponent } from '../components/account-form/account-form.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile-account',
  template: `
    <app-account-form
      (submitForm)="onSubmit($event)"
      [profile]="userProfile$ | async"
      [languages]="languages$ | async"
    ></app-account-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [AccountFormComponent, AsyncPipe],
})
export class ProfileAccountComponent extends ProfileBaseComponent {
  userProfile$: Observable<UserProfile>;
  languages$: Observable<Language[]>;

  constructor(service: ProfileService, route: ActivatedRoute) {
    super(service, route);
    this.userProfile$ = this.service.user$;
    this.languages$ = this.service.fetchLanguages();
  }

  onSubmit(userProfile: UserCreateDTO): void {
    this.service.updateProfile(userProfile);
  }
}
