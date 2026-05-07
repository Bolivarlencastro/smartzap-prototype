import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { ChannelService, PulseService } from '@core/api';
import { Pulse } from '@core/model/pulse.model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable, of, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  CONTENT_DIALOG_APP,
  CONTENT_DIALOG_MODULE,
  ContentDialogData,
  ContentFormData,
  KpContentFormDialogComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { PulseUploadService } from './pulse-upload.service';
import { ChannelDetailDialogComponent } from 'app/main/channel/pages/detail/channel-detail-dialog/channel-detail-dialog.component';

const DIALOG_CLASS = 'content-form-dialog';

@Injectable()
export class ChannelDetailService implements OnDestroy {
  private expandPanelSubject = new Subject<void>();
  readonly expandPanel$ = this.expandPanelSubject.asObservable();

  constructor(
    private _dialog: MatDialog,
    private _messageService: KpMessageService,
    private _channelService: ChannelService,
    private pulseUploadService: PulseUploadService,
    private pulseService: PulseService,
  ) {}

  ngOnDestroy(): void {
    this.expandPanelSubject.complete();
  }

  openPulseCreateDialog(): Observable<ContentFormData> {
    const data: ContentDialogData = {
      app: CONTENT_DIALOG_APP.KONQUEST,
      moduleName: CONTENT_DIALOG_MODULE.PULSE,
    };

    return this._dialog
      .open(KpContentFormDialogComponent, {
        panelClass: DIALOG_CLASS,
        autoFocus: 'dialog',
        data,
      })
      .afterClosed();
  }

  createPulse(channelId: string, pulseForm: ContentFormData): Observable<Pulse> {
    const uploadId = this.pulseUploadService.getRandomUploadId();
    const isFileUpload = pulseForm.value instanceof File;
    const uploadName = isFileUpload ? pulseForm.value.name : pulseForm.name;
    const cancelSubject = new Subject<void>();
    const initialPercentage = isFileUpload ? 0 : 100;

    this.pulseUploadService.addFileUpload(uploadId, uploadName, cancelSubject, initialPercentage);
    return this._channelService.createPulse(channelId, pulseForm).pipe(
      this.monitorPulseUploadStatus(uploadId),
      filter((response: unknown) => !!(response as Pulse)?.id),
      tap({ next: () => this._messageService.success(marker('PULSES.SUCCESSFULLY_ADDED')) }),
      switchMap((result: Pulse) => {
        if (pulseForm.coverImage) {
          return this.pulseService.updatePulse(result.id, { holder_image: pulseForm.coverImage });
        }
        return of(result);
      }),
      takeUntil(cancelSubject),
    );
  }

  openDetailsDialog() {
    this._dialog.open(ChannelDetailDialogComponent, {
      width: '760px',
      maxHeight: '95vh',
      maxWidth: '95vw',
      autoFocus: 'dialog',
    });
  }

  private monitorPulseUploadStatus(uploadId: string) {
    return tap({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentage = Math.min((100 * event.loaded) / event.total, 90);
          this.pulseUploadService.updateFileUpload(uploadId, percentage);
        }
      },
      error: () => this.pulseUploadService.updateFileUpload(uploadId, 0),
      complete: () => this.pulseUploadService.updateFileUpload(uploadId, 100),
    });
  }
}
