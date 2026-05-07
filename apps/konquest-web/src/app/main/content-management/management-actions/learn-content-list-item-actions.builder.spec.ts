import { LearnContentListItemActionsBuilder } from './learn-content-list-item-actions.builder';

describe('LearnContentListItemActionsBuilder', () => {
  it('should build an empty list of actions by default', () => {
    const builder = new LearnContentListItemActionsBuilder();
    const result = builder.build();
    expect(result).toEqual([]);
  });

  it('should clear all actions when reset is called', () => {
    const builder = new LearnContentListItemActionsBuilder();
    builder.withDeleteAction().withDuplicateAction();
    builder.reset();
    const result = builder.build();
    expect(result).toEqual([]);
  });
});
