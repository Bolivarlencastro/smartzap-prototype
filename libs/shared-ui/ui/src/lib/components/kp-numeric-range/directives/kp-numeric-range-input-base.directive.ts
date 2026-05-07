import { AfterViewInit, Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[kpNumericRangeInputBase]',
  standalone: true,
})
export class KpNumericRangeInputBaseDirective implements OnDestroy, AfterViewInit {
  private valueChangesSub: Subscription;
  private readonly inputChange = new Subject<void>();
  public readonly valueChanges = this.inputChange.asObservable();

  @Input({ required: true }) maxLength: number;
  @HostBinding('class') classes = 'kp-numeric-range-input-part';

  public onKeyUp: (keyCode: string) => void;

  constructor(
    private control: NgControl,
    private elementRef: ElementRef<HTMLInputElement>,
  ) {}

  get empty(): boolean {
    return !this.control.value;
  }

  get disabled(): boolean {
    return this.control.disabled;
  }

  get invalid(): boolean {
    return this.control.touched && this.control.invalid;
  }

  get value(): string {
    return this.control.value;
  }

  @HostListener('input')
  inputChanged() {
    this.inputChange.next();
  }

  @HostListener('keyup', ['$event.key'])
  keyUp(eventKey: string) {
    if (this.onKeyUp) {
      this.onKeyUp(eventKey);
    }
  }

  ngAfterViewInit() {
    this.valueChangesSub = this.control.valueChanges.subscribe(() => {
      this.inputChange.next();
    });
  }

  ngOnDestroy() {
    this.valueChangesSub?.unsubscribe();
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}
