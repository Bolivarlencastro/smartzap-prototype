import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { GlobalSearchFilter, GlobalSearchFilterOptions } from '../kp-global-search-side-filter';
import { KpSelectMenuTriggerComponent, KpSelectTriggerContentDirective } from '../kp-select-menu';

export interface GlobalSearchFilterForm {
  enrollmentType: FormControl<string>;
  duedate: FormControl<string>;
  duration: FormControl<string>;
  enrollmentStatus: FormControl<string[]>;
  categories: FormControl<string[]>;
  platforms: FormControl<string[]>;
}

@Component({
  selector: 'kp-global-search-filter-form',
  imports: [
    CommonModule,
    MatIconModule,
    TranslocoModule,
    KpSelectMenuTriggerComponent,
    KpSelectTriggerContentDirective,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './kp-global-search-filter-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpGlobalSearchFilterFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() activeFilters: GlobalSearchFilter;
  @Input() filterOptions: GlobalSearchFilterOptions;
  @Output() formSubmit = new EventEmitter<Partial<GlobalSearchFilter>>();
  @Output() cleanFilterEvent = new EventEmitter<void>();

  private _unsubscribeAll = new Subject();
  protected readonly form: FormGroup<GlobalSearchFilterForm>;

  constructor(private _formBuilder: FormBuilder) {
    this.form = this.buildForm(_formBuilder);
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntil(this._unsubscribeAll), debounceTime(500)).subscribe(() => this.onSubmit());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['activeFilters']) {
      this.patchForm(this.activeFilters, this.form);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }

  onSubmit(): void {
    this.formSubmit.emit(this.form.value);
  }

  cleanFilter(): void {
    this.cleanFilterEvent.emit();
  }

  private buildForm(formBuilder: FormBuilder): FormGroup<GlobalSearchFilterForm> {
    return formBuilder.group<GlobalSearchFilterForm>({
      enrollmentType: new FormControl(null),
      duedate: new FormControl(null),
      duration: new FormControl(null),
      enrollmentStatus: new FormControl(null),
      categories: new FormControl(null),
      platforms: new FormControl(null),
    });
  }

  private patchForm(activeFilters: GlobalSearchFilter, form: FormGroup<GlobalSearchFilterForm>): void {
    if (activeFilters) {
      Object.keys(form.controls).forEach((controlName) => {
        const controlValue = controlName in activeFilters ? activeFilters[controlName] : null;
        form.get(controlName).setValue(controlValue, { emitEvent: false });
      });
    }
    form.updateValueAndValidity({ emitEvent: false });
  }
}
