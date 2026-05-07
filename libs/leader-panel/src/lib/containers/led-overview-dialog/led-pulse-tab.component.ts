import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpSkeletonComponent } from '@keeps-platform-frontend-workspace/ui/kp-skeleton';
import { Store } from '@ngrx/store';
import { LedPulseItemComponent } from '../../components/led-overview-dialog/led-pulse-item/led-pulse-item.component';
import { LedPulseItem } from '../../models/led-pulse-item';
import { ListViewModel } from '../../models/list';
import { LedPulseTabActions, ledPulseTabFeature } from '../../store/led-overview';

@Component({
  selector: 'lp-led-pulse-tab',
  imports: [LedPulseItemComponent, KpSkeletonComponent, TranslocoPipe],
  template: `
    @let vm = this.vm();

    @if (vm.loading) {
      <kp-skeleton class="w-full h-13 bg-default rounded-md"></kp-skeleton>
      <kp-skeleton class="w-full h-13 bg-default rounded-md"></kp-skeleton>
      <kp-skeleton class="w-full h-13 bg-default rounded-md"></kp-skeleton>
    } @else {
      @if (vm.data?.length) {
        @for (pulse of vm.data; track pulse.id) {
          <lp-led-pulse-item [item]="pulse"></lp-led-pulse-item>
        }
      } @else {
        <div class="h-28 flex items-center justify-center text-sm opacity-70">
          {{ 'LEADER_PANEL.LED.PULSE.EMPTY_MESSAGE' | transloco }}
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
export class LedPulseTabComponent {
  readonly vm: Signal<ListViewModel<LedPulseItem>>;

  constructor(private readonly store: Store) {
    this.store.dispatch(LedPulseTabActions.fetchPulses());
    this.vm = toSignal(this.store.select(ledPulseTabFeature.selectViewModel));
  }
}
