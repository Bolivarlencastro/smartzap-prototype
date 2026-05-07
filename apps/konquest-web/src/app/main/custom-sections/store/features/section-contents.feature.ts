import { createFeature, createReducer, on } from '@ngrx/store';
import { LearningObjectType } from '../../models/custom-sections';
import { CONTENT_TABS_MAP, ContentModel, ContentTab, ContentTabType } from '../../models/section-contents';
import { SectionContentsActions } from '../actions';

export interface SectionContentsFeatureState {
  learningObjectType: LearningObjectType;
  tabs: ContentTab[];
  activeTab: ContentTabType;
  items: ContentModel[];
  search: string;
  loading: boolean;
}

export const sectionContentsInitialState: SectionContentsFeatureState = {
  learningObjectType: null,
  tabs: [],
  activeTab: 'learning-object',
  items: [],
  search: null,
  loading: true,
};

export const sectionContentsReducer = createReducer(
  sectionContentsInitialState,

  on(
    SectionContentsActions.init,
    (state, { learningObjectType }): SectionContentsFeatureState => ({
      ...state,
      learningObjectType,
      tabs: CONTENT_TABS_MAP[learningObjectType],
    }),
  ),

  on(
    SectionContentsActions.setData,
    (state, { items }): SectionContentsFeatureState => ({
      ...state,
      items,
      loading: false,
    }),
  ),

  on(
    SectionContentsActions.setSearch,
    (state, { search }): SectionContentsFeatureState => ({
      ...state,
      search,
      loading: true,
    }),
  ),

  on(
    SectionContentsActions.setTab,
    (state, { tab }): SectionContentsFeatureState => ({
      ...state,
      activeTab: tab,
      search: null,
      loading: true,
    }),
  ),

  on(SectionContentsActions.reset, (): SectionContentsFeatureState => sectionContentsInitialState),
);

export const sectionContentsFeature = createFeature({
  name: 'sectionContents',
  reducer: sectionContentsReducer,
});
