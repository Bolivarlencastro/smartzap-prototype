import { KpFilterOptionRange } from './kp-filter-option-range';
import { KpFilterOptionType } from './kp-filter-option-type';
import { KpFilterSelectOption } from './kp-filter-select-option';

export interface KpFilterOption {
  label: string;
  /**
   * The string value of the filter object key. Will be used to register the FormControl on the parent FormGroup.
   */
  filterKey: string;
  /**
   * The type of the filter.
   *
   * Autocomplete will register to the formControl value changes and emit them via the valueChanges event.
   * To bind the event use the [structural directive longhand <ng-template> form](https://angular.io/guide/structural-directives#structural-directive-shorthand).
   *
   */
  type: KpFilterOptionType;
  placeholder?: string;
  /**
   * Set this property to match the value defined in the `kpFilterDef` directive on the template, and it will be
   * rendered instead of the default templates when this option is selected.
   */
  customTemplate?: string;
  /**
   * The options displayed in the default select or selectMultiple templates
   */
  options?: KpFilterSelectOption[];
  /**
   * If this option is selected or not.
   */
  selected?: boolean;
  /**
   * Whether the option is disabled or not.
   */
  disabled?: boolean;
  /**
   * Definition for the names of extra formControls that can be registered when using range types (dateRange / numberRange),
   * if provided will render an additional select to refine the filter.
   */
  rangeConfig?: {
    fromKey: string;
    toKey: string;
  };
  /**
   * The currentlySelected rangeType.
   */
  rangeType?: KpFilterOptionRange;
  /**
   * List of available range options to select from, if not provided the default options will be displayed.
   * If provided the first range option will be selected by default when the filter option is selected.
   */
  rangeOptions?: KpFilterOptionRange[];
  /**
   * Settings for a numeric range input
   */
  numericRangeConfig?: {
    /**
     * Mask in the same pattern as the ngx-mask library.
     */
    mask: string;
    startPlaceHolder?: string;
    endPlaceHolder?: string;
    suffix?: string;
    /**
     * Whether the special characters should be maintained.
     */
    keepSpecialCharacters?: boolean;
  };
  /**
   * Determines the minimum and max number of selections for the select multiple and autocomplete option types
   */
  selectionLengthConfig?: {
    min?: number;
    max?: number;
  };
}
