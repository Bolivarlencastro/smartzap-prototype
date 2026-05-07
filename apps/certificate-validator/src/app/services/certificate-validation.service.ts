import { computed, Injectable, ResourceRef, Signal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CertificateValidationDto, CustomCertificatesApi } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable({ providedIn: 'root' })
export class CertificateValidationService {
  readonly verificationCode = signal<string | undefined>(undefined);
  private readonly validationResource: ResourceRef<CertificateValidationDto>;

  readonly isLoading = computed(() => this.validationResource.isLoading());
  readonly value = computed(() => {
    if (!this.validationResource.hasValue()) {
      return undefined;
    }

    return this.validationResource.value();
  });

  readonly hasError = computed(() => !!this.validationResource.error());

  constructor(private readonly api: CustomCertificatesApi) {
    this.validationResource = this.initValidationResource(this.verificationCode);
  }

  private initValidationResource(verificationCode: Signal<string | undefined>) {
    return rxResource({
      params: () => (verificationCode() ? { verification_code: verificationCode() } : undefined),
      stream: ({ params }) => this.api.validateCertificate(params.verification_code),
    });
  }
}
