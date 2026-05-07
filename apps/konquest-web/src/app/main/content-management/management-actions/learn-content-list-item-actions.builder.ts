import { LEARN_CONTENT_LIST_ITEM_ACTION } from '../models/learn-content-list-item-action';

export class LearnContentListItemActionsBuilder {
  private actions = new Set<LEARN_CONTENT_LIST_ITEM_ACTION>();

  reset() {
    this.actions.clear();
  }

  build(): LEARN_CONTENT_LIST_ITEM_ACTION[] {
    return Array.from(this.actions);
  }

  withDeleteAction() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.DELETE);
    return this;
  }

  withDuplicateAction() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.DUPLICATE);
    return this;
  }

  withEditAction() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.EDIT);
    return this;
  }

  withEditContributorsAction() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.EDIT_CONTRIBUTORS);
    return this;
  }

  withEnrollUsersAction() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS);
    return this;
  }

  withFinishEventAction() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.FINISH_EVENT);
    return this;
  }

  withShareAction() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.SHARE);
    return this;
  }

  withTransferAction() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER);
    return this;
  }

  withViewEvaluationsAction() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_EVALUATIONS);
    return this;
  }

  withViewStatisticsAction() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_STATISTICS);
    return this;
  }

  withViewAsUserAction() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_AS_USER);
    return this;
  }

  withViewVinculateToGroupAction() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP);
    return this;
  }

  withPublishCourseAction() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.PUBLISH);
    return this;
  }

  withManageEnrollments() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_ENROLLMENTS);
    return this;
  }

  withManagePulses() {
    this.actions.add(LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_PULSES);
    return this;
  }
}
