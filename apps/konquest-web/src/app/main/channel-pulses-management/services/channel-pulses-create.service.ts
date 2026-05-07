import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { ChannelService, PulseService } from '@core/api';
import { Pulse, PulseRequest } from '@core/model/pulse.model';
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
import { PulseUploadService } from 'app/main/channel/pages/detail/pulse-upload.service';
import { ChannelAPI } from 'app/main/channel/channel.api';

const DIALOG_CLASS = 'content-form-dialog';

@Injectable()
export class ChannelPulsesCreateService implements OnDestroy {
  private readonly expandPanelSubject = new Subject<void>();
  readonly expandPanel$ = this.expandPanelSubject.asObservable();

  constructor(
    private readonly dialog: MatDialog,
    private readonly channelService: ChannelService,
    private readonly pulseUploadService: PulseUploadService,
    private readonly pulseService: PulseService,
    private readonly messageService: KpMessageService,
    private readonly channelAPI: ChannelAPI,
  ) {}

  ngOnDestroy(): void {
    this.expandPanelSubject.complete();
  }

  openPulseCreateDialog(): Observable<ContentFormData> {
    const data: ContentDialogData = {
      app: CONTENT_DIALOG_APP.KONQUEST,
      moduleName: CONTENT_DIALOG_MODULE.PULSE,
    };

    return this.dialog
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
    this.expandPanelSubject.next();

    return this.channelService.createPulse(channelId, pulseForm).pipe(
      this.monitorPulseUploadStatus(uploadId),
      filter((response: unknown) => !!(response as Pulse)?.id),
      tap({ next: () => this.messageService.success(marker('PULSES.SUCCESSFULLY_ADDED')) }),
      switchMap((result: Pulse) => {
        if (pulseForm.coverImage) {
          return this.pulseService.updatePulse(result.id, { holder_image: pulseForm.coverImage });
        }
        return of(result);
      }),
      takeUntil(cancelSubject),
    );
  }

  postPulseQuiz(payload: PulseRequest | undefined, channelId: string): Observable<Pulse> {
    return this.channelAPI.postPulseQuiz(payload, channelId);
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
