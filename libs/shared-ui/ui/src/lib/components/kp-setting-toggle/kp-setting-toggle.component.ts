import { coerceBooleanProperty } from '@angular/cdk/coercion';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggle, MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fuseAnimations } from '@keeps-platform-frontend-workspace/layout';

@Component({
  selector: 'kp-setting-toggle',
  imports: [MatSlideToggleModule, MatTooltipModule, MatIconModule, ReactiveFormsModule],
  styles: [
    `
      :host {
        @apply min-h-20 flex justify-between items-center pr-4;
      }
    `,
  ],
  template: `
    <div class="flex gap-2 items-center">
      <p>{{ label }}</p>
      @if (settingTooltip) {
        <mat-icon class="s-4 filled" [matTooltip]="settingTooltip">info</mat-icon>
      }
    </div>
    <div class="flex items-center gap-3">
      @if (checked) {
        <div [@fadeInOut]>
          <ng-content></ng-content>
        </div>
      }
      @if (toggleFormControlName) {
        <mat-slide-toggle
          #slideToggle
          [formControlName]="toggleFormControlName"
          (change)="onToggleChange($event)"
        ></mat-slide-toggle>
      } @else {
        <mat-slide-toggle
          #slideToggle
          (change)="onToggleChange($event)"
          [checked]="checked"
          [disabled]="disableSimpleToggle"
        ></mat-slide-toggle>
      }
    </div>
  `,
  animations: fuseAnimations,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpSettingToggleComponent {
  @Input() label!: string;
  @Input() settingTooltip: string;
  @Input() toggleFormControlName!: string;
  @Input() disableSimpleToggle: boolean;
  @Output() toggleChange = new EventEmitter<MatSlideToggleChange>();
  @ViewChild('slideToggle') toggle: MatSlideToggle;
  private _checked: boolean;

  constructor(private _cdr: ChangeDetectorRef) {}

  @Input()
  set checked(checked: boolean) {
    this._checked = coerceBooleanProperty(checked);
    this._cdr.markForCheck();
  }

  get checked(): boolean {
    return this._checked || this.toggle?.checked;
  }

  onToggleChange(event: MatSlideToggleChange): void {
    this.checked = event.checked;
    this.toggleChange.emit(event);
  }
}
