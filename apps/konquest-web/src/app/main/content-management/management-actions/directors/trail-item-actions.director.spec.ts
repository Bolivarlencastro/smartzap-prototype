import { TrailItemActionsDirector } from './trail-item-actions.director';
import { LearnContentListItemActionsBuilder } from '../learn-content-list-item-actions.builder';
import { LEARN_CONTENT_LIST_ITEM_ACTION } from '../../models/learn-content-list-item-action';
import { LearnContentListItem } from '../../models/learn-content-list-item';
import { Chance } from 'chance';

describe('TrailItemActionsDirector', () => {
  let director: TrailItemActionsDirector;
  let builder: LearnContentListItemActionsBuilder;
  let mockContent: LearnContentListItem;
  const chance = new Chance();

  beforeEach(() => {
    director = new TrailItemActionsDirector(false);
    builder = new LearnContentListItemActionsBuilder();
    mockContent = { name: chance.name(), meta: { isActive: true } } as unknown as LearnContentListItem;
  });

  it('should call reset whenever construct is called', () => {
    const resetSpy = jest.spyOn(builder, 'reset');
    director.construct(builder, mockContent);
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should handle invalid trails', () => {
    director.construct(builder, null);
    expect(builder.build()).toEqual([]);
  });

  describe('when isContentCreator is false', () => {
    beforeEach(() => {
      director = new TrailItemActionsDirector(false);
    });

    it('should build actions for a trail that is enrollable', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      director.construct(builder, mockContent);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should build actions for a trail that is not enrollable', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      const notEnrollableTrail: LearnContentListItem = { ...mockContent };
      notEnrollableTrail.meta['isActive'] = false;
      director.construct(builder, notEnrollableTrail);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should include edit action for all trails', () => {
      const activeTrail: LearnContentListItem = { ...mockContent };
      activeTrail.meta['isActive'] = true;
      director.construct(builder, activeTrail);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.EDIT);

      const inactiveTrail: LearnContentListItem = { ...mockContent };
      inactiveTrail.meta['isActive'] = false;
      director.construct(builder, inactiveTrail);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.EDIT);
    });

    it('should include transfer action when isContentCreator is false', () => {
      director.construct(builder, mockContent);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER);
    });

    it('should include vinculate to group action when isContentCreator is false', () => {
      director.construct(builder, mockContent);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP);
    });

    it('should include enroll users action for active trails', () => {
      const activeTrail: LearnContentListItem = { ...mockContent };
      activeTrail.meta['isActive'] = true;
      director.construct(builder, activeTrail);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS);
    });

    it('should not include enroll users action for inactive trails', () => {
      const inactiveTrail: LearnContentListItem = { ...mockContent };
      inactiveTrail.meta['isActive'] = false;
      director.construct(builder, inactiveTrail);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS);
    });

    it('should include delete action for all trails', () => {
      const activeTrail: LearnContentListItem = { ...mockContent };
      activeTrail.meta['isActive'] = true;
      director.construct(builder, activeTrail);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.DELETE);

      const inactiveTrail: LearnContentListItem = { ...mockContent };
      inactiveTrail.meta['isActive'] = false;
      director.construct(builder, inactiveTrail);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.DELETE);
    });
  });

  describe('when isContentCreator is true', () => {
    beforeEach(() => {
      director = new TrailItemActionsDirector(true);
    });

    it('should build actions for a trail that is enrollable when isContentCreator is true', () => {
      const expectedActions = [
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ];
      director.construct(builder, mockContent);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should build actions for a trail that is not enrollable when isContentCreator is true', () => {
      const expectedActions = [LEARN_CONTENT_LIST_ITEM_ACTION.EDIT, LEARN_CONTENT_LIST_ITEM_ACTION.DELETE];
      const notEnrollableTrail: LearnContentListItem = { ...mockContent };
      notEnrollableTrail.meta['isActive'] = false;
      director.construct(builder, notEnrollableTrail);
      expect(builder.build()).toEqual(expectedActions);
    });

    it('should include edit action for all trails when isContentCreator is true', () => {
      const activeTrail: LearnContentListItem = { ...mockContent };
      activeTrail.meta['isActive'] = true;
      director.construct(builder, activeTrail);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.EDIT);
    });

    it('should not include transfer action when isContentCreator is true', () => {
      director.construct(builder, mockContent);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER);
    });

    it('should not include vinculate to group action when isContentCreator is true', () => {
      director.construct(builder, mockContent);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP);
    });

    it('should include enroll users action for active trails when isContentCreator is true', () => {
      const activeTrail: LearnContentListItem = { ...mockContent };
      activeTrail.meta['isActive'] = true;
      director.construct(builder, activeTrail);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS);
    });

    it('should not include enroll users action for inactive trails when isContentCreator is true', () => {
      const inactiveTrail: LearnContentListItem = { ...mockContent };
      inactiveTrail.meta['isActive'] = false;
      director.construct(builder, inactiveTrail);
      expect(builder.build()).not.toContain(LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS);
    });

    it('should include delete action for all trails when isContentCreator is true', () => {
      const activeTrail: LearnContentListItem = { ...mockContent };
      activeTrail.meta['isActive'] = true;
      director.construct(builder, activeTrail);
      expect(builder.build()).toContain(LEARN_CONTENT_LIST_ITEM_ACTION.DELETE);
    });

    it('should build correct actions for active trail when isContentCreator is true', () => {
      const activeTrail: LearnContentListItem = { ...mockContent };
      activeTrail.meta['isActive'] = true;
      director.construct(builder, activeTrail);
      expect(builder.build()).toEqual([
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ]);
    });

    it('should build correct actions for inactive trail when isContentCreator is true', () => {
      const inactiveTrail: LearnContentListItem = { ...mockContent };
      inactiveTrail.meta['isActive'] = false;
      director.construct(builder, inactiveTrail);
      expect(builder.build()).toEqual([LEARN_CONTENT_LIST_ITEM_ACTION.EDIT, LEARN_CONTENT_LIST_ITEM_ACTION.DELETE]);
    });
  });
});
