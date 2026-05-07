import { FormControl } from '@angular/forms';
import { KpAutocompleteOption } from '@keeps-platform-frontend-workspace/ui/kp-autocomplete';
import { CyclePeriodType } from '@keeps-platform-frontend-workspace/kp-keeps';

export * from './compliance';
export * from './compliance-dialog-view-model';
export * from './cycle-management';
export * from './cycles-list-models';

export type CycleLearningObjectType = 'trail' | 'mission';

export type CycleCreateFilterType = 'compliances' | 'learningObjects';
export type CycleCreateFilter = { type: CycleCreateFilterType; search: string };

export type CycleCreateForm = {
  duration: number;
  periodType: CyclePeriodType;
  description: string;
  compliance: KpAutocompleteOption | string;
  learningObject: KpAutocompleteOption | string;
  jobIds: string[];
  jobFunctionIds: string[];
};

export interface CycleCreateFormGroup {
  duration: FormControl<number>;
  periodType: FormControl<CyclePeriodType>;
  description: FormControl<string>;
  compliance: FormControl<KpAutocompleteOption | string>;
  learningObject: FormControl<KpAutocompleteOption | string>;
  jobIds: FormControl<string[]>;
  jobFunctionIds: FormControl<string[]>;
}
