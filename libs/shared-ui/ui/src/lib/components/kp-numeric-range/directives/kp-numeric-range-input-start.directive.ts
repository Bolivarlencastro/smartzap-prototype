import { Directive } from '@angular/core';
import { KpNumericRangeInputBaseDirective } from './kp-numeric-range-input-base.directive';

@Directive({
  selector: '[kpNumericRangeStart]',
  standalone: true,
})
export class KpNumericRangeInputStartDirective extends KpNumericRangeInputBaseDirective {}
