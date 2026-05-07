import { SectionContentItemActionsDirector } from '../section-content-item-actions.director';
import { SectionContentActionsBuilder } from '../section-content-actions.builder';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';

export class TrailSectionContentActionsDirector implements SectionContentItemActionsDirector {
  construct(builder: SectionContentActionsBuilder, content: LearnContentCardData): void {
    builder.reset();

    if (!content) {
      return;
    }

    builder.withDetailsAction().withShareAction();
  }
}
