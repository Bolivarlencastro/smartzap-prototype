import { LearnContentCardActionId } from '@keeps-platform-frontend-workspace/ui/models';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { SECTION_CONTENT_TYPE } from 'app/main/section-contents/models/section-contents-type';

export type SectionContentItemEvent = {
  action: LearnContentCardActionId;
  item: LearnContentCardData;
  contentType: SECTION_CONTENT_TYPE;
};
