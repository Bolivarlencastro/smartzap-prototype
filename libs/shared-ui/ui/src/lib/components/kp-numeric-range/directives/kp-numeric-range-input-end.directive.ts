import { Directive } from '@angular/core';
import { KpNumericRangeInputBaseDirective } from './kp-numeric-range-input-base.directive';

@Directive({
  selector: '[kpNumericRangeEnd]',
  standalone: true,
})
export class KpNumericRangeInputEndDirective extends KpNumericRangeInputBaseDirective {}
