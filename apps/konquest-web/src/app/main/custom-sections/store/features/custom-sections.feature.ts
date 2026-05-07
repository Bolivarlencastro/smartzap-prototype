import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import {
  CustomSectionModel,
  CustomSectionsFeature,
  CustomSectionsViewModel,
  EMPTY_LIST_MESSAGE_MAP,
  PageType,
  SECTION_TYPES_MAP,
} from '../../models/custom-sections';
import { CustomSectionsActions, SectionContentsActions } from '../actions';

export interface CustomSectionsFeatureState {
  pageType: PageType;
  activeFeatures: CustomSectionsFeature[];
  sections: CustomSectionModel[];
  loading: boolean;
}

export const customSectionsInitialState: CustomSectionsFeatureState = {
  pageType: null,
  activeFeatures: [],
  sections: [],
  loading: true,
};

export const customSectionsReducer = createReducer(
  customSectionsInitialState,

  on(
    CustomSectionsActions.setActiveFeatures,
    (state, { activeFeatures }): CustomSectionsFeatureState => ({
      ...state,
      activeFeatures,
      pageType: activeFeatures?.[0]?.id,
    }),
  ),

  on(
    CustomSectionsActions.changePage,
    (state, { pageType }): CustomSectionsFeatureState => ({
      ...state,
      pageType,
      loading: true,
    }),
  ),

  on(
    CustomSectionsActions.setSections,
    (state, { sections }): CustomSectionsFeatureState => ({
      ...state,
      sections,
      loading: false,
    }),
  ),

  on(
    CustomSectionsActions.createSection,
    CustomSectionsActions.editSection,
    SectionContentsActions.save,
    CustomSectionsActions.deleteContent,
    (state): CustomSectionsFeatureState => ({
      ...state,
      loading: true,
    }),
  ),

  on(
    CustomSectionsActions.createSectionFailure,
    CustomSectionsActions.editSectionFailure,
    SectionContentsActions.saveFailure,
    CustomSectionsActions.deleteContentFailure,
    (state): CustomSectionsFeatureState => ({
      ...state,
      loading: false,
    }),
  ),

  on(CustomSectionsActions.reset, (): CustomSectionsFeatureState => customSectionsInitialState),
);

export const customSectionsFeature = createFeature({
  name: 'customSections',
  reducer: customSectionsReducer,
  extraSelectors: ({ selectLoading, selectPageType, selectActiveFeatures, selectSections }) => ({
    selectViewModel: createSelector(
      selectLoading,
      selectPageType,
      selectActiveFeatures,
      selectSections,
      (loading, pageType, activeFeatures, sections): CustomSectionsViewModel => ({
        loading,
        pageType,
        activeFeatures,
        sectionFilter: SECTION_TYPES_MAP[pageType],
        emptyListMessage: EMPTY_LIST_MESSAGE_MAP[pageType],
        sections,
      }),
    ),
  }),
});
