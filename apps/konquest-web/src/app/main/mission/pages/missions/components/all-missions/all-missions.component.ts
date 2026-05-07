import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  KpLearnContentCardComponent,
  LearnContentCardData,
} from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { LearnContentActionData, LearnContentCardActionId } from '@keeps-platform-frontend-workspace/ui/models';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'kp-all-missions',
  templateUrl: './all-missions.component.html',
  imports: [KpLearnContentCardComponent, NgxSkeletonLoaderModule, TranslocoPipe],
})
export class AllMissionsComponent {
  @Input() missions: LearnContentCardData[];
  @Input() isLoading!: boolean;
  @Input() emptyMessage!: string;
  @Input() isMobile: boolean;
  @Output() cardAction = new EventEmitter<LearnContentActionData>();

  private readonly baseLoaderTheme = {
    'border-radius': '12px',
    height: '434px',
    width: '240px',
  };
  protected readonly webLoaderTheme = { ...this.baseLoaderTheme, height: '426px', width: '240px' };
  protected readonly mobileLoaderTheme = { ...this.baseLoaderTheme, height: '288px', width: '162px' };

  onCardAction(action: LearnContentCardActionId, cardData: LearnContentCardData): void {
    this.cardAction.emit({
      action,
      learnContent: cardData,
      contentType: 'mission',
    });
  }
}
