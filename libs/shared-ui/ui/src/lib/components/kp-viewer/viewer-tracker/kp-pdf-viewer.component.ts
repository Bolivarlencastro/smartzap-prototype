import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ProgressBarEvent, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { BehaviorSubject } from 'rxjs';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'kp-pdf-viewer',
  template: ` @if (url) {
    <div class="kp-pdf-viewer">
      @if (loading$ | async) {
        <div class="loader">
          <mat-progress-bar mode="determinate" [value]="progress$ | async"></mat-progress-bar>
        </div>
      }
      <ngx-extended-pdf-viewer
        [src]="url"
        [class.hidden]="loading$ | async"
        [useBrowserLocale]="true"
        [showDownloadButton]="false"
        [showPrintButton]="false"
        [showOpenFileButton]="false"
        [showBookmarkButton]="false"
        [height]="'calc(100vh - 60px)'"
        (progress)="onProgress($event)"
        (pdfLoaded)="pdfLoadingChange(false)"
        (pdfLoadingFailed)="pdfLoadingChange(false)"
      >
      </ngx-extended-pdf-viewer>
    </div>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  imports: [MatProgressBar, NgxExtendedPdfViewerModule, AsyncPipe],
})
export class KpPdfViewerComponent {
  @Input() url: string;
  private _loading = new BehaviorSubject(true);
  private _progress = new BehaviorSubject(0);

  protected loading$ = this._loading.asObservable();
  protected progress$ = this._progress.asObservable();

  onProgress(event: ProgressBarEvent) {
    this._progress.next(event.percent);
  }

  pdfLoadingChange(loading: boolean): void {
    this._loading.next(loading);
  }
}
