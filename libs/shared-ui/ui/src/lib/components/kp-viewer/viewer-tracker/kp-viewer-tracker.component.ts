import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
  DOCUMENT,
} from '@angular/core';
import { CreateActivity, UpateActivity, ActivityContentTypes, TIME_INTERVAEL, TIME_TO_DISABLE } from '../model';
import { MatButton } from '@angular/material/button';
import { KpDocsViewerComponent } from './kp-docs-viewer.component';
import { KpImageViewerComponent } from './kp-image-viewer.component';
import { KpPdfViewerComponent } from './kp-pdf-viewer.component';

@Component({
  selector: 'kp-viewer-tracker',
  template: ` @switch (contentType) {
      @case (types.PDF) {
        <kp-pdf-viewer [url]="url"></kp-pdf-viewer>
      }
      @case (types.Image) {
        <kp-image-viewer [url]="url"></kp-image-viewer>
      }
      @case (types.Text) {
        <kp-docs-viewer [url]="url"></kp-docs-viewer>
      }
      @case (types.Presentation) {
        <kp-docs-viewer [url]="url"></kp-docs-viewer>
      }
      @case (types.Spreadsheet) {
        <kp-docs-viewer [url]="url"></kp-docs-viewer>
      }
      @default {
        <div>Formato não suportado</div>
      }
    }

    @if (isPageDisabled) {
      <div class="block-screen">
        <div class="block-screen--content">
          <p>Olá, você ainda está por ai? Aperte no botão para continuar ou feche a janela para sair.</p>
          <button mat-raised-button (click)="onContinue()" color="primary">Continuar...</button>
        </div>
      </div>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  imports: [KpPdfViewerComponent, KpImageViewerComponent, KpDocsViewerComponent, MatButton],
})
export class KpViewerTrackerComponent implements OnInit, OnDestroy {
  @Input() url: string;
  @Input() contentType: ActivityContentTypes;
  @Input() contentId: string;
  @Output() activityTracker = new EventEmitter<any>();

  types = ActivityContentTypes;
  isPageDisabled: boolean;

  private _interval: any;
  private _lastPageActivity: number | null;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.reset();
  }

  @HostListener('document:mousemove')
  handleMouseMove() {
    this.updatePageActivity();
  }

  @HostListener('document:keyup')
  handleKeyup() {
    this.updatePageActivity();
  }

  @HostListener('window:visibilitychange')
  handleVisibilitychange() {
    if (document.hidden) {
      this.reset();
    }
  }

  // Public Methods
  onContinue(): void {
    this.init();
  }

  // Private Methods
  private init() {
    if (this.document.hidden) {
      this.reset();
      return;
    }

    this.activityTracker.emit(new CreateActivity());
    this.startInterval();
    this.isPageDisabled = false;
    this._lastPageActivity = new Date().valueOf();
  }

  private reset(): void {
    clearInterval(this._interval);
    this._interval = null;
    this.isPageDisabled = true;
    this._lastPageActivity = null;
  }

  private startInterval(): void {
    this._interval = setInterval(() => {
      if (this.isPageDisabled) {
        this.reset();
        return;
      }

      this.checkInactivity();
      this.activityTracker.emit(new UpateActivity());
    }, TIME_INTERVAEL);
  }

  private updatePageActivity() {
    if (!this.isPageDisabled) {
      this._lastPageActivity = new Date().valueOf();
    }
  }

  private checkInactivity() {
    if (!this._lastPageActivity) return;
    const timeDiff = new Date().valueOf() - this._lastPageActivity;
    this.isPageDisabled = timeDiff > TIME_TO_DISABLE;
  }
}
