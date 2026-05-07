import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { MissionInformationDate, MissionModel } from 'app/main/mission/mission.model';
import { PublishMissionComponent } from '../../components/publish-mission/publish-mission.component';
import { MissionActions, MissionSelectors } from '../../store';

@Component({
  selector: 'app-mission-created',
  template: `
    <app-publish-mission
      [developmentStatus]="missionDevelopmentStatus()"
      [missionModel]="missionModel()"
      [eventDates]="eventDates()"
      (publishMission)="publishMission()"
      (accessMission)="accessMission()"
    >
    </app-publish-mission>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PublishMissionComponent],
})
export class MissionCreatedComponent {
  missionModel: Signal<MissionModel>;
  missionDevelopmentStatus: Signal<DevelopmentStatus>;
  eventDates: Signal<MissionInformationDate[]>;

  constructor(private store: Store) {
    this.missionModel = toSignal(store.select(MissionSelectors.selectMissionModel));
    this.missionDevelopmentStatus = toSignal(store.select(MissionSelectors.selectMissionDevelopmentStatus));
    this.eventDates = toSignal(store.select(MissionSelectors.selectPresentialLiveDates));
  }

  publishMission(): void {
    this.store.dispatch(MissionActions.publishMission());
  }

  accessMission(): void {
    this.store.dispatch(MissionActions.navigateToMission());
  }
}
