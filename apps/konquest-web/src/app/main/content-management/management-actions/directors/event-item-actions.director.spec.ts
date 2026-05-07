import { EventItemActionsDirector } from './event-item-actions.director';
import { LearnContentListItemActionsBuilder } from '../learn-content-list-item-actions.builder';
import { LearnContentListItem } from '../../models/learn-content-list-item';
import { LEARN_CONTENT_LIST_ITEM_ACTION } from '../../models/learn-content-list-item-action';
import { Chance } from 'chance';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('EventItemActionsDirector', () => {
  let director: EventItemActionsDirector;
  let builder: LearnContentListItemActionsBuilder;
  let mockContent: LearnContentListItem;
  const chance = new Chance();

  beforeEach(() => {
    director = new EventItemActionsDirector(false);
    builder = new LearnContentListItemActionsBuilder();
    mockContent = {
      name: chance.name(),
      enrollable: true,
      meta: { status: DevelopmentStatus.DONE },
    } as unknown as LearnContentListItem;
  });

  it('should call reset whenever construct is called', () => {
    const resetSpy = jest.spyOn(builder, 'reset');
    director.construct(builder, mockContent);
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should handle invalid events', () => {
    director.construct(builder, null);
    expect(builder.build()).toEqual([]);
  });

  describe('when isContentCreator is false', () => {
    beforeEach(() => {
      director = new EventItemActionsDirector(false);
    });

    it('should build actions for an event that is enrollable and not finished', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.FINISH_EVENT,
        LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_ENROLLMENTS,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      director.construct(builder, mockContent);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should build actions for an event that is finished', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_ENROLLMENTS,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      const finishedEvent: LearnContentListItem = { ...mockContent };
      finishedEvent.meta['status'] = 'FINISHED';
      director.construct(builder, finishedEvent);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should be possible to finish an event that is in the DONE development status', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.FINISH_EVENT,
        LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_ENROLLMENTS,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      const notEnrollableEvent: LearnContentListItem = { ...mockContent };
      notEnrollableEvent.meta['status'] = DevelopmentStatus.DONE;
      director.construct(builder, notEnrollableEvent);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should build the correct actions for a closed event', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_ENROLLMENTS,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      const notEnrollableEvent: LearnContentListItem = { ...mockContent };
      notEnrollableEvent.meta['status'] = DevelopmentStatus.CLOSED;
      director.construct(builder, notEnrollableEvent);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should build the correct actions for a finished event', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_ENROLLMENTS,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      const notEnrollableEvent: LearnContentListItem = { ...mockContent };
      notEnrollableEvent.meta['status'] = 'FINISHED';
      director.construct(builder, notEnrollableEvent);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should not include finish event action for finished event', () => {
      const finishedEvent: LearnContentListItem = { ...mockContent };
      finishedEvent.meta['status'] = 'FINISHED';
      director.construct(builder, finishedEvent);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.FINISH_EVENT);
    });

    it('should include finish event action for DONE status event', () => {
      const doneEvent: LearnContentListItem = { ...mockContent };
      doneEvent.meta['status'] = DevelopmentStatus.DONE;
      director.construct(builder, doneEvent);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.FINISH_EVENT);
    });

    it('should include manage enrollments action for all events', () => {
      const doneEvent: LearnContentListItem = { ...mockContent };
      doneEvent.meta['status'] = DevelopmentStatus.DONE;
      director.construct(builder, doneEvent);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_ENROLLMENTS);

      const finishedEvent: LearnContentListItem = { ...mockContent };
      finishedEvent.meta['status'] = 'FINISHED';
      director.construct(builder, finishedEvent);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_ENROLLMENTS);
    });

    it('should include enroll users action for enrollable events', () => {
      const doneEvent: LearnContentListItem = { ...mockContent };
      doneEvent.meta['status'] = DevelopmentStatus.DONE;
      director.construct(builder, doneEvent);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS);

      const closedEvent: LearnContentListItem = { ...mockContent };
      closedEvent.meta['status'] = DevelopmentStatus.CLOSED;
      director.construct(builder, closedEvent);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS);
    });

    it('should not include enroll users action for non-enrollable events', () => {
      const inReviewEvent: LearnContentListItem = { ...mockContent };
      inReviewEvent.meta['status'] = DevelopmentStatus.IN_REVIEW;
      director.construct(builder, inReviewEvent);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS);
    });

    it('should include vinculate to group action when isContentCreator is false', () => {
      director.construct(builder, mockContent);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP);
    });

    it('should include delete action for all events', () => {
      director.construct(builder, mockContent);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.DELETE);
    });
  });

  describe('when isContentCreator is true', () => {
    beforeEach(() => {
      director = new EventItemActionsDirector(true);
    });

    it('should build actions for an event that is enrollable and not finished when isContentCreator is true', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.FINISH_EVENT,
        LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_ENROLLMENTS,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      director.construct(builder, mockContent);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should build actions for an event that is finished when isContentCreator is true', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_ENROLLMENTS,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      const finishedEvent: LearnContentListItem = { ...mockContent };
      finishedEvent.meta['status'] = 'FINISHED';
      director.construct(builder, finishedEvent);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should not include vinculate to group action when isContentCreator is true', () => {
      director.construct(builder, mockContent);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP);
    });

    it('should include finish event action for DONE status event when isContentCreator is true', () => {
      const doneEvent: LearnContentListItem = { ...mockContent };
      doneEvent.meta['status'] = DevelopmentStatus.DONE;
      director.construct(builder, doneEvent);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.FINISH_EVENT);
    });

    it('should include manage enrollments action for all events when isContentCreator is true', () => {
      const finishedEvent: LearnContentListItem = { ...mockContent };
      finishedEvent.meta['status'] = 'FINISHED';
      director.construct(builder, finishedEvent);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_ENROLLMENTS);
    });

    it('should include enroll users action for enrollable events when isContentCreator is true', () => {
      const closedEvent: LearnContentListItem = { ...mockContent };
      closedEvent.meta['status'] = DevelopmentStatus.CLOSED;
      director.construct(builder, closedEvent);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS);
    });

    it('should include delete action for all events when isContentCreator is true', () => {
      director.construct(builder, mockContent);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.DELETE);
    });

    it('should build correct actions for IN_REVIEW status event when isContentCreator is true', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_ENROLLMENTS,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      const inReviewEvent: LearnContentListItem = { ...mockContent };
      inReviewEvent.meta['status'] = DevelopmentStatus.IN_REVIEW;
      director.construct(builder, inReviewEvent);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should build correct actions for INACTIVATED status event when isContentCreator is true', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_ENROLLMENTS,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      const inactivatedEvent: LearnContentListItem = { ...mockContent };
      inactivatedEvent.meta['status'] = DevelopmentStatus.INACTIVATED;
      director.construct(builder, inactivatedEvent);
      expect(builder.build()).toEqual(expectedActions);
    });
  });
});
