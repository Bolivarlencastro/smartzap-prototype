import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LearnContentService } from '@core/api';
import { LearnContentAPI } from '@core/api/learn-content.api';
import { PulseAPI } from '@core/api/pulse.api';
import { LearnContent } from '@core/model';
import { ChannelAPI } from 'app/main/channel/channel.api';
import { Channel } from 'app/main/channel/channel.model';
import {
  CONTENT_DIALOG_APP,
  CONTENT_DIALOG_MODULE,
  ContentEditDialogComponent,
  ContentEditDialogData,
  ContentFormData,
} from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { PulseEditComponent } from '../components/pulse-edit/pulse-edit.component';
import { Pulse } from '@core/model/pulse.model';
import { PulsesSearchService } from '@core/api/pulses-search.service';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { ChannelPulsesManagementFilter, PulseManagementItem } from '../models/channel-pulses-management.model';

@Injectable()
export class ChannelPulsesManagementService {
  private readonly channelAPI = inject(ChannelAPI);
  private readonly pulseAPI = inject(PulseAPI);
  private readonly dialog = inject(MatDialog);
  private readonly learnContentAPI = inject(LearnContentAPI);
  private readonly learnContentService = inject(LearnContentService);
  private readonly messageService = inject(KpMessageService);
  private readonly pulsesSearchService = inject(PulsesSearchService);

  getChannel(channelId: string): Observable<Channel> {
    return this.channelAPI.getChannel(channelId);
  }

  fetchChannelPulses(
    channelId: string,
    filter: ChannelPulsesManagementFilter,
  ): Observable<{ pulses: PulseManagementItem[]; total: number }> {
    return this.pulsesSearchService.fetchChannelPulses(channelId, filter).pipe(
      map((response) => ({
        pulses: response.items.map((dto) => ({
          id: dto.id,
          name: dto.name,
          pulse_type: dto.pulse_type,
          creator_name: dto.creator_name,
          created_date: dto.created_date,
          is_active: dto.is_active,
        })),
        total: response.total,
      })),
    );
  }

  getPulse(pulseId: string): Observable<Pulse> {
    return this.pulseAPI.getPulse(pulseId);
  }

  openPulseEditDialog(pulse: Pulse): Observable<{ name: string; description: string; coverImage: string } | null> {
    return this.dialog
      .open(PulseEditComponent, {
        data: { pulse },
        width: window.innerWidth > 768 ? '50%' : '95%',
      })
      .afterClosed();
  }

  updatePulse(
    pulseId: string,
    payload: { name: string; description: string; holder_image: string },
  ): Observable<Pulse> {
    return this.pulseAPI
      .editPulse(pulseId, payload)
      .pipe(tap(() => this.messageService.success(marker('PULSES.SUCCESSFULLY_EDITED'))));
  }

  editPulseContent(pulse: Pulse): Observable<void> {
    return this.openContentEditDialog(pulse).pipe(
      filter((result) => !!result),
      switchMap((contentForm) => this.updatePulseContent(pulse.id, contentForm)),
      map(() => undefined as void),
    );
  }

  private openContentEditDialog(pulse: Pulse): Observable<ContentFormData | null> {
    return this.learnContentAPI.getLearnContent(pulse.learn_content_uuid).pipe(
      switchMap((learnContent) => {
        const data: ContentEditDialogData = {
          app: CONTENT_DIALOG_APP.KONQUEST,
          moduleName: CONTENT_DIALOG_MODULE.PULSE,
          editContentType: pulse.pulse_type.name.toUpperCase(),
          learnContentUrl: learnContent.url,
        };
        return this.dialog
          .open(ContentEditDialogComponent, { autoFocus: 'dialog', width: '620px', data })
          .afterClosed();
      }),
    );
  }

  updatePulseContent(pulseId: string, content: ContentFormData): Observable<Pulse> {
    return this.uploadPulseContent(content).pipe(
      switchMap(({ id }) => this.pulseAPI.updatePulseContent(pulseId, id)),
      tap(() => this.messageService.success(marker('PULSE.EDIT_CONTENT_SUCCESS'))),
    );
  }

  toggleActivation(pulseId: string, is_active: boolean): Observable<Pulse> {
    return this.pulseAPI
      .editPulse(pulseId, { is_active })
      .pipe(tap(() => this.messageService.success(marker('PULSE.TOGGLE_ACTIVATION_SUCCESS'))));
  }

  deletePulse(pulseId: string): Observable<void> {
    return this.pulseAPI
      .deletePulse(pulseId)
      .pipe(tap(() => this.messageService.success(marker('PULSE.DELETE_SUCCESS'))));
  }

  openDeleteConfirmDialog(): Observable<boolean> {
    const ref = this.dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    ref.componentInstance.confirmTitle = 'PULSE.DETAIL.DELETE_PULSE_TITLE';
    ref.componentInstance.confirmMessage = 'PULSE.DETAIL.DELETE_PULSE';
    ref.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';
    return ref.afterClosed();
  }

  showMutationError(): void {
    this.messageService.error(marker('PULSE.EDIT_CONTENT_FAILURE'));
  }

  private uploadPulseContent(content: ContentFormData): Observable<LearnContent> {
    if (content.type === 'FILE') {
      return this.learnContentService.uploadFileWithoutMonitoring(content);
    }

    if (content.type !== 'GENIALLY' && content.type !== 'H5P') {
      return this.learnContentService.createLearnContentFromLink(content.name, content.value);
    }

    if (typeof content.value !== 'string') {
      return this.learnContentService.uploadFileWithoutMonitoring(content, content.time);
    }

    return this.learnContentService.createHtmlLearnContentFromLink(content.name, content.value, content.time);
  }
}
