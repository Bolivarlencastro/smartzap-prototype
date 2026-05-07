import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SmartzapApi } from '@core/api';
import { Actions, Activity } from '@core/model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Tracker } from '@keeps-platform-frontend-workspace/ui/kp-viewer';
import { AnalyticsEventTypes } from '@keeps-platform-frontend-workspace/kp-keeps';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private activityId: string;
  private _url = '/view/activity';

  constructor(
    private _http: SmartzapApi,
    private _authService: AuthService,
    private _router: Router,
  ) {}

  registry(data: Tracker): Observable<any> {
    if (data.event.type === 'CREATE') {
      const body = this.buildActivity(data);
      return this._http.post<Activity>(this._url, body).pipe(tap(({ id }) => (this.activityId = id)));
    }

    return this._http.patch<Activity>(`${this._url}/${this.activityId}`, { stop_at: data.event.stop });
  }

  leave(): Observable<any> {
    return this._http.patch<Activity>(`${this._url}/${this.activityId}`, { stop_at: new Date() });
  }

  getActivityId(): string {
    return this.activityId;
  }

  return(url: string): any {
    if (environment.prototypeMode) {
      this._router.navigateByUrl(environment.prototypeHomePath);
      return;
    }

    window.location.href = url;
    setInterval(() => window.close(), 5000);
  }

  private buildActivity(data: Tracker): Activity {
    const actions: Actions = {
      Podcast: AnalyticsEventTypes.LISTEN,
      Video: AnalyticsEventTypes.WATCH,
      Image: AnalyticsEventTypes.VIEW,
      PDF: AnalyticsEventTypes.READ,
      Text: AnalyticsEventTypes.READ,
      Presentation: AnalyticsEventTypes.VIEW,
      Spreadsheet: AnalyticsEventTypes.READ,
      Blog: AnalyticsEventTypes.READ,
    };
    return {
      user_id: this._authService.userId,
      content_id: data.contentId,
      action: actions[data.contentType as keyof Actions],
      start_at: data.event.start,
      stop_at: data.event.stop,
    };
  }
}
