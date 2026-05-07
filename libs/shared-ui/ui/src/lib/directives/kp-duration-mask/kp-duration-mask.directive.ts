import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const KP_DURATION_MASK_DIRECTIVE: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => KpDurationMaskDirective),
  multi: true,
};

@Directive({
  selector: '[kpDurationMask]',
  providers: [KP_DURATION_MASK_DIRECTIVE],
  standalone: true,
})
export class KpDurationMaskDirective implements ControlValueAccessor {
  private readonly ERASE_KEYS = ['Delete', 'Backspace'];
  private readonly ARROW_LEFT = 'ArrowLeft';
  private readonly ARROW_RIGHT = 'ArrowRight';
  private readonly TAB = 'Tab';
  private readonly NAV_KEYS = [this.TAB, this.ARROW_LEFT, this.ARROW_RIGHT];
  private readonly NUMBER_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  private readonly ALLOWED_KEYS = ['Escape', 'Enter', ...this.NAV_KEYS, ...this.ERASE_KEYS, ...this.NUMBER_KEYS];

  private onValueChange: (value: string) => void;
  private onTouched: () => void;
  private duration = { hours: '', minutes: '' };
  private _sectionJustFocused = false;

  constructor(
    private _elementRef: ElementRef<HTMLInputElement>,
    private _renderer: Renderer2,
  ) {}

  registerOnChange(fn: any): void {
    this.onValueChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: string): void {
    const regex = /^\d{2}:[0-5]\d/s;
    const validValue = value && typeof value === 'string' && regex.exec(value);
    this.setElementValue(validValue ? value : '00:00');

    this.selectHours();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const key = event.key;

    if (!this.ALLOWED_KEYS.includes(key)) {
      event.preventDefault();
    }

    if (this.NAV_KEYS.includes(key)) {
      this.focusByKeyboard(key, event);
    }

    if (this.ERASE_KEYS.includes(key)) {
      this.clearCurrentSection();
    }

    if (this.NUMBER_KEYS.includes(key)) {
      event.preventDefault();
      this.onNumberInput(key);
    }
  }

  @HostListener('click')
  @HostListener('focus')
  onInteraction() {
    this.focusByInteraction();
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  private focusByInteraction(): void {
    const caretPosition = this.getCaretPosition();
    if (caretPosition > 2) {
      this.selectMinutes();
      return;
    }
    this.selectHours();
  }

  private focusByKeyboard(key: string, event: KeyboardEvent): void {
    const caretPosition = this.getCaretPosition();
    if (key === this.TAB) {
      // We need to check the caret position in order to focus the correct section
      if (caretPosition < 2 && !event.shiftKey) {
        event.preventDefault();
        this.selectMinutes();
      } else if (caretPosition > 2 && event.shiftKey) {
        event.preventDefault();
        this.selectHours();
      }
      // Return used so the user can TAB out of the input
      return;
    }

    const keySelectionMap: Record<string, () => void> = {
      [this.ARROW_RIGHT]: () => this.selectMinutes(),
      [this.ARROW_LEFT]: () => this.selectHours(),
    };

    event.preventDefault();
    keySelectionMap[key]();
  }

  private clearCurrentSection(): void {
    const caretPosition = this.getCaretPosition();
    const { hours, minutes } = this.duration;
    if (caretPosition < 3) {
      this.updateValues('00', minutes);
    } else {
      this.updateValues(hours, '00');
    }
    this.selectHours();
  }

  private onNumberInput(key: string): void {
    const caretPosition = this.getCaretPosition();
    if (caretPosition < 3) {
      this.setHours(key);
    } else {
      this.setMinutes(key);
    }
    this._sectionJustFocused = false;
  }

  private setHours(key: string): void {
    let { hours } = this.duration;
    const { minutes } = this.duration;
    let keepFocus = true;

    const digits = [...hours];
    const firstDigit = digits[0];
    const secondDigit = digits[1];

    if (!firstDigit || this._sectionJustFocused) {
      hours = `0${key}`;
    } else {
      hours = `${secondDigit}${key}`;
      keepFocus = false;
    }

    this.updateValues(hours, minutes);
    if (keepFocus) {
      this.selectHours();
      return;
    }
    this.selectMinutes();
  }

  private setMinutes(key: string): void {
    const { hours } = this.duration;
    let { minutes } = this.duration;

    const digits = [...minutes];
    const firstDigit = digits[0];
    const secondDigit = digits[1];

    if (!firstDigit || this._sectionJustFocused || Number(secondDigit) > 5) {
      minutes = `0${key}`;
    } else {
      minutes = `${secondDigit}${key}`;
    }

    this.updateValues(hours, minutes);
    this.selectMinutes();
  }

  private updateValues(hours: string, minutes: string): void {
    this.duration = { hours, minutes };
    const formattedDuration = `${hours || '00'}:${minutes || '00'}`;
    this.setElementValue(formattedDuration);
    // We only set durations that are longer than 1 second in the FormControl in order to work with the required validator
    const validDuration = formattedDuration !== '00:00';
    this.onValueChange(validDuration ? formattedDuration : '');
  }

  private setElementValue(value: string): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', value || '00:00');
  }

  private selectHours(): void {
    this._elementRef.nativeElement.setSelectionRange(0, 2);
    this._sectionJustFocused = true;
  }

  private selectMinutes(): void {
    this._elementRef.nativeElement.setSelectionRange(3, 5);
    this._sectionJustFocused = true;
  }

  private getCaretPosition(): number {
    return this._elementRef.nativeElement.selectionStart || 0;
  }
}
