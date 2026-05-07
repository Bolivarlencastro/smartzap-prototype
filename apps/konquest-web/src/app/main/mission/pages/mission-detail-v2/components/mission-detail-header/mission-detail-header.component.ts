import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Mission } from 'app/main/mission/mission.model';
import { LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';
import { DevelopmentStatus, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-mission-detail-header',
  templateUrl: './mission-detail-header.component.html',
  styleUrls: ['./mission-detail-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KpCardTagComponent, NgxSkeletonLoaderModule, MatIconButton, MatIcon],
})
export class MissionDetailHeaderComponent {
  @Input() mission: Mission;
  @Input() loading = true;
  @Input() missionTags: LearnContentCardTag[];
  @Output() closeClick = new EventEmitter<void>();

  protected readonly loaderTheme = {
    'border-radius': '12px',
    height: '22px',
    width: '150px',
  };
  private readonly defaultBg = 'https://assets.keepsdev.com/images/placeholders/default-card-bg.png';

  @HostBinding('style.background-image')
  get backgroundImage(): string {
    return `url(${this.mission?.holder_image || this.defaultBg})`;
  }

  get isInactivated(): boolean {
    return this.mission?.development_status === DevelopmentStatus.INACTIVATED;
  }

  get showGoalDateTag(): boolean {
    return this.mission?.enrollment?.status === EnrollmentStatuses.ENROLLED;
  }

  emitClose(): void {
    this.closeClick.emit();
  }
}
