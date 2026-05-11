import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';
import { CustomCertificateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CertificateCreatePreviewComponent } from '../certificate-create-preview/certificate-create-preview.component';
import { CertificateImageUploadComponent } from '../certificate-image-upload/certificate-image-upload.component';
import { CertificateImageDefinition } from '../../model';

type FormControls<T> = { [K in keyof T]: FormControl<T[K]> };
export type CertificateImageEvent = { imageDef: CertificateImageDefinition; image: File };

@Component({
  selector: 'kp-certificate-create-form',
  templateUrl: './certificate-create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    TranslocoPipe,
    ReactiveFormsModule,
    MatTabsModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDialogModule,
    CertificateCreatePreviewComponent,
    CertificateImageUploadComponent,
    MatProgressSpinnerModule,
  ],
})
export class CertificateCreateFormComponent {
  readonly certificate = input<CustomCertificateDto | null>();
  readonly isSaving = input<boolean | null>(false);

  readonly formSubmit = output<CustomCertificateDto>();
  readonly saveImage = output<CertificateImageEvent>();

  readonly form: FormGroup<FormControls<CustomCertificateDto>>;

  get isEditing(): boolean {
    return !!this.certificate();
  }

  get saveButtonLabel(): string {
    return this.isEditing
      ? 'CUSTOM_CERTIFICATES.CREATE_DIALOG.ACTIONS.SAVE'
      : 'CUSTOM_CERTIFICATES.CREATE_DIALOG.ACTIONS.CREATE';
  }

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group<FormControls<CustomCertificateDto>>({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      orientation: new FormControl('landscape'),
      template: new FormControl('mission' as CustomCertificateDto['template']),
      textColor: new FormControl('#000000'),
      backgroundImage: new FormControl(''),
      brandImage: new FormControl(''),
      signedBy: new FormControl('', Validators.maxLength(30)),
      displayBrand: new FormControl(true),
      displayPerformance: new FormControl(true),
      displayTotalTime: new FormControl(true),
      displayConclusionDate: new FormControl(true),
      default: new FormControl(false),
      backgroundColor: new FormControl(''),
    });

    effect(() => {
      const cert = this.certificate();
      if (cert) {
        this.form.patchValue(cert);
      }
    });
  }

  onSubmit() {
    const certificate = this.form.getRawValue() as CustomCertificateDto;
    this.formSubmit.emit(certificate);
  }

  onColorChange(field: 'backgroundColor' | 'textColor', event: Event) {
    const input = event.target as HTMLInputElement;
    this.form.get(field)?.setValue(input.value);
  }

  onImageSelected(image: File, imageDef: CertificateImageDefinition) {
    this.saveImage.emit({ image, imageDef });
  }

  onImageRemoved(imageDef: CertificateImageDefinition) {
    if (imageDef === 'brandImage') {
      this.form.get('brandImage')?.setValue(null);
    } else {
      this.form.get('backgroundImage')?.setValue(null);
    }
  }
}
