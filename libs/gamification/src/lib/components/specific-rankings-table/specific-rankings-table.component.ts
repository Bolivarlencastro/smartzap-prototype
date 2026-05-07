import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { GamificationListType, GamificationViewModel } from '@keeps-platform-frontend-workspace/kp-keeps';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { TranslocoModule } from '@jsverse/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { GamificationHelper } from '../../util/gamification.helper';
import { PodiumBorderPipe } from '../../util/pipes/podium-border.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'kp-specific-rankings-table',
  imports: [
    CommonModule,
    MatTableModule,
    TranslocoModule,
    NgxSkeletonLoaderModule,
    PodiumBorderPipe,
    MatTooltipModule,
    MatDividerModule,
    KpPluralizeTranslatePipe,
    ScrollingModule,
  ],
  templateUrl: './specific-rankings-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecificRankingsTableComponent implements OnChanges {
  @Input() vm: GamificationViewModel;
  @Input() path: GamificationListType;
  @Input() isMobile: boolean;
  @Output() cleanFilterEvent = new EventEmitter<void>();

  nameColumnTitle: string;
  textMessageNoData: string;
  protected readonly defaultUserAvatar = constants.defaultUserAvatar;
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };
  protected readonly displayedColumns: string[] = ['image', 'name', 'people', 'score'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['path']) {
      this.nameColumnTitle = GamificationHelper.buildNameColumnTitle(this.path);
      this.textMessageNoData = GamificationHelper.buildTextMessageNoData(this.path);
    }
  }

  cleanFilter(): void {
    this.cleanFilterEvent.emit();
  }
}
