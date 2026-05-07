import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MissionModel } from 'app/main/mission/mission.model';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpMissionDevelopmentStatusLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-mission-development-status-label';
import { KpMissionDevelopmentStatusColorPipe } from '@keeps-platform-frontend-workspace/ui/kp-mission-development-status-color';

@Component({
  selector: 'app-mission-development-status-tag',
  templateUrl: './mission-development-status-tag.component.html',
  styleUrls: ['./mission-development-status-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, TranslocoPipe, KpMissionDevelopmentStatusLabelPipe, KpMissionDevelopmentStatusColorPipe],
})
export class MissionDevelopmentStatusTagComponent {
  @Input() status: DevelopmentStatus;
  @Input() missionModel: MissionModel;

  get icon(): string {
    if (this.missionModel !== MissionModel.LIVE && this.missionModel !== MissionModel.PRESENTIAL) {
      return '';
    }
    return this.missionModel === MissionModel.LIVE ? 'videocam' : 'location_on';
  }

  get iconColor(): string {
    if (this.missionModel === MissionModel.LIVE) {
      return 'text-red-500';
    }
    return 'text-blue-600';
  }

  get presentialLivelabel(): string {
    if (this.missionModel === MissionModel.PRESENTIAL) {
      return marker('MISSION.MISSION_MODEL.PRESENTIAL');
    }
    return marker('MISSION.MISSION_MODEL.LIVE');
  }
}
