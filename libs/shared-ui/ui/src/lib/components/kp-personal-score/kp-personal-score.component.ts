import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { GamificationListDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoPipe } from '@jsverse/transloco';
import { BuildedStatistic } from '../kp-personal-score-menu';
import { KpPersonalScoreMenuComponent } from '../kp-personal-score-menu/kp-personal-score-menu.component';

@Component({
  selector: 'kp-personal-score',
  imports: [CommonModule, MatDividerModule, MatIconModule, MatMenuModule, KpPersonalScoreMenuComponent, TranslocoPipe],
  template: `
    <div class="flex justify-beetwen gap-4 cursor-pointer" [matMenuTriggerFor]="menu">
      <mat-divider vertical="true"></mat-divider>
      <div class="flex items-center gap-4">
        <mat-icon class="s-4">payments</mat-icon>
        <div class="flex flex-col justify-center items-center">
          <span class="text-sm">{{ score || 0 | number }}</span>
          <span class="text-2xxs">{{
            'UI.GAMIFICATION.PERSONAL_SCORE.POINTS' | transloco: { points: score } | uppercase
          }}</span>
        </div>
      </div>
      <mat-divider vertical="true"></mat-divider>
    </div>

    <mat-menu #menu="matMenu" xPosition="before" class="mt-2 w-80 max-w-none kp-reset-menu-padding">
      <kp-personal-score-menu
        [partialRanking]="partialRanking"
        [statistics]="statistics"
        [userId]="userId"
        [isLoading]="isLoading"
        (navigate)="navigateToGeneralRanking()"
      ></kp-personal-score-menu>
    </mat-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpPersonalScoreComponent {
  @Input() score;
  @Input() userId: string;
  @Input() partialRanking: Partial<GamificationListDto>[];
  @Input() statistics: BuildedStatistic[];
  @Input() isLoading: boolean;
  @Output() navigate = new EventEmitter<void>();
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;

  navigateToGeneralRanking(): void {
    this.navigate.emit();
    this.menuTrigger.closeMenu();
  }
}
