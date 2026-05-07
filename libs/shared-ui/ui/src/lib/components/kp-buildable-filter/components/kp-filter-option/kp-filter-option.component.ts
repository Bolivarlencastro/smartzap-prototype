import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpFilterOption, KpFilterOptionRange, KpFilterOptionSwap } from '../../models';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoModule } from '@jsverse/transloco';
import { KpFilterController } from '../../services';
import { KpFilterDefDirective } from '../../directives';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KpFilterKeySelectComponent } from '../kp-filter-key-select/kp-filter-key-select.component';
import { MatButtonModule } from '@angular/material/button';

export type RangeTypeSelectOption = {
  label: string;
  value: KpFilterOptionRange;
};

const DEFAULT_RANGE_TYPES: RangeTypeSelectOption[] = [
  { label: marker('UI.KP_FILTER.PLACEHOLDERS.RANGE_EQUALS'), value: 'equals' },
  { label: marker('UI.KP_FILTER.PLACEHOLDERS.RANGE_LESS'), value: 'less' },
  { label: marker('UI.KP_FILTER.PLACEHOLDERS.RANGE_MORE'), value: 'more' },
  { label: marker('UI.KP_FILTER.PLACEHOLDERS.RANGE_BETWEEN'), value: 'between' },
];

@Component({
  selector: 'kp-filter-option',
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    TranslocoModule,
    MatFormFieldModule,
    KpFilterKeySelectComponent,
    MatButtonModule,
  ],
  styles: [
    `
      .double-column {
        grid-template-columns: auto 1fr;
      }

      .single-column {
        grid-template-columns: 1fr;
      }
    `,
  ],
  templateUrl: './kp-filter-option.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpFilterOptionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) availableOptions: KpFilterOption[];
  @Input({ required: true }) selectedOption: KpFilterOption;
  @Input() first: boolean;
  @Output() optionSelected = new EventEmitter<KpFilterOptionSwap>();
  @Output() rangeChange = new EventEmitter<KpFilterOptionRange>();
  @Output() remove = new EventEmitter<void>();

  get options(): KpFilterOption[] {
    if (!this.selectedOption) {
      return this.availableOptions;
    }

    return [this.selectedOption, ...this.availableOptions];
  }

  rangeTypes: RangeTypeSelectOption[] = DEFAULT_RANGE_TYPES;

  @ViewChild('valueContainer', { read: ViewContainerRef }) private valueContainer: ViewContainerRef;
  private currentDirective: KpFilterDefDirective;
  private readonly filterController = inject(KpFilterController);

  get showRangeSelector(): boolean {
    return !!this.selectedOption.rangeConfig;
  }

  onSelectionChange(filterKey: string) {
    this.optionSelected.emit({ previous: this.selectedOption.filterKey, current: filterKey });
  }

  onRangeTypeChange(type: KpFilterOptionRange): void {
    this.rangeChange.emit(type);
  }

  ngOnInit() {
    if (this.selectedOption.rangeOptions?.length) {
      this.rangeTypes = DEFAULT_RANGE_TYPES.filter((rangeOption) =>
        this.selectedOption.rangeOptions.includes(rangeOption.value),
      );
    }
  }

  ngAfterViewInit() {
    this.currentDirective = this.filterController.getDirectiveForRendering(this.selectedOption);
    this.currentDirective.registerAndRender(this.valueContainer, this.selectedOption);
  }

  ngOnDestroy() {
    this.currentDirective.unregisterAndMarkForCheck(this.getUnregisterKeys());
  }

  removeOption() {
    this.remove.emit();
  }

  private getUnregisterKeys(): string[] {
    switch (this.selectedOption.rangeType) {
      case 'between':
        return [this.selectedOption.rangeConfig?.toKey, this.selectedOption.rangeConfig?.fromKey];
      case 'less':
        return [this.selectedOption.rangeConfig?.toKey];
      case 'more':
        return [this.selectedOption.rangeConfig?.fromKey];
      default:
        return [this.selectedOption.filterKey];
    }
  }
}
