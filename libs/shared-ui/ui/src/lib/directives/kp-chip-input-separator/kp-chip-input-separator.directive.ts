import { Directive, HostListener } from '@angular/core';
import { MatChipInput } from '@angular/material/chips';

@Directive({
  selector: '[kpChipInputSeparator]',
  standalone: true,
})
export class KpChipInputSeparatorDirective {
  private _keys: string[] = [';', ','];

  constructor(private chipInput: MatChipInput) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this._keys.includes(event.key)) {
      event.preventDefault();
      this.chipInput._emitChipEnd();
    }
  }
}
