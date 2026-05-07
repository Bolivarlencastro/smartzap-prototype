import { Injectable } from '@angular/core';
import { KonquestClient } from './konquest.client';
import { map, Observable } from 'rxjs';
import { Pagination } from '../../pagination';
import { Course, CourseStage, SupportMaterial } from '../models';
import { KeepsUtils } from '../../shared';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CoursesApi {
  constructor(private _http: KonquestClient) {}

  newProvider(newDateProvider: any) {
    const formData = new FormData();
    formData.append('icon', newDateProvider.icon);
    formData.append('name', newDateProvider.name);
    formData.append('description', newDateProvider.description);
    return this._http.postFormData<any>(`/missions/providers`, formData);
  }

  loadProviders() {
    return this._http.get<any>('/missions/providers').pipe(map(({ results }) => results));
  }

  deleteProvider(providerId: string) {
    return this._http.delete(`/missions/providers/${providerId}`);
  }

  updateProvider(id: string, body: any) {
    return this._http.patchFormData(`/missions/providers/${id}`, body);
  }

  fetchById(courseId: string): Observable<Course> {
    return this._http.get<Course>(`/missions/${courseId}`);
  }

  getCourseStages(courseId: string) {
    return this._http.get<Pagination<CourseStage>>(`/missions/${courseId}/stages`).pipe(
      map(({ results }) => {
        if (!results) {
          return [];
        }

        return results.map(
          (courseStage): CourseStage => ({
            ...courseStage,
            contents: KeepsUtils.orderBy(courseStage.contents, ['order'], ['asc']),
          }),
        );
      }),
    );
  }

  userContentDone(contentId: string, userId: string): Observable<any> {
    return this._http.post('/users/mission-contents', {
      user: userId,
      content: contentId,
    });
  }

  userStageDone(stageId: string, userId: string): Observable<unknown> {
    return this._http.post('/users/mission-stages', {
      user: userId,
      stage: stageId,
    });
  }

  fetchSupportMaterials(mission_id: string): Observable<SupportMaterial[]> {
    return this._http.get<SupportMaterial[]>('/supplementary-materials', { mission_id });
  }

  autoCheckIn(eventDateId: string) {
    return this._http.post<HttpResponse<void>>(
      '/mission-enrollments/attendances/auto-check',
      { date_id: eventDateId },
      null,
      null,
      true,
    );
  }
}
