import { FormArray, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FilterGroupConnector } from './filter-group-connector';
import { FilterGroupOperator } from './filter-group-operator';

export type DialogForm = { filters: FormArray<FormGroup<FilterFormGroup>> };

export type FilterFormGroup = {
  connector: FormControl<FilterGroupConnector>;
  selector: FormControl<string>;
  operator: FormControl<FilterGroupOperator>;
  value: UntypedFormControl | UntypedFormGroup;
};

export type FilterValue = FilterGroupValue[];

export type FilterGroupValue = {
  connector: FilterGroupConnector;
  selector: string;
  operator: FilterGroupOperator;
  value: any;
};
