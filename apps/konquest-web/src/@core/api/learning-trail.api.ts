import { Injectable } from '@angular/core';
import {
  LearningTrailImageType,
  LearningTrailImageUpload,
} from '@app/main/learning-trail/pages/learning-trail-create/containers/learning-trail-images/learning-trail-images.component';
import { Mission } from '@app/main/mission/mission.model';
import { Pulse } from '@core/model/pulse.model';
import { KonquestAPI } from '@core/api';
import { Pagination } from '@core/model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import {
  LearningTrail,
  LearningTrailFilter,
  LearningTrailType,
  Step,
} from 'app/main/learning-trail/model/learning-trail';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

const BASE_PATH = '/learning-trails';
type ImageDimensions = { width: number; height: number };

@Injectable({ providedIn: 'root' })
export class LearningTrailAPI {
  constructor(
    private _http: KonquestAPI,
    private _messageService: KpMessageService,
  ) {}

  getLearningTrails(filters?: any): Observable<Pagination<LearningTrail>> {
    return this._http.get<Pagination<LearningTrail>>(`${BASE_PATH}`, filters);
  }

  getRecommendationsLearningTrails(filters?: LearningTrailFilter): Observable<Pagination<LearningTrail>> {
    return this._http.get<Pagination<LearningTrail>>(`${BASE_PATH}/my-recommendations`, filters);
  }

  getLearningTrailContents(
    learning_trail: string | undefined,
    filters: { search: string | undefined } = { search: '' },
  ) {
    return this._http
      .get<{
        results: { Mission: Mission[]; Pulse: Pulse[] };
      }>(`${BASE_PATH}/${learning_trail}/available-contents`, filters)
      .pipe(map(({ results }) => results));
  }

  getById(id: string | undefined): Observable<LearningTrail> {
    return this._http.get<LearningTrail>(`${BASE_PATH}/${id}`);
  }

  deleteLearningTrail(id: string): Observable<unknown> {
    return this._http.delete<unknown>(`${BASE_PATH}/${id}`);
  }

  getLearningTrailTypes(): Observable<{ results: LearningTrailType[] }> {
    return this._http.get<{ results: LearningTrailType[] }>(`${BASE_PATH}/types`);
  }

  postLearningTrailImage({ file, imageType }: LearningTrailImageUpload): Observable<{ url: string }> {
    const dimensionsMap: Record<LearningTrailImageType, ImageDimensions> = {
      holder_image: { width: 1920, height: 640 },
      thumb_image: { width: 1920, height: 1080 },
    };

    const imageDimensions = dimensionsMap[imageType];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('width', imageDimensions.width.toString());
    formData.append('height', imageDimensions.height.toString());

    return this._http.postFormData<any>(`/learn-contents/cover-images-by-size`, formData);
  }

  postLearningTrail(body: Partial<LearningTrail>): Observable<LearningTrail> {
    return this._http.post<LearningTrail>(`${BASE_PATH}`, body).pipe(map((response) => response));
  }

  updateLearningTrail(body: Partial<LearningTrail>): Observable<LearningTrail> {
    return this._http.patch<LearningTrail>(`${BASE_PATH}/${body.id}`, body).pipe(map((response) => response));
  }

  updateLearningTrailDescription(id: string, description: string): Observable<LearningTrail> {
    return this._http.patch<LearningTrail>(`${BASE_PATH}/${id}`, { description });
  }

  getLearningTrailSteps(filters: Record<string, unknown>): Observable<Pagination<Step>> {
    return this._http.get<Pagination<Step>>(`${BASE_PATH}/steps`, filters);
  }

  postLearningTrailContent({ learning_trail, mission, pulse, order }): Observable<LearningTrail> {
    return this._http
      .post<LearningTrail>(`${BASE_PATH}/steps`, {
        learning_trail,
        ...(mission && { mission }),
        ...(pulse && { pulse }),
        order,
      })
      .pipe(
        tap({
          error: () => this._messageService.error('LEARNING_TRAIL.STEP.ERROR.ADD_CONTENT_ERROR'),
        }),
      );
  }

  reorderLearningTrailContent(
    learningTrailId: string | undefined,
    steps: { step_id: string; order: number }[],
  ): Observable<LearningTrail> {
    return this._http.patch<LearningTrail>(`${BASE_PATH}/${learningTrailId}/steps/reorder`, steps);
  }

  deleteLearningTrailContent(id: string): Observable<LearningTrail> {
    return this._http.delete<LearningTrail>(`${BASE_PATH}/steps/${id}`);
  }

  transferLearningTrial(trailId: string, newOwnerId: string, target_workspace: string): Observable<any> {
    return this._http.post(`${BASE_PATH}/${trailId}/transfer`, { user_creator: newOwnerId, target_workspace });
  }
}
