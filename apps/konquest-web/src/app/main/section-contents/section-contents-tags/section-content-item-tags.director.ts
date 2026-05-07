import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { SectionContentTagsBuilder } from './section-content-tags.builder';

export interface SectionContentItemTagsDirector {
  construct(
    builder: SectionContentTagsBuilder,
    content: LearnContentCardData,
    isAdmin: boolean,
    isSuperAdmin: boolean,
  ): void;
}
