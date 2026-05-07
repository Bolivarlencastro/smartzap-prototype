import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CycleCreateActions } from '../actions';
import { KpAutocompleteOption } from '@keeps-platform-frontend-workspace/ui/kp-autocomplete';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface CycleCreateFeatureState {
  cycle: CycleDto | undefined;
  jobs: KpAutocompleteOption[];
  jobFunctions: KpAutocompleteOption[];
  compliances: KpAutocompleteOption[];
  learningObjects: KpAutocompleteOption[];
}

export const cycleCreateInitialState: CycleCreateFeatureState = {
  cycle: undefined,
  jobs: [],
  jobFunctions: [],
  compliances: [],
  learningObjects: [],
};

export const normativeCycleReducer = createReducer(
  cycleCreateInitialState,

  on(
    CycleCreateActions.loadCycleForEditionSuccess,
    (state, { cycle }): CycleCreateFeatureState => ({ ...state, cycle }),
  ),

  on(
    CycleCreateActions.loadJobsAndFunctionsSuccess,
    (state, { jobs, jobFunctions }): CycleCreateFeatureState => ({ ...state, jobs, jobFunctions }),
  ),

  on(CycleCreateActions.filterItemsSuccess, (state, { searchType, results }): CycleCreateFeatureState => {
    return { ...state, [searchType]: results };
  }),

  on(CycleCreateActions.resetState, () => cycleCreateInitialState),
);

export const cycleCreateFeature = createFeature({
  name: 'cycleCreate',
  reducer: normativeCycleReducer,
  extraSelectors: ({ selectCycle, selectCompliances, selectLearningObjects, selectJobs, selectJobFunctions }) => ({
    selectViewModel: createSelector(
      selectCycle,
      selectCompliances,
      selectJobs,
      selectJobFunctions,
      selectLearningObjects,
      (cycle, compliances, jobs, jobFunctions, learningObjects) => ({
        cycle,
        compliances,
        jobs,
        jobFunctions,
        learningObjects,
        editingCycle: !!cycle?.id,
      }),
    ),
  }),
});
