import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailsDialogComponent } from '@keeps-platform-frontend-workspace/analytics';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  constructor(
    private _dialog: MatDialog,
    private _authService: AuthService,
  ) {}

  openMyStatisticsDialog(): void {
    this._dialog.open<UserDetailsDialogComponent>(UserDetailsDialogComponent, {
      autoFocus: 'dialog',
      panelClass: 'analytics-dialog-container',
      data: { id: this._authService.userId },
    });
  }
}
