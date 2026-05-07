import { AbstractSelectController } from './abstract-select-controller';
import { KpSelectCompleteOption } from '../models';

export class SingleSelectController extends AbstractSelectController {
  constructor() {
    super(false);
  }

  override selectByValue(value: string, options: KpSelectCompleteOption[]): void {
    const correspondingOption = options.find((option) => option.value === value);
    if (correspondingOption) {
      this.selection.toggle(correspondingOption);
    }
  }

  override select(value: KpSelectCompleteOption): void {
    this.selection.toggle(value);
  }

  override get currentSelection(): KpSelectCompleteOption {
    return this.selection.selected.at(0);
  }

  override get controlValue() {
    return this.currentSelection.value;
  }
}
