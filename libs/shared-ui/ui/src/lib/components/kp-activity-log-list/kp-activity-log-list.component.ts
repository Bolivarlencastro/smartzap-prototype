import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@jsverse/transloco';
import { ACTIVITY_LOG_STATUS_TAG_COLOR, ActivityLogList } from '@keeps-platform-frontend-workspace/kp-keeps';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KpPluralizeTranslatePipe } from '../../pipes';
import { KpCardTagComponent } from '../kp-card-tag';

@Component({
  selector: 'kp-activity-log-list',
  imports: [
    CommonModule,
    MatTableModule,
    TranslocoModule,
    MatIconModule,
    MatButtonModule,
    NgxSkeletonLoaderModule,
    KpCardTagComponent,
    KpPluralizeTranslatePipe,
  ],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        position: relative;
      }
    `,
  ],
  templateUrl: './kp-activity-log-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpActivityLogListComponent {
  vm = input<ActivityLogList>();
  export = output<string>();

  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };
  protected readonly displayedColumns: string[] = ['date', 'time', 'user', 'action', 'status', 'menu'];
  protected readonly statusTagColor = ACTIVITY_LOG_STATUS_TAG_COLOR;

  onExport(id: string): void {
    this.export.emit(id);
  }
}
