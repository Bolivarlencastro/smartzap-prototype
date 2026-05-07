import { KpLearnContentActionLabelPipe } from './kp-learn-content-action.pipe';
import { LEARN_CONTENT_ACTION_MAP, LearnContentCardAction, LearnContentCardActionId } from '../../models';

describe('KpLearnContentActionPipe', () => {
  describe('transform', () => {
    const pipe = new KpLearnContentActionLabelPipe();

    const cases = Object.entries(LEARN_CONTENT_ACTION_MAP);
    test.each(cases)(
      'should return the correct action label for action %p',
      (actionID: LearnContentCardActionId, action: LearnContentCardAction) => {
        expect(pipe.transform(actionID)).toBe(action.label);
      },
    );
  });

  it('should return the action id if not available in the actions map', () => {
    const pipe = new KpLearnContentActionLabelPipe();
    expect(pipe.transform('undefinedId' as LearnContentCardActionId)).toBe('undefinedId');
  });
});
