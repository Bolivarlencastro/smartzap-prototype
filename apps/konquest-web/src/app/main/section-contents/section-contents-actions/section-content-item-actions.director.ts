import { SectionContentActionsBuilder } from './section-content-actions.builder';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';

export interface SectionContentItemActionsDirector {
  construct(
    builder: SectionContentActionsBuilder,
    content: LearnContentCardData,
    isAdmin: boolean,
    isSuperAdmin: boolean,
  ): void;
}
