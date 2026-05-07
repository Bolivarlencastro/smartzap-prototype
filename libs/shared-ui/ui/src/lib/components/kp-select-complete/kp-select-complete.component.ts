import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  InputSignal,
  OnInit,
  output,
  signal,
  Signal,
} from '@angular/core';
import { KpSelectCompleteOption } from './models';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { KpAutocompleteSearchInputComponent } from '../kp-autocomplete';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { AbstractSelectController, MultiSelectController, SingleSelectController } from './controllers';

@Component({
  selector: 'kp-select-complete',
  standalone: true,
  imports: [
    MatFormField,
    KpAutocompleteSearchInputComponent,
    MatLabel,
    MatOption,
    MatSelect,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KpSelectCompleteComponent),
      multi: true,
    },
  ],
  template: `
    <mat-form-field appearance="outline" class="w-full cursor-pointer" subscriptSizing="dynamic">
      <mat-label class="text-base cursor-pointer">{{ label() | transloco }}</mat-label>
      @if (multiple()) {
        <mat-select
          class="text-base select-no-arrow"
          [multiple]="true"
          [hideSingleSelectionIndicator]="true"
          [compareWith]="controller.compareWithFn"
          (selectionChange)="selectionChange($event.value)"
          [value]="controller.currentSelection"
          [disabled]="disabled()"
        >
          <kp-autocomplete-search-input (filterEvent)="filter($event)"></kp-autocomplete-search-input>
          <div class="overflow-y-auto max-h-44">
            @for (option of displayedOptions(); track option.label) {
              <mat-option class="text-base" [value]="option">
                {{ option.label | transloco }}
              </mat-option>
            }
          </div>
          <div class="mt-1">
            <div class="mt-2 pl-4 h-7">
              <a class="text-primary cursor-pointer underline hover:no-underline" (click)="selectAll()">{{
                'UI.GENERAL.SELECT_ALL' | transloco
              }}</a>
              <span class="text-primary"> - </span>
              <a class="text-primary cursor-pointer underline hover:no-underline" (click)="clearSelection()">{{
                'UI.GENERAL.CLEAR' | transloco
              }}</a>
            </div>
          </div>
        </mat-select>
      } @else {
        <mat-select
          class="text-base select-no-arrow"
          [hideSingleSelectionIndicator]="true"
          (selectionChange)="selectionChange($event.value)"
          [compareWith]="controller.compareWithFn"
          [value]="controller.currentSelection"
          [disabled]="disabled()"
        >
          <kp-autocomplete-search-input (filterEvent)="filter($event)"></kp-autocomplete-search-input>
          <div class="overflow-y-auto">
            @for (option of displayedOptions(); track option.label) {
              <mat-option class="text-base" [value]="option">
                {{ option.label | transloco }}
              </mat-option>
            }
          </div>
        </mat-select>
      }
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpSelectCompleteComponent implements ControlValueAccessor, OnInit {
  options: InputSignal<KpSelectCompleteOption[]> = input.required();
  multiple = input(false, { transform: booleanAttribute });
  label = input('');
  displayedOptions: Signal<KpSelectCompleteOption[]>;
  filterChange = output<string>();

  protected disabled = signal(false);
  protected controller: AbstractSelectController;

  _onChange: (value: any) => void = () => {};
  _onTouched = () => {};

  ngOnInit() {
    this.controller = this.multiple() ? new MultiSelectController() : new SingleSelectController();
    this.displayedOptions = computed(() => {
      const currentOptions = this.options();
      return this.controller?.getDisplayOptions(currentOptions);
    });
  }

  writeValue(obj: any): void {
    this.controller.selectByValue(obj, this.options());
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  selectionChange(selection: KpSelectCompleteOption | KpSelectCompleteOption[]) {
    this.controller.select(selection);
    this._onChange(this.controller.controlValue);
  }

  filter(filter: string) {
    this.filterChange.emit(filter);
  }

  selectAll() {
    this.controller.select(this.options());
    this._onChange(this.controller.controlValue);
  }

  clearSelection() {
    this.controller.clearSelection();
    this._onChange(this.controller.controlValue);
  }
}
