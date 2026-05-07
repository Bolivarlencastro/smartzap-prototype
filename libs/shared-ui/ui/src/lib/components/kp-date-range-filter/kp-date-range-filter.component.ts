import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { KeepsUtils, KpDateRange, KpDateRangeForm } from '@keeps-platform-frontend-workspace/kp-keeps';
import { format } from 'date-fns';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'kp-date-range-filter',
  imports: [CommonModule, MatIconModule, MatDatepickerModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './kp-date-range-filter.component.html',
  styles: [
    `
      :host {
        display: inline-flex;
        position: relative;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpDateRangeFilterComponent implements OnDestroy {
  @Input() set currentDateRange(value: Partial<KpDateRange>) {
    if (!KeepsUtils.areObjectEqual(value, this._currentDateRange)) {
      this.patchForm(value, this.form);
      this.updateCurrentDateRange(value);
    }
  }

  get currentDateRange(): Partial<KpDateRange> {
    return this._currentDateRange;
  }

  @Input() label: string;
  @Input() icon: string;
  @Output() dateRangeEvent = new EventEmitter<Partial<KpDateRange>>();
  @Output() cleanDateRange = new EventEmitter<void>();

  readonly form: FormGroup<KpDateRangeForm>;
  private _unsubscribeAll = new Subject();
  private _currentDateRange: Partial<KpDateRange>;

  get hasAppliedValue(): boolean {
    return !!this._currentDateRange?.startDate && !!this._currentDateRange?.endDate;
  }

  get formattedAppliedDate(): string {
    return `${format(this._currentDateRange?.startDate, 'dd/MM/yyyy')} - ${format(
      this._currentDateRange?.endDate,
      'dd/MM/yyyy',
    )}`;
  }

  constructor(private _formBuilder: FormBuilder) {
    this.form = this.buildForm(_formBuilder);
    this.subscribeToForm();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }

  cleanFilter(event: Event): void {
    event.stopPropagation();
    this.cleanDateRange.emit();
  }

  private buildForm(formBuilder: FormBuilder): FormGroup<KpDateRangeForm> {
    return formBuilder.group({
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
    }) as FormGroup;
  }

  private patchForm(value: Partial<KpDateRange>, form: FormGroup<KpDateRangeForm>): void {
    if (value) {
      this.form.patchValue(value);
    }
    form.updateValueAndValidity({ emitEvent: false });
  }

  private updateCurrentDateRange(value: Partial<KpDateRange>): void {
    this._currentDateRange = value;
  }

  private updateDateRange(value: Partial<KpDateRange>): void {
    this.updateCurrentDateRange(value);
    this.dateRangeEvent.emit(value);
  }

  private subscribeToForm(): void {
    this.form.valueChanges.pipe(debounceTime(500), takeUntil(this._unsubscribeAll)).subscribe((currentValue) => {
      if (!KeepsUtils.areObjectEqual(currentValue, this._currentDateRange) && this.form.valid) {
        this.updateDateRange(currentValue);
      }
    });
  }
}
