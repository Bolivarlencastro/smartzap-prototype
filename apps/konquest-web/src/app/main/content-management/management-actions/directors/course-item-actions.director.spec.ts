import { CourseItemActionsDirector } from './course-item-actions.director';
import { LearnContentListItemActionsBuilder } from '../learn-content-list-item-actions.builder';
import { LearnContentListItem } from '../../models/learn-content-list-item';
import { LEARN_CONTENT_LIST_ITEM_ACTION } from '../../models/learn-content-list-item-action';
import { Chance } from 'chance';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('CourseItemActionsDirector', () => {
  let director: CourseItemActionsDirector;
  let builder: LearnContentListItemActionsBuilder;
  let mockContent: LearnContentListItem;
  const chance = new Chance();

  beforeEach(() => {
    director = new CourseItemActionsDirector(false);
    builder = new LearnContentListItemActionsBuilder();
    mockContent = {
      name: chance.name(),
      meta: { shared: false, externalCourse: false, status: DevelopmentStatus.DONE },
    } as unknown as LearnContentListItem;
  });

  it('should call reset whenever construct is called', () => {
    const resetSpy = jest.spyOn(builder, 'reset');
    director.construct(builder, mockContent);
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should handle invalid courses', () => {
    director.construct(builder, null);
    expect(builder.build()).toEqual([]);
  });

  describe('when isContentCreator is false', () => {
    beforeEach(() => {
      director = new CourseItemActionsDirector(false);
    });

    it('should build actions for a course that is not shared and enrollable', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_AS_USER,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_EVALUATIONS,
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT_CONTRIBUTORS,
        LEARN_CONTENT_LIST_ITEM_ACTION.DUPLICATE,
        LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER,
        LEARN_CONTENT_LIST_ITEM_ACTION.SHARE,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_STATISTICS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      director.construct(builder, mockContent);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should build actions for a course that is shared', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_AS_USER,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_EVALUATIONS,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_STATISTICS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
      ];
      const sharedContent: LearnContentListItem = { ...mockContent };
      sharedContent.meta['shared'] = true;
      director.construct(builder, sharedContent);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should build actions for a course that is not enrollable', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_AS_USER,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_EVALUATIONS,
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT_CONTRIBUTORS,
        LEARN_CONTENT_LIST_ITEM_ACTION.DUPLICATE,
        LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER,
        LEARN_CONTENT_LIST_ITEM_ACTION.SHARE,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_STATISTICS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      const notEnrollableCourse: LearnContentListItem = { ...mockContent };
      notEnrollableCourse.meta['status'] = DevelopmentStatus.INACTIVATED;
      director.construct(builder, notEnrollableCourse);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should include publish action for course in review and not shared', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_AS_USER,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_EVALUATIONS,
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT_CONTRIBUTORS,
        LEARN_CONTENT_LIST_ITEM_ACTION.DUPLICATE,
        LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER,
        LEARN_CONTENT_LIST_ITEM_ACTION.SHARE,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_STATISTICS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
        LEARN_CONTENT_LIST_ITEM_ACTION.PUBLISH,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      const inReviewCourse: LearnContentListItem = { ...mockContent };
      inReviewCourse.meta['status'] = DevelopmentStatus.IN_REVIEW;
      director.construct(builder, inReviewCourse);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should not include publish action for course in review but shared', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_AS_USER,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_EVALUATIONS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_STATISTICS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
      ];
      const sharedInReviewCourse: LearnContentListItem = { ...mockContent };
      sharedInReviewCourse.meta['status'] = DevelopmentStatus.IN_REVIEW;
      sharedInReviewCourse.meta['shared'] = true;
      director.construct(builder, sharedInReviewCourse);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should exclude external course view as user action', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_EVALUATIONS,
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT_CONTRIBUTORS,
        LEARN_CONTENT_LIST_ITEM_ACTION.DUPLICATE,
        LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER,
        LEARN_CONTENT_LIST_ITEM_ACTION.SHARE,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_STATISTICS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      const externalCourse: LearnContentListItem = { ...mockContent };
      externalCourse.meta['externalCourse'] = true;
      director.construct(builder, externalCourse);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should not include enroll users action for not enrollable course', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_AS_USER,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_EVALUATIONS,
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT_CONTRIBUTORS,
        LEARN_CONTENT_LIST_ITEM_ACTION.DUPLICATE,
        LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER,
        LEARN_CONTENT_LIST_ITEM_ACTION.SHARE,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_STATISTICS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
        LEARN_CONTENT_LIST_ITEM_ACTION.PUBLISH,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      const notEnrollableCourse: LearnContentListItem = { ...mockContent };
      notEnrollableCourse.meta['status'] = DevelopmentStatus.IN_REVIEW;
      director.construct(builder, notEnrollableCourse);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should not include edit, delete, share, duplicate, transfer, edit contributors, and publish for shared content', () => {
      const sharedContent: LearnContentListItem = { ...mockContent };
      sharedContent.meta['shared'] = true;
      director.construct(builder, sharedContent);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.EDIT);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.DELETE);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.SHARE);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.DUPLICATE);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.EDIT_CONTRIBUTORS);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.PUBLISH);
    });
  });

  describe('when isContentCreator is true', () => {
    beforeEach(() => {
      director = new CourseItemActionsDirector(true);
    });

    it('should build actions without contributor actions when isContentCreator is true', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_AS_USER,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_EVALUATIONS,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_STATISTICS,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      director.construct(builder, mockContent);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should build actions for shared course when isContentCreator is true', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_AS_USER,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_EVALUATIONS,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_STATISTICS,
      ];
      const sharedContent: LearnContentListItem = { ...mockContent };
      sharedContent.meta['shared'] = true;
      director.construct(builder, sharedContent);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should include publish action for course in review and not shared when isContentCreator is true', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_AS_USER,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_EVALUATIONS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_STATISTICS,
        LEARN_CONTENT_LIST_ITEM_ACTION.PUBLISH,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      const inReviewCourse: LearnContentListItem = { ...mockContent };
      inReviewCourse.meta['status'] = DevelopmentStatus.IN_REVIEW;
      director.construct(builder, inReviewCourse);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should not include publish action for shared course in review when isContentCreator is true', () => {
      const sharedInReviewCourse: LearnContentListItem = { ...mockContent };
      sharedInReviewCourse.meta['status'] = DevelopmentStatus.IN_REVIEW;
      sharedInReviewCourse.meta['shared'] = true;
      director.construct(builder, sharedInReviewCourse);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.PUBLISH);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.EDIT);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.DELETE);
    });

    it('should not include enroll users action for not enrollable course when isContentCreator is true', () => {
      const notEnrollableCourse: LearnContentListItem = { ...mockContent };
      notEnrollableCourse.meta['status'] = DevelopmentStatus.IN_REVIEW;
      director.construct(builder, notEnrollableCourse);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS);
    });

    it('should exclude view as user for external course when isContentCreator is true', () => {
      const externalCourse: LearnContentListItem = { ...mockContent };
      externalCourse.meta['externalCourse'] = true;
      director.construct(builder, externalCourse);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_AS_USER);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.EDIT);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_EVALUATIONS);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.VIEW_STATISTICS);
    });

    it('should not include vinculate to group action when isContentCreator is true', () => {
      director.construct(builder, mockContent);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP);
    });

    it('should not include edit contributors, duplicate, transfer, and share actions when isContentCreator is true', () => {
      director.construct(builder, mockContent);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.EDIT_CONTRIBUTORS);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.DUPLICATE);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.SHARE);
    });
  });
});
