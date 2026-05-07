import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LearnContentService } from '@core/api';
import { KeepsError } from '@core/model/error.model';
import { Store } from '@ngrx/store';
import { MissionStage } from 'app/main/mission/mission.model';
import { LearnContentMissionStageContent, MissionStageContent } from 'app/main/mission/models';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { MissionStageActions } from '../store';
import { ContentCreateService } from './content-create.service';
import { KpUploadDialogItem, KpUploadDialogManager } from '@keeps-platform-frontend-workspace/ui/kp-upload-dialog';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';

@Injectable()
export class ContentUploadService extends KpUploadDialogManager {
  constructor(
    private store: Store,
    private _contentCreateService: ContentCreateService,
    private _learnContentService: LearnContentService,
    private _messageService: KpMessageService,
  ) {
    super();
  }

  createUpload(stage: MissionStage, missionId: string, content: ContentFormData): void {
    const uploadId = Math.random().toString(36).substring(2, 9);

    const subscription = this.create(stage, content)
      .pipe(
        tap((response) => this.processUploadResponse(uploadId, response)),
        catchError((error) => {
          this.onUploadFailure(uploadId, error);
          return throwError(() => error);
        }),
      )
      .subscribe();

    const upload: KpUploadDialogItem = {
      id: uploadId,
      subscription,
      loading: true,
      percentage: 0,
      name: content.name,
    };
    this.addUpload(upload);
  }

  private create(stage: MissionStage, content: ContentFormData): Observable<any> {
    const id = stage.id;
    const order = stage.contents?.length + 1;

    if (content.type === 'FILE' || (content.value && content.value instanceof File)) {
      return this.createLearnContentWithProgress(id, order, content);
    }

    return this.createLearnContent(id, order, content);
  }

  /**
   * Create a learn content
   *
   * @param stageId the stage id
   * @param order the content order
   * @param content the content
   *
   */
  private createLearnContent(
    stageId: string,
    order: number,
    content: ContentFormData,
  ): Observable<MissionStageContent> {
    return this._learnContentService.createLearnContent(content).pipe(
      switchMap((response) => {
        const learnContent = new LearnContentMissionStageContent(response, order, stageId);
        return this._contentCreateService.createMissionStageContent(learnContent);
      }),
    );
  }

  /**
   * Create a learn content reporting upload progress
   *
   * @param stage the stage id
   * @param order the content order
   * @param content the content
   *
   */
  private createLearnContentWithProgress(stage: string, order: number, content: ContentFormData): Observable<any> {
    return this._learnContentService.createLearnContent(content).pipe(
      switchMap((response) => {
        if (response.type === HttpEventType.Response) {
          const learnContent = new LearnContentMissionStageContent(response.body, order, stage);
          return this._contentCreateService.createMissionStageContent(learnContent);
        }

        return of(response);
      }),
    );
  }

  private processUploadResponse(uploadId: string, response: any): void {
    if (response?.id) {
      this.onUploadCompleted(uploadId);
      return;
    }

    if (response.type === HttpEventType.UploadProgress) {
      const progress = Math.round((100 * response.loaded) / response.total);
      this.updateUploadProgress(uploadId, progress, true);
    }
  }

  private onUploadCompleted(uploadId: string): void {
    this.updateUploadProgress(uploadId, 100, false);
    this.store.dispatch(MissionStageActions.loadStages());
  }

  private onUploadFailure(uploadId: string, error: KeepsError): void {
    if (error?.error?.i18n) {
      this._messageService.error('MISSION.CREATE.' + error.error.i18n);
    }
    this.updateUploadProgress(uploadId, 0, false);
  }
}
