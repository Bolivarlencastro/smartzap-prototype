import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KpAutocompleteOption } from '../../models';
import { Observable } from 'rxjs';
import { KpAutocompleteFilterService } from '../../services';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { KpAutocompleteSearchInputComponent } from '../kp-autocomplete-search-input/kp-autocomplete-search-input.component';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { AsyncPipe } from '@angular/common';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';

@Component({
  selector: 'kp-autocomplete',
  templateUrl: './kp-autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  providers: [KpAutocompleteFilterService],
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    FormsModule,
    ReactiveFormsModule,
    MatSelectTrigger,
    KpAutocompleteSearchInputComponent,
    MatOption,
    MatIcon,
    MatSuffix,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class KpAutocompleteComponent implements OnInit {
  @Input({ required: true }) acFormControlName: string;
  @Input() formFieldLabel = '';
  @Input() multiple = false;

  @Input({ required: true })
  set options(options: KpAutocompleteOption[]) {
    this.autocompleteFilter.setOptions(options);
  }

  protected readonly filteredOptions: Observable<KpAutocompleteOption[]>;
  protected readonly selectTrigger: Observable<string>;

  constructor(
    private formGroupDirective: FormGroupDirective,
    private autocompleteFilter: KpAutocompleteFilterService,
  ) {
    this.filteredOptions = this.autocompleteFilter.options;
    this.selectTrigger = this.autocompleteFilter.triggerValue;
  }

  private get formControl() {
    return this.formGroupDirective.form.get(this.acFormControlName);
  }

  ngOnInit() {
    this.autocompleteFilter.selectionChange(this.formControl.value);
  }

  selectAll() {
    const availableOptions = this.autocompleteFilter.getFilteredOptions()?.map((option) => option.value);
    this.formControl.setValue(availableOptions);
    this.selectionChange(availableOptions);
  }

  clearSelection() {
    this.formControl.setValue([]);
  }

  onFilter(value: string) {
    this.autocompleteFilter.filterOptions(value);
  }

  selectionChange(value: string[]) {
    this.autocompleteFilter.selectionChange(value);
  }
}
