import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ContributorsDialogComponent } from '../components/contributors-dialog/contributors-dialog.component';
import { Contributor } from '@core/model/contributor.model';
import { KonquestAPI } from '@core/api';
import { ContributorsDialogContentType } from '../models/contributors-dialog-content.type';
import { map, tap } from 'rxjs/operators';
import { Pagination } from '@core/model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Injectable({
  providedIn: 'root',
})
export class ContributorsDialogService {
  private missionsBasePath = '/missions';
  private channelsBasePath = '/channels';

  constructor(
    private _dialog: MatDialog,
    private _http: KonquestAPI,
    private _messageService: KpMessageService,
  ) {}

  openDialog(): Observable<any> {
    return this._dialog.open(ContributorsDialogComponent, { minWidth: '50vh', autoFocus: false }).afterClosed();
  }

  loadContributors(type: ContributorsDialogContentType, contentId: string): Observable<Contributor[]> {
    return this._http.get<Pagination<Contributor>>(`${this.getBasePath(type)}/${contentId}/contributors`).pipe(
      tap({
        error: () => this._messageService.error(marker('CONTRIBUTORS.ERROR.CONSULT')),
      }),
      map((result) => result?.results),
    );
  }

  addContributors(type: ContributorsDialogContentType, contentId: string, userId: string): Observable<Contributor> {
    return this._http.post<Contributor>(`${this.getBasePath(type)}/${contentId}/contributors/${userId}`, {}).pipe(
      tap({
        next: () => this._messageService.success(marker('CONTRIBUTORS.SUCCESS.SAVE')),
        error: () => this._messageService.error(marker('CONTRIBUTORS.ERROR.SAVE')),
      }),
    );
  }

  deleteContributor(type: ContributorsDialogContentType, contentId: string, userId: string): Observable<any> {
    return this._http.delete(`${this.getBasePath(type)}/${contentId}/contributors/${userId}`).pipe(
      tap({
        next: () => this._messageService.success(marker('CONTRIBUTORS.SUCCESS.REMOVED')),
        error: () => this._messageService.error(marker('CONTRIBUTORS.ERROR.REMOVED')),
      }),
    );
  }

  private getBasePath(type: ContributorsDialogContentType): string {
    if (type === ContributorsDialogContentType.MISSION) {
      return this.missionsBasePath;
    }

    return this.channelsBasePath;
  }
}
