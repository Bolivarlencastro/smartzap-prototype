import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { LearningTrailFilter } from 'app/main/learning-trail/model/learning-trail';
import { createReducer, on } from '@ngrx/store';
import { CollectionActions } from '../actions';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { QuickFilterType } from '@keeps-platform-frontend-workspace/ui/kp-filter';

export const featureKey = 'learningTrailsCollection';

export interface LearningTrailsCollectionState extends EntityState<LearnContentCardData> {
  isLoading: boolean;
  count: number | undefined;
  finished: boolean;
  filter: LearningTrailFilter;
  quickFilterType: QuickFilterType;
}

export const learningTrailsCollectionAdapter: EntityAdapter<LearnContentCardData> =
  createEntityAdapter<LearnContentCardData>({ selectId: (item) => item.contentId });

export const learningTrailsCollectionInitialState: LearningTrailsCollectionState =
  learningTrailsCollectionAdapter.getInitialState({
    isLoading: false,
    finished: false,
    count: undefined,
    filter: { page: 1, per_page: 30, is_active: true },
    quickFilterType: QuickFilterType.LEARNING_TRAILS,
  });

export const reducer = createReducer(
  learningTrailsCollectionInitialState,

  on(CollectionActions.filterLearningTrails, (state, { filter, newQuickFilterType }): LearningTrailsCollectionState => {
    return {
      ...state,
      filter: { ...state.filter, ...filter, page: 1 },
      quickFilterType: newQuickFilterType || state.quickFilterType,
    };
  }),

  on(CollectionActions.loadLearningTrails, (state): LearningTrailsCollectionState => {
    return learningTrailsCollectionAdapter.removeAll({
      ...state,
      isLoading: true,
    });
  }),

  on(CollectionActions.loadLearningTrailsSuccess, (state, { payload }): LearningTrailsCollectionState => {
    const { count, finished, results } = payload;

    return learningTrailsCollectionAdapter.setAll(results || [], {
      ...state,
      isLoading: false,
      count: count,
      finished,
    });
  }),

  on(
    CollectionActions.fetchMoreLearningTrails,
    (state): LearningTrailsCollectionState => ({ ...state, isLoading: !state.finished }),
  ),

  on(CollectionActions.fetchMoreLearningTrailsSuccess, (state, { payload }): LearningTrailsCollectionState => {
    const { count, finished, results } = payload;

    return learningTrailsCollectionAdapter.addMany(results || [], {
      ...state,
      isLoading: false,
      count: count,
      finished,
      filter: { ...state.filter, page: state.filter.page && state.filter.page + 1 },
    });
  }),

  on(
    CollectionActions.loadLearningTrailsFailure,
    (state): LearningTrailsCollectionState => ({ ...state, isLoading: false }),
  ),

  on(CollectionActions.removeTrail, (state, { trailId }): LearningTrailsCollectionState => {
    return learningTrailsCollectionAdapter.removeOne(trailId, { ...state, count: Math.max((state.count || 0) - 1, 0) });
  }),

  on(
    CollectionActions.resetCollectionState,
    (): LearningTrailsCollectionState =>
      learningTrailsCollectionAdapter.removeAll(learningTrailsCollectionInitialState),
  ),
);

export const { selectAll } = learningTrailsCollectionAdapter.getSelectors();
