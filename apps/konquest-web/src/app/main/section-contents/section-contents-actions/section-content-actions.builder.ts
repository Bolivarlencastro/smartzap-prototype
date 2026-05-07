import { LearnContentCardActionId } from '@keeps-platform-frontend-workspace/ui/models';

export class SectionContentActionsBuilder {
  private actions = new Set<LearnContentCardActionId>();

  reset() {
    this.actions.clear();
  }

  build(): LearnContentCardActionId[] {
    return Array.from(this.actions);
  }

  withContinueAction() {
    this.actions.add('continue');
    return this;
  }

  withStartAction() {
    this.actions.add('start');
    return this;
  }

  withEnrollAction() {
    this.actions.add('enroll');
    return this;
  }

  withRequestNewDeadLineAction() {
    this.actions.add('request-new-deadline');
    return this;
  }

  withDetailsAction() {
    this.actions.add('details');
    return this;
  }

  withShareAction() {
    this.actions.add('share');
    return this;
  }

  withAddBookmarkAction() {
    this.actions.add('add-bookmark');
    return this;
  }

  withRemoveBookmarkAction() {
    this.actions.add('remove-bookmark');
    return this;
  }
}
