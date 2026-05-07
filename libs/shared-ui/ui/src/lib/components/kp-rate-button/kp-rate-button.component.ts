import { Component, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'kp-rate-button',
  template: `
    <div
      (click)="disabled ? null : setFormControlValue(position)"
      [class.checked]="formControl.value === position"
      [class.disabled]="disabled"
      [ngClass]="[disabled ? 'cursor-default' : 'cursor-pointer']"
      class="flex justify-center items-center rounded-full border min-h-[40px] min-w-[40px] sm:min-h-[30px] sm:min-w-[30px]"
    >
      {{ position }}
    </div>
  `,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  imports: [NgClass],
})
export class KpRateButtonComponent {
  @Input() kpFormControlName: string;
  @Input() index: number;
  @Input() disabled: boolean;

  constructor(private formGroupDirective: FormGroupDirective) {}

  get position() {
    return this.index + 1 || 0;
  }

  get formControl() {
    return this.formGroupDirective.form.get(this.kpFormControlName);
  }

  setFormControlValue(value: number) {
    this.formControl.setValue(value);
  }
}
