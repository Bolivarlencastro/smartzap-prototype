import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MyAccountV2API } from '@app/shared/api/myaccount-v2.api';
import { CustomMenuItem } from '@keeps-platform-frontend-workspace/kp-keeps';
import { filter, Observable } from 'rxjs';
import { ToolConfigDialogComponent } from '../components/tool-config-dialog/tool-config-dialog.component';

@Injectable({ providedIn: 'root' })
export class ToolsHubService {
  constructor(
    private readonly myAccApi: MyAccountV2API,
    private readonly dialog: MatDialog,
  ) {}

  getData(): Observable<CustomMenuItem[]> {
    return this.myAccApi.get<CustomMenuItem[]>('/custom-menu-items');
  }

  openConfigDialog(data?: CustomMenuItem): Observable<Partial<CustomMenuItem>> {
    return this.dialog
      .open(ToolConfigDialogComponent, { autoFocus: false, width: '350px', data })
      .afterClosed()
      .pipe(filter((value) => value));
  }

  create(item: Partial<CustomMenuItem>) {
    return this.myAccApi.post('/custom-menu-items', { ...item });
  }

  edit(item: Partial<CustomMenuItem>) {
    const { name, icon, url } = item;
    return this.myAccApi.patch(`/custom-menu-items/${item.id}`, { name, icon, url });
  }

  remove(id: string) {
    return this.myAccApi.delete(`/custom-menu-items/${id}`);
  }
}
