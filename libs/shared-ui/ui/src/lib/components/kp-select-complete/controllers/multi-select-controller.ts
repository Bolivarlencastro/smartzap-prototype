import { AbstractSelectController } from './abstract-select-controller';
import { KpSelectCompleteOption } from '../models';

export class MultiSelectController extends AbstractSelectController {
  constructor() {
    super(true);
  }

  override selectByValue(value: string[], options: KpSelectCompleteOption[]): void {
    value?.forEach((optionValue) => {
      const correspondingOption = options.find((option) => option.value === optionValue);
      if (correspondingOption) {
        this.selection.select(correspondingOption);
      }
    });
  }

  override select(value: KpSelectCompleteOption[]): void {
    this.selection.clear();
    this.selection.select(...value);
  }

  override get currentSelection(): KpSelectCompleteOption[] {
    return this.selection.selected;
  }

  override get controlValue() {
    return this.currentSelection.map((option) => option.value);
  }
}
