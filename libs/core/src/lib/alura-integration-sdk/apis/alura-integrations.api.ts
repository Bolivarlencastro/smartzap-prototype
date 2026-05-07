import { Injectable } from '@angular/core';
import { AluraIntegrationClient } from './alura-integration.client';
import {
  AluraCourse,
  CoursesListFilter,
  IntegrationTokensDto,
  IntegrationTokenType,
  MirroredCourse,
  UpdateActiveStatusBatchDto,
} from '../models';
import { KeepsUtils } from '../../shared';
import { PageResponse } from '../../pagination';
import { Observable } from 'rxjs';
import { UserProfileService } from '../../services';

@Injectable({
  providedIn: 'root',
})
export class AluraIntegrationsApi {
  constructor(
    private http: AluraIntegrationClient,
    private userProfileService: UserProfileService,
  ) {}

  getCourses(filter: CoursesListFilter) {
    const updatedFilter = KeepsUtils.removeNullAndUndefined(filter);
    return this.http.get<PageResponse<AluraCourse>>('/courses', updatedFilter);
  }

  getMirroredCourses(filter: CoursesListFilter) {
    const updatedFilter = KeepsUtils.removeNullAndUndefined(filter);
    return this.http.get<PageResponse<MirroredCourse>>('/mirrored-courses', updatedFilter);
  }

  batchMirrorCourses(courseIds: string[]) {
    return this.http.post('/courses/mirror/batch', { courseIds });
  }

  getWorkspaceTokens() {
    return this.http.get<IntegrationTokensDto>('/tokens/workspace');
  }

  getCategories() {
    return this.http.get<string[]>('/courses/categories');
  }

  validateIntegrationToken(tokenType: IntegrationTokenType, token: string): Observable<boolean> {
    return this.http.post(`/integrations/${tokenType}/validate`, { token });
  }

  saveTokens(tokens: IntegrationTokensDto) {
    return this.http.post('/tokens/workspace', tokens);
  }

  batchUpdateActiveStatus(payload: UpdateActiveStatusBatchDto) {
    return this.http.post<MirroredCourse[]>('/mirrored-courses/batch-update-active-status', payload);
  }

  batchDeleteCourses(coursesIds: string[]): Observable<unknown> {
    return this.http.post('/mirrored-courses/delete-batch', { ids: coursesIds });
  }

  deleteCourseByMissionId(missionId: string) {
    return this.http.delete<unknown>(`/mirrored-courses/by-mission-id/${missionId}`);
  }

  getAccessUrlByMissionId(missionId: string) {
    const userEmail = this.userProfileService.getProfile().email;
    return this.http.get<{ url: string }>(`/courses/${missionId}/sso-link/${userEmail}`);
  }
}
