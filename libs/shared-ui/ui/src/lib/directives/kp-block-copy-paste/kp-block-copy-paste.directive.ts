import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[kpBlockCopyPaste]',
  standalone: true,
})
export class KpBlockCopyPasteDirective {
  @HostListener('copy', ['$event'])
  @HostListener('cut', ['$event'])
  @HostListener('paste', ['$event'])
  onEvent(event: ClipboardEvent): void {
    event.preventDefault();
  }
}
