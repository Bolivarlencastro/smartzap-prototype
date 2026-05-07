import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { KontentLearnContentAPI } from '@core/api/base/kontent-learn-content.api';
import { KonquestAPI } from '@core/api/base/konquest.api';
import { PulseAPI } from '@core/api/pulse.api';
import { Router } from '@angular/router';
import { navigateToTrail, RouteDialogService } from 'app/shared/services';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { PulseDetailsComponent } from '../containers/pulse-details/pulse-details.component';
import { ChannelDetailsApiResponse, PulseDetailsData } from '../models/pulse-details';

@Injectable()
export class PulseDetailsService {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly routeDialogService = inject(RouteDialogService);
  private readonly pulseApi = inject(PulseAPI);
  private readonly kontentLearnContentApi = inject(KontentLearnContentAPI);
  private readonly konquestApi = inject(KonquestAPI);
  private dialogRef: MatDialogRef<PulseDetailsComponent> | undefined;

  loadPulseDetails(pulseId: string): Observable<PulseDetailsData> {
    return this.pulseApi.getPulse(pulseId).pipe(
      switchMap((pulse) => {
        const channelId = pulse.channels?.[0]?.id;
        return forkJoin({
          comments: this.pulseApi.getPulseComments({ pulse_id: pulseId, ordering: '-created_date' }),
          content: this.kontentLearnContentApi.get(pulse.learn_content_uuid),
          channel: channelId ? this.konquestApi.get<ChannelDetailsApiResponse>(`/channels/${channelId}`) : of(null),
        }).pipe(
          map(
            ({ comments, content, channel }) =>
              ({ pulse, comments: comments.results ?? [], content, channel }) as unknown as PulseDetailsData,
          ),
        );
      }),
    );
  }

  openDialog() {
    if (this.dialogRef) return;
    this.dialogRef = this.dialog.open(PulseDetailsComponent, {
      autoFocus: 'dialog',
      panelClass: 'pulse-dialog-container',
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = undefined;
    });
  }

  onDialogDestroyed(rollbackTrailId?: string): void {
    this.routeDialogService.onDialogClosed();
    if (rollbackTrailId) {
      navigateToTrail(this.router, rollbackTrailId);
    }
  }
}
