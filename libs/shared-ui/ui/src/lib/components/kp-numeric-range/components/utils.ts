import { KpNumericRangeInputBaseDirective } from '../directives/kp-numeric-range-input-base.directive';

export function onChildInputKeyUp(
  targetDirective: KpNumericRangeInputBaseDirective,
  remainingDirective: KpNumericRangeInputBaseDirective,
  keyCode: string,
  isStartInput: boolean,
) {
  const maxLength = targetDirective.maxLength;
  const currentLength = targetDirective.value?.length;

  if (keyCode === 'Tab') {
    return;
  }

  if (!isStartInput && currentLength === 0 && keyCode === 'Backspace') {
    remainingDirective.focus();
    return;
  }

  if (isStartInput && maxLength === currentLength) {
    remainingDirective.focus();
  }
}
