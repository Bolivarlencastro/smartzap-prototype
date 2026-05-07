import { createAction, props } from '@ngrx/store';
import { BannerActionData, BannerModel } from '../../models/banners';

export const loadBanners = createAction('[Banners] Load Banners');
export const loadBannersSuccess = createAction('[Banners] Load Banners Success', props<{ banners: BannerModel[] }>());
export const loadBannersFailure = createAction('[Banners] Load Banners Failure');

export const dispatchAction = createAction('[Banners] Dispatch Action', props<{ data: BannerActionData }>());

export const redirectTo = createAction('[Banners] Redirect To', props<{ data: BannerActionData }>());
export const showDetails = createAction('[Banners] Show Details', props<{ item: BannerModel }>());
export const openExternalContent = createAction('[Banners] Open External Content', props<{ url: string }>());
