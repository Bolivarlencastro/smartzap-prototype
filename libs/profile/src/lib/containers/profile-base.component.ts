import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../services';
import { ProfilePageData } from '../types';

@Component({
  selector: 'app-profile-base',
  template: ``,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileBaseComponent {
  constructor(
    protected service: ProfileService,
    protected route: ActivatedRoute,
  ) {
    route.data.subscribe((data) => this.service.updatePageData(data as ProfilePageData));
  }
}
