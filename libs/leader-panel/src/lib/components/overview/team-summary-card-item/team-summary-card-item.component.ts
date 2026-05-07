import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { OverviewTeamSummaryItem } from '../../../models/overview';

@Component({
  selector: 'lp-team-summary-card-item',
  imports: [NgClass],
  template: `
    @let item = this.item();
    @let index = this.index();

    <div class="flex gap-3.5 items-center h-20 p-3" [ngClass]="{ 'border-b border-default': !lastItem() }">
      @if (index) {
        <span class="text-xs mx-2">{{ index }}</span>
      }
      <img class="rounded-full h-8 w-8" [src]="item.avatar || defaultUserAvatar" alt="User Image" />
      <div class="flex flex-col">
        <span class="text-xs font-bold [word-break:break-word] line-clamp-1">{{ item.name }}</span>
        <span class="text-2xxs opacity-70 [word-break:break-word] line-clamp-1">{{ item.subtitle }}</span>
        @if (item.description) {
          <span class="text-xs mt-1 opacity-70 [word-break:break-word] line-clamp-1">{{ item.description }}</span>
        }
      </div>
      <div class="ml-auto text-xs shrink-0">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamSummaryCardItemComponent {
  item = input<OverviewTeamSummaryItem>();
  index = input<number>();
  lastItem = input<boolean>();
  protected readonly defaultUserAvatar = constants.defaultUserAvatar;
}
