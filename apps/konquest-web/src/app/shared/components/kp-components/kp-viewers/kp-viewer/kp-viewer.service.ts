import { Injectable } from '@angular/core';
import { AnalyticsEvent } from '@core/model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KpViewerService {
  private readonly _activities = new BehaviorSubject<any>(null);
  readonly activities$ = this._activities.asObservable();

  notify(event: AnalyticsEvent): void {
    this._activities.next(event);
  }
}
