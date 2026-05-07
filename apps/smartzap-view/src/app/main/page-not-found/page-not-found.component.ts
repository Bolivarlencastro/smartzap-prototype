import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ActivityService } from '@core/services';
import { environment } from 'environments/environment';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'sw-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PageNotFoundComponent {
  prototypeMode = environment.prototypeMode;
  prototypeHomePath = environment.prototypeHomePath;

  constructor(
    private _activityService: ActivityService,
    private _activatedRoute: ActivatedRoute,
  ) {}

  supportUrl = environment.keepsSupport;
  whatsappUrlRedirect = this.getReturnPhone(this._activatedRoute.snapshot.queryParamMap);

  onReturn(url: string) {
    this._activityService.return(url);
  }

  private getReturnPhone(paramMap: ParamMap): string {
    const phone = paramMap.get('phone');
    return phone && phone !== 'None' ? `https://wa.me/${phone}` : environment.whatsappUrlRedirect;
  }
}
