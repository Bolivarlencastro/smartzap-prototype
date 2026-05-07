import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

interface KpRange {
  from: string;
  to: string;
}

@Component({
  selector: 'kp-percent-range-input',
  templateUrl: './kp-percent-range-input.component.html',
  styleUrls: ['./kp-percent-range-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatFormFieldControl, useExisting: KpPercentRangeInputComponent }, provideNgxMask()],
  imports: [FormsModule, ReactiveFormsModule, NgxMaskDirective],
})
export class KpPercentRangeInputComponent implements OnInit, ControlValueAccessor, OnDestroy {
  private _fromPlaceholder: string;
  private _toPlaceholder: string;
  private _required = false;
  private _disabled = false;

  private static _nextId = 0;

  static get nextId(): number {
    return this._nextId;
  }

  static set nextId(value: number) {
    this._nextId = value;
  }

  @ViewChild('from') fromInput: HTMLInputElement;
  @ViewChild('to') toInput: HTMLInputElement;
  @Input() mask: string;
  @Input() suffix: string;
  @Input() maxLength: number;
  @Input() spacer = '-';
  @Input() normalizeFn: (value: string) => string;
  @Input() reverseNormalizeFn: (value: string) => string;
  @Input() maxRange!: string;
  @Input() minRange!: string;

  parts = new FormGroup({
    from: new FormControl<string>(''),
    to: new FormControl<string>(''),
  });

  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'kp-percent-range-input';
  id = `kp-range-input-${KpPercentRangeInputComponent.nextId++}`;
  onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    const {
      value: { from, to },
    } = this.parts;

    return !from && !to;
  }

  @HostBinding('attr.id')
  get hostId() {
    return this.id;
  }

  @HostBinding('class.kp-percent-range-input-floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  set fromPlaceholder(value: string) {
    this._fromPlaceholder = value;
    this.stateChanges.next();
  }

  get fromPlaceholder(): string {
    return this._fromPlaceholder;
  }

  @Input()
  set toPlaceholder(value: string) {
    this._toPlaceholder = value;
    this.stateChanges.next();
  }

  get toPlaceholder(): string {
    return this._toPlaceholder;
  }

  get placeholder(): string {
    return `${this.fromPlaceholder} - ${this.toPlaceholder}`;
  }

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    if (this._disabled) {
      this.parts.disable();
    } else {
      this.parts.enable();
    }
    this.stateChanges.next();
  }

  @Input()
  get value(): KpRange | null {
    if (this.parts.valid) {
      const {
        value: { from, to },
      } = this.parts;
      return { from: this.applyNormalization(from), to: this.applyNormalization(to) };
    }
    return null;
  }

  set value(range: KpRange | null) {
    const { from, to } = range || { from: '', to: '' };
    this.parts.setValue({ from: this.applyReverseNormalization(from), to: this.applyReverseNormalization(to) });
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return this.parts.invalid && this.touched;
  }

  constructor(
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    if (this.maxLength) {
      const fromControl = this.parts.get('from');
      const toControl = this.parts.get('to');
      fromControl?.setValidators(Validators.maxLength(this.maxLength));
      toControl?.setValidators(Validators.maxLength(this.maxLength));
      fromControl?.updateValueAndValidity();
      toControl?.updateValueAndValidity();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  onFocusIn(_event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (
      nextElement &&
      !control.errors &&
      (control.value.length === (this.maxLength || this.mask.length) ||
        (control.value.length === this.maxLength - 1 && control.value !== '10'))
    ) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program');
      this.parts.patchValue({ to: this.minRange });
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement.querySelector('.kp-percent-range-input-container');
    controlElement?.setAttribute('aria-describedby', ids.join(' '));
  }

  writeValue(range: KpRange | null): void {
    this.value = range;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    const val = control.value;

    if (nextElement) {
      this.handleWithNextElement(val);
    } else {
      this.handleNoNextElement(val);
    }

    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }

  private handleWithNextElement(val: string): void {
    if (val.length < 1) {
      this._revertInput(this.minRange, 'from');
    }

    if (val.length > 1 && val.at(0) === '0') {
      this._revertInput(val.slice(1), 'from');
    }

    if (+val > +this.maxRange) {
      this._revertInput(this.maxRange, 'from');
    }
  }

  private handleNoNextElement(val: string): void {
    if (+val > +this.maxRange) {
      this._revertInput(this.maxRange, 'to');
    }

    if (val.length === this.maxLength - 1 && val.at(0) === '0') {
      this._revertInput(val.slice(1), 'to');
    }

    if (val.length >= this.maxLength && val.at(0) === '0') {
      this._revertInput(val.slice(1), 'to');
    }
  }

  private _revertInput(value: string, inputToRevert: string): void {
    this.parts.patchValue({ [inputToRevert]: value });
  }

  private applyNormalization(value: string): string {
    if (this.normalizeFn) {
      return this.normalizeFn(value);
    }
    return value;
  }

  private applyReverseNormalization(value: string): string {
    if (this.reverseNormalizeFn) {
      return this.reverseNormalizeFn(value);
    }
    return value;
  }
}
