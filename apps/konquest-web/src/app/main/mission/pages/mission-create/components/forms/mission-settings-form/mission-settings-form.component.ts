import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CustomCertificateDto, LearnContentCertificateChange } from '@keeps-platform-frontend-workspace/kp-keeps';
import {
  Mission,
  MissionLive,
  MissionModel,
  MissionModelInformation,
  MissionPresential,
} from 'app/main/mission/mission.model';
import { debounceTime, Subscription } from 'rxjs';
import { format, isDate } from 'date-fns';

import { KpSettingToggleComponent } from '@keeps-platform-frontend-workspace/ui/kp-setting-toggle';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatIconButton } from '@angular/material/button';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';

interface MissionSettingsForm {
  is_active: FormControl<boolean>;
  notify_users_enrolled?: FormControl<boolean>;
  required_evaluation?: FormControl<boolean>;
  allow_self_enrollment_renewal?: FormControl<boolean>;
  allow_self_reproved_enrollment_renewal?: FormControl<boolean>;
  minimum_performance?: FormControl<number>;
  expiration_date?: FormControl<Date | string | null>;
  enrollment_goal_duration_days?: FormControl<string | null>;
  min_time_in_content?: FormControl<number>;
  auto_attendance?: FormControl<boolean>;
}

interface MissionSettingsFormValue {
  is_active?: boolean;
  notify_users_enrolled?: boolean;
  required_evaluation?: boolean;
  allow_self_enrollment_renewal?: boolean;
  allow_self_reproved_enrollment_renewal?: boolean;
  minimum_performance?: number;
  expiration_date?: Date | string | null;
  enrollment_goal_duration_days?: string | null;
  min_time_in_content?: number;
  auto_attendance?: boolean;
}

@Component({
  selector: 'app-mission-settings-form',
  templateUrl: './mission-settings-form.component.html',
  styleUrls: ['./mission-settings-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    KpSettingToggleComponent,
    MatFormField,
    MatLabel,
    MatInput,
    NgxMaskDirective,
    MatIcon,
    MatTooltip,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatIconButton,
    MatSelect,
    MatSelectTrigger,
    MatOption,
    TranslocoPipe,
  ],
})
export class MissionSettingsFormComponent implements OnChanges, OnDestroy {
  @Input() mission: Mission;
  @Input() missionModel: MissionModel;
  @Input() certificates: CustomCertificateDto[];
  @Input() learnContentCertificate: CustomCertificateDto;
  @Input() isContentCreator: boolean;
  @Output() previewCertificate = new EventEmitter<CustomCertificateDto>();
  @Output() newCertificate = new EventEmitter<void>();
  @Output() formChange = new EventEmitter<Partial<Mission>>();
  @Output() certificateChange = new EventEmitter<LearnContentCertificateChange>();

  readonly settingsForm: FormGroup<MissionSettingsForm>;
  readonly today = new Date();
  private readonly _formSubscription: Subscription;

  constructor(
    _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
  ) {
    this.settingsForm = this.buildForm(_formBuilder);
    this._formSubscription = this.settingsForm.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
      this.onSubmit();
    });
  }

  get isLivePresentialMission(): boolean {
    return this.missionModel === MissionModel.LIVE || this.missionModel === MissionModel.PRESENTIAL;
  }

  get isLiveMission(): boolean {
    return this.missionModel === MissionModel.LIVE;
  }

  get invalid(): boolean {
    return this.settingsForm?.invalid;
  }

  get displayContentProgressRestriction(): boolean {
    return this.missionModel !== MissionModel.EXTERNAL_PROVIDER;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mission'] || changes['missionModel']) {
      this.patchForm(this.settingsForm, this.mission, this.isLivePresentialMission);
    }
  }

  ngOnDestroy() {
    this._formSubscription?.unsubscribe();
  }

  getSettings(): Partial<Mission> {
    const formValue: MissionSettingsFormValue = this.settingsForm.getRawValue();
    const parsedExpirationDate = formValue.expiration_date ? formValue.expiration_date : '';
    const minimumPerformance = formValue.minimum_performance ? formValue.minimum_performance / 100 : 0;
    const contentProgressRestriction = formValue.min_time_in_content ? formValue.min_time_in_content / 100 : 0;

    let missionSettings: Partial<Mission> = {
      ...formValue,
      expiration_date: parsedExpirationDate,
      minimum_performance: minimumPerformance,
      min_time_in_content: contentProgressRestriction,
    };

    // Presential/live mission settings need to be defined in the corresponding mission model
    if (this.isLivePresentialMission) {
      missionSettings = this.updatePresentialLiveSettings(missionSettings, formValue, this.missionModel);
    }

    return missionSettings;
  }

  customGoalDateToggleChange(event: MatSlideToggleChange): void {
    if (event.checked) {
      return;
    }
    this.settingsForm.get('enrollment_goal_duration_days').setValue(null);
  }

  certificateToggleChange(event: MatSlideToggleChange): void {
    if (event.checked) {
      return;
    }
    this.certificateChange.emit({ learnContentId: this.mission.id, certificate: null });
  }

  minimumPerformanceToggleChange(event: MatSlideToggleChange): void {
    if (event.checked) {
      return;
    }
    this.settingsForm.get('minimum_performance').setValue(0);
  }

  allowSelfEnrollmentRenewalToggleChange(event: MatSlideToggleChange): void {
    if (event.checked) {
      return;
    }
    this.settingsForm.get('allow_self_reproved_enrollment_renewal').setValue(false);
  }

  resetDefaultProgressRestrictionForm() {
    const progressRestrictionFC = this.settingsForm.get('min_time_in_content');
    if (progressRestrictionFC.value === 10) {
      return;
    }

    progressRestrictionFC.setValue(10);
    progressRestrictionFC.updateValueAndValidity();
  }

  temporaryToggleChange({ checked }: MatSlideToggleChange): void {
    const expirationDateFC = this.settingsForm.get('expiration_date');

    if (checked) {
      expirationDateFC.setValidators(Validators.required);
      expirationDateFC.updateValueAndValidity();
      return;
    }
    expirationDateFC.reset();
    expirationDateFC.clearValidators();
    expirationDateFC.updateValueAndValidity();
  }

  onPreviewCertificate(certificate: CustomCertificateDto, event: Event): void {
    event.stopPropagation();
    this.previewCertificate.emit(certificate);
  }

  onNewCertificate(): void {
    this.newCertificate.emit();
  }

  isFormControlDisabled(formControlName: string) {
    return this.settingsForm.get(formControlName).disabled;
  }

  certificatesCompareWithFn(first: CustomCertificateDto, second: CustomCertificateDto) {
    return first?.id === second?.id;
  }

  onCertificateChange(certificate: CustomCertificateDto | null) {
    if (!certificate) {
      return;
    }
    this.certificateChange.emit({ learnContentId: this.mission.id, certificate });
  }

  private patchForm(form: FormGroup<MissionSettingsForm>, mission: Mission, isPresentialLive: boolean): void {
    if (isPresentialLive) {
      this.patchAsPresentialLiveForm(form, mission);
      return;
    }

    this.patchAsDefaultForm(form, mission);

    // Ensuring that Change Detection runs after the form has already been filled out
    setTimeout(() => this._cdr.detectChanges(), 0);
  }

  private buildForm(formBuilder: FormBuilder): FormGroup<MissionSettingsForm> {
    return formBuilder.group<MissionSettingsForm>({
      is_active: new FormControl(true),
      required_evaluation: new FormControl(false),
      allow_self_enrollment_renewal: new FormControl(false),
      allow_self_reproved_enrollment_renewal: new FormControl(false),
      minimum_performance: new FormControl(0),
      expiration_date: new FormControl<Date>(null),
      enrollment_goal_duration_days: new FormControl(null),
      min_time_in_content: new FormControl(10, [Validators.min(1), Validators.required]),
    });
  }

  private patchAsDefaultForm(form: FormGroup<MissionSettingsForm>, mission: Mission): void {
    this.removeControls(form, 'notify_users_enrolled');
    this.removeControls(form, 'auto_attendance');

    const minimumPerformance = Math.round((mission?.minimum_performance || 0) * 100);
    const contentProgressRestriction = Math.round((mission?.min_time_in_content ?? 0.1) * 100);
    const patchedMission: Partial<Mission> = {
      ...mission,
      minimum_performance: minimumPerformance,
      min_time_in_content: contentProgressRestriction,
    };

    if (mission?.expiration_date) {
      const patchDate = isDate(patchedMission.expiration_date)
        ? patchedMission.expiration_date
        : new Date(`${mission.expiration_date}T00:00:00`);
      patchedMission.expiration_date = format(patchDate as Date, 'yyyy-MM-dd');
    }

    form.patchValue(patchedMission, { emitEvent: false });
    form.updateValueAndValidity({ emitEvent: false });
    this.toggleIntegrationFields(mission?.is_integration);
  }

  private patchAsPresentialLiveForm(form: FormGroup<MissionSettingsForm>, mission: Mission): void {
    this.removeControls(
      form,
      'is_active',
      'required_evaluation',
      'allow_self_enrollment_renewal',
      'allow_self_reproved_enrollment_renewal',
      'minimum_performance',
      'expiration_date',
      'enrollment_goal_duration_days',
      'min_time_in_content',
    );

    const missionModelInfo: MissionPresential | MissionLive | undefined = mission
      ? mission[mission?.mission_model.toLowerCase()]
      : undefined;

    form.registerControl('notify_users_enrolled', new FormControl(missionModelInfo?.notify_users_enrolled || false));

    if (this.isLiveMission) {
      form.registerControl('auto_attendance', new FormControl(missionModelInfo?.auto_attendance || false));
    } else {
      this.removeControls(form, 'auto_attendance');
    }

    form.patchValue(mission, { emitEvent: false });
    form.updateValueAndValidity({ emitEvent: false });
  }

  private onSubmit(): void {
    if (this.settingsForm.invalid) {
      return;
    }

    this.formChange.emit(this.getSettings());
  }

  private removeControls(form: FormGroup<MissionSettingsForm>, ...controls: (keyof MissionSettingsForm)[]): void {
    controls.forEach((controlName) => form.removeControl(controlName, { emitEvent: false }));
  }

  private updatePresentialLiveSettings(
    missionSettings: Partial<Mission>,
    formValue: MissionSettingsFormValue,
    missionModel: MissionModel,
  ): Partial<Mission> {
    const isLive = missionModel === MissionModel.LIVE;
    const missionModelInfo = {
      notify_users_enrolled: formValue.notify_users_enrolled,
      ...(isLive && { auto_attendance: formValue.auto_attendance }),
    } as MissionModelInformation;

    const updatedSettings: Partial<Mission> & MissionSettingsFormValue = {
      ...missionSettings,
      [missionModel.toLowerCase()]: missionModelInfo,
    };

    delete updatedSettings.notify_users_enrolled;
    delete updatedSettings.auto_attendance;
    delete updatedSettings.min_time_in_content;

    return updatedSettings;
  }

  private toggleIntegrationFields(isIntegrationMission: boolean) {
    if (!isIntegrationMission) {
      return;
    }
    this.settingsForm.disable({ emitEvent: false });
    this.settingsForm.get('is_active').enable({ emitEvent: false });
    this.settingsForm.get('required_evaluation').enable({ emitEvent: false });
  }
}
