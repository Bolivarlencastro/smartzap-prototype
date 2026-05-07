import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { Mission, MissionInformationDate } from 'app/main/mission/mission.model';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { eventManagementFeature } from 'app/main/event-management/store/features';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DateRangePipe } from '../pipes/date-range.pipe';
import { TitleCasePipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { EventQrCodeService } from '../services/event-qr-code.service';
import { TranslocoPipe } from '@jsverse/transloco';

const VIEW_BOX_REGEX = / viewBox="([^"]*)"/;
const PATH_D_REGEX = / d="([^"]*)"/;

@Component({
  selector: 'app-qr-code-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatFormField,
    MatSelectModule,
    DateRangePipe,
    TitleCasePipe,
    MatInput,
    MatButton,
    MatIcon,
    MatIconButton,
    MatTooltip,
    TranslocoPipe,
  ],
  template: `
    <div mat-dialog-content class="flex flex-col">
      <svg #svgElement class="mb-4 rounded-lg">
        <rect width="100%" height="100%" fill="#FFFFFF" stroke-width="0"></rect>
        <path d="" fill="#000000" stroke-width="0"></path>
      </svg>
      <mat-form-field appearance="outline" class="w-full">
        <mat-select [value]="currentDateId()" (selectionChange)="onDateChange($event.value)">
          @for (date of eventDates(); track date.id) {
            <mat-option [value]="date.id">
              {{ date | dateRange | titlecase }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline" class="w-full">
        <input matInput [value]="accessUrl()" readonly />
        <button
          matIconButton
          matSuffix
          [matTooltip]="'EVENT_MANAGEMENT.QR_CODE_DIALOG.COPY_LINK' | transloco"
          (click)="copyLink()"
        >
          <mat-icon>link</mat-icon>
        </button>
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="center">
      <button matButton (click)="copySVG()">
        <mat-icon>content_cut</mat-icon>
        {{ 'EVENT_MANAGEMENT.QR_CODE_DIALOG.COPY_SVG' | transloco }}
      </button>
      <a matButton [href]="downloadLink()" target="_blank">
        <mat-icon>print</mat-icon>
        {{ 'EVENT_MANAGEMENT.QR_CODE_DIALOG.PRINT' | transloco }}</a
      >
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCodeDialogComponent {
  protected readonly eventDates: Signal<MissionInformationDate[]>;
  protected readonly event: Signal<Mission>;
  protected readonly initialDateId: Signal<string>;
  protected readonly currentDateId: WritableSignal<string>;
  protected readonly svgElement: Signal<ElementRef> = viewChild('svgElement');
  protected readonly accessUrl: Signal<string>;
  protected readonly svgData: Signal<string>;
  protected readonly downloadLink: Signal<string>;

  constructor(
    private readonly store: Store,
    private readonly qrCodeService: EventQrCodeService,
  ) {
    this.eventDates = toSignal(this.store.select(eventManagementFeature.selectEventDates));
    this.event = toSignal(this.store.select(eventManagementFeature.selectEvent));
    this.initialDateId = toSignal(this.store.select(eventManagementFeature.selectCurrentDateId));
    this.currentDateId = signal(this.initialDateId());
    this.accessUrl = this.createAccessUrl();
    this.svgData = this.createSvgData();
    this.downloadLink = this.createDownloadLink();

    effect(() => {
      const svgData = this.svgData();
      const svgElement = this.svgElement().nativeElement;
      this.renderInSvgElement(svgElement, svgData);
    });
  }

  onDateChange(dateId: string) {
    this.currentDateId.set(dateId);
  }

  copyLink() {
    const accessUrl = this.accessUrl();
    this.qrCodeService.copyToClipBoard(accessUrl);
  }

  copySVG() {
    const svgData = this.svgData();
    this.qrCodeService.copyToClipBoard(svgData);
  }

  private createAccessUrl() {
    return computed(() => {
      const currentDateId = this.currentDateId();
      const dates = this.eventDates();
      const event = this.event();
      const selectedDate = dates.find((date) => date.id === currentDateId);
      return this.qrCodeService.createCheckInUrl(event.id, event.name, selectedDate);
    });
  }

  private createSvgData() {
    return computed(() => {
      const accessUrl = this.accessUrl();
      const qrc = this.qrCodeService.createQrCode(accessUrl);
      return this.qrCodeService.createQrCodeSvg(qrc);
    });
  }

  private createDownloadLink() {
    return computed(() => {
      const svgData = this.svgData();
      return this.qrCodeService.createDownloadLink(svgData);
    });
  }

  private renderInSvgElement(element: Element, svgCode: string) {
    const viewBox = VIEW_BOX_REGEX.exec(svgCode).at(1);
    const pathD = PATH_D_REGEX.exec(svgCode).at(1);

    element.setAttribute('viewBox', viewBox);
    element.querySelector('path').setAttribute('d', pathD);

    element.querySelector('rect').setAttribute('fill', '#FFFFFF');
    element.querySelector('path').setAttribute('fill', '#000000');
  }
}
