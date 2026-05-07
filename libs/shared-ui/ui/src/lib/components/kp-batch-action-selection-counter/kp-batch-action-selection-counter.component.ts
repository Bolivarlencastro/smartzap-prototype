import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '../../pipes';
import { marker } from '@jsverse/transloco-keys-manager/marker';

const DEFAULT_ALL_SELECTED_MESSAGE = marker('UI.BATCH_ACTIONS.COUNTER.ALL_SELECTED.MESSAGE');
const DEFAULT_ALL_SELECTED_LINK = marker('UI.BATCH_ACTIONS.COUNTER.ALL_SELECTED.LINK');
const DEFAULT_SIMPLE_SELECTION_MESSAGE = marker('UI.BATCH_ACTIONS.COUNTER.SIMPLE_SELECTION.MESSAGE');
const DEFAULT_SIMPLE_SELECTION_LINK = marker('UI.BATCH_ACTIONS.COUNTER.SIMPLE_SELECTION.LINK');

@Component({
  selector: 'kp-batch-action-selection-counter',
  imports: [TranslocoModule, KpPluralizeTranslatePipe],
  template: `
    <div class="p-3 h-16 w-full text-sm flex justify-center items-center counter-bg">
      @if (isAllSelected()) {
        <span>
          {{ allSelectedMessage() | transloco: { value: total() } }}
          <a class="text-primary font-bold cursor-pointer" (click)="clearSelection()">
            {{ allSelectedLink() | transloco }}
          </a>
        </span>
      } @else {
        <span>
          {{ simpleSelectionMessage() | kpPluralizeTranslate: { value: selection() } }}
          @if (hasAppliedFilter()) {
            <a class="text-primary font-bold cursor-pointer" (click)="selectAllRecords()">
              {{ simpleSelectionLink() | transloco: { value: total() } }}
            </a>
          }
        </span>
      }
    </div>
  `,
  styles: [
    `
      .counter-bg {
        background-color: var(--mat-sys-inverse-on-surface);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpBatchActionSelectionCounterComponent {
  isAllSelected = model<boolean>();
  selection = input<number>();
  total = input<number>();
  hasAppliedFilter = input<boolean>();
  allSelectedMessage = input<string>(DEFAULT_ALL_SELECTED_MESSAGE);
  allSelectedLink = input<string>(DEFAULT_ALL_SELECTED_LINK);
  simpleSelectionMessage = input<string>(DEFAULT_SIMPLE_SELECTION_MESSAGE);
  simpleSelectionLink = input<string>(DEFAULT_SIMPLE_SELECTION_LINK);
  selectAll = output<void>();
  clear = output<void>();

  selectAllRecords(): void {
    this.isAllSelected.set(true);
    this.selectAll.emit();
  }

  clearSelection(): void {
    this.isAllSelected.set(false);
    this.clear.emit();
  }
}
