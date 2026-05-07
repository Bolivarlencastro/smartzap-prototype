import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { User } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createFeature, createReducer, on } from '@ngrx/store';
import { Contributor } from '@core/model/contributor.model';
import { ContributorsDialogContentType } from '../models/contributors-dialog-content.type';
import { ContributorDialogActions } from './contributors.actions';

export interface ContributorsFeature extends EntityState<Contributor> {
  filteredContributors: User[];
  contentType: ContributorsDialogContentType | undefined;
  relatedContentId: string | undefined;
}

function selectUserId(entity: Contributor): string {
  return entity.user.id;
}

const adapter = createEntityAdapter<Contributor>({
  selectId: selectUserId,
});

export const contributorsFeatureInitialState: ContributorsFeature = adapter.getInitialState({
  filteredContributors: [],
  relatedContentId: undefined,
  contentType: undefined,
});

const featureReducer = createReducer(
  contributorsFeatureInitialState,
  on(
    ContributorDialogActions.openDialog,
    (state, { contentType, relatedContentId }): ContributorsFeature => ({
      ...state,
      contentType,
      relatedContentId,
    }),
  ),

  on(
    ContributorDialogActions.loadContributorsSuccess,
    (state, { contributors }): ContributorsFeature => adapter.setAll(contributors, state),
  ),

  on(
    ContributorDialogActions.filterContributorsSuccess,
    (state, { users }): ContributorsFeature => ({ ...state, filteredContributors: users }),
  ),

  on(
    ContributorDialogActions.addContributorSuccess,
    (state, { contributor }): ContributorsFeature => adapter.addOne(contributor, state),
  ),

  on(
    ContributorDialogActions.removeContributorSuccess,
    (state, { userId }): ContributorsFeature => adapter.removeOne(userId, state),
  ),

  on(ContributorDialogActions.reset, (): ContributorsFeature => contributorsFeatureInitialState),
);

export const contributorsFeature = createFeature({
  name: 'contributorsDialog',
  reducer: featureReducer,
  extraSelectors: ({ selectContributorsDialogState }) => ({ ...adapter.getSelectors(selectContributorsDialogState) }),
});
