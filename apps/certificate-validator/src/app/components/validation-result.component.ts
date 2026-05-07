import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { CertificateValidationDto } from '@keeps-platform-frontend-workspace/kp-keeps';

@Component({
  selector: 'cv-validation-result',
  imports: [TranslocoPipe, MatIcon, MatButton, DatePipe],
  template: `
    <p class="font-bold text-sm flex items-center gap-2 mb-4">
      <mat-icon>{{ icon() }}</mat-icon>
      {{ title() | transloco }}
    </p>
    @if (valid()) {
      <div class="result-data mb-4">
        <span>{{ 'validation-result.owner' | transloco }}:</span>
        <span>{{ data()?.userName }}</span>
        <span>{{ 'validation-result.course' | transloco }}:</span>
        <span>{{ data()?.courseName }}</span>
        <span>{{ 'validation-result.issue-date' | transloco }}:</span>
        <span>{{ data()?.issuedAt | date }}</span>
        <span>{{ 'validation-result.issuer' | transloco }}:</span>
        <span>{{ data()?.issuerName }}</span>
      </div>
      <a matButton="filled" [href]="data()?.pdfUrl" target="_blank">
        <mat-icon>download</mat-icon>
        {{ 'validation-result.download-copy' | transloco }}
      </a>
    } @else {
      <p class="mb-2" [innerHTML]="'validation-result.invalid-label' | transloco: { value: code() }"></p>
      <p>{{ 'validation-result.contact-tip' | transloco }}</p>
    }
  `,
  styles: `
    :host {
      display: block;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid;
      font-size: 14px;
    }

    .result-data {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem;
    }
  `,
  host: {
    '[style.background]': `background()`,
    '[style.border-color]': `borderColor()`,
    '[style.color]': `textColor()`,
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationResultComponent {
  code = input<string>();
  data = input<CertificateValidationDto | undefined>();
  valid = input<boolean>(true);
  icon = computed(() => {
    return this.valid() ? 'verified' : 'verified_off';
  });
  title = computed(() => {
    return this.valid() ? 'validation-result.valid' : 'validation-result.invalid';
  });
  background = computed(() => {
    const color = this.valid() ? 'var(--mat-sys-primary)' : 'var(--mat-sys-error)';
    return `color-mix(in srgb, ${color} 15%, transparent)`;
  });
  borderColor = computed(() => {
    return this.valid() ? 'var(--mat-sys-primary)' : 'var(--mat-sys-error)';
  });
  textColor = computed(() => {
    return this.valid() ? 'var(--mat-sys-primary)' : 'var(--mat-sys-error)';
  });
}
