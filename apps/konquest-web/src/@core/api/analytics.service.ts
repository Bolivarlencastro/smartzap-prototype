import { Injectable } from '@angular/core';
import { AnalyticsActivity, AnalyticsEvent, LearnContentActivity } from '@core/model';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable, of } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { KonquestAPI } from './base';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  public static readonly ACTIVITY_KEY = 'ACTIVITY_CACHE';

  private activityCache: any;

  private _url = '/users/learn-activities';

  constructor(
    private _http: KonquestAPI,
    private _authService: AuthService,
  ) {}

  registerNewActivity(event: AnalyticsEvent): Observable<LearnContentActivity> {
    if (!event) {
      return of(null);
    }

    const activityCache: any = this.getActivityCache();

    if (activityCache && event.type === 'LEAVE') {
      return this.updateActivityStopTime(activityCache.id, event.timestamp);
    }

    if (activityCache && event.type !== 'LEAVE') {
      return this.fetchActivity(activityCache.id).pipe(
        filter((response) => !this.hasStopTime(response)),
        switchMap((response) => this.updateActivityStopTime(response.id, activityCache.time_stop)),
        switchMap(() => this.createNewActivity(new AnalyticsActivity(event))),
        tap((response) => this.setActivityCache(response)),
      );
    }

    if (!activityCache && event.type !== 'LEAVE') {
      return this.createNewActivity(new AnalyticsActivity(event)).pipe(
        tap((response) => this.setActivityCache(response)),
      );
    }

    return of(null);
  }

  private hasStopTime(activity: LearnContentActivity): boolean {
    return !!activity.time_stop;
  }

  public createNewActivity(activity: LearnContentActivity): Observable<LearnContentActivity> {
    const user = this._authService.userId;
    return this._http.post<LearnContentActivity>(this._url, {
      ...activity,
      user,
    });
  }

  public onBeforeUnload(): void {
    const activity = this.getActivityCache();

    if (!activity) {
      return;
    }

    activity.time_stop = new Date();
    this.setActivityCache(activity);
  }

  private setActivityCache(activity: any): void {
    this.activityCache = activity;
    localStorage.setItem(AnalyticsService.ACTIVITY_KEY, JSON.stringify(this.activityCache));
  }

  private getActivityCache(): LearnContentActivity {
    const cacheString = localStorage.getItem(AnalyticsService.ACTIVITY_KEY);

    if (!cacheString) {
      return null;
    }

    return JSON.parse(cacheString);
  }

  private clearActivityCache(): void {
    localStorage.removeItem(AnalyticsService.ACTIVITY_KEY);
  }

  private updateActivityStopTime(activityId: string, time_stop): Observable<LearnContentActivity> {
    return this._http
      .patch<LearnContentActivity>(`${this._url}/${activityId}`, { time_stop })
      .pipe(tap(() => this.clearActivityCache()));
  }

  private fetchActivity(activityId: string): Observable<LearnContentActivity> {
    return this._http.get<LearnContentActivity>(`${this._url}/${activityId}`);
  }
}
