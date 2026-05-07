import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LearningTrail, LearningTrailType } from '@app/main/learning-trail/model/learning-trail';
import {
  CustomCertificateDto,
  LanguageTypes,
  LearnContentCertificateChange,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpLanguageColorTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-language-color-tag';
import { KpSettingToggleComponent } from '@keeps-platform-frontend-workspace/ui/kp-setting-toggle';
import { TranslocoModule } from '@jsverse/transloco';
import { format } from 'date-fns';
import { LearningTrailFormHeaderComponent } from '../../learning-trail-form-header/learning-trail-form-header.component';

@Component({
  selector: 'app-learning-trail-info-form',
  imports: [
    CommonModule,
    LearningTrailFormHeaderComponent,
    ReactiveFormsModule,
    TranslocoModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDividerModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatLabel,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    KpSettingToggleComponent,
    KpLanguageColorTagComponent,
    MatIconButton,
  ],
  templateUrl: './learning-trail-info-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningTrailInfoFormComponent implements OnChanges {
  @Input() types!: LearningTrailType[];
  @Input() certificates: CustomCertificateDto[];
  @Input() learningTrail!: LearningTrail;
  @Input() learnContentCertificate: CustomCertificateDto;
  @Input() isContentCreator: boolean;
  @Output() save = new EventEmitter<any>();
  @Output() linkGroupEvent = new EventEmitter<any>();
  @Output() previewCertificate = new EventEmitter<CustomCertificateDto>();
  @Output() newCertificate = new EventEmitter<void>();
  @Output() certificateChange = new EventEmitter<LearnContentCertificateChange>();

  @Input() languages: LanguageTypes[];
  informationFormGroup: UntypedFormGroup;

  readonly today = new Date();

  get isActive(): boolean {
    return this.informationFormGroup?.get('is_active')?.value;
  }

  constructor(_formBuilder: UntypedFormBuilder) {
    this.buildForm(_formBuilder);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['learningTrail']) {
      const firstChange = changes['learningTrail'].firstChange;
      this.verifyForm(this.learningTrail, this.informationFormGroup, firstChange);
    }
  }

  onSubmit(): void {
    if (!this.informationFormGroup.valid) {
      return;
    }
    const data = this.informationFormGroup.getRawValue();
    const expiration_date = data.expiration_date ? format(new Date(data.expiration_date), 'yyyy-MM-dd') : null;

    this.save.emit({
      ...data,
      expiration_date,
      name: data.name.trim(),
    });
  }

  optionsCompareWith(firstOption: LearningTrailType, secondOption: LearningTrailType): boolean {
    return firstOption?.id === secondOption?.id;
  }

  verifyForm(learningTrail: LearningTrail, form: UntypedFormGroup, firstChange: boolean) {
    if (!learningTrail && !firstChange) {
      form.reset();
    }

    if (learningTrail) {
      this.patchForm(learningTrail, form);
    }

    form.updateValueAndValidity();
  }

  onActiveChange(value: MatSlideToggleChange): void {
    this.informationFormGroup.get('is_active').setValue(value.checked);
  }

  expirationDateToggleChange({ checked }: MatSlideToggleChange): void {
    const expirationFormControl = this.informationFormGroup.get('expiration_date');
    if (checked) {
      expirationFormControl.enable();
      expirationFormControl.setValidators(Validators.required);
    } else {
      expirationFormControl.disable();
      expirationFormControl.reset();
      expirationFormControl.clearValidators();
    }
    expirationFormControl.updateValueAndValidity();
  }

  onPreviewCertificate(certificate: CustomCertificateDto, event: Event): void {
    event.stopPropagation();
    this.previewCertificate.emit(certificate);
  }

  onNewCertificate(): void {
    this.newCertificate.emit();
  }

  certificateToggleChange(event: MatSlideToggleChange): void {
    if (event.checked) {
      return;
    }
    this.certificateChange.emit({ learnContentId: this.learningTrail.id, certificate: null });
  }

  certificatesCompareWithFn(first: CustomCertificateDto, second: CustomCertificateDto) {
    return first?.id === second?.id;
  }

  onCertificateChange(certificate: CustomCertificateDto | null) {
    if (!certificate) {
      return;
    }
    this.certificateChange.emit({ learnContentId: this.learningTrail.id, certificate });
  }

  private buildForm(formBuilder: FormBuilder) {
    this.informationFormGroup = formBuilder.group({
      learning_trail_type: [null, Validators.required],
      is_active: true,
      language: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern(/\S/)]],
      expiration_date: null,
      description: ['', Validators.required],
    });
  }

  private patchForm(learningTrail: LearningTrail, form: UntypedFormGroup) {
    form.patchValue(learningTrail);
  }
}
