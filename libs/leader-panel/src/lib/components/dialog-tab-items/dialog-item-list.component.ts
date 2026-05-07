import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpSkeletonComponent } from '@keeps-platform-frontend-workspace/ui/kp-skeleton';

@Component({
  selector: 'lp-dialog-item-list',
  imports: [KpSkeletonComponent, TranslocoPipe],
  template: `
    @if (loading()) {
      <kp-skeleton class="w-full h-13 bg-default rounded-md"></kp-skeleton>
      <kp-skeleton class="w-full h-13 bg-default rounded-md"></kp-skeleton>
      <kp-skeleton class="w-full h-13 bg-default rounded-md"></kp-skeleton>
    } @else {
      @if (hasItems()) {
        <ng-content></ng-content>
      } @else {
        <div class="h-28 flex items-center justify-center text-sm opacity-70">
          {{ emptyStateMessage() | transloco }}
        </div>
      }
    }
  `,
  styles: `
    :host {
      @apply mt-5 flex flex-col gap-2.5;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogItemListComponent {
  loading = input<boolean>();
  emptyStateMessage = input<string>();
  hasItems = input<boolean>();
}
