import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from 'app/main/dashboard/components';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  KpLearnContentCardComponent,
  LearnContentCardData,
} from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import {
  LearnContentActionContentType,
  LearnContentActionData,
  LearnContentCardActionId,
  LearnContentCardOrientation,
} from '@keeps-platform-frontend-workspace/ui/models';

@Component({
  selector: 'kp-dashboard-card-section',
  imports: [CommonModule, DashboardHeaderComponent, KpLearnContentCardComponent, NgxSkeletonLoaderModule],
  templateUrl: './dashboard-card-section.component.html',
  styleUrls: ['./dashboard-card-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardCardSectionComponent implements OnChanges {
  @Input({ required: true }) sectionTitle: string;
  @Input({ required: true }) contentType: LearnContentActionContentType;
  @Input() actionButtonLink: any[] | string | null | undefined;
  @Input() actionButtonLabel: string;
  @Input() cardsData: LearnContentCardData[] = [];
  @Input() loading: boolean;
  @Input() cardOrientation: LearnContentCardOrientation = 'portrait';
  @Output() cardAction = new EventEmitter<LearnContentActionData>();

  protected loaderTheme = {
    'border-radius': '12px',
    height: '434px',
    width: '240px',
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cardOrientation']) {
      this.setLoaderDimensions();
    }
  }

  get containerOrientation() {
    return this.cardOrientation === 'landscape' ? 'container-landscape' : 'container-portrait';
  }

  private setLoaderDimensions() {
    this.loaderTheme.height = this.cardOrientation === 'portrait' ? '426px' : '230px';
    this.loaderTheme.width = this.cardOrientation === 'portrait' ? '240px' : '408px';
  }

  onCardAction(action: LearnContentCardActionId, learnContent: LearnContentCardData) {
    this.cardAction.emit({ action, learnContent, contentType: this.contentType });
  }

  onCardClick(learnContent: LearnContentCardData) {
    this.cardAction.emit({ action: 'details', learnContent, contentType: this.contentType });
  }
}
