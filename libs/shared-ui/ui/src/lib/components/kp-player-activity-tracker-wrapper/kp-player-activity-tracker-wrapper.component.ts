import { Component, EventEmitter, Input, OnDestroy, Output, ViewEncapsulation } from '@angular/core';
import { TIME_INTERVAL } from './models/activity-tracker-consts';
import { ActivityTrackerComponent, ActivityTrackerEvent } from './models/activity-tracker-component';
import { KpCountdownControllerService } from '../../directives';

@Component({
  selector: 'kp-player-activity-tracker-wrapper',
  encapsulation: ViewEncapsulation.None,
  template: ` <ng-content></ng-content>`,
  standalone: true,
})
export class KpPlayerActivityTrackerWrapperComponent implements OnDestroy, ActivityTrackerComponent {
  private _interval: any;

  constructor(private countdownController: KpCountdownControllerService) {}

  @Output() activityEvent = new EventEmitter<ActivityTrackerEvent>();
  @Input() disableActivityEvents = false;

  ngOnDestroy(): void {
    this.clear();
  }

  createTimer(): void {
    if (this._interval) {
      return;
    }

    this._interval = setInterval(() => {
      this.emitActivityEvent('UPDATE');
    }, TIME_INTERVAL);
  }

  play(): void {
    this.init();
    this.countdownController.resume();
  }

  pause(): void {
    this.clear();
    this.emitActivityEvent('UPDATE');
    this.countdownController.pause();
  }

  clear(): void {
    if (!this._interval) {
      return;
    }
    clearInterval(this._interval);
    this._interval = null;
  }

  init(): void {
    this.emitActivityEvent('CREATE');
    this.createTimer();
  }

  private emitActivityEvent(event: 'CREATE' | 'UPDATE'): void {
    if (!this.disableActivityEvents) {
      this.activityEvent.emit(event);
    }
  }
}
