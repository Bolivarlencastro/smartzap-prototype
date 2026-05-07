import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { DashboardHeaderComponent } from '../dashboard-header/dashboard-header.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KpChannelCardComponent, KpChannelCardModel } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';

@Component({
  selector: 'kp-dashboard-channel-section',
  imports: [DashboardHeaderComponent, NgxSkeletonLoaderModule, KpChannelCardComponent],
  templateUrl: './dashboard-channel-section.component.html',
  styles: [
    `
      .cards-container {
        @apply grid gap-4 pb-4 auto-cols-[min-content] grid-flow-col overflow-x-auto;

        @screen xxs {
          @apply grid pb-0 grid-cols-1 auto-cols-auto grid-flow-row overflow-visible min-[440px]:grid-cols-1 min-[1024px]:grid-cols-2 min-[1468px]:grid-cols-3;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardChannelSectionComponent {
  @Input({ required: true }) sectionTitle: string;
  @Input() actionButtonLink: any[] | string | null | undefined;
  @Input() actionButtonLabel: string;
  @Input() cardsData: KpChannelCardModel[] = [];
  @Input() loading: boolean;

  @Output() cardClick = new EventEmitter<KpChannelCardModel>();
  @Output() subscribeChange = new EventEmitter<KpChannelCardModel>();

  protected loaderTheme = {
    'border-radius': '12px',
    height: '172px',
    width: '421px',
  };

  onCardClick(channel: KpChannelCardModel): void {
    this.cardClick.emit(channel);
  }

  onSubscribe(channel: KpChannelCardModel): void {
    this.subscribeChange.emit(channel);
  }
}
