import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TransfersFilterDialogComponent } from '../containers/transfers-filter-dialog/transfers-filter-dialog.component';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { Pagination, Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { KonquestAPI } from '@core/api';
import { TransfersFiltersResult } from 'app/main/transfer/models/transfers-filters-result';

@Injectable({
  providedIn: 'root',
})
export class TransfersFiltersService {
  constructor(
    private dialog: MatDialog,
    private _http: KonquestAPI,
  ) {}

  openDialog() {
    return this.dialog
      .open<TransfersFilterDialogComponent, any, TransfersFiltersResult>(TransfersFilterDialogComponent, {
        minWidth: '400px',
        maxWidth: '90vw',
        autoFocus: 'dialog',
      })
      .afterClosed();
  }

  filterWorkspaces(query: string): Observable<KpFilterSelectOption[]> {
    return this._http
      .get<Pagination<Pick<Workspace, 'id' | 'name'>>>(`/missions/transactions/workspaces`, {
        search: query,
        per_page: 10,
      })
      .pipe(
        mergeMap(({ results }) => results),
        map(({ name, id }) => ({ label: name, value: id })),
        toArray(),
      );
  }
}
