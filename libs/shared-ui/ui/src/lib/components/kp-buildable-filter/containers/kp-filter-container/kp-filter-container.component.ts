import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  inject,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpFilterController } from '../../services';
import { KpFilterControllerState, KpFilterOption, KpFilterOptionRange, KpFilterOptionSwap } from '../../models';
import { Observable } from 'rxjs';
import {
  KpFilterDefaultDateRangeComponent,
  KpFilterKeySelectComponent,
  KpFilterOptionComponent,
} from '../../components';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { KpFilterDefDirective } from '../../directives';
import { MatInputModule } from '@angular/material/input';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { KpFilterDefaultNumericRangeComponent } from '../../components/kp-filter-default-numeric-range/kp-filter-default-numeric-range.component';

marker('UI.KP_FILTER.PLACEHOLDERS.SELECT_VALUE');
marker('UI.KP_FILTER.PLACEHOLDERS.SEARCH');
marker('UI.KP_FILTER.PLACEHOLDERS.DATE');

@Component({
  selector: 'kp-filter-container',
  imports: [
    CommonModule,
    KpFilterOptionComponent,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    TranslocoModule,
    MatButtonModule,
    MatInputModule,
    KpFilterDefDirective,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatIconModule,
    KpFilterDefaultDateRangeComponent,
    KpFilterKeySelectComponent,
    KpFilterDefaultNumericRangeComponent,
  ],
  templateUrl: 'kp-filter-container.component.html',
  providers: [KpFilterController],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpFilterContainerComponent implements AfterViewInit {
  @Input({ required: true }) filterOptions: KpFilterOption[];
  @Input() initialControllerState: KpFilterControllerState | undefined;
  @Input() initialFilterValue: any;

  @ContentChildren(KpFilterDefDirective) customDirectives: QueryList<KpFilterDefDirective>;
  @ViewChildren(KpFilterDefDirective) defaultDirectives: QueryList<KpFilterDefDirective>;

  private readonly parentContainer = inject(ControlContainer);

  get displayOptionSelect(): boolean {
    return this._displayOptionSelect;
  }

  private _displayOptionSelect = true;

  private readonly filterController = inject(KpFilterController);
  protected readonly availableOptions$: Observable<KpFilterOption[]>;
  protected readonly selectedOptions$: Observable<KpFilterOption[]>;

  constructor() {
    this.availableOptions$ = this.filterController.availableOptions$;
    this.selectedOptions$ = this.filterController.selectedOptions$;
  }

  ngAfterViewInit() {
    this.filterController.setDefaultDirectives(this.defaultDirectives.toArray());
    this.filterController.setCustomDirectives(this.customDirectives.toArray());
    this.setFilterControllerOptions();
  }

  onSelectionChange(filterKey: string) {
    this.filterController.toggleOptionSelection(filterKey);
    this._displayOptionSelect = false;
  }

  swapOptions(event: KpFilterOptionSwap) {
    this.filterController.swapSelectedOptions(event);
  }

  addNewOption() {
    this._displayOptionSelect = true;
  }

  rangeChange(selectedOptionKey: string, range: KpFilterOptionRange) {
    this.filterController.setOptionRangeType(selectedOptionKey, range);
  }

  removeOption(filterKey: string): void {
    this.filterController.toggleOptionSelection(filterKey);
  }

  private setFilterControllerOptions() {
    if (!this.initialControllerState) {
      this.filterController.buildOptions(this.filterOptions);
      return;
    }

    this.filterController.restoreControllerState(this.initialControllerState);
    this._displayOptionSelect = false;

    setTimeout(() => {
      this.parentContainer.control.patchValue(this.initialFilterValue);
    }, 0);
  }
}
