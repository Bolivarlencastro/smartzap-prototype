import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { navigateToEvent, navigateToMission, navigateToTrail } from '@app/shared/services';
import { KonquestAPI } from '@core/api';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ENROLLMENT_STATUS_TAG_TYPE_MAP } from '@keeps-platform-frontend-workspace/ui/helpers';
import { map, Observable } from 'rxjs';
import { BannerAction, BannerActionData, BannerModel, MyRecommendationsResponse } from '../models/banners';
import { BannersActions } from '../store/actions';

@Injectable()
export class BannersService {
  constructor(
    private readonly konquestApi: KonquestAPI,
    private router: Router,
  ) {}

  getAction(data: BannerActionData): any {
    const ACTIONS_MAP: Record<BannerAction, any> = {
      continue: BannersActions.redirectTo({ data }),
      start: BannersActions.redirectTo({ data }),
      details: BannersActions.showDetails({ item: data.item }),
      'view-more': BannersActions.openExternalContent({ url: data.item.external_resource_url }),
    };

    return ACTIONS_MAP[data.action];
  }

  redirectTo({ item, action }: BannerActionData) {
    const redirectMap = new Map<BannerAction, string[]>([
      ['continue', ['/course', item.id]],
      ['start', ['/course', item.id]],
    ]);

    this.router.navigate(redirectMap.get(action));
  }

  showDetails(item: BannerModel) {
    if (item.resource_type === 'COURSE') {
      navigateToMission(this.router, item.id);
      return;
    }

    if (item.resource_type === 'EVENT') {
      navigateToEvent(this.router, item.id);
      return;
    }

    navigateToTrail(this.router, item.id);
  }

  loadBanners(): Observable<BannerModel[]> {
    return this.konquestApi
      .get<MyRecommendationsResponse[]>('/banners/my-recommendations')
      .pipe(map((res) => this.buildBanners(res)));
  }

  private buildBanners(banners: MyRecommendationsResponse[]): BannerModel[] {
    return banners?.map((banner) => ({
      ...banner,
      action: this.buildAction(banner),
      enrollmentTag: ENROLLMENT_STATUS_TAG_TYPE_MAP.get(banner.enrollment?.status),
    }));
  }

  private buildAction(banner: MyRecommendationsResponse): BannerAction {
    if (banner.external_resource_url) {
      return 'view-more';
    }

    if (banner.resource_type === 'COURSE' && banner.enrollment?.id) {
      return this.getEnrollmentAction(banner.enrollment.status);
    }

    return 'details';
  }

  private getEnrollmentAction(status: string): BannerAction {
    if (status === EnrollmentStatuses.ENROLLED) {
      return 'start';
    }

    if (status === EnrollmentStatuses.STARTED) {
      return 'continue';
    }

    return 'details';
  }
}
