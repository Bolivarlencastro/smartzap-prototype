import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KpAutocompleteOption } from '../models';

@Injectable()
export class KpAutocompleteFilterService {
  private readonly availableOptions = new BehaviorSubject<KpAutocompleteOption[]>([]);
  private readonly filteredOptions = new BehaviorSubject<KpAutocompleteOption[]>([]);
  private readonly autocompleteLabel = new BehaviorSubject<string>('');

  readonly options = this.filteredOptions.asObservable();
  readonly triggerValue = this.autocompleteLabel.asObservable();

  setOptions(options: KpAutocompleteOption[]) {
    this.availableOptions.next(options);
    this.filterOptions();
  }

  getFilteredOptions() {
    return this.filteredOptions.value;
  }

  filterOptions(filter?: string) {
    const currentOptions = this.availableOptions.value;

    if (!filter) {
      this.filteredOptions.next(currentOptions);
      return;
    }

    const filteredOptions = currentOptions.filter((option) =>
      option.label.toLowerCase().includes(filter.toLowerCase()),
    );

    this.filteredOptions.next(filteredOptions);
  }

  selectionChange(selectedValues: string[]) {
    if (!selectedValues) {
      return;
    }

    const currentOptions = this.availableOptions.value;
    const labels = currentOptions
      .filter((option) => selectedValues.includes(option.value))
      .map((option) => option.label);

    this.autocompleteLabel.next(labels.join(', '));
  }
}
