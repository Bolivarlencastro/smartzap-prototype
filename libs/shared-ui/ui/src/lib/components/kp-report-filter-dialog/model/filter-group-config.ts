import { FilterGroupAutoCompleteSelectComponent } from '../components/value-inputs/filter-group-autocomplete-select/filter-group-autocomplete-select.component';
import { FilterGroupOperator } from './filter-group-operator';
import { FilterGroupSelectOption } from './filter-group-select-option';
import { FilterGroupType } from './filter-group-type';

export interface FilterGroupConfig {
  label: string;
  value: string;
  type: FilterGroupType;
  inUse?: boolean;
  svgIcon?: string;
  icon?: string;
  multiple?: boolean;
  options?: FilterGroupSelectOption[];
  operators?: FilterGroupOperator[];
  disabled?: boolean;
  autocompleteCallback?: (filterValue: string, autoComplete: FilterGroupAutoCompleteSelectComponent) => void;
}
