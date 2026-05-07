import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { KpSafeUrlPipe } from '../../pipes/kp-safe-url/kp-safe-url.pipe';
import { KpMediaPlayerComponent } from '../kp-media-player/kp-media-player.component';

const DEFAULT_PLAY_DELAY = 3000;

@Component({
  selector: 'kp-audio-player',
  templateUrl: './kp-audio-player.component.html',
  styleUrls: ['./kp-audio-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KpMediaPlayerComponent, KpSafeUrlPipe],
})
export class KpAudioPlayerComponent implements OnInit, OnChanges {
  @Input() url: string;
  @Output() played = new EventEmitter<void>();
  @Output() paused = new EventEmitter<void>();

  protected audioUrl: string;
  protected isSoundCloud: boolean;

  ngOnInit(): void {
    this.setInitialValues();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['url']) {
      this.setInitialValues();
    }
  }

  onPlay(): void {
    this.played.emit();
  }

  onPause(): void {
    this.paused.emit();
  }

  private setInitialValues(): void {
    this.isSoundCloud = this.isSoundCloudUrl(this.url);
    this.audioUrl = this.getNormalizedUrl(this.url, this.isSoundCloud);

    if (this.isSoundCloud) {
      setTimeout(() => {
        this.played.emit();
      }, DEFAULT_PLAY_DELAY);
    }
  }

  private getNormalizedUrl(_url: string, _isSoundCloud: boolean): string {
    if (!_isSoundCloud) {
      return _url;
    }

    return this.buildSoundCloudPlayerUrl(_url);
  }

  isSoundCloudUrl(url: string): boolean {
    if (!url) {
      return false;
    }

    const regex = /http(s)?:\/\/soundcloud\.com/;
    return regex.test(url);
  }

  buildSoundCloudPlayerUrl(url: string): string {
    const isValidUrl = this.isSoundCloudUrl(url);

    if (!isValidUrl) {
      throw new Error('Should inform an SoundCloud URL');
    }

    return 'https://w.soundcloud.com/player/?url=' + url;
  }
}
