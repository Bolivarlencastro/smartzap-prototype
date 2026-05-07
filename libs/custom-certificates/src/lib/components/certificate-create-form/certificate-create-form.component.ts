import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  CustomCertificateDto,
  CustomCertificateTemplate,
  FormControlsFromType,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoModule } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { CertificateCreatePreviewComponent } from '../certificate-create-preview/certificate-create-preview.component';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { CertificateImageUploadComponent } from '../certificate-image-upload/certificate-image-upload.component';
import { CertificateImageDefinition } from '../../models/certificate-image-definition';
import { CUSTOM_CERTIFICATE_DEFAULT_IMAGES } from '../../certificate-constants';

type CertificateForm = FormControlsFromType<CustomCertificateDto>;
type CertificateColorDef = keyof Pick<CustomCertificateDto, 'backgroundColor' | 'textColor'>;
export type CertificateImageEvent = { imageDef: CertificateImageDefinition; image: File };

@Component({
  selector: 'kp-certificate-create-form',
  imports: [
    MatFormFieldModule,
    TranslocoModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    CertificateCreatePreviewComponent,
    MatIconModule,
    CertificateImageUploadComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './certificate-create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateCreateFormComponent implements OnChanges {
  @Output() formSubmit = new EventEmitter<CustomCertificateDto>();
  @Output() saveImage = new EventEmitter<CertificateImageEvent>();
  @Input() fixedTemplate: CustomCertificateTemplate;
  @Input() certificate: CustomCertificateDto;
  @Input() isSaving: boolean;
  editingCertificate: boolean;

  readonly form: FormGroup<CertificateForm>;
  protected backgroundImageSrc = CUSTOM_CERTIFICATE_DEFAULT_IMAGES.landscape;

  get saveButtonLabel() {
    return this.editingCertificate
      ? marker('CUSTOM_CERTIFICATES.CREATE_DIALOG.ACTIONS.SAVE')
      : marker('CUSTOM_CERTIFICATES.CREATE_DIALOG.ACTIONS.CREATE');
  }

  constructor(formBuilder: FormBuilder) {
    this.form = this.buildForm(formBuilder);
  }

  onSubmit(): void {
    const certificate = this.form.getRawValue();
    this.formSubmit.emit(certificate);
  }

  onColorChange(field: CertificateColorDef, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.get(field).setValue(input.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['certificate']) {
      this.editingCertificate = !!this.certificate;
      this.patchForm(this.certificate, this.form);
    }
  }

  private buildForm(formBuilder: FormBuilder): FormGroup<CertificateForm> {
    return formBuilder.group<CertificateForm>({
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      orientation: new FormControl('landscape'),
      template: new FormControl(null, Validators.required),
      textColor: new FormControl('#000000'),
      backgroundImage: new FormControl(''),
      signedBy: new FormControl('', Validators.maxLength(30)),
      displayBrand: new FormControl(true),
      displayPerformance: new FormControl(true),
      displayTotalTime: new FormControl(true),
      displayConclusionDate: new FormControl(true),
      default: new FormControl(false),
      brandImage: new FormControl(''),
    });
  }

  private patchForm(certificate: CustomCertificateDto, form: FormGroup<CertificateForm>) {
    if (!certificate) {
      return;
    }

    form.patchValue(certificate);
    this.backgroundImageSrc = certificate?.backgroundImage;
  }

  onImageSelected(image: File, imageDef: CertificateImageDefinition) {
    this.saveImage.emit({ image, imageDef });
  }

  onImageRemoved(imageDef: CertificateImageDefinition) {
    if (imageDef === 'brandImage') {
      this.form.get('brandImage')?.setValue(null);
    } else {
      this.form.get('backgroundImage').setValue(null);
    }
  }
}
