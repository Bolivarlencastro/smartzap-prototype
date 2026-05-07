import { KpFilterControllerState, KpFilterOption, KpFilterOptionRange, KpFilterOptionSwap } from '../models';
import { BehaviorSubject, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { KpFilterDefDirective } from '../directives';

@Injectable()
export class KpFilterController {
  private readonly optionsMap = new Map<string, KpFilterOption>();

  private options = new BehaviorSubject<KpFilterOption[]>([]);
  readonly availableOptions$ = this.options
    .asObservable()
    .pipe(map((options) => options.filter((option) => !option.selected)));

  private selectedOptions = new BehaviorSubject<KpFilterOption[]>([]);
  readonly selectedOptions$ = this.selectedOptions.asObservable();

  private customDirectives = new Map<string, KpFilterDefDirective>();
  private defaultDirectives = new Map<string, KpFilterDefDirective>();

  /**
   * Toggles an option selection, when selected it will be filtered when listing the available options
   * @param filterKey the filterKey of the option
   */
  toggleOptionSelection(filterKey: string): void {
    const filterOption = this.optionsMap.get(filterKey);
    if (!filterOption) {
      return;
    }

    const updatedOption: KpFilterOption = {
      ...filterOption,
      selected: !filterOption.selected,
      rangeType: this.getInitialRangeTypeSelection(filterOption),
    };
    this.optionsMap.set(filterKey, updatedOption);

    this.updateAvailableOptions();
    this.updateSelectedOptions(updatedOption);
  }

  setOptionRangeType(filterKey: string, rangeType: KpFilterOptionRange): void {
    const filterOption = this.optionsMap.get(filterKey);
    const updatedOption: KpFilterOption = { ...filterOption, rangeType };
    this.optionsMap.set(filterKey, updatedOption);

    const currentSelectedOptions = this.selectedOptions.value;
    const optionIndex = currentSelectedOptions.findIndex((option) => option.filterKey === filterKey);

    currentSelectedOptions.splice(optionIndex, 1, updatedOption);
    this.selectedOptions.next(currentSelectedOptions);
  }

  swapSelectedOptions(event: KpFilterOptionSwap): void {
    const updatedPreviousOption: KpFilterOption = {
      ...this.optionsMap.get(event.previous),
      selected: false,
      rangeType: undefined,
    };
    const newOption = this.optionsMap.get(event.current);
    const updatedCurrentOption: KpFilterOption = {
      ...newOption,
      selected: true,
      rangeType: this.getInitialRangeTypeSelection(newOption),
    };

    this.optionsMap.set(event.previous, updatedPreviousOption);
    this.optionsMap.set(event.current, updatedCurrentOption);
    this.updateAvailableOptions();

    const updatedOptions = this.swapOptions(this.selectedOptions.value, event.previous, updatedCurrentOption);
    this.selectedOptions.next(updatedOptions);
  }

  getControllerState(): KpFilterControllerState {
    return { options: Array.from(this.optionsMap.values()), selectedOptions: this.selectedOptions.value };
  }

  restoreControllerState(state: KpFilterControllerState): void {
    state.options.forEach((option) => {
      this.optionsMap.set(option.filterKey, { ...option });
    });

    this.updateAvailableOptions();
    this.selectedOptions.next([...state.selectedOptions]);
  }

  resetSelection() {
    this.optionsMap.forEach((option) => {
      option.selected = false;
      option.rangeType = undefined;
    });

    this.selectedOptions.next([]);
    this.updateAvailableOptions();
  }

  buildOptions(definitions: KpFilterOption[]): void {
    definitions.forEach((definition) => {
      if (definition.disabled) {
        return;
      }

      this.optionsMap.set(definition.filterKey, definition);
    });

    this.updateAvailableOptions();
  }

  readDefinition(filterKey: string): KpFilterOption {
    return this.optionsMap.get(filterKey);
  }

  setDefaultDirectives(directives: KpFilterDefDirective[]): void {
    directives?.forEach((filterDefDirective) => {
      this.defaultDirectives.set(filterDefDirective.kpFilterDef, filterDefDirective);
    });
  }

  setCustomDirectives(directives: KpFilterDefDirective[]): void {
    directives?.forEach((filterDefDirective) => {
      this.customDirectives.set(filterDefDirective.kpFilterDef, filterDefDirective);
    });
  }

  getDirectiveForRendering(directive: KpFilterOption): KpFilterDefDirective {
    if (directive.customTemplate) {
      return this.customDirectives.get(directive.customTemplate);
    }

    return this.defaultDirectives.get(directive.type);
  }

  private getInitialRangeTypeSelection(option: KpFilterOption): KpFilterOptionRange | undefined {
    if (!option.rangeConfig) {
      return undefined;
    }

    const rangeOptions = option.rangeOptions;
    return rangeOptions?.length ? rangeOptions.at(0) : 'equals';
  }

  private updateAvailableOptions(): void {
    this.options.next(Array.from(this.optionsMap.values()));
  }

  private updateSelectedOptions(option: KpFilterOption): void {
    const currentOptions = this.selectedOptions.value;
    const updatedOptions = option.selected
      ? this.addSelectedOption(currentOptions, option)
      : this.removeSelectedOption(currentOptions, option);

    this.selectedOptions.next(updatedOptions);
  }

  private addSelectedOption(currentOptions: KpFilterOption[], option: KpFilterOption): KpFilterOption[] {
    return [...currentOptions, option];
  }

  private removeSelectedOption(currentOptions: KpFilterOption[], option: KpFilterOption): KpFilterOption[] {
    return currentOptions.filter((item) => item.filterKey !== option.filterKey);
  }

  private swapOptions(
    currentOptions: KpFilterOption[],
    previousOptionFilterKey: string,
    currentOption: KpFilterOption,
  ): KpFilterOption[] {
    const previousOptionIndex = currentOptions.findIndex((item) => item.filterKey === previousOptionFilterKey);
    currentOptions.splice(previousOptionIndex, 1, currentOption);
    return [...currentOptions];
  }
}
