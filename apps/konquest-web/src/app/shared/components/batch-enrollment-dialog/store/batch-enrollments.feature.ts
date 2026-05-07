import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import * as BatchEnrollmentActions from './batch-enrollment.actions';
import { BatchEnrollmentType } from 'app/shared/services/batch-enrollment.service';
import { BatchEnrollmentFilter, BatchEnrollmentViewMode } from '../models';
import { BatchEnrollmentDialogViewModel } from 'app/shared/components/batch-enrollment-dialog/batch-enrollment-dialog-view-model';
import { EnrollmentConfig } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { BasicUserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface BatchEnrollmentsState extends EntityState<BasicUserProfile> {
  selectedIds: Record<string, string>;
  notFounds: string[];
  isLoading: boolean;
  totalItems: number;
  isFinished: boolean;
  isProcessing: boolean;
  filter: BatchEnrollmentFilter;
  enrollmentType: BatchEnrollmentType | undefined;
  learningContentId: string | undefined;
  viewMode: BatchEnrollmentViewMode;
  hasCreatedEnrollments: boolean;
  enrollmentErrors: number;
  enrollmentConfig: EnrollmentConfig | undefined;
  remainingSeats: number;
}

export const adapter: EntityAdapter<BasicUserProfile> = createEntityAdapter<BasicUserProfile>();

export const batchEnrollmentsInitialState: BatchEnrollmentsState = adapter.getInitialState({
  totalItems: 0,
  isLoading: true,
  isFinished: false,
  isProcessing: false,
  filter: {
    page: 0,
  },
  selectedIds: {},
  notFounds: [],
  enrollmentType: undefined,
  learningContentId: undefined,
  viewMode: 'list',
  hasCreatedEnrollments: false,
  enrollmentErrors: 0,
  enrollmentConfig: undefined,
  remainingSeats: null,
});

const featureReducer = createReducer(
  batchEnrollmentsInitialState,

  on(
    BatchEnrollmentActions.openDialog,
    (state, { learningContentId, enrollmentType, remainingSeats }): BatchEnrollmentsState => {
      return { ...state, learningContentId, enrollmentType, remainingSeats };
    },
  ),

  on(
    BatchEnrollmentActions.loadUsersSuccess,
    (state, { results, totalItems, isFinished, concatResults }): BatchEnrollmentsState => {
      if (concatResults) {
        return adapter.addMany(results, { ...state, isFinished, totalItems, isLoading: false });
      }

      return adapter.setAll(results, { ...state, isFinished, totalItems, isLoading: false });
    },
  ),

  on(BatchEnrollmentActions.filterUsers, (state, { filter }): BatchEnrollmentsState => {
    const updatedFilter: BatchEnrollmentFilter = structuredClone(state.filter);
    updatedFilter.page = 1;
    updatedFilter.search = filter;

    return adapter.removeAll({ ...state, filter: updatedFilter, isLoading: true });
  }),

  on(BatchEnrollmentActions.loadMoreUsers, (state): BatchEnrollmentsState => {
    if (state.isFinished) {
      return state;
    }

    const updatedFilter: BatchEnrollmentFilter = structuredClone(state.filter);
    updatedFilter.page++;

    return { ...state, filter: updatedFilter, isLoading: true };
  }),

  on(BatchEnrollmentActions.parseUsersSuccess, (state, { notFounds }): BatchEnrollmentsState => {
    return {
      ...state,
      notFounds,
      isLoading: false,
      viewMode: notFounds.length ? 'notFound' : 'list',
    };
  }),

  on(BatchEnrollmentActions.batchEnrollment, (state): BatchEnrollmentsState => {
    return { ...state, isProcessing: true };
  }),

  on(
    BatchEnrollmentActions.batchEnrollmentSuccess,
    (state, { enrollmentErrors }): BatchEnrollmentsState => ({
      ...state,
      enrollmentErrors,
      hasCreatedEnrollments: true,
      viewMode: 'finish',
    }),
  ),

  on(
    BatchEnrollmentActions.batchEnrollmentSuccess,
    BatchEnrollmentActions.batchEnrollmentFailure,
    (state): BatchEnrollmentsState => {
      return { ...state, isProcessing: false };
    },
  ),

  on(
    BatchEnrollmentActions.parseUsersFailure,
    BatchEnrollmentActions.batchEnrollmentFailure,
    (state): BatchEnrollmentsState => {
      return { ...state, isLoading: false };
    },
  ),

  on(BatchEnrollmentActions.toggleSelectUser, (state, { id }): BatchEnrollmentsState => {
    const selectedIds = { ...state.selectedIds };

    if (selectedIds[id]) {
      delete selectedIds[id];
    } else {
      selectedIds[id] = id;
    }

    return { ...state, selectedIds };
  }),

  on(
    BatchEnrollmentActions.setSelection,
    (state, { selectedIds }): BatchEnrollmentsState => ({ ...state, selectedIds }),
  ),

  on(
    BatchEnrollmentActions.addToSelection,
    (state, { ids }): BatchEnrollmentsState => ({
      ...state,
      selectedIds: { ...state.selectedIds, ...ids },
    }),
  ),

  on(BatchEnrollmentActions.setEnrollmentConfig, (state, { config }): BatchEnrollmentsState => {
    return { ...state, enrollmentConfig: config };
  }),

  on(BatchEnrollmentActions.changeViewMode, (state, { viewMode }): BatchEnrollmentsState => {
    return { ...state, viewMode };
  }),

  on(
    BatchEnrollmentActions.backToEnrollList,
    ({ learningContentId, enrollmentType, hasCreatedEnrollments, enrollmentConfig }): BatchEnrollmentsState => {
      return {
        ...batchEnrollmentsInitialState,
        learningContentId,
        enrollmentType,
        hasCreatedEnrollments,
        enrollmentConfig,
        isLoading: false,
      };
    },
  ),

  on(BatchEnrollmentActions.resetState, (): BatchEnrollmentsState => {
    return batchEnrollmentsInitialState;
  }),
);
export const batchEnrollmentFeature = createFeature({
  name: 'batchEnrollment',
  reducer: featureReducer,
  extraSelectors: ({
    selectBatchEnrollmentState,
    selectIsLoading,
    selectIsProcessing,
    selectSelectedIds,
    selectTotalItems,
    selectViewMode,
    selectEnrollmentConfig,
    selectNotFounds,
    selectEnrollmentErrors,
    selectEnrollmentType,
    selectRemainingSeats,
  }) => ({
    ...adapter.getSelectors(selectBatchEnrollmentState),
    selectViewModel: createSelector(
      adapter.getSelectors(selectBatchEnrollmentState).selectAll,
      selectTotalItems,
      selectIsLoading,
      selectIsProcessing,
      selectSelectedIds,
      selectViewMode,
      selectEnrollmentConfig,
      selectNotFounds,
      selectEnrollmentErrors,
      selectEnrollmentType,
      selectRemainingSeats,
      (
        users,
        totalItems,
        isLoading,
        isProcessing,
        selectedIds,
        viewMode,
        enrollmentConfig,
        notFounds,
        enrollmentErrors,
        type,
        remainingSeats,
      ): BatchEnrollmentDialogViewModel => {
        const totalSelected = Object.keys(selectedIds).length;
        const reachedLimitSeats = remainingSeats ? totalSelected > remainingSeats : false;
        const commonConditionToDisableSubmit = !totalSelected || isProcessing || reachedLimitSeats;
        return {
          users,
          isLoading,
          isProcessing,
          viewMode,
          totalItems,
          selectedIds,
          enrollmentConfig,
          submitDisabled:
            type === 'event'
              ? commonConditionToDisableSubmit
              : !enrollmentConfig?.date || commonConditionToDisableSubmit,
          notFounds,
          selectionSize: Object.keys(selectedIds).length || 0,
          successfullyEnrolledTotal: (Object.keys(selectedIds).length || 0) - enrollmentErrors,
          type,
          reachedLimitSeats,
          remainingSeats,
        };
      },
    ),
  }),
});
