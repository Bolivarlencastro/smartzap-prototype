import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { BannersActions } from '../actions';
import { BannerModel, BannersViewModel } from '../../models/banners';

export interface BannersFeatureState {
  banners: BannerModel[];
  loading: boolean;
}

export const bannersInitialState: BannersFeatureState = {
  banners: null,
  loading: true,
};

export const bannersReducer = createReducer(
  bannersInitialState,

  on(
    BannersActions.loadBannersSuccess,
    (state, { banners }): BannersFeatureState => ({
      ...state,
      banners,
      loading: false,
    }),
  ),

  on(
    BannersActions.loadBannersFailure,
    (state): BannersFeatureState => ({
      ...state,
      loading: false,
    }),
  ),
);

export const bannersFeature = createFeature({
  name: 'banners',
  reducer: bannersReducer,
  extraSelectors: ({ selectBanners, selectLoading }) => ({
    selectViewModel: createSelector(
      selectBanners,
      selectLoading,
      (banners, loading): BannersViewModel => ({ banners, loading }),
    ),
  }),
});
