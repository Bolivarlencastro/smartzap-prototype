import { FormControl } from '@angular/forms';
import { BannerResourceType } from './banners';

export interface BannersApiResponse {
  start_date: Date;
  end_date: Date;
  learning_resources: LearningResource[];
}

export interface LearningResource {
  resource_type: BannerResourceType;
  resource_id?: string;
  external_resource_title?: string;
  external_resource_url?: string;
  external_resource_image?: string | File;
  order?: number;
  title?: string;
  icon?: string;
}

export interface BannerSettings {
  mode: BannerMode;
  customSettings?: BannersApiResponse;
}

export interface BannerSettingsViewModel extends BannerSettings {
  initialLoading: boolean;
  internalContents: LearningResource[];
  savedMode: BannerMode;
}

interface CustomSettingsModel<D, L> {
  start_date: D;
  end_date: D;
  learning_resources: L;
}

export type CustomSettings = CustomSettingsModel<Date, LearningResource[]>;
export type CustomSettingsForm = CustomSettingsModel<FormControl<Date>, FormControl<LearningResource[]>>;

export type BannerMode = 'RECOMMENDATION' | 'MANUAL';
export type SourceContent = 'INTERNAL' | 'EXTERNAL';
