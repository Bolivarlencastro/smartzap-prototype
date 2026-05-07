import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ValidationCodeFormComponent } from '../components/validation-code-form.component';
import { ValidationResultComponent } from '../components/validation-result.component';
import { CertificateValidationService } from '../services/certificate-validation.service';

@Component({
  selector: 'cv-validation',
  imports: [TranslocoPipe, ValidationCodeFormComponent, ValidationResultComponent],
  template: `
    <main class="px-4 py-10 md:max-w-240 mx-auto grow">
      <h2 class="text-3xl max-w-prose font-medium text-center mb-8">{{ 'main.cta' | transloco }}</h2>
      <p class="max-w-prose text-center secondary-text mb-12">
        {{ 'main.label' | transloco }}
      </p>
      <div class="card">
        <cv-validation-code-form [currentCode]="c()" [processing]="service.isLoading()"></cv-validation-code-form>
        @if (showResult()) {
          <cv-validation-result
            class="mt-4"
            [valid]="!service.hasError()"
            [data]="service.value()"
            [code]="c()"
          ></cv-validation-result>
        }
      </div>
    </main>
  `,
  styles: `
    :host {
      display: contents;
    }

    .card {
      display: block;
      padding: 2rem;
      border-radius: 1rem;
      border: 1px solid color-mix(in srgb, var(--mat-sys-primary) 5%, transparent);
      @apply shadow;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationComponent {
  protected readonly service = inject(CertificateValidationService);

  readonly c = input<string>();

  protected readonly showResult = computed(() => !!this.c() && !this.service.isLoading());

  constructor() {
    effect(() => {
      this.service.verificationCode.set(this.c());
    });
  }
}
