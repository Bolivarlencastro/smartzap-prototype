import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { KpTitle } from './kp-title';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatIcon } from '@angular/material/icon';
import { NgClass, DecimalPipe, DatePipe } from '@angular/common';

marker('UI.TITLE.OPEN');
marker('UI.TITLE.CLOSED');

@Component({
  selector: 'kp-title',
  templateUrl: './kp-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, NgClass, NgxSkeletonLoaderModule, DecimalPipe, DatePipe, TranslocoPipe],
})
export class KpTitleComponent {
  @Input() title: KpTitle;
  @Input() loading: boolean;

  private readonly baseLoaderTheme = {
    'border-radius': '4px',
  };
  protected readonly titleLoaderTheme = { ...this.baseLoaderTheme, width: '150px', height: '32px' };
  protected readonly subtitleLoaderTheme = { ...this.baseLoaderTheme, height: '12px', width: '250px' };

  get showRating(): boolean {
    return this.title?.rating >= 0;
  }

  get showPulsesCount(): boolean {
    return this.title?.pulsesCount >= 0;
  }

  get showMissionsCount(): boolean {
    return this.title?.missionCount >= 0;
  }
}
