import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostBinding,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';

import { MatFormFieldControl } from '@angular/material/form-field';
import { AbstractControlDirective, NgControl } from '@angular/forms';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { KpNumericRangeInputEndDirective, KpNumericRangeInputStartDirective } from '../directives';
import { A11yModule, FocusOrigin } from '@angular/cdk/a11y';
import { onChildInputKeyUp } from './utils';

@Component({
  selector: 'kp-numeric-range',
  imports: [A11yModule],
  templateUrl: './kp-numeric-range.component.html',
  styleUrls: ['kp-numeric-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatFormFieldControl, useExisting: KpNumericRangeComponent }],
  encapsulation: ViewEncapsulation.None,
})
export class KpNumericRangeComponent implements MatFormFieldControl<any>, AfterContentInit, OnDestroy {
  private static _nextId = 0;

  static get nextId(): number {
    return this._nextId;
  }

  static set nextId(value: number) {
    this._nextId = value;
  }

  private valueChangesSub: Subscription;
  private _stateChanges = new Subject<void>();
  readonly stateChanges: Observable<void> = this._stateChanges.asObservable();
  focused = false;

  @Input() separator = '–';

  @HostBinding()
  id = `kp-numeric-range-${KpNumericRangeComponent.nextId++}`;

  @ContentChild(KpNumericRangeInputStartDirective) startInput: KpNumericRangeInputStartDirective;
  @ContentChild(KpNumericRangeInputEndDirective) endInput: KpNumericRangeInputStartDirective;

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  get disabled(): boolean {
    return this.startInput.disabled && this.endInput.disabled;
  }

  get empty(): boolean {
    return this.startInput.empty && this.endInput.empty;
  }

  get errorState(): boolean {
    return this.startInput.invalid || this.endInput.invalid;
  }

  onContainerClick(): void {
    if (this.focused || this.disabled) {
      return;
    }

    if (this.startInput.empty) {
      this.startInput.focus();
      return;
    }

    this.endInput.focus();
  }

  ngAfterContentInit() {
    if (!this.startInput || !this.endInput) {
      return;
    }

    this.valueChangesSub = merge(this.startInput.valueChanges, this.endInput.valueChanges).subscribe(() => {
      this._stateChanges.next();
    });
    this.setOnKeyUpListeners();
  }

  ngOnDestroy() {
    this.valueChangesSub?.unsubscribe();
  }

  focusChanged(origin: FocusOrigin) {
    this.focused = origin !== null;
    this._stateChanges.next();
  }

  private setOnKeyUpListeners() {
    this.startInput.onKeyUp = this.onStartInput;
    this.endInput.onKeyUp = this.onEndInput;
  }

  private onStartInput = (keyCode: string) => {
    onChildInputKeyUp(this.startInput, this.endInput, keyCode, true);
  };

  private onEndInput = (keyCode: string) => {
    onChildInputKeyUp(this.endInput, this.startInput, keyCode, false);
  };

  /**
   * Implemented as a part of `MatFormFieldControl`.
   * @docs-private
   */
  value: string;
  placeholder: string;
  ngControl: NgControl | AbstractControlDirective;
  required: boolean;
  controlType?: string;
  autofilled?: boolean;
  userAriaDescribedBy?: string;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDescribedByIds(): void {
    return;
  }
}
