import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityContentTypes, CreateActivity, UpateActivity } from '../model';
import { KpMediaPlayerComponent } from '../../kp-media-player/kp-media-player.component';
import { KpAudioPlayerComponent } from '../../kp-audio-player/kp-audio-player.component';

const TIME_INTERVAEL = 5000;

@Component({
  selector: 'kp-player-tracker',
  template: `
    @switch (contentType) {
      @case (types.Podcast) {
        <kp-audio-player [url]="url" (paused)="onPause()" (played)="onPlay()"></kp-audio-player>
      }
      @case (types.Video) {
        <kp-media-player [url]="url" (paused)="onPause()" (played)="onPlay()"></kp-media-player>
      }
      @default {
        <div>Formato não suportado</div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  imports: [KpAudioPlayerComponent, KpMediaPlayerComponent],
})
export class KpPlayerTrackerComponent {
  @Input() url: string;
  @Input() contentType: ActivityContentTypes;
  @Input() contentId: string;
  @Output() activityTracker = new EventEmitter<any>();

  types = ActivityContentTypes;

  private _interval: any;

  onPause() {
    clearInterval(this._interval);
    this._interval = null;
    this.activityTracker.emit(new UpateActivity());
  }

  createTimer(): void {
    if (this._interval) return;

    this._interval = setInterval(() => {
      this.activityTracker.emit(new UpateActivity());
    }, TIME_INTERVAEL);
  }

  onPlay() {
    this.activityTracker.emit(new CreateActivity());
    this.createTimer();
  }
}
