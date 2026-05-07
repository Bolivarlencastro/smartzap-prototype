import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  DOCUMENT,
} from '@angular/core';
import { ActivityTrackerComponent, ActivityTrackerEvent, TIME_INTERVAL } from '../kp-player-activity-tracker-wrapper';
import { KpCountdownControllerService } from '../../directives';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatButton } from '@angular/material/button';

const TIME_TO_DISABLE = 60000 * 3; // 3 min +/-

@Component({
  selector: 'kp-content-activity-tracker-wrapper',
  templateUrl: './kp-content-activity-tracker-wrapper.component.html',
  styleUrls: ['./kp-content-activity-tracker-wrapper.component.scss'],
  imports: [MatButton, TranslocoPipe],
})
export class KpContentActivityTrackerWrapperComponent implements ActivityTrackerComponent, OnInit, OnDestroy {
  @Input() startAutomatically = true;
  @Input() continueOnPageVisible = false;
  @Input() disableInactivityCheck = false;
  @Input() disableActivityEvents = false;
  @Output() activityEvent = new EventEmitter<ActivityTrackerEvent>();

  isPageDisabled = false;

  private _interval: any;
  private _lastPageActivity: number;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private countdownController: KpCountdownControllerService,
  ) {}

  ngOnInit(): void {
    if (this.startAutomatically) {
      this.init();
    }
  }

  ngOnDestroy(): void {
    this.reset();
  }

  @HostListener('document:mousemove')
  handleMouseMove(): any {
    this.updatePageActivity();
  }

  @HostListener('document:keyup')
  handleKeyup(): any {
    this.updatePageActivity();
  }

  @HostListener('window:visibilitychange')
  handleVisibilitychange(): any {
    const pageIsHidden = document.hidden;
    if (pageIsHidden) {
      this.reset();
      this.countdownController.pause();
      return;
    }
    if (this.continueOnPageVisible) {
      this.onContinue();
    }
  }

  // Public Methods
  onContinue(): void {
    this.init();
    this.countdownController.resume();
  }

  clear(): void {
    clearInterval(this._interval);
    this._interval = null;
    this._lastPageActivity = 0;
  }

  init(): void {
    if (this.document.hidden) {
      this.reset();
      return;
    }

    this.emitActivityEvent('CREATE');
    this.startInterval();
    this.isPageDisabled = false;
    this._lastPageActivity = new Date().valueOf();
  }

  // Private Methods
  private reset(): void {
    this.clear();
    this.isPageDisabled = !this.disableInactivityCheck;
  }

  private startInterval(): void {
    this._interval = setInterval(() => {
      if (this.isPageDisabled) {
        this.reset();
        return;
      }

      this.checkInactivity();
      this.emitActivityEvent('UPDATE');
    }, TIME_INTERVAL);
  }

  private updatePageActivity(): any {
    if (!this.isPageDisabled) {
      this._lastPageActivity = new Date().valueOf();
    }
  }

  private checkInactivity(): any {
    if (this.disableInactivityCheck) {
      return;
    }

    const timeDiff = new Date().valueOf() - this._lastPageActivity;
    this.isPageDisabled = timeDiff > TIME_TO_DISABLE;
  }

  private emitActivityEvent(event: 'CREATE' | 'UPDATE'): void {
    if (this.disableActivityEvents) {
      return;
    }

    this.activityEvent.emit(event);
  }
}
