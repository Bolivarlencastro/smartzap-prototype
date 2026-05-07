import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import {
  BannerMode,
  BannersApiResponse,
  BannerSettingsViewModel,
  LearningResource,
} from '../../models/banner-settings';
import { BannerSettingsActions } from '../actions';

export interface BannerSettingsFeatureState {
  savedMode: BannerMode;
  mode: BannerMode;
  customSettings: BannersApiResponse;
  initialLoading: boolean;
  internalContents: LearningResource[];
}

export const bannerSettingsInitialState: BannerSettingsFeatureState = {
  savedMode: null,
  mode: null,
  customSettings: null,
  initialLoading: true,
  internalContents: [],
};

export const bannerSettingsReducer = createReducer(
  bannerSettingsInitialState,

  on(
    BannerSettingsActions.setInitialSettings,
    (state, { data }): BannerSettingsFeatureState => ({
      ...state,
      ...data,
      savedMode: data.mode,
      initialLoading: false,
    }),
  ),

  on(
    BannerSettingsActions.setMode,
    (state, { mode }): BannerSettingsFeatureState => ({
      ...state,
      mode,
    }),
  ),

  on(
    BannerSettingsActions.saveRecommendationModeSuccess,
    (state): BannerSettingsFeatureState => ({
      ...state,
      savedMode: 'RECOMMENDATION',
      customSettings: null,
    }),
  ),

  on(
    BannerSettingsActions.loadInternalContentsSuccess,
    (state, { internalContents }): BannerSettingsFeatureState => ({
      ...state,
      internalContents,
    }),
  ),

  on(BannerSettingsActions.reset, (): BannerSettingsFeatureState => bannerSettingsInitialState),
);

export const bannerSettingsFeature = createFeature({
  name: 'bannerSettings',
  reducer: bannerSettingsReducer,
  extraSelectors: ({
    selectMode,
    selectSavedMode,
    selectCustomSettings,
    selectInitialLoading,
    selectInternalContents,
  }) => ({
    selectViewModel: createSelector(
      selectMode,
      selectSavedMode,
      selectCustomSettings,
      selectInitialLoading,
      selectInternalContents,
      (mode, savedMode, customSettings, initialLoading, internalContents): BannerSettingsViewModel => ({
        mode,
        savedMode,
        customSettings,
        initialLoading,
        internalContents,
      }),
    ),
  }),
});
