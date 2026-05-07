import { MatDialog } from '@angular/material/dialog';
import {
  AluraCourse,
  AluraIntegrationsApi,
  CoursesListFilter,
  PageResponse,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable, tap } from 'rxjs';
import { AluraMirrorCourseComponent } from '../../containers/alura-mirror-course/alura-mirror-course.component';
import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable({
  providedIn: 'root',
})
export class AluraCourseMirrorService {
  constructor(
    private dialog: MatDialog,
    private aluraIntegrationApi: AluraIntegrationsApi,
    private messageService: KpMessageService,
  ) {}

  openDialog() {
    return this.dialog
      .open<AluraMirrorCourseComponent, any, string[] | undefined>(AluraMirrorCourseComponent, {
        width: '70vw',
        autoFocus: false,
        disableClose: false,
      })
      .afterClosed();
  }

  fetchCoursesList(filter: CoursesListFilter): Observable<PageResponse<AluraCourse>> {
    return this.aluraIntegrationApi.getCourses(filter);
  }

  mirrorCourses(ids: string[]): Observable<any> {
    return this.aluraIntegrationApi.batchMirrorCourses(ids).pipe(
      tap({
        next: () => this.messageService.success(marker('INTEGRATIONS.MIRROR_DIALOG.MIRROR_COURSES_SUCCESS')),
        error: () => this.messageService.error(marker('INTEGRATIONS.MIRROR_DIALOG.MIRROR_COURSES_FAILURE')),
      }),
    );
  }
}
