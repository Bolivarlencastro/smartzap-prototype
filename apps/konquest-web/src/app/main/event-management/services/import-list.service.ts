import { Injectable } from '@angular/core';
import { ImportCheckModel, UsersImported } from '@app/main/mission/mission.model';
import { KonquestAPI } from '@core/api';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportListService {
  constructor(
    private readonly http: KonquestAPI,
    private readonly messageService: KpMessageService,
  ) {}

  checkImportFile(id: string, file: File): Observable<ImportCheckModel> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.postFormData<ImportCheckModel>(`/missions/${id}/batch-check-enrollments/import`, formData);
  }

  verifyImportData(data: ImportCheckModel): boolean {
    return data && (!!data.enrolled?.length || !!data.registered?.length || !!data.not_registered?.length);
  }

  confirmImport(date_id: string, persons: UsersImported[]): Observable<unknown> {
    return this.http
      .post<unknown>('/mission-enrollments/batch/sync/person-check', {
        date_id,
        persons,
        presented: true,
      })
      .pipe(
        tap({
          next: () => this.messageService.success('MISSION.ATTENDANCE_LIST.IMPORT_SUCCESS'),
          error: () => this.messageService.error('MISSION.ERROR_MESSAGE'),
        }),
      );
  }
}
