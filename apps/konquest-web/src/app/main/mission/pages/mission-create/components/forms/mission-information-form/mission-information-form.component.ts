import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MissionAssessmentType } from '@app/main/mission/models';
import { Mission, MissionCategory, MissionModel, MissionType } from 'app/main/mission/mission.model';
import { LanguageTypes } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MissionFormHeaderComponent } from '../../mission-form-header/mission-form-header.component';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { KeyValuePipe, LowerCasePipe } from '@angular/common';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { KpLanguageColorTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-language-color-tag';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpCategoryLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-category-label';

interface MissionInfoForm {
  name: FormControl<string>;
  mission_category: FormControl<string | MissionCategory>;
  language: FormControl<LanguageTypes>;
  mission_type: FormControl<string | MissionType>;
  description: FormControl<string>;
  assessment_type?: FormControl<string>;
  inner_code?: FormControl<string>;
}

@Component({
  selector: 'app-mission-information-form',
  templateUrl: './mission-information-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MissionFormHeaderComponent,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatHint,
    MatSelect,
    MatSelectTrigger,
    MatOption,
    KpLanguageColorTagComponent,
    LowerCasePipe,
    KeyValuePipe,
    TranslocoPipe,
    KpCategoryLabelPipe,
  ],
})
export class MissionInformationFormComponent implements OnChanges {
  @Input() types!: MissionType[];
  @Input() missionModel!: MissionModel;
  @Input() categories!: MissionCategory[];
  @Input() mission!: Mission;
  @Input() isNormativeActive: boolean;
  @Output() formSubmit = new EventEmitter<Partial<Mission>>();

  @Input() languages: LanguageTypes[];
  protected readonly assessmentTypes = MissionAssessmentType;
  protected readonly informationFormGroup: FormGroup<MissionInfoForm>;

  get isDirty() {
    return this.informationFormGroup?.dirty;
  }

  get displayAssessmentType(): boolean {
    return !!this.informationFormGroup.get('assessment_type');
  }

  constructor(_formBuilder: FormBuilder) {
    this.informationFormGroup = this.buildForm(_formBuilder);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mission'] || changes['missionModel']) {
      const firstChanges = changes['missionModel']?.firstChange || changes['mission']?.firstChange;
      this.patchForm(this.mission, this.missionModel, this.informationFormGroup, firstChanges);
    }
  }

  onSubmit(): void {
    if (this.informationFormGroup.invalid) {
      return;
    }
    this.formSubmit.emit(this.informationFormGroup.value);
  }

  optionsCompareWith(firstOption: MissionCategory | MissionType, secondOption: MissionCategory | MissionType): boolean {
    return firstOption?.id === secondOption?.id;
  }

  private patchForm(
    mission: Mission,
    missionModel: MissionModel,
    form: FormGroup<MissionInfoForm>,
    firstChanges: boolean,
  ): void {
    if (!mission && !firstChanges) {
      form.reset();
    }

    const shouldDisplayAssessmentType = missionModel === MissionModel.INTERNAL || missionModel === MissionModel.SCORM;
    if (shouldDisplayAssessmentType) {
      form.setControl('assessment_type', new FormControl('', Validators.required));
    } else {
      form.removeControl('assessment_type', { emitEvent: false });
    }

    if (mission) {
      form.patchValue(mission, { emitEvent: false });
      this.toggleIntegrationFields(!!mission.is_integration);
    }

    form.updateValueAndValidity({ emitEvent: false });
  }

  private buildForm(formBuilder: FormBuilder): FormGroup<MissionInfoForm> {
    const formGroup = formBuilder.group<MissionInfoForm>({
      name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      mission_category: new FormControl('', Validators.required),
      language: new FormControl('pt-BR', Validators.required),
      mission_type: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      inner_code: new FormControl('', Validators.maxLength(30)),
    });
    return formGroup;
  }

  private toggleIntegrationFields(isIntegrationMission: boolean) {
    if (!isIntegrationMission) {
      return;
    }
    this.informationFormGroup.disable({ emitEvent: false });
    this.informationFormGroup.get('mission_type').enable({ emitEvent: false });
  }
}
