import { LearnContentCardBaseDto } from '../base/learn-content-card-base-dto';
import { TrailsResponse } from '@core/model/search-api';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { LearnContentCardActionId, LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';
import { getEnrollmentTags, getModifierTags } from 'app/shared/utils/card-helpers';

export class TrailContentCardDto extends LearnContentCardBaseDto<TrailsResponse> {
  constructor(trail: TrailsResponse, isBanner?: boolean, isSuperAdmin?: boolean) {
    super(trail, isBanner, isSuperAdmin);
  }

  override buildData(data: TrailsResponse, isBanner?: boolean): LearnContentCardData {
    return {
      contentId: data.id,
      title: data.name,
      backgroundImage: isBanner ? data.holder_image : data.thumb_image,
      duration: data.duration_time,
      language: data.language,
      missionsCount: data.missions_count,
      pulsesCount: data.pulses_count,
      progress: data.stats?.user_enrollment?.progress * 100,
    };
  }

  override setActions(_trail: TrailsResponse): LearnContentCardActionId[] {
    return ['details', 'share'];
  }

  override buildTags(trail: TrailsResponse): LearnContentCardTag[] {
    const canEdit = this.canEdit(trail);
    const tags: LearnContentCardTag[] = [];

    if (canEdit) {
      const statusTag: LearnContentCardTag = {
        type: trail.is_active ? 'development-published' : 'development-inactive',
      };

      tags.push(statusTag);
    }

    tags.push(...getModifierTags(trail.stats?.user_enrollment, trail.expiration_date));
    tags.push(...getEnrollmentTags(trail.stats?.user_enrollment));

    return tags;
  }

  private canEdit(trail: TrailsResponse) {
    return trail.stats?.user_is_owner || this.isSuperAdmin;
  }
}
