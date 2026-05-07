import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[kpPreventMenuClosedOnTab]',
  standalone: true,
})
export class KpPreventMenuClosedOnTabDirective {
  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.stopPropagation();
    }
  }
}
