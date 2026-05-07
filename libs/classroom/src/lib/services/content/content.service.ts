import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KontentApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpInfoDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-info-dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  constructor(
    private kontentApi: KontentApi,
    private dialog: MatDialog,
  ) {}

  loadContent(id: string) {
    return this.kontentApi.fetchLearnContentById(id);
  }

  openContentErrorDialog() {
    return this.dialog
      .open(KpInfoDialogComponent, {
        autoFocus: 'dialog',
        disableClose: true,
        data: {
          title: marker('CLASSROOM.CONTENT_ERROR_DIALOG.TITLE'),
          description: marker('CLASSROOM.CONTENT_ERROR_DIALOG.DESCRIPTION'),
          buttonLabel: marker('CLASSROOM.GENERAL.LEAVE'),
        },
      })
      .afterClosed();
  }
}
