import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  AluraIntegrationsApi,
  CoursesListFilter,
  MirroredCourse,
  PageResponse,
  UpdateActiveStatusBatchDto,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable({
  providedIn: 'root',
})
export class CoursesListService {
  constructor(
    private router: Router,
    private aluraIntegrationApi: AluraIntegrationsApi,
    private messageService: KpMessageService,
  ) {}

  fetchAluraCategories(): Observable<string[]> {
    return this.aluraIntegrationApi.getCategories();
  }

  fetchMirroredCourses(filter: CoursesListFilter): Observable<PageResponse<MirroredCourse>> {
    return this.aluraIntegrationApi.getMirroredCourses(filter);
  }

  batchDeleteCourses(courseIds: string[]): Observable<unknown> {
    return this.aluraIntegrationApi.batchDeleteCourses(courseIds).pipe(
      tap({
        next: () => this.messageService.success(marker('INTEGRATIONS.INTEGRATION_LIST.DELETE_COURSE_SUCCESS')),
        error: () => this.messageService.error(marker('INTEGRATIONS.INTEGRATION_LIST.DELETE_COURSE_FAILURE')),
      }),
    );
  }

  batchUpdateActiveStatus(payload: UpdateActiveStatusBatchDto): Observable<MirroredCourse[]> {
    return this.aluraIntegrationApi.batchUpdateActiveStatus(payload);
  }

  openDetailDialog(courseId: string): void {
    this.router.navigate([`/C/${courseId}`]);
  }
}
