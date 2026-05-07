import { marker } from '@jsverse/transloco-keys-manager/marker';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CardTagType } from '@keeps-platform-frontend-workspace/ui/models';

export interface BannersViewModel {
  banners: BannerModel[];
  loading: boolean;
}

export interface MyRecommendationsResponse {
  id: string;
  external_resource_url: string;
  title: string;
  holder_image: string;
  resource_type: BannerResourceType;
  enrollment: {
    id: string;
    status: EnrollmentStatuses;
    goal_date: string;
  };
}

export interface BannerModel extends MyRecommendationsResponse {
  action: BannerAction;
  enrollmentTag: CardTagType;
}

export interface BannerActionData {
  item: BannerModel;
  action: BannerAction;
}

export type BannerResourceType = 'COURSE' | 'LEARNING_TRAIL' | 'EXTERNAL_CONTENT' | 'EVENT';
export type BannerAction = 'view-more' | 'details' | 'start' | 'continue';

export const BANNER_ACTION_MAP: Record<BannerAction, unknown> = {
  continue: { label: marker('HOME.BANNER.ACTIONS.CONTINUE'), icon: 'play_arrow' },
  start: { label: marker('HOME.BANNER.ACTIONS.START'), icon: 'play_arrow' },
  details: { label: marker('HOME.BANNER.ACTIONS.DETAILS'), icon: 'add' },
  'view-more': { label: marker('HOME.BANNER.ACTIONS.VIEW_MORE'), icon: 'play_arrow' },
};
