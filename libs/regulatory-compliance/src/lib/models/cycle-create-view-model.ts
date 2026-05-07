import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpAutocompleteOption } from '@keeps-platform-frontend-workspace/ui/kp-autocomplete';

export type CycleCreateViewModel = {
  cycle: CycleDto;
  editingCycle: boolean;
  compliances: KpAutocompleteOption[];
  learningObjects: KpAutocompleteOption[];
  jobs: KpAutocompleteOption[];
  jobFunctions: KpAutocompleteOption[];
};
