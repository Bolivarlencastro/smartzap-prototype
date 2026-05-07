import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

import { isYouTubeProvider, MediaPlayer, MediaProviderChangeEvent, MediaRateChangeEvent } from 'vidstack';
import { KpMediaPlayerStorageService } from './kp-media-player-storage.service';
import { KpMediaPlayerType } from './models';
import { KpCountdownControllerService } from '../../directives';

import 'vidstack/player';
import 'vidstack/player/layouts/default';
import 'vidstack/player/ui';
import { VimeoUrlFilterPipe } from './vimeo-url-filter.pipe';
import { KpPlaysInlineDirective } from '../../kp-ios-version';

const ISO_639_2_LANGUAGES: Record<string, string> = { 'pt-BR': 'pt', 'pt-PT': 'pt', en: 'en', es: 'es' };

@Component({
  selector: 'kp-media-player',
  imports: [CommonModule, VimeoUrlFilterPipe, KpPlaysInlineDirective, NgClass],
  templateUrl: './kp-media-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      :host {
        display: flex;
      }

      kp-media-player {
        iframe.vds-youtube[data-no-controls] {
          height: 100% !important;
        }
      }

      video {
        height: 100%;
      }

      .classroom-video {
        aspect-ratio: auto;
        overflow: hidden;
      }
    `,
  ],
})
export class KpMediaPlayerComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) url: string;
  @Input() playerType: KpMediaPlayerType = 'video';
  @Input() isClassroomVideo: boolean;
  @Input() currentLanguage: string;
  @Input() mediaPlayerClass: string;

  @Output() paused = new EventEmitter<void>();
  @Output() played = new EventEmitter<void>();
  @ViewChild('mediaPlayer') playerInstance: ElementRef<MediaPlayer>;

  constructor(
    private kpMediaPlayerService: KpMediaPlayerStorageService,
    private countdownController: KpCountdownControllerService,
  ) {}

  ngAfterViewInit() {
    this.playerInstance.nativeElement['storage'] = this.kpMediaPlayerService;
    this.registerEvents();
  }

  ngOnDestroy() {
    this.countdownController.setPlaybackSpeed(1);
  }

  private registerEvents(): void {
    this.registerProviderChangeListener();
    this.registerPlayListener();
    this.registerPauseListener();
    this.registerPlayBackRateChangeListener();
  }

  private registerPlayListener() {
    this.playerInstance.nativeElement.addEventListener('play', () => {
      this.played.emit();
    });
  }

  private registerPauseListener() {
    this.playerInstance.nativeElement.addEventListener('pause', () => {
      this.paused.emit();
    });
  }

  private registerPlayBackRateChangeListener() {
    this.playerInstance.nativeElement.addEventListener('rate-change', (event: MediaRateChangeEvent) =>
      this.countdownController.setPlaybackSpeed(event.detail),
    );
  }

  private registerProviderChangeListener() {
    this.playerInstance.nativeElement.addEventListener('provider-change', (event: MediaProviderChangeEvent) => {
      const provider = event.detail;
      if (isYouTubeProvider(provider)) {
        provider.cookies = true;
        provider.language = ISO_639_2_LANGUAGES[this.currentLanguage] || 'pt';
      }
    });
  }
}
