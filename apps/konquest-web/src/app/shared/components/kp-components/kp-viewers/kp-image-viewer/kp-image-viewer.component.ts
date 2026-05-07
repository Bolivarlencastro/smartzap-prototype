import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AnalyticsEvent } from '@core/model';
import { FullScreenViewer } from 'iv-viewer';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'kp-image-viewer',
  templateUrl: './kp-image-viewer.component.html',
  styleUrls: ['./kp-image-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { '[class.fullscreen-enabled]': 'enableFullscreen' },
  imports: [MatTooltip, TranslocoPipe],
})
export class KpImageViewerComponent implements OnInit, OnDestroy {
  @Input() url!: string;
  @Input() enableFullscreen = true;
  @Output() analyticsEvent = new EventEmitter<AnalyticsEvent>();
  @Output() started = new EventEmitter<void>();

  private _viewer: any;

  ngOnInit(): void {
    if (this.enableFullscreen) {
      this._viewer = new FullScreenViewer();
    }
    this.started.emit();
  }

  ngOnDestroy(): void {
    this._viewer?.destroy();
  }

  onClick(): void {
    if (!this.url || !this.enableFullscreen) {
      return;
    }

    this._viewer.show(this.url);
  }
}
