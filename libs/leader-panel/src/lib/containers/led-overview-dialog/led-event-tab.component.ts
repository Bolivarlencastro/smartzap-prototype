import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpSkeletonComponent } from '@keeps-platform-frontend-workspace/ui/kp-skeleton';
import { Store } from '@ngrx/store';
import { LedEventItemComponent } from '../../components/led-overview-dialog/led-event-item/led-event-item.component';
import { LedEventItem } from '../../models/led-event-item';
import { ListViewModel } from '../../models/list';
import { LedEventTabActions, ledEventTabFeature } from '../../store/led-overview';

@Component({
  selector: 'lp-led-event-tab',
  imports: [LedEventItemComponent, KpSkeletonComponent, TranslocoPipe],
  template: `
    @let vm = this.vm();

    @if (vm.loading) {
      <kp-skeleton class="w-full h-14 bg-default rounded-md"></kp-skeleton>
      <kp-skeleton class="w-full h-14 bg-default rounded-md"></kp-skeleton>
      <kp-skeleton class="w-full h-14 bg-default rounded-md"></kp-skeleton>
    } @else {
      @if (vm.data?.length) {
        @for (event of vm.data; track event.id) {
          <lp-led-event-item [item]="event"></lp-led-event-item>
        }
      } @else {
        <div class="h-28 flex items-center justify-center text-sm opacity-70">
          {{ 'LEADER_PANEL.LED.EVENT.EMPTY_MESSAGE' | transloco }}
        </div>
      }
    }
  `,
  styles: `
    :host {
      @apply p-5 flex flex-col gap-2.5;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedEventTabComponent {
  readonly vm: Signal<ListViewModel<LedEventItem>>;

  constructor(private readonly store: Store) {
    this.store.dispatch(LedEventTabActions.fetchEvents());
    this.vm = toSignal(this.store.select(ledEventTabFeature.selectViewModel));
  }
}
