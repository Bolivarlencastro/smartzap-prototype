import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CycleDto, KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { startWith, Subject } from 'rxjs';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';

import { MatOption } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';

type LinkCycleForm = { cycle: FormControl<CycleDto | string> };

@Component({
  selector: 'app-link-cycle-dialog-form',
  templateUrl: './link-cycle-dialog-form.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatIcon,
    MatSuffix,
    MatButton,
    MatDialogClose,
    TranslocoPipe,
  ],
})
export class LinkCycleDialogFormComponent implements OnDestroy {
  @Input() cycles: CycleDto[] = [];
  @Output() formSubmit = new EventEmitter<string>();
  @Output() filterCycle = new EventEmitter<string>();

  readonly form: FormGroup<LinkCycleForm>;
  private readonly unsub = new Subject<void>();

  constructor(formBuilder: FormBuilder) {
    this.form = this.buildForm(formBuilder);
    this.registerCycleAutocomplete();
  }

  get disabledSubmitButton(): boolean {
    return this.form.invalid;
  }

  onSubmit(): void {
    const cycle = this.form.getRawValue().cycle;

    if (this.form.invalid || !this.isCycle(cycle)) {
      return;
    }

    this.formSubmit.emit(cycle.id);
  }

  cycleDisplay(cycle: CycleDto) {
    return cycle?.compliance?.name || '';
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  private registerCycleAutocomplete() {
    this.form
      .get('cycle')
      .valueChanges.pipe(
        debounceTime(200),
        startWith(''),
        filter((value): value is string => typeof value === 'string'),
        takeUntil(this.unsub),
      )
      .subscribe((value) => this.filterCycle.emit(value));
  }

  private buildForm(formBuilder: FormBuilder): FormGroup<LinkCycleForm> {
    return formBuilder.group<LinkCycleForm>({
      cycle: new FormControl(null, [KeepsUtils.objectKeyValidator<CycleDto>('id', true)]),
    });
  }

  private isCycle(value: any): value is CycleDto {
    return typeof value === 'object' && 'id' in value;
  }
}
