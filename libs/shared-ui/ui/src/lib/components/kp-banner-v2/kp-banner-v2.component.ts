import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KpInfoTagComponent } from '../kp-info-tag';
import { KpCardTagComponent } from '../kp-card-tag';
import { KpSpeedDialComponent, KpSpeedDialOptionComponent } from '../kp-speed-dial';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { LearnContentCardData } from '../kp-learn-content-card';
import { LearnContentActionContentType, LearnContentActionData, LearnContentCardActionId } from '../../models';
import { KpLearnContentActionIconPipe, KpLearnContentActionLabelPipe } from '../../pipes';
import { MatCarouselComponent, MatCarouselSlideComponent } from '../overrides';

@Component({
  selector: 'kp-banner-v2',
  imports: [
    CommonModule,
    MatButtonModule,
    KpInfoTagComponent,
    KpCardTagComponent,
    KpSpeedDialComponent,
    MatIcon,
    KpSpeedDialOptionComponent,
    TranslocoPipe,
    KpLearnContentActionIconPipe,
    KpLearnContentActionLabelPipe,
    MatCarouselComponent,
    MatCarouselSlideComponent,
  ],
  templateUrl: './kp-banner-v2.component.html',
  styleUrls: ['./kp-banner-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpBannerV2Component {
  protected isMobile$: Observable<boolean>;

  @Input() items: LearnContentCardData[] = [];
  @Input({ required: true }) contentType: LearnContentActionContentType;
  @Output() bannerAction = new EventEmitter<LearnContentActionData>();
  @ViewChildren(KpSpeedDialComponent) speedDialOptions!: QueryList<KpSpeedDialComponent>;

  constructor(private breakPointObserver: BreakpointObserver) {
    this.isMobile$ = this.breakPointObserver.observe('(max-width: 599px)').pipe(map((state) => state.matches));
  }

  getMainAction(actions: LearnContentCardActionId[]): LearnContentCardActionId {
    return actions.at(0);
  }

  getSecondaryActions(actions: LearnContentCardActionId[]): LearnContentCardActionId[] {
    return actions.slice(1, actions.length);
  }
  onBannerAction(actionId: LearnContentCardActionId, item: LearnContentCardData, event?: MouseEvent) {
    event?.stopPropagation();
    this.bannerAction.emit({ action: actionId, learnContent: item, contentType: this.contentType });
  }

  get optionsAreOpen() {
    return this.speedDialOptions?.some((o) => o.speedDialOpen);
  }
}
