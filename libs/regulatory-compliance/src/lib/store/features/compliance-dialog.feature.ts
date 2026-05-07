import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ComplianceDialogViewModel, ComplianceListItem } from '../../models';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ComplianceDialogActions } from '../actions';

export interface ComplianceDialogFeatureState extends EntityState<ComplianceListItem> {
  currentFormValue: string;
  selectedIds: { [p: string]: string };
  currentPage: number;
  totalItems: number;
  isFinished: boolean;
  filter: string;
  loading: boolean;
}

const adapter = createEntityAdapter<ComplianceListItem>();

export const complianceDialogInitialState: ComplianceDialogFeatureState = adapter.getInitialState({
  selectedIds: {},
  currentPage: 1,
  totalItems: 0,
  isFinished: false,
  filter: '',
  currentFormValue: '',
  loading: true,
});

const featureReducer = createReducer(
  complianceDialogInitialState,

  on(
    ComplianceDialogActions.loadComplianceSuccess,
    (state, { results, totalItems, isFinished }): ComplianceDialogFeatureState =>
      adapter.setAll(results, {
        ...state,
        isFinished,
        totalItems,
        loading: false,
      }),
  ),

  on(ComplianceDialogActions.loadMoreItems, (state): ComplianceDialogFeatureState => {
    if (state.isFinished) {
      return state;
    }

    return { ...state, currentPage: state.currentPage + 1, loading: true };
  }),

  on(
    ComplianceDialogActions.loadMoreItemsSuccess,
    (state, { results, totalItems, isFinished }): ComplianceDialogFeatureState => {
      return adapter.addMany(results, {
        ...state,
        isFinished,
        totalItems,
        loading: false,
      });
    },
  ),

  on(
    ComplianceDialogActions.loadComplianceFailure,
    (state): ComplianceDialogFeatureState => ({
      ...state,
      loading: false,
    }),
  ),

  on(
    ComplianceDialogActions.filterCompliance,
    (state, { filter }): ComplianceDialogFeatureState => ({ ...state, filter, currentPage: 1, loading: true }),
  ),

  on(
    ComplianceDialogActions.saveCompliance,
    (state, { compliance }): ComplianceDialogFeatureState => ({
      ...state,
      currentFormValue: !compliance.id ? compliance.name : '',
    }),
  ),

  on(
    ComplianceDialogActions.addComplianceSuccess,
    (state, { compliance }): ComplianceDialogFeatureState =>
      adapter.addOne(compliance, {
        ...state,
        currentFormValue: '',
      }),
  ),

  on(
    ComplianceDialogActions.editComplianceSuccess,
    (state, { payload }): ComplianceDialogFeatureState => adapter.updateOne(payload, { ...state }),
  ),

  on(ComplianceDialogActions.deleteComplianceSuccess, (state, { id }): ComplianceDialogFeatureState => {
    const selectedIds = { ...state.selectedIds };
    delete selectedIds[id];
    return adapter.removeOne(id, { ...state, selectedIds, totalItems: state.totalItems - 1 });
  }),

  on(ComplianceDialogActions.batchDeleteSuccess, (state): ComplianceDialogFeatureState => {
    const selectedIds = Object.keys(state.selectedIds);
    return adapter.removeMany(selectedIds, { ...state, selectedIds: {} });
  }),

  on(ComplianceDialogActions.toggleSelectCompliance, (state, { id, selected }): ComplianceDialogFeatureState => {
    const selectedIds = { ...state.selectedIds };

    if (selected) {
      selectedIds[id] = id;
    } else {
      delete selectedIds[id];
    }

    return adapter.updateOne({ id, changes: { selected } }, { ...state, selectedIds });
  }),

  on(ComplianceDialogActions.updateAllItemsSelection, (state, { selected, payload }): ComplianceDialogFeatureState => {
    let selectedIds = { ...state.selectedIds };

    if (selected) {
      for (const update of payload) {
        const id: string = update.id as string;
        selectedIds[id] = id;
      }
    } else {
      selectedIds = {};
    }

    return adapter.updateMany(payload, { ...state, selectedIds });
  }),

  on(ComplianceDialogActions.reset, (): ComplianceDialogFeatureState => complianceDialogInitialState),
);

export const complianceDialogFeature = createFeature({
  name: 'complianceDialog',
  reducer: featureReducer,
  extraSelectors: ({
    selectComplianceDialogState,
    selectSelectedIds,
    selectFilter,
    selectTotalItems,
    selectCurrentFormValue,
    selectLoading,
  }) => ({
    ...adapter.getSelectors(selectComplianceDialogState),
    selectSelectIdsArray: createSelector(selectSelectedIds, (selectedIds) => Object.keys(selectedIds)),
    selectDialogViewModel: createSelector(
      adapter.getSelectors(selectComplianceDialogState).selectAll,
      selectFilter,
      selectSelectedIds,
      selectTotalItems,
      selectCurrentFormValue,
      selectLoading,
      (items, filter, selectedIds, totalItems, currentFormValue, isLoading): ComplianceDialogViewModel => ({
        listItems: items,
        filter,
        itemsTotal: totalItems,
        selectedTotal: Object.keys(selectedIds).length,
        normativeInputValue: currentFormValue,
        isLoading,
      }),
    ),
  }),
});
