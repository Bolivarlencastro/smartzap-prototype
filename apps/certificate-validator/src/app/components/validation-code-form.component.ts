import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'cv-validation-code-form',
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    TranslocoPipe,
    MatLabel,
    MatButton,
    MatIcon,
    MatProgressSpinner,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col md:flex-row items-center gap-4">
      <mat-form-field color="primary" appearance="outline" class="w-full" [subscriptSizing]="'dynamic'">
        <mat-label>{{ 'validation-form.label' | transloco }}</mat-label>
        <input matInput formControlName="code" />
      </mat-form-field>
      <button type="submit" matButton="filled" [disabled]="processing()">
        <div class="flex gap-2 items-center">
          @if (processing()) {
            <mat-progress-spinner diameter="20" mode="indeterminate"></mat-progress-spinner>
            {{ 'validation-form.validating' | transloco }}
          } @else {
            <mat-icon>search</mat-icon>
            {{ 'validation-form.validate' | transloco }}
          }
        </div>
      </button>
    </form>
    <span class="text-xs secondary-text">{{ 'validation-form.hint' | transloco }}</span>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationCodeFormComponent {
  private readonly router = inject(Router);

  readonly form = new FormGroup({ code: new FormControl<string>('') });
  readonly currentCode = input<string>();
  readonly processing = input<boolean>(false);

  constructor() {
    effect(() => {
      const newCode = this.currentCode() ?? '';

      if (this.form.controls.code.value !== newCode) {
        this.form.controls.code.setValue(newCode, { emitEvent: false });
      }
    });
  }

  protected submit(): void {
    const { code } = this.form.value;

    this.router.navigate([], {
      queryParams: { c: code || null },
      queryParamsHandling: 'merge',
    });
  }
}
