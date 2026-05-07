import { KpLearnContentActionIconPipe } from './kp-learn-content-action-icon.pipe';
import { LEARN_CONTENT_ACTION_MAP, LearnContentCardAction, LearnContentCardActionId } from '../../models';

describe('KpLearnContentActionIconPipe', () => {
  describe('transform', () => {
    const pipe = new KpLearnContentActionIconPipe();

    const cases = Object.entries(LEARN_CONTENT_ACTION_MAP);
    test.each(cases)(
      'should return the correct action icon for action %p',
      (actionID: LearnContentCardActionId, action: LearnContentCardAction) => {
        expect(pipe.transform(actionID)).toBe(action.icon);
      },
    );
  });

  it('should return the action id if not available in the actions map', () => {
    const pipe = new KpLearnContentActionIconPipe();
    expect(pipe.transform('undefinedId' as LearnContentCardActionId)).toBe('undefinedId');
  });
});
