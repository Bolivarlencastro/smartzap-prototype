import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FullScreenViewer } from 'iv-viewer';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';

@Component({
  selector: 'kp-image-viewer',
  template: `
    <div class="kp-image-viewer">
      <button mat-mini-fab color="primary" class="zoom" (click)="onClick()">
        <mat-icon>zoom_in</mat-icon>
      </button>

      <img [src]="url" alt="Image Viewer" (click)="onClick()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  imports: [MatMiniFabButton, MatIcon],
})
export class KpImageViewerComponent implements OnInit, OnDestroy {
  @Input() url: string;

  private _viewer: any;

  ngOnInit(): void {
    this._viewer = new FullScreenViewer();
  }

  ngOnDestroy(): void {
    this._viewer.destroy();
  }

  onClick(): void {
    if (!this.url) {
      return;
    }

    this._viewer.show(this.url);
  }
}
