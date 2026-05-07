import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { KpResume } from './kp-resume';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPerformancePipe } from '../../pipes/kp-performance/kp-performance.pipe';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatDivider } from '@angular/material/divider';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'kp-resume',
  templateUrl: './kp-resume.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatProgressBar, MatTooltip, MatDivider, NgxSkeletonLoaderModule, KpPerformancePipe, TranslocoPipe],
})
export class KpResumeComponent {
  @Input() items: KpResume[];
  @Input() progress: number | undefined;
  @Input() loading: boolean;

  protected readonly loaderCount = [1, 2, 3, 4, 5];
  protected readonly loaderTheme = {
    'border-radius': '4px',

    width: '110px',
  };

  get showProgressBar(): boolean {
    return this.progress >= 0;
  }
}
