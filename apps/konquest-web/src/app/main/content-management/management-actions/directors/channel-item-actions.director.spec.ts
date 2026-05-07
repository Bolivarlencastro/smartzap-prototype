import { ChannelItemActionsDirector } from './channel-item-actions.director';
import { LearnContentListItemActionsBuilder } from '../learn-content-list-item-actions.builder';
import { LearnContentListItem } from '../../models/learn-content-list-item';
import { LEARN_CONTENT_LIST_ITEM_ACTION } from '../../models/learn-content-list-item-action';

describe('ChannelItemActionsDirector', () => {
  let builder: LearnContentListItemActionsBuilder;

  beforeEach(() => {
    builder = new LearnContentListItemActionsBuilder();
  });

  it('should call reset whenever construct is called', () => {
    const director = new ChannelItemActionsDirector(false);
    const resetSpy = jest.spyOn(builder, 'reset');

    director.construct(builder, { meta: {} } as LearnContentListItem);

    expect(resetSpy).toHaveBeenCalled();
  });

  it('should handle null content', () => {
    const director = new ChannelItemActionsDirector(false);

    director.construct(builder, null);

    expect(builder.build()).toEqual([]);
  });

  describe('when forceFilteringOnlyManaged is false', () => {
    let director: ChannelItemActionsDirector;

    beforeEach(() => {
      director = new ChannelItemActionsDirector(false);
    });

    it('should include edit, manage pulses, edit contributors, transfer, vinculate to group, and delete when user is not a contributor', () => {
      const content = { meta: { isContributor: false } } as unknown as LearnContentListItem;

      director.construct(builder, content);

      expect(builder.build()).toEqual([
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_PULSES,
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT_CONTRIBUTORS,
        LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ]);
    });

    it('should include edit, manage pulses, edit contributors, and transfer but not vinculate to group or delete when user is a contributor', () => {
      const content = { meta: { isContributor: true } } as unknown as LearnContentListItem;

      director.construct(builder, content);

      expect(builder.build()).toEqual([
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_PULSES,
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT_CONTRIBUTORS,
        LEARN_CONTENT_LIST_ITEM_ACTION.TRANSFER,
      ]);
    });
  });

  describe('when forceFilteringOnlyManaged is true', () => {
    let director: ChannelItemActionsDirector;

    beforeEach(() => {
      director = new ChannelItemActionsDirector(true);
    });

    it('should include edit, manage pulses, vinculate to group, and delete but not edit contributors or transfer when user is not a contributor', () => {
      const content = { meta: { isContributor: false } } as unknown as LearnContentListItem;

      director.construct(builder, content);

      expect(builder.build()).toEqual([
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_PULSES,
        LEARN_CONTENT_LIST_ITEM_ACTION.VINCULATE_TO_GROUP,
        LEARN_CONTENT_LIST_ITEM_ACTION.DELETE,
      ]);
    });

    it('should include edit and manage pulses when user is a contributor', () => {
      const content = { meta: { isContributor: true } } as unknown as LearnContentListItem;

      director.construct(builder, content);

      expect(builder.build()).toEqual([
        LEARN_CONTENT_LIST_ITEM_ACTION.EDIT,
        LEARN_CONTENT_LIST_ITEM_ACTION.MANAGE_PULSES,
      ]);
    });
  });
});
