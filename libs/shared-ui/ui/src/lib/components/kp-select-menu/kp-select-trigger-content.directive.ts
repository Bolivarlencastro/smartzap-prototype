import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[kpSelectTriggerContent]',
  standalone: true,
})
export class KpSelectTriggerContentDirective {
  @HostBinding('class') get classList(): string {
    return 'kp-select-trigger-content';
  }
}
