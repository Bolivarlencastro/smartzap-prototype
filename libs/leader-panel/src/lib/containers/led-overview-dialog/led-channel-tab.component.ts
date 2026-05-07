import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpSkeletonComponent } from '@keeps-platform-frontend-workspace/ui/kp-skeleton';
import { Store } from '@ngrx/store';
import { LedChannelItemComponent } from '../../components/led-overview-dialog/led-channel-item/led-channel-item.component';
import { LedChannelItem } from '../../models/led-channel-item';
import { ListViewModel } from '../../models/list';
import { LedChannelTabActions, ledChannelTabFeature } from '../../store/led-overview';

@Component({
  selector: 'lp-led-channel-tab',
  imports: [LedChannelItemComponent, KpSkeletonComponent, TranslocoPipe],
  template: `
    @let vm = this.vm();

    @if (vm.loading) {
      <kp-skeleton class="w-full h-14 bg-default rounded-md"></kp-skeleton>
      <kp-skeleton class="w-full h-14 bg-default rounded-md"></kp-skeleton>
      <kp-skeleton class="w-full h-14 bg-default rounded-md"></kp-skeleton>
    } @else {
      @if (vm.data?.length) {
        @for (channel of vm.data; track channel.id) {
          <lp-led-channel-item [item]="channel"></lp-led-channel-item>
        }
      } @else {
        <div class="h-28 flex items-center justify-center text-sm opacity-70">
          {{ 'LEADER_PANEL.LED.CHANNEL.EMPTY_MESSAGE' | transloco }}
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
export class LedChannelTabComponent {
  readonly vm: Signal<ListViewModel<LedChannelItem>>;

  constructor(private readonly store: Store) {
    this.store.dispatch(LedChannelTabActions.fetchChannels());
    this.vm = toSignal(this.store.select(ledChannelTabFeature.selectViewModel));
  }
}
