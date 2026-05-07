import { KpNumericRangeInputBaseDirective } from '../directives/kp-numeric-range-input-base.directive';
import { onChildInputKeyUp } from './utils';

describe('onChildInputKeyUp', () => {
  let targetDirective: jest.Mocked<KpNumericRangeInputBaseDirective>;
  let remainingDirective: jest.Mocked<KpNumericRangeInputBaseDirective>;

  beforeEach(() => {
    targetDirective = {
      maxLength: 3,
      value: '100',
      focus: jest.fn(),
    } as unknown as jest.Mocked<KpNumericRangeInputBaseDirective>;

    remainingDirective = {
      maxLength: 3,
      value: '',
      focus: jest.fn(),
    } as unknown as jest.Mocked<KpNumericRangeInputBaseDirective>;
  });

  it('should do nothing when tab is pressed', () => {
    onChildInputKeyUp(targetDirective, remainingDirective, 'Tab', true);

    expect(targetDirective.focus).not.toHaveBeenCalled();
    expect(remainingDirective.focus).not.toHaveBeenCalled();
  });

  it('should do focus the remaining directive when the target value length is zero, backspace is pressed and is not the startInput', () => {
    (targetDirective as any).value = '';
    onChildInputKeyUp(targetDirective, remainingDirective, 'Backspace', false);

    expect(remainingDirective.focus).toHaveBeenCalled();
  });

  it('should do focus the remaining directive when the target value matches the max length', () => {
    onChildInputKeyUp(targetDirective, remainingDirective, '1', true);

    expect(remainingDirective.focus).toHaveBeenCalled();
  });
});
