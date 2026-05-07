import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { KonquestAPI } from '@core/api';
import { SearchAPI } from '@core/api/base/search.api';
import { GlobalSearchResponse } from '@core/model/search-api/global-response.model';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import {
  LearnContentsApi,
  MyAccountV2Client,
  PageResponse,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { filter, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { BannerSettingsComponent } from '../containers/banner-settings/banner-settings.component';
import { BannerMode, BannersApiResponse, CustomSettings, LearningResource } from '../models/banner-settings';

@Injectable()
export class BannerSettingsService {
  private dialogRef: MatDialogRef<BannerSettingsComponent>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly myAccApi: MyAccountV2Client,
    private readonly konquestApi: KonquestAPI,
    private readonly searchApi: SearchAPI,
    private readonly workspaceService: WorkspaceService,
    private readonly learnContentsApi: LearnContentsApi,
  ) {}

  openDialog(): MatDialogRef<BannerSettingsComponent> {
    this.dialogRef = this.dialog.open(BannerSettingsComponent, {
      autoFocus: 'dialog',
      disableClose: true,
      panelClass: 'custom-banner-dialog-container',
    });

    return this.dialogRef;
  }

  loadMode(): Observable<BannerMode> {
    const id = this.workspaceService.currentWorkspaceId;
    return this.myAccApi
      .get<{ banner_mode: BannerMode }>(`/workspaces/${id}/banner-mode`)
      .pipe(map(({ banner_mode }) => banner_mode));
  }

  loadCustomSettings(): Observable<BannersApiResponse> {
    return this.konquestApi.get('/banners').pipe(map(this.buildCustomSettings));
  }

  saveMode(banner_mode: BannerMode): Observable<any> {
    const id = this.workspaceService.currentWorkspaceId;
    return this.myAccApi.post(`/workspaces/${id}/banner-mode`, { banner_mode });
  }

  loadInternalContents(search = ''): Observable<LearningResource[]> {
    const filter = { page: 1, per_page: 15, search, dataType: ['courses', 'trails'], development_status: ['DONE'] };
    return this.searchApi.get<PageResponse<GlobalSearchResponse>>('/v1/global', filter).pipe(
      map((res) => res.items),
      map(this.buildInternalContents),
    );
  }

  publish(settings: CustomSettings): Observable<unknown> {
    const { start_date, end_date } = settings;
    const is_temporary = !!start_date && !!end_date;

    return forkJoin(this.handleResourceImageUploads(settings)).pipe(
      switchMap((updatedResources) => {
        const data = {
          ...settings,
          learning_resources: updatedResources?.map((item, index) => ({ ...item, order: index })),
          is_temporary,
        };
        return this.konquestApi.post('/banners', data);
      }),
    );
  }

  openConfirmRecommendationDialog(): Observable<any> {
    const dialogRefConfirm = this.dialog.open(KpConfirmDialogComponent, { width: '350px', autoFocus: 'dialog' });
    dialogRefConfirm.componentInstance.confirmTitle = marker(
      'HOME.BANNER.SETTINGS.CONFIRM_RECOMMENDATION_DIALOG.TITLE',
    );
    dialogRefConfirm.componentInstance.confirmMessage = marker(
      'HOME.BANNER.SETTINGS.CONFIRM_RECOMMENDATION_DIALOG.MESSAGE',
    );
    dialogRefConfirm.componentInstance.negativeButtonLabel = marker('GENERAL.BACK');
    dialogRefConfirm.componentInstance.positiveButtonLabel = marker(
      'HOME.BANNER.SETTINGS.CONFIRM_RECOMMENDATION_DIALOG.POSITIVE_BUTTON',
    );

    return dialogRefConfirm.afterClosed();
  }

  verifyClose(dirtyForm: boolean, mode: BannerMode) {
    if (dirtyForm && mode === 'MANUAL') {
      const dialogRefConfirm = this.dialog.open(KpConfirmDialogComponent, { width: '350px', autoFocus: 'dialog' });
      dialogRefConfirm.componentInstance.confirmTitle = marker('HOME.BANNER.SETTINGS.CLOSE_CONFIRM_DIALOG.TITLE');
      dialogRefConfirm.componentInstance.confirmMessage = marker('HOME.BANNER.SETTINGS.CLOSE_CONFIRM_DIALOG.MESSAGE');
      dialogRefConfirm.componentInstance.negativeButtonLabel = marker('GENERAL.BACK');
      dialogRefConfirm.componentInstance.positiveButtonLabel = marker('GENERAL.CANCEL');

      dialogRefConfirm
        .afterClosed()
        .pipe(filter((result) => !!result))
        .subscribe(() => this.closeDialog());

      return;
    }

    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private buildInternalContents(items: GlobalSearchResponse[]): LearningResource[] {
    return items?.map((item) => {
      const result: Partial<LearningResource> = {
        resource_id: item.id,
        title: item.name,
      };

      if (item.stats.dataType === 'trails') {
        return { ...result, resource_type: 'LEARNING_TRAIL', icon: 'route' };
      }

      if (['LIVE', 'PRESENTIAL'].includes(item.course_model)) {
        return { ...result, resource_type: 'EVENT', icon: 'event' };
      } else {
        return { ...result, resource_type: 'COURSE', icon: 'rocket_launch' };
      }
    });
  }

  private buildCustomSettings(res: BannersApiResponse): BannersApiResponse {
    const iconMap: Record<string, string> = {
      LEARNING_TRAIL: 'route',
      EVENT: 'event',
      EXTERNAL_CONTENT: 'link',
      COURSE: 'rocket_launch',
    };

    const buildedLearningResources = res.learning_resources?.map((item) => ({
      ...item,
      icon: iconMap[item.resource_type],
    }));

    const start_date = res.start_date ? new Date(res.start_date) : null;
    const end_date = res.end_date ? new Date(res.end_date) : null;

    return { ...res, start_date, end_date, learning_resources: buildedLearningResources };
  }

  private handleResourceImageUploads(settings: CustomSettings) {
    return settings.learning_resources?.map((item) => {
      if (item.external_resource_image && typeof item.external_resource_image !== 'string') {
        return this.uploadImage(item.external_resource_image).pipe(
          map((url) => ({ ...item, external_resource_image: url })),
        );
      }

      return of(item);
    });
  }

  private uploadImage(image: File): Observable<string> {
    return this.learnContentsApi.saveCoverWithSize(image, 1920, 640).pipe(map(({ url }) => url));
  }
}
