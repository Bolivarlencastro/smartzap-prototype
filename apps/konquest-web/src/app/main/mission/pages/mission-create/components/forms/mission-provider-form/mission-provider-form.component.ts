import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Mission, MissionProvider } from 'app/main/mission/mission.model';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { MissionFormHeaderComponent } from '../../mission-form-header/mission-form-header.component';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { MatOption } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { KpDurationMaskDirective } from '@keeps-platform-frontend-workspace/ui/kp-duration-mask';
import { TranslocoPipe } from '@jsverse/transloco';

interface MissionProviderForm {
  provider: FormControl<string | MissionProvider>;
  external_course_url: FormControl<string>;
  duration_time: FormControl<string>;
}

@Component({
  selector: 'app-mission-provider-form',
  templateUrl: './mission-provider-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MissionFormHeaderComponent,
    MatFormField,
    MatLabel,
    MatInput,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatIcon,
    MatError,
    KpDurationMaskDirective,
    MatHint,
    TranslocoPipe,
  ],
})
export class MissionProviderFormComponent implements OnChanges, OnDestroy {
  @Input() providers: MissionProvider[] = [];
  @Input() mission: Mission;
  @Output() formSubmit = new EventEmitter<Partial<Mission>>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() searchProvider = new EventEmitter<string>();

  readonly linkRegex = constants.defaultLinkRegex;
  private readonly destroySub = new Subject<void>();
  protected readonly externalFormGroup: FormGroup<MissionProviderForm>;

  get isDirty() {
    return this.externalFormGroup?.dirty;
  }

  constructor(private _formBuilder: FormBuilder) {
    this.externalFormGroup = this.buildForm(_formBuilder);
    this.registerProviderAC();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mission']) {
      this.patchForm(this.mission, this.externalFormGroup);
    }
  }

  ngOnDestroy() {
    this.destroySub.next();
    this.destroySub.complete();
  }

  onSubmit(): void {
    if (this.externalFormGroup.invalid) {
      return;
    }
    if (this.mission.is_integration) {
      this.next.emit();
      return;
    }
    const value = this.externalFormGroup.value;
    const durationInSeconds = this.convertToSeconds(value.duration_time);
    this.formSubmit.emit({ ...value, duration_time: durationInSeconds });
  }

  onPrevious(): void {
    this.previous.emit();
  }

  private buildForm(formBuilder: FormBuilder): FormGroup<MissionProviderForm> {
    return formBuilder.group<MissionProviderForm>({
      provider: new FormControl('', Validators.required),
      external_course_url: new FormControl('', [Validators.required, Validators.pattern(this.linkRegex)]),
      duration_time: new FormControl(null, Validators.required),
    });
  }

  private patchForm(mission: Mission, form: FormGroup<MissionProviderForm>): void {
    const missionDuration = this.formatSeconds(mission?.duration_time);
    form.patchValue({ ...mission, duration_time: missionDuration }, { emitEvent: false });
    if (mission?.is_integration) {
      form.disable();
    }
  }

  private formatSeconds(seconds: number): string {
    if (!seconds) {
      return '';
    }

    return new Date(seconds * 1000).toISOString().slice(11, 16);
  }

  private convertToSeconds(duration: string) {
    const [hours, minutes] = duration.split(':');
    return Number(hours) * 60 * 60 + Number(minutes) * 60;
  }

  private registerProviderAC() {
    this.externalFormGroup
      .get('provider')
      .valueChanges.pipe(
        distinctUntilChanged(),
        filter((value) => typeof value === 'string'),
      )
      .subscribe((value: string) => this.searchProvider.emit(value));
  }

  providerDisplay(provider: MissionProvider) {
    return provider?.name || '';
  }
}
