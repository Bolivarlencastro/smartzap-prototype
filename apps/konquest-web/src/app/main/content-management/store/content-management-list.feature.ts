import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ContentManagementListActions } from './actions';
import { LearnContentListFilter, LearnContentManagementType } from '../models/learn-content-list-filter';
import { LearnContentListItem } from '../models/learn-content-list-item';
import { LearnContentListItemActionsBuilder } from '../management-actions/learn-content-list-item-actions.builder';
import { LearnContentListItemDirectorFactory } from '../management-actions/learn-content-list-item-director.factory';

const ACTIONS_BUILDER = new LearnContentListItemActionsBuilder();

export interface ContentManagementListFeatureState extends EntityState<LearnContentListItem> {
  isLoading: boolean;
  contentType: LearnContentManagementType | undefined;
  totalItems: number;
  filter: LearnContentListFilter;
  forceFilterOnlyManaged: boolean;
}

const adapter = createEntityAdapter<LearnContentListItem>();

const contentManagementInitialState: ContentManagementListFeatureState = adapter.getInitialState({
  isLoading: false,
  contentType: undefined,
  totalItems: 0,
  filter: { page: 1, per_page: 10 },
  forceFilterOnlyManaged: false,
});

const reducer = createReducer(
  contentManagementInitialState,

  on(
    ContentManagementListActions.loadLearnContentsByType,
    (_state, { contentType, forceFilterOnlyManaged }): ContentManagementListFeatureState => ({
      ...contentManagementInitialState,
      contentType,
      isLoading: true,
      forceFilterOnlyManaged,
    }),
  ),

  on(ContentManagementListActions.loadLearnContents, (state): ContentManagementListFeatureState => {
    return { ...state, isLoading: true };
  }),

  on(ContentManagementListActions.loadLearnContentsSuccess, (state, { result }): ContentManagementListFeatureState => {
    return adapter.setAll(result.items, { ...state, isLoading: false, totalItems: result.total });
  }),

  on(ContentManagementListActions.loadLearnContentsFailure, (state): ContentManagementListFeatureState => {
    return { ...state, isLoading: false };
  }),

  on(ContentManagementListActions.setFilter, (state, { filter }): ContentManagementListFeatureState => {
    return { ...state, filter: { ...state.filter, ...filter, page: 1 } };
  }),

  on(ContentManagementListActions.setPagination, (state, { page, perPage }): ContentManagementListFeatureState => {
    return { ...state, filter: { ...state.filter, page, per_page: perPage } };
  }),

  on(ContentManagementListActions.removeItemActionResult, (state, { id }): ContentManagementListFeatureState => {
    return adapter.removeOne(id, state);
  }),

  on(ContentManagementListActions.updateItemActionResult, (state, { update }): ContentManagementListFeatureState => {
    return adapter.updateOne(update, state);
  }),

  on(ContentManagementListActions.resetState, (): ContentManagementListFeatureState => contentManagementInitialState),
);

export const contentManagementListFeature = createFeature({
  name: 'learnContentManagement',
  reducer,
  extraSelectors: ({ selectLearnContentManagementState, selectContentType, selectForceFilterOnlyManaged }) => ({
    selectItems: createSelector(
      adapter.getSelectors(selectLearnContentManagementState).selectAll,
      selectContentType,
      selectForceFilterOnlyManaged,
      (items, contentType, filteringOnlyManaged) => setItemsActions(items, contentType, filteringOnlyManaged),
    ),
  }),
});

function setItemsActions(
  items: LearnContentListItem[],
  contentType: LearnContentManagementType,
  forceFilterOnlyManaged: boolean,
): LearnContentListItem[] {
  if (!items?.length) {
    return [];
  }
  const director = LearnContentListItemDirectorFactory.getDirector(contentType, forceFilterOnlyManaged);

  return items.map((item) => {
    director.construct(ACTIONS_BUILDER, item);
    const itemActions = ACTIONS_BUILDER.build();
    return { ...item, actions: itemActions };
  });
}
