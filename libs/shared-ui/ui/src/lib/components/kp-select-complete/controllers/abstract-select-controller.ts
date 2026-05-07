import { SelectionModel } from '@angular/cdk/collections';
import { KpSelectCompleteOption } from '../models';

export abstract class AbstractSelectController {
  protected selection: SelectionModel<KpSelectCompleteOption>;

  protected constructor(multiple: boolean) {
    this.selection = new SelectionModel(multiple);
    this.selection.compareWith = this.compareWithFn;
  }

  getDisplayOptions(currentOptions: KpSelectCompleteOption[]): KpSelectCompleteOption[] {
    const currentSelection = this.selection.selected;
    const allOptions = [...currentOptions, ...currentSelection];
    const uniqueOptions = new Map<string, KpSelectCompleteOption>();
    for (const option of allOptions) {
      if (option) {
        uniqueOptions.set(option.value, option);
      }
    }
    return this.sortOptions(Array.from(uniqueOptions.values()));
  }

  compareWithFn = (firstOption: KpSelectCompleteOption, secondOption: KpSelectCompleteOption): boolean => {
    return firstOption?.value === secondOption?.value;
  };

  clearSelection(): void {
    this.selection.clear();
  }

  protected sortOptions(options: KpSelectCompleteOption[]): KpSelectCompleteOption[] {
    return options.sort((a, b) => a.label.localeCompare(b.label));
  }

  abstract selectByValue(value: string | string[], options: KpSelectCompleteOption[]): void;

  abstract select(value: KpSelectCompleteOption | KpSelectCompleteOption[]): void;

  abstract get currentSelection(): KpSelectCompleteOption | KpSelectCompleteOption[];

  abstract get controlValue(): string | string[];
}
