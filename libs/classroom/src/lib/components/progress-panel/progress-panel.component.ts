import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, ViewChild } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { KpDatepickerMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-datepicker-menu';
import { KpInfoDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-info-dialog';
import { TranslocoModule } from '@jsverse/transloco';
import { ProgressPanelCardDialogData, ProgressPanelViewModel } from '../../models';
import { getTranslocoScope } from '../../transloco-scope.factory';
import { KpDaysUntil } from '@keeps-platform-frontend-workspace/ui/kp-days-until';

@Component({
  selector: 'kp-progress-panel',
  imports: [
    TranslocoModule,
    MatIcon,
    CommonModule,
    MatDatepickerModule,
    KpDatepickerMenuComponent,
    MatMenuModule,
    KpDaysUntil,
  ],
  providers: [getTranslocoScope()],
  templateUrl: './progress-panel.component.html',
  styles: [
    `
      .container {
        min-width: 266px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressPanelComponent {
  progressPanel = input<ProgressPanelViewModel>();
  updateGoalDate = output<Date>();
  toggleGoalDate = output<boolean>();

  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  constructor(private dialog: MatDialog) {}

  openDialog(data: ProgressPanelCardDialogData) {
    this.dialog.open(KpInfoDialogComponent, {
      autoFocus: 'dialog',
      data,
    });
  }

  changeGoalDate(date: Date) {
    this.menuTrigger.closeMenu();
    this.updateGoalDate.emit(date);
  }

  toggleGoalDateMenu(value: boolean) {
    this.toggleGoalDate.emit(value);
  }
}
