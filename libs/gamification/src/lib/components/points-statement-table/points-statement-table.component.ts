import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@jsverse/transloco';
import { GamificationViewModel } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { getTranslocoScope } from '../../util/transloco-scope.factory';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'kp-points-statement-table',
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    TranslocoModule,
    NgxSkeletonLoaderModule,
    MatDividerModule,
    KpPluralizeTranslatePipe,
    ScrollingModule,
  ],
  providers: [getTranslocoScope()],
  templateUrl: './points-statement-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointsStatementTableComponent {
  @Input() vm: GamificationViewModel;
  @Input() isMobile: boolean;
  @Output() cleanFilterEvent = new EventEmitter<void>();
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };
  protected readonly displayedColumns: string[] = [
    'type',
    'date',
    'name',
    'job',
    'area',
    'leader',
    'board',
    'subDirectorate',
    'performance',
    'totalPoints',
    'earnedPoints',
  ];

  cleanFilter(): void {
    this.cleanFilterEvent.emit();
  }
}
