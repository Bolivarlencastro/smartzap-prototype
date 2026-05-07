import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { JobManagementActions } from '.';
import { JobEnum, JobModel } from '../models';

export interface JobManagementFeature extends EntityState<JobModel> {
  loading: boolean;
  searchTerm: string;
  item: JobModel;
  activeTab: JobEnum;
}

export const jobManagementAdapter = createEntityAdapter<JobModel>();

export const jobManagementInitialState: JobManagementFeature = jobManagementAdapter.getInitialState({
  loading: false,
  searchTerm: '',
  item: null,
  activeTab: JobEnum.JOB_POSITION,
});

export const jobManagementReducer = createReducer(
  jobManagementInitialState,

  on(JobManagementActions.loadItems, (state): JobManagementFeature => {
    return jobManagementAdapter.removeAll({ ...state, loading: true });
  }),

  on(JobManagementActions.loadItemsSuccess, (state, { response }): JobManagementFeature => {
    return jobManagementAdapter.setAll(response || [], {
      ...state,
      loading: false,
    });
  }),

  on(JobManagementActions.loadItemsFailure, (state): JobManagementFeature => {
    return { ...state, loading: false };
  }),

  on(JobManagementActions.openDialog, (state, { item }): JobManagementFeature => {
    return { ...state, item };
  }),

  on(JobManagementActions.dialogClosed, (state): JobManagementFeature => {
    return { ...state, item: null };
  }),

  on(JobManagementActions.changeTab, (state, { tab }): JobManagementFeature => {
    return { ...state, activeTab: tab };
  }),

  on(JobManagementActions.updateSearchTerm, (state, { searchTerm }): JobManagementFeature => {
    return { ...state, searchTerm };
  }),

  on(JobManagementActions.resetState, (): JobManagementFeature => jobManagementInitialState),
);

export const jobManagementFeature = createFeature({
  name: 'jobManagement',
  reducer: jobManagementReducer,
  extraSelectors: ({ selectJobManagementState, selectActiveTab, selectItem }) => ({
    ...jobManagementAdapter.getSelectors(selectJobManagementState),
    selectTabs: createSelector(() => [
      { title: 'JOB_MANAGEMENT.JOB_POSITIONS', value: JobEnum.JOB_POSITION },
      { title: 'JOB_MANAGEMENT.JOB_FUNCTIONS', value: JobEnum.JOB_FUNCTION },
    ]),
    selectAddJobButtonLabel: createSelector(selectActiveTab, (tab) => {
      return tab === JobEnum.JOB_FUNCTION
        ? 'JOB_MANAGEMENT.ADD_JOB_FUNCTION_BUTTON'
        : 'JOB_MANAGEMENT.ADD_JOB_POSITION_BUTTON';
    }),
    selectTitleDialog: createSelector(selectActiveTab, selectItem, (tab, item) => {
      if (tab === JobEnum.JOB_FUNCTION) {
        return item ? 'JOB_MANAGEMENT.JOB_FUNCTION.EDIT_JOB_FUNCTION' : 'JOB_MANAGEMENT.JOB_FUNCTION.ADD_JOB_FUNCTION';
      } else {
        return item ? 'JOB_MANAGEMENT.JOB_POSITION.EDIT_JOB_POSITION' : 'JOB_MANAGEMENT.JOB_POSITION.ADD_JOB_POSITION';
      }
    }),
    selectDescriptionDialog: createSelector(selectActiveTab, selectItem, (tab, item) => {
      if (item) {
        return 'JOB_MANAGEMENT.EDIT_DIALOG_DESCRIPTION';
      } else {
        return tab === JobEnum.JOB_FUNCTION
          ? 'JOB_MANAGEMENT.JOB_FUNCTION.ADD_DIALOG_DESCRIPTION'
          : 'JOB_MANAGEMENT.JOB_POSITION.ADD_DIALOG_DESCRIPTION';
      }
    }),
    selectPlaceholderDialog: createSelector(selectActiveTab, (tab) => {
      return tab === JobEnum.JOB_FUNCTION
        ? 'JOB_MANAGEMENT.JOB_FUNCTION.PLACEHOLDER'
        : 'JOB_MANAGEMENT.JOB_POSITION.PLACEHOLDER';
    }),
    selectSubmitButtonDialog: createSelector(selectItem, (item) => {
      return item ? 'JOB_MANAGEMENT.EDIT_BUTTON' : 'JOB_MANAGEMENT.ADD_BUTTON';
    }),
    selectEmptyListMessage: createSelector(selectActiveTab, (tab) => {
      return tab === JobEnum.JOB_FUNCTION
        ? 'JOB_MANAGEMENT.JOB_FUNCTION.EMPTY_LIST_MESSAGE'
        : 'JOB_MANAGEMENT.JOB_POSITION.EMPTY_LIST_MESSAGE';
    }),
  }),
});
