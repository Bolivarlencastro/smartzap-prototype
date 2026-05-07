import { Injectable } from '@angular/core';
import { LocalMediaStorage } from 'vidstack';

@Injectable({
  providedIn: 'root',
})
export class KpMediaPlayerStorageService extends LocalMediaStorage {
  private _playbackRate = 1;

  get playbackRate() {
    return this._playbackRate || 1;
  }

  constructor() {
    super();
  }

  override setPlaybackRate(rate: number) {
    this._playbackRate = rate;
    return super.setPlaybackRate(rate);
  }

  override async getPlaybackRate() {
    const speed = await super.getPlaybackRate();
    this._playbackRate = speed;
    return speed;
  }

  override async getTime() {
    return 0;
  }
}
