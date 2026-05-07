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
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { GamificationListDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoPipe } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { constants } from '../../constants';
import { KpPodiumBadgePipe } from '../../pipes';
import { BuildedStatistic, GamificationMenuTab, GamificationMenuTabType } from './model';

@Component({
  selector: 'kp-personal-score-menu',
  imports: [
    CommonModule,
    MatTabsModule,
    MatDividerModule,
    TranslocoPipe,
    MatButtonModule,
    MatBadgeModule,
    KpPodiumBadgePipe,
    MatIconModule,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './kp-personal-score-menu.component.html',
  styles: [
    `
      nav {
        background-color: var(--mat-sys-secondary-container);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpPersonalScoreMenuComponent implements OnChanges {
  @Input() partialRanking: Partial<GamificationListDto>[];
  @Input() statistics: BuildedStatistic[];
  @Input() userId: string;
  @Input() isLoading: boolean;
  @Output() navigate = new EventEmitter<void>();

  podium: Partial<GamificationListDto>[] = [];
  otherUsers: Partial<GamificationListDto>[] = [];
  activeTab: GamificationMenuTabType = 'ranking';
  protected readonly defaultUserAvatar = constants.defaultUserAvatar;
  protected readonly tabs: GamificationMenuTab[] = [
    {
      title: marker('UI.GAMIFICATION.PERSONAL_SCORE.RANKING_TAB.TITLE'),
      value: 'ranking',
    },
    {
      title: marker('UI.GAMIFICATION.PERSONAL_SCORE.STATISTICS_TAB.TITLE'),
      value: 'statistics',
    },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partialRanking'] && this.partialRanking) {
      this.buildRanking();
    }
  }

  changeTab(value: GamificationMenuTabType): void {
    this.activeTab = value;
  }

  navigateToGeneralRanking(): void {
    this.navigate.emit();
  }

  private buildRanking(): void {
    const ranking = [...this.partialRanking];
    [ranking[0], ranking[1]] = [ranking[1], ranking[0]];

    if (ranking.length > 3) {
      this.podium = ranking.slice(0, 3);
      this.otherUsers = ranking.slice(3);
      return;
    }

    this.podium = [{ position: 2 }, { position: 1 }, { position: 3 }];
    this.otherUsers = [];
    ranking.forEach((user, index) => {
      if (user) {
        this.podium[index] = user;
      }
    });
  }
}
