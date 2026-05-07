import { ImportCheckModel, ImportStatus, MissionInformationDate, UsersImported } from '@app/main/mission/mission.model';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ImportListViewMode, ImportListViewModel } from '../../models/import-list';
import { ImportListActions } from '../actions';

export interface ImportListFeatureState {
  eventId: string;
  dates: MissionInformationDate[];
  selectedDateId: string;
  viewMode: ImportListViewMode;
  loading: boolean;
  importData: ImportCheckModel;
}

export const importListInitialState: ImportListFeatureState = {
  eventId: null,
  dates: [],
  selectedDateId: null,
  viewMode: 'select',
  loading: false,
  importData: null,
};

export const importListReducer = createReducer(
  importListInitialState,

  on(
    ImportListActions.init,
    (state, { eventId, dates }): ImportListFeatureState => ({
      ...state,
      eventId,
      dates,
    }),
  ),

  on(
    ImportListActions.selectFileOnInit,
    (state, { selectedDateId }): ImportListFeatureState => ({
      ...state,
      selectedDateId,
      loading: true,
    }),
  ),

  on(
    ImportListActions.checkImportFile,
    (state): ImportListFeatureState => ({
      ...state,
      loading: true,
    }),
  ),

  on(
    ImportListActions.checkImportFileSuccess,
    (state, { importData }): ImportListFeatureState => ({
      ...state,
      importData,
      loading: false,
      viewMode: 'import-success',
    }),
  ),

  on(
    ImportListActions.checkImportFileFailure,
    (state): ImportListFeatureState => ({
      ...state,
      loading: false,
      viewMode: 'import-error',
    }),
  ),

  on(
    ImportListActions.continueImport,
    (state): ImportListFeatureState => ({
      ...state,
      viewMode: 'import-confirmation',
    }),
  ),

  on(ImportListActions.reset, (): ImportListFeatureState => importListInitialState),
);

export const importListFeature = createFeature({
  name: 'importList',
  reducer: importListReducer,
  extraSelectors: ({ selectViewMode, selectLoading, selectImportData, selectDates }) => ({
    selectViewModel: createSelector(
      selectViewMode,
      selectLoading,
      selectImportData,
      selectDates,
      (viewMode, loading, importData, dates): ImportListViewModel => ({
        viewMode,
        dates,
        loading,
        importData,
        importDataSource: buildDataSource(importData),
      }),
    ),
  }),
});

function buildDataSource(importData: ImportCheckModel): UsersImported[] {
  const users: UsersImported[] = [];
  if (importData) {
    const { enrolled, registered, not_registered } = importData;

    enrolled.forEach((user) => {
      users.push({ ...user, status: ImportStatus.ENROLLED });
    });

    registered.forEach((user) => {
      users.push({ ...user, status: ImportStatus.REGISTERED });
    });

    not_registered.forEach((user) => {
      users.push({ ...user, status: ImportStatus.NOT_REGISTERED });
    });
  }

  return users;
}
