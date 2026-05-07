import { Injectable } from '@angular/core';
import { KonquestActivityApi } from '@core/api';
import { AnalyticsEventTypes, AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { tap } from 'rxjs/operators';
import { URLService } from '.';
import { KpMediaPlayerStorageService } from '@keeps-platform-frontend-workspace/ui/kp-media-player';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private _activityId: any;
  private _activityType: AnalyticsEventTypes;
  private _contentUrl: string;

  constructor(
    private _http: KonquestActivityApi,
    private _authService: AuthService,
    private _urlService: URLService,
    private mediaPlayerService: KpMediaPlayerStorageService,
  ) {}

  registry(contentParam: Record<string, string>, action: AnalyticsEventTypes, url?: string): void {
    this._activityType = action;
    this._contentUrl = url;

    const body = {
      ...contentParam,
      action,
      user: this._authService.userId,
      time_start: new Date(),
      time_stop: new Date(),
      ...(this.shouldRegisterSpeed() && {
        speed: this.getPlayerSpeed(),
      }),
    };

    this._http
      .create(body)
      .pipe(tap({ next: ({ id }) => (this._activityId = id), error: (error) => this.logTrackingError(error) }))
      .subscribe();
  }

  update(): void {
    this.updateStopTime();
  }

  leave(): void {
    this.updateStopTime();
  }

  private logTrackingError(error: any) {
    console.error('There was an error while tracking the user progress', error);
  }

  private updateStopTime(): void {
    if (!this._activityId) {
      return;
    }

    this._http
      .update(this._activityId, {
        time_stop: new Date(),
        ...(this.shouldRegisterSpeed() && {
          speed: this.getPlayerSpeed(),
        }),
      })
      .pipe(tap({ error: (error) => this.logTrackingError(error) }))
      .subscribe();
  }

  private shouldRegisterSpeed(): boolean {
    return this._activityType === AnalyticsEventTypes.WATCH || this._activityType === AnalyticsEventTypes.LISTEN;
  }

  private getPlayerSpeed(): number {
    return this._urlService.isSoundCloudUrl(this._contentUrl) ? 1 : this.mediaPlayerService.playbackRate;
  }
}
