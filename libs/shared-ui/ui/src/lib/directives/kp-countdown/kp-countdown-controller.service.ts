import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KpCountdownControllerService {
  private readonly pausedSubject = new Subject<boolean>();
  readonly onPauseEvent = this.pausedSubject.asObservable();
  private readonly playbackSpeedSubject = new Subject<number>();
  readonly onPlaybackSpeedChange = this.playbackSpeedSubject.asObservable();

  pause() {
    this.pausedSubject.next(true);
  }

  resume() {
    this.pausedSubject.next(false);
  }

  setPlaybackSpeed(playbackSpeed: number) {
    this.playbackSpeedSubject.next(playbackSpeed);
  }
}
