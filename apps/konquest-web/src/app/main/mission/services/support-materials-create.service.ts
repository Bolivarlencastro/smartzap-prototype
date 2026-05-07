import { Injectable } from '@angular/core';
import { KontentAPI } from '@core/api';
import { HttpEventType } from '@angular/common/http';
import { filter, switchMap, tap } from 'rxjs/operators';
import { LearnContent } from '@core/model';
import { KpUploadDialogItem, KpUploadDialogManager } from '@keeps-platform-frontend-workspace/ui/kp-upload-dialog';
import { catchError, Observable, of, throwError } from 'rxjs';
import { SupportMaterial } from '@keeps-platform-frontend-workspace/kp-keeps';
import { SupportMaterialCreateDto } from '../mission.model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { MissionServiceV2 } from './mission.service';
import { Store } from '@ngrx/store';
import { SupportMaterialActions } from 'app/main/mission/pages/mission-create/store';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { MatDialog } from '@angular/material/dialog';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';

@Injectable({
  providedIn: 'root',
})
export class SupportMaterialsCreateService extends KpUploadDialogManager {
  constructor(
    private kontentAPI: KontentAPI,
    private missionService: MissionServiceV2,
    private messageService: KpMessageService,
    private store: Store,
    private dialog: MatDialog,
  ) {
    super();
  }

  createUpload(file: File, eventId: string) {
    const uploadId = Math.random().toString(36).substring(2, 9);
    const fileName = file.name;
    const subscription = this.createLearnContent(fileName, file, eventId)
      .pipe(
        tap((response) => this.processUploadProgress(uploadId, response)),
        catchError((error) => {
          this.processUploadError(uploadId);
          return throwError(() => error);
        }),
      )
      .subscribe();

    const upload: KpUploadDialogItem = { id: uploadId, subscription, name: file.name, percentage: 0, loading: true };
    this.addUpload(upload);
  }

  openDeleteConfirmDialog(): Observable<boolean> {
    const dialogRefConfirm = this.dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRefConfirm.componentInstance.confirmMessage = marker(
      'MISSION.CREATE.SUPPORT_MATERIAL.DELETE_DIALOG.CONFIRM_MESSAGE',
    );
    dialogRefConfirm.componentInstance.confirmTitle = marker('MISSION.CREATE.SUPPORT_MATERIAL.DELETE_DIALOG.TITLE');
    dialogRefConfirm.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';

    return dialogRefConfirm.afterClosed();
  }

  private createLearnContent(fileName: string, file: File, eventId: string) {
    const formData = new FormData();
    formData.append('name', fileName);
    formData.append('file', file);
    formData.append('is_whatsapp_content', 'True');

    return this.kontentAPI.postFormData2('/learn-content', formData).pipe(
      filter((event) => event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Response),
      switchMap((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round((100 * event.loaded) / (event.total ?? event.loaded));
          return of(progress);
        }

        const learnContent = event.body as LearnContent;
        return this.createSupportMaterial(learnContent, eventId);
      }),
    );
  }

  private createSupportMaterial(learnContent: LearnContent, eventId: string): Observable<SupportMaterial> {
    const supportMaterialDto: SupportMaterialCreateDto = {
      mission_id: eventId,
      description: learnContent.description,
      kontent_content_id: learnContent.id,
      title: learnContent.name,
      order: 0,
    };
    return this.missionService.createSupportMaterial(supportMaterialDto);
  }

  private processUploadProgress(uploadId: string, response: number | SupportMaterial) {
    if (typeof response === 'number') {
      this.updateUploadProgress(uploadId, response, true);
    } else {
      this.updateUploadProgress(uploadId, 100, false);
      this.store.dispatch(SupportMaterialActions.uploadSupportMaterialSuccess({ supportMaterial: response }));
    }
  }

  private processUploadError(uploadId: string) {
    this.messageService.error(marker('MISSION.CREATE.ERROR.SUPPORT_MATERIAL'));
    this.updateUploadProgress(uploadId, 0, false);
  }
}
