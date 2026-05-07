import { Injectable } from '@angular/core';
import { KonquestMissionStageAPI, LearnContentService } from '@core/api';
import { MissionStageContent } from 'app/main/mission/models';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ContentCreateService {
  constructor(
    private _stageApi: KonquestMissionStageAPI,
    private _learnContentService: LearnContentService,
  ) {}

  /**
   * Create a mission stage content
   *
   * @param content {MissionStageContent}
   */
  createMissionStageContent(content: MissionStageContent): Observable<MissionStageContent> {
    return forkJoin({
      stageContent: this._stageApi.createContent(content),
      learnContentType: this._learnContentService.fetchLearnContentType(content.content_type_id),
    }).pipe(
      map(({ stageContent, learnContentType }) => {
        const learn_content_id = stageContent.learn_content_uuid;
        return { ...stageContent, learn_content_type: learnContentType, learn_content_id };
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
