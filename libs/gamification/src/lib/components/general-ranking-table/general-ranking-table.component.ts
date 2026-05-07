import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AuthService, GamificationViewModel } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoModule } from '@jsverse/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { getTranslocoScope } from '../../util';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { PodiumBorderPipe } from '../../util/pipes/podium-border.pipe';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'kp-general-ranking-table',
  imports: [
    CommonModule,
    MatTableModule,
    TranslocoModule,
    NgxSkeletonLoaderModule,
    PodiumBorderPipe,
    KpPluralizeTranslatePipe,
    MatDividerModule,
    ScrollingModule,
  ],
  providers: [getTranslocoScope()],
  templateUrl: './general-ranking-table.component.html',
  styles: [
    `
      .user-bg {
        background-color: var(--mat-sys-inverse-on-surface);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralRankingTableComponent implements OnInit {
  @Input() vm: GamificationViewModel;
  @Input() isMobile: boolean;
  @Output() cleanFilterEvent = new EventEmitter<void>();

  userId: string;
  protected readonly defaultUserAvatar = constants.defaultUserAvatar;
  protected readonly itemsLoaderTheme = { width: '100%', borderRadius: '0', height: '64px' };
  protected readonly displayedColumns: string[] = [
    'image',
    'username',
    'job',
    'area',
    'leader',
    'board',
    'subDirectorate',
    'score',
  ];

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this._authService.userId;
  }

  cleanFilter(): void {
    this.cleanFilterEvent.emit();
  }
}
