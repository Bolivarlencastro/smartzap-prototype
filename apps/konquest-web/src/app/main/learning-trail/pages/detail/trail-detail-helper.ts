import { LearningTrail, LearningTrailType } from 'app/main/learning-trail/model/learning-trail';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KpResume } from '@keeps-platform-frontend-workspace/ui/kp-resume';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { KpTitle } from '@keeps-platform-frontend-workspace/ui/kp-title';

export class TrailDetailHelper {
  static buildResume(trail: LearningTrail, isMobile: boolean): KpResume[] {
    if (!trail) {
      return [];
    }

    const resumeItens: KpResume[] = TrailDetailHelper.resumeItems(trail);

    if (!isMobile) {
      resumeItens.push({
        label: marker('GENERAL.ENROLLMENTS'),
        value: trail?.users_enrolled || 0,
        icon: 'person',
      });

      resumeItens.push({
        label: marker('GENERAL.FINISHED'),
        value: trail?.users_finished || 0,
        icon: 'school',
      });
    }

    return resumeItens;
  }

  private static resumeItems(trail: LearningTrail): KpResume[] {
    const durationPipe = new KpDurationPipe();
    const resumeItens: KpResume[] = [];

    resumeItens.push({
      label: marker('GENERAL.DURATION'),
      value: durationPipe.transform(trail.duration_time),
      icon: 'alarm',
    });

    resumeItens.push({
      label: marker('GENERAL.MISSIONS'),
      value: trail?.count_missions || 0,
      icon: 'rocket_launch',
    });

    resumeItens.push({
      label: marker('GENERAL.PULSES'),
      value: trail?.count_pulses || 0,
      svgIcon: 'pulse',
    });

    return resumeItens;
  }

  static buildTitle(trail: LearningTrail): KpTitle | undefined {
    if (!trail) {
      return undefined;
    }
    const trailType = trail?.learning_trail_type as LearningTrailType;

    return {
      title: trail.name,
      createdDate: trail.created_date,
      creatorName: trail.user_creator?.name,
      open: trailType.name === 'Open For Workspace',
      expirationDate: trail.expiration_date,
    };
  }
}
