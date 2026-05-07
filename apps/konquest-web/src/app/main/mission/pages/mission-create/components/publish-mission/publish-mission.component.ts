import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { MissionInformationDate, MissionModel } from 'app/main/mission/mission.model';
import { Observable } from 'rxjs';
import { MissionSelectors } from '../../store';
import { MissionDevelopmentStatusTagComponent } from '../mission-development-status-tag/mission-development-status-tag.component';

@Component({
  selector: 'app-publish-mission',
  templateUrl: './publish-mission.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MissionDevelopmentStatusTagComponent, MatButton, AsyncPipe, TranslocoPipe, DatePipe],
  styles: [
    `
      .status-tag {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `,
  ],
})
export class PublishMissionComponent {
  missionModel = input<MissionModel>();
  eventDates = input<MissionInformationDate[]>();
  developmentStatus = input<DevelopmentStatus>();
  publishMission = output<void>();
  accessMission = output<void>();

  private readonly titles = PublishMissionComponent.buildTitlesMap();
  private readonly eventTitles = PublishMissionComponent.buildEventTitlesMap();

  private readonly messages: Map<DevelopmentStatus, string> = PublishMissionComponent.buildMessagesMap();

  protected publishLabel$: Observable<string>;
  protected accessLabel$: Observable<string>;

  get isEvent(): boolean {
    return [MissionModel.LIVE, MissionModel.PRESENTIAL].includes(this.missionModel());
  }

  get icon(): string {
    return this.isEvent ? 'event' : 'rocket_launch';
  }

  get title(): string {
    if (this.isEvent) {
      return this.eventTitles.get(this.developmentStatus()) || '';
    }

    return this.titles.get(this.developmentStatus()) || '';
  }

  get message(): string {
    return this.messages.get(this.developmentStatus()) || '';
  }

  get eventTypeTranslation(): string {
    return this.missionModel() === MissionModel.LIVE
      ? 'MISSION.CREATE.CREATED.MESSAGE_EVENT.ONLINE'
      : 'MISSION.CREATE.CREATED.MESSAGE_EVENT.PRESENTIAL';
  }

  get firstEventDate(): string {
    return this.eventDates()?.[0]?.start_at;
  }

  get lastEventDate(): string {
    return this.eventDates()?.[this.eventDates()?.length - 1]?.start_at;
  }

  get canPublishMission(): boolean {
    if (!this.isEvent) {
      return true;
    }
    return this.developmentStatus() !== DevelopmentStatus.CLOSED && this.developmentStatus() !== DevelopmentStatus.DONE;
  }

  constructor(private store: Store) {
    this.publishLabel$ = store.select(MissionSelectors.selectPublishButtonLabel);
    this.accessLabel$ = store.select(MissionSelectors.selectAccessButtonLabel);
  }

  private static buildTitlesMap(): Map<DevelopmentStatus, string> {
    return new Map<DevelopmentStatus, string>([
      [DevelopmentStatus.IN_PROGRESS, marker('MISSION.CREATE.CREATED.TITLE.IN_PROGRESS')],
      [DevelopmentStatus.PROCESSING, marker('MISSION.CREATE.CREATED.TITLE.PROCESSING')],
      [DevelopmentStatus.IN_REVIEW, marker('MISSION.CREATE.CREATED.TITLE.IN_REVIEW')],
      [DevelopmentStatus.DONE, marker('MISSION.CREATE.CREATED.TITLE.DONE')],
      [DevelopmentStatus.INACTIVATED, marker('MISSION.CREATE.CREATED.TITLE.INACTIVATED')],
    ]);
  }

  private static buildEventTitlesMap(): Map<DevelopmentStatus, string> {
    return new Map<DevelopmentStatus, string>([
      [DevelopmentStatus.IN_PROGRESS, marker('MISSION.CREATE.CREATED.TITLE_EVENT.IN_PROGRESS')],
      [DevelopmentStatus.DONE, marker('MISSION.CREATE.CREATED.TITLE_EVENT.DONE')],
      [DevelopmentStatus.CLOSED, marker('MISSION.CREATE.CREATED.TITLE_EVENT.CLOSED')],
    ]);
  }

  private static buildMessagesMap(): Map<DevelopmentStatus, string> {
    return new Map<DevelopmentStatus, string>([
      [DevelopmentStatus.IN_PROGRESS, marker('MISSION.CREATE.CREATED.MESSAGE.DEFAULT')],
      [DevelopmentStatus.PROCESSING, marker('MISSION.CREATE.CREATED.MESSAGE.DEFAULT')],
      [DevelopmentStatus.IN_REVIEW, marker('MISSION.CREATE.CREATED.MESSAGE.DEFAULT')],
      [DevelopmentStatus.DONE, marker('MISSION.CREATE.CREATED.MESSAGE.DEFAULT')],
      [DevelopmentStatus.INACTIVATED, marker('MISSION.CREATE.CREATED.MESSAGE.DEFAULT')],
      [DevelopmentStatus.CLOSED, marker('MISSION.CREATE.CREATED.MESSAGE.CLOSED')],
    ]);
  }

  executeAction(action: 'publish' | 'access'): void {
    if (action === 'publish') {
      this.publishMission.emit();
      return;
    }
    this.accessMission.emit();
  }
}
