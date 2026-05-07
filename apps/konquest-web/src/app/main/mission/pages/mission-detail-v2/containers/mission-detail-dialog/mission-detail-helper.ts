import { Mission, MissionType, UserCreator } from 'app/main/mission/mission.model';
import { KpResume } from '@keeps-platform-frontend-workspace/ui/kp-resume';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { KpPerformancePipe } from '@keeps-platform-frontend-workspace/ui/kp-performance';
import { KpTitle } from '@keeps-platform-frontend-workspace/ui/kp-title';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export class MissionDetailHelper {
  static buildResume(mission: Mission, isMobile: boolean, includeGamificationOptions = false): KpResume[] {
    if (!mission) {
      return [];
    }

    const resumeItens: KpResume[] = MissionDetailHelper.resumeItems(mission, includeGamificationOptions);

    if (!isMobile) {
      resumeItens.push({
        label: marker('GENERAL.ENROLLMENTS'),
        value: mission?.users_enrolled || 0,
        icon: 'person',
      });

      resumeItens.push({
        label: marker('GENERAL.FINISHED'),
        value: mission?.users_finished || 0,
        icon: 'school',
      });
    }

    return resumeItens;
  }

  private static resumeItems(mission: Mission, includeGamificationOptions: boolean): KpResume[] {
    const durationPipe = new KpDurationPipe();
    const resumeItens: KpResume[] = [];

    resumeItens.push({
      label: marker('GENERAL.DURATION'),
      value: durationPipe.transform(mission.duration_time),
      icon: 'timer',
    });

    if (mission.minimum_performance || mission.workspace_min_performance) {
      const performancePipe = new KpPerformancePipe();
      const value = mission.minimum_performance || mission.workspace_min_performance;
      resumeItens.push({
        label: marker('MISSION.MISSION_MIN_PERFORMANCE'),
        value: performancePipe.transform(value, '%'),
        icon: 'gps_fixed',
      });
    }

    if (includeGamificationOptions) {
      resumeItens.push({
        label: marker('GENERAL.SCORE'),
        value: mission?.points || 0,
        icon: 'trophy',
      });
    }

    return resumeItens;
  }

  static buildTitle(mission: Mission): KpTitle | undefined {
    if (!mission) {
      return undefined;
    }
    return {
      title: mission.name,
      open: (mission.mission_type as MissionType)?.name === 'Open For Workspace',
      createdDate: mission.created_date,
      creatorName: (mission.user_creator as UserCreator)?.name,
      expirationDate: mission?.expiration_date,
      rating: mission?.rating_avg,
      ratings: mission?.rating_count,
      ratings_total: mission?.ratings_total,
    };
  }
}
