import { ChannelsListParams, CoursesListParams, TrailsListParams } from '@core/model/search-api';

export type LearnContentManagementType = 'courses' | 'trails' | 'events' | 'channels';

export type LearnContentListBaseFilter = {
  search?: string;
  page?: number;
  per_page?: number;
};

export type LearnContentListFilter = (CoursesListParams | TrailsListParams | ChannelsListParams) &
  LearnContentListBaseFilter;
