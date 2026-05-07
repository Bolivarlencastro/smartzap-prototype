import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { GamificationListType, GamificationViewModel, KpDateRange } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpDateRangeFilterComponent } from '@keeps-platform-frontend-workspace/ui/kp-date-range-filter';
import { TranslocoModule } from '@jsverse/transloco';
import { GeneralRankingTableComponent } from '../general-ranking-table/general-ranking-table.component';
import { PointsStatementTableComponent } from '../points-statement-table/points-statement-table.component';
import { SpecificRankingsTableComponent } from '../specific-rankings-table/specific-rankings-table.component';
import { getTranslocoScope } from '../../util';

@Component({
  selector: 'kp-gamification-list',
  imports: [
    PointsStatementTableComponent,
    GeneralRankingTableComponent,
    SpecificRankingsTableComponent,
    KpDateRangeFilterComponent,
    TranslocoModule,
  ],
  providers: [getTranslocoScope()],
  template: `
    @if (isMobile) {
      <div class="flex items-center gap-2 px-4 py-3 border-b border-default">
        <kp-date-range-filter
          [label]="'GAMIFICATION.GENERAL.PERIOD' | transloco"
          [currentDateRange]="currentDateRange"
          icon="today"
          (dateRangeEvent)="dateRangeEvent.emit($event)"
          (cleanDateRange)="cleanDateRange.emit()"
        ></kp-date-range-filter>
      </div>
    }
    <div class="grow">
      @switch (path) {
        @case ('points-statement') {
          <kp-points-statement-table
            [vm]="vm"
            [isMobile]="isMobile"
            (cleanFilterEvent)="cleanFilter()"
          ></kp-points-statement-table>
        }
        @case ('general') {
          <kp-general-ranking-table
            [vm]="vm"
            [isMobile]="isMobile"
            (cleanFilterEvent)="cleanFilter()"
          ></kp-general-ranking-table>
        }
        @default {
          <kp-specific-rankings-table
            [vm]="vm"
            [path]="path"
            [isMobile]="isMobile"
            (cleanFilterEvent)="cleanFilter()"
          ></kp-specific-rankings-table>
        }
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamificationListComponent {
  @Input() vm: GamificationViewModel;
  @Input() path: GamificationListType;
  @Input() isMobile: boolean;
  @Input() currentDateRange: KpDateRange;
  @Output() dateRangeEvent = new EventEmitter<KpDateRange>();
  @Output() cleanDateRange = new EventEmitter<void>();
  @Output() cleanFilterEvent = new EventEmitter<void>();

  cleanFilter(): void {
    this.cleanFilterEvent.emit();
  }
}
