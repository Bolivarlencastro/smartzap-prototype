import { Injectable } from '@angular/core';
import { KonquestAPI } from '@core/api';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Pagination } from '@core/model';
import { Contributor } from '@core/model/contributor.model';

@Injectable({ providedIn: 'root' })
export class ContributorService {
  private basePath = '/missions';

  constructor(
    private _http: KonquestAPI,
    private _messageService: KpMessageService,
  ) {}

  getContributors(missionId: string): Observable<Pagination<Contributor>> {
    return this._http.get(`${this.basePath}/${missionId}/contributors`).pipe(
      tap({
        error: () => this._messageService.error('CONTRIBUTORS.ERROR.CONSULT'),
      }),
    );
  }

  addContributors(missionId: string, userId: string): Observable<Contributor> {
    return this._http.post<Contributor>(`${this.basePath}/${missionId}/contributors/${userId}`, {}).pipe(
      tap({
        next: () => this._messageService.success('CONTRIBUTORS.SUCCESS.SAVE'),
        error: () => this._messageService.error('CONTRIBUTORS.ERROR.SAVE'),
      }),
    );
  }

  deleteContributors(missionId: string, userId: string): Observable<any> {
    return this._http.delete(`${this.basePath}/${missionId}/contributors/${userId}`).pipe(
      tap({
        next: () => this._messageService.success('CONTRIBUTORS.SUCCESS.REMOVED'),
        error: () => this._messageService.error('CONTRIBUTORS.ERROR.REMOVED'),
      }),
    );
  }
}
