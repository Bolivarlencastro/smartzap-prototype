import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ActivityContentTypes, Tracker } from './model';
import { KpViewerTrackerComponent } from './viewer-tracker/kp-viewer-tracker.component';
import { KpPlayerTrackerComponent } from './player-tracker/kp-player-tracker.component';

@Component({
  selector: 'kp-viewer',
  templateUrl: './kp-viewer.component.html',
  styleUrls: ['./kp-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [KpPlayerTrackerComponent, KpViewerTrackerComponent],
})
export class KpViewerComponent {
  @Input() url: string;
  @Input() contentType: ActivityContentTypes;
  @Input() contentId: string;

  @Output() tracker = new EventEmitter<Tracker>();

  types = ActivityContentTypes;

  onActivityChange($event: any): void {
    const contentId = this.contentId;
    const contentType = this.contentType;
    this.tracker.emit({ event: $event, contentId, contentType });
  }
}
