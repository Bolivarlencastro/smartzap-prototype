import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MissionDetailDialogDescriptionComponent } from '../mission-detail-dialog-description/mission-detail-dialog-description.component';
import { filter, tap } from 'rxjs/operators';
import { Mission } from 'app/main/mission/mission.model';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpLinebreakPipe } from '@keeps-platform-frontend-workspace/ui/kp-linebreak';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-mission-detail-description',
  templateUrl: './mission-detail-description.component.html',
  styleUrls: ['./mission-detail-description.component.scss'],
  imports: [MatIcon, MatIconButton, MatTooltip, KpLinebreakPipe, NgxSkeletonLoaderModule, TranslocoPipe],
})
export class MissionDetailDescriptionComponent {
  @Input() mission: Mission;
  @Input() loading: boolean;
  @Output() update = new EventEmitter<string>();

  developmentStatus = DevelopmentStatus;

  private readonly baseLoaderTheme = {
    'border-radius': '4px',
  };
  protected readonly fullLineLoaderTheme = { ...this.baseLoaderTheme, width: '100%' };
  protected readonly halfLineLoaderTheme = { ...this.baseLoaderTheme, width: '50%' };

  showmore: boolean;

  constructor(public dialog: MatDialog) {
    this.showmore = false;
  }

  showMore(): void {
    this.showmore = !this.showmore;
  }

  get showmoreLabel(): string {
    return this.showmore ? 'GENERAL.SHOW_LESS' : 'GENERAL.SHOW_MORE';
  }

  get showmoreIcon(): string {
    return this.showmore ? 'arrow_drop_up' : 'arrow_drop_down';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MissionDetailDialogDescriptionComponent, {
      data: this.mission.summary,
      width: '60vw',
      autoFocus: 'dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap((result) => this.update.emit(result)),
      )
      .subscribe();
  }
}
