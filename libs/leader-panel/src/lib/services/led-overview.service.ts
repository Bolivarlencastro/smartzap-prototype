import { Inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { KEEPS_APP_SERVICES, KeepsAppServices, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LedOverviewComponent } from '../containers/led-overview-dialog/led-overview.component';
import { LedOverViewTabs } from '../models/led-overview';

@Injectable({
  providedIn: 'root',
})
export class LedOverviewService {
  private dialogRef: MatDialogRef<LedOverviewComponent>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly workspaceService: WorkspaceService,
    @Inject(KEEPS_APP_SERVICES) private readonly keepsAppServices: KeepsAppServices,
  ) {}

  openDialog() {
    const tabsDisplayConfig = this.buildTabsDisplayConfig();
    this.dialogRef = this.dialog.open(LedOverviewComponent, {
      width: '100%',
      maxWidth: '80vw',
      autoFocus: 'dialog',
      data: tabsDisplayConfig,
    });
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  private buildTabsDisplayConfig(): Record<LedOverViewTabs, boolean> {
    const services = this.keepsAppServices;
    return {
      overview: true,
      courses: this.workspaceService.isServiceActive(services?.['mission']?.id),
      trails: this.workspaceService.isServiceActive(services?.['learning_trail']?.id),
      pulses: this.workspaceService.isServiceActive(services?.['pulse']?.id),
      channels: this.workspaceService.isServiceActive(services?.['pulse']?.id),
      events: this.workspaceService.isServiceActive(services?.['event']?.id),
    };
  }
}
