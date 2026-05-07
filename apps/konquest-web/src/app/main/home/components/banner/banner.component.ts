import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { MatCarouselComponent, MatCarouselSlideComponent } from '@keeps-platform-frontend-workspace/ui/overrides';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BANNER_ACTION_MAP, BannerActionData, BannerModel } from '../../models/banners';

@Component({
  selector: 'app-banner',
  imports: [
    CommonModule,
    MatButtonModule,
    KpCardTagComponent,
    MatIconModule,
    TranslocoPipe,
    MatCarouselComponent,
    MatCarouselSlideComponent,
    MatTooltipModule,
  ],
  templateUrl: './banner.component.html',
  styles: [
    `
      .settings-button {
        background-color: var(--mat-sys-secondary-container);
        color: var(--mat-sys-on-secondary-container);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerComponent {
  items = input<BannerModel[]>();
  action = output<BannerActionData>();
  openSettings = output<void>();

  protected readonly isMobile$: Observable<boolean>;
  protected readonly isAdmin$: Observable<boolean>;
  protected readonly actionMap = BANNER_ACTION_MAP;

  constructor(
    private readonly breakPointObserver: BreakpointObserver,
    private readonly userProfileService: UserProfileService,
  ) {
    this.isMobile$ = breakPointObserver.observe('(max-width: 599px)').pipe(map((state) => state.matches));
    this.isAdmin$ = userProfileService.isAdmin$();
  }

  onOpenSettings(event: MouseEvent) {
    event.stopPropagation();
    this.openSettings.emit();
  }

  onOpenDetails(item: BannerModel) {
    if (item.resource_type === 'EXTERNAL_CONTENT') {
      return;
    }

    this.action.emit({ item, action: 'details' });
  }

  onAction(item: BannerModel, event: MouseEvent) {
    event.stopPropagation();
    this.action.emit({ item, action: item.action });
  }
}
