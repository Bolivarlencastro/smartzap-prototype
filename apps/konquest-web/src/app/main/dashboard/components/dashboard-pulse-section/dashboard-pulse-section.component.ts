import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { DashboardHeaderComponent } from '../dashboard-header/dashboard-header.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KpPulseCardComponent, PulseCardDto } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';

@Component({
  selector: 'kp-dashboard-pulse-section',
  imports: [DashboardHeaderComponent, NgxSkeletonLoaderModule, KpPulseCardComponent],
  templateUrl: './dashboard-pulse-section.component.html',
  styles: [
    `
      .cards-container {
        @apply grid pb-4 gap-4 auto-cols-[min-content] grid-flow-col overflow-x-auto;

        @screen xxs {
          @apply px-20 pb-0 auto-cols-auto grid-flow-row overflow-visible min-[432px]:grid-cols-2 min-[810px]:grid-cols-3 min-[1400px]:grid-cols-5 min-[432px]:px-0 min-[810px]:px-0;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPulseSectionComponent {
  @Input({ required: true }) sectionTitle: string;
  @Input() actionButtonLink: any[] | string | null | undefined;
  @Input() actionButtonLabel: string;
  @Input() cardsData: PulseCardDto[] = [];
  @Input() loading: boolean;

  @Output() cardClick = new EventEmitter<PulseCardDto>();
  @Output() bookmarkChange = new EventEmitter<PulseCardDto>();

  protected loaderTheme = {
    'border-radius': '12px',
    height: '152px',
    width: '152px',
  };

  onCardClick(pulse: PulseCardDto): void {
    this.cardClick.emit(pulse);
  }

  onBookmark(pulse: PulseCardDto): void {
    this.bookmarkChange.emit(pulse);
  }
}
