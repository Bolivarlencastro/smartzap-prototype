import { CustomSectionModel, LearningObjectType } from '@app/main/custom-sections/models/custom-sections';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { SectionContentActions, SectionContentItemActions } from 'app/main/section-contents/store/actions';
import { selectIsAdmin, selectIsSuperAdmin } from 'app/shared/store/selectors/user-profile.selectors';
import { SectionContentViewModel } from '../models/section-content-view-model';
import { SECTION_FILTER_TYPE_MAP, SectionContentsFilter } from '../models/section-contents-filter';
import { SECTION_CONTENT_TYPE } from '../models/section-contents-type';
import { SectionContentActionsBuilder } from '../section-contents-actions/section-content-actions.builder';
import { SectionContentItemActionDirectorFactory } from '../section-contents-actions/section-content-item-action-director.factory';
import { SectionContentItemTagDirectorFactory } from '../section-contents-tags/section-content-item-tag-director.factory';
import { SectionContentTagsBuilder } from '../section-contents-tags/section-content-tags.builder';

const ACTIONS_BUILDER = new SectionContentActionsBuilder();
const TAGS_BUILDER = new SectionContentTagsBuilder();

export interface SectionContentsFeatureState extends EntityState<LearnContentCardData> {
  section: CustomSectionModel;
  contentType: SECTION_CONTENT_TYPE;
  loading: boolean;
  filter: SectionContentsFilter;
  finished: boolean;
}

const adapter = createEntityAdapter<LearnContentCardData>({
  selectId: (entity) => entity.contentId,
});

const sectionContentsInitialState: SectionContentsFeatureState = adapter.getInitialState({
  section: null,
  contentType: null,
  loading: true,
  filter: { page: 1, per_page: 25 },
  finished: false,
});

const reducer = createReducer(
  sectionContentsInitialState,

  on(SectionContentActions.setInitialConfig, (state, { section, contentType }): SectionContentsFeatureState => {
    return { ...state, section, contentType };
  }),

  on(
    SectionContentActions.loadSectionContents,
    (state): SectionContentsFeatureState =>
      adapter.removeAll({ ...state, loading: true, filter: { ...state.filter, page: 1 } }),
  ),

  on(SectionContentActions.loadSectionContentsSuccess, (state, { result }): SectionContentsFeatureState => {
    const finished = result.last_page === result.page;
    return adapter.setAll(result.items, { ...state, loading: false, finished });
  }),

  on(SectionContentActions.loadMoreSectionContents, (state): SectionContentsFeatureState => {
    if (state.finished) {
      return state;
    }

    return { ...state, loading: true, filter: { ...state.filter, page: state.filter.page + 1 } };
  }),

  on(SectionContentActions.loadMoreSectionContentsSuccess, (state, { result }): SectionContentsFeatureState => {
    const finished = result.last_page === result.page;
    return adapter.addMany(result.items, {
      ...state,
      loading: false,
      finished,
    });
  }),

  on(
    SectionContentActions.loadSectionContentsFailure,
    SectionContentActions.loadMoreSectionContentsFailure,
    (state): SectionContentsFeatureState => ({ ...state, loading: false }),
  ),

  on(
    SectionContentActions.filter,
    (state, { filter }): SectionContentsFeatureState => ({ ...state, filter: { ...state.filter, ...filter } }),
  ),

  on(SectionContentItemActions.updateItemActionResult, (state, { update }): SectionContentsFeatureState => {
    return adapter.updateOne(update, state);
  }),

  on(SectionContentActions.resetState, (): SectionContentsFeatureState => sectionContentsInitialState),
);

export const sectionContentsFeature = createFeature({
  name: 'sectionContentsPage',
  reducer,
  extraSelectors: ({ selectSectionContentsPageState, selectContentType, selectSection, selectLoading }) => ({
    selectSectionId: createSelector(selectSection, (section) => section?.id),
    selectViewModel: createSelector(
      adapter.getSelectors(selectSectionContentsPageState).selectAll,
      selectContentType,
      selectLoading,
      selectSection,
      selectIsAdmin,
      selectIsSuperAdmin,
      (items, contentType, loading, section, isAdmin, isSuperAdmin): SectionContentViewModel => {
        const isLearningTrail = contentType === SECTION_CONTENT_TYPE.TRAILS;
        const typesWithoutSetActionsAndTags: LearningObjectType[] = ['COURSE.ALL', 'LEARNING_TRAIL.ALL'];

        const contents = typesWithoutSetActionsAndTags.includes(section?.learning_object_type)
          ? items
          : setItemActionsAndTags(items, contentType, isAdmin, isSuperAdmin);
        const gridClass = isLearningTrail ? 'trails-grid' : 'courses-grid';
        const orientation = isLearningTrail ? 'landscape' : 'portrait';
        const webLoaderTheme = isLearningTrail
          ? { 'border-radius': '12px', height: '230px', width: '409px' }
          : { 'border-radius': '12px', height: '426px', width: '240px' };
        const mobileLoaderTheme = isLearningTrail
          ? { 'border-radius': '12px', height: '188px', width: '344px' }
          : { 'border-radius': '12px', height: '288px', width: '162px' };
        const filterType = SECTION_FILTER_TYPE_MAP[section?.learning_object_type];

        return {
          contents,
          gridClass,
          orientation,
          loading,
          webLoaderTheme,
          mobileLoaderTheme,
          filterType,
          contentType,
        };
      },
    ),
  }),
});

function setItemActionsAndTags(
  items: LearnContentCardData[],
  contentType: SECTION_CONTENT_TYPE,
  isAdmin: boolean,
  isSuperAdmin: boolean,
): LearnContentCardData[] {
  if (!items?.length) {
    return [];
  }

  const actionsDirector = SectionContentItemActionDirectorFactory.getDirector(contentType);
  const tagsDirector = SectionContentItemTagDirectorFactory.getDirector(contentType);
  return items.map((item) => {
    actionsDirector.construct(ACTIONS_BUILDER, item, isAdmin, isSuperAdmin);
    tagsDirector.construct(TAGS_BUILDER, item, isAdmin, isSuperAdmin);
    return { ...item, actions: ACTIONS_BUILDER.build(), tags: TAGS_BUILDER.build() };
  });
}
