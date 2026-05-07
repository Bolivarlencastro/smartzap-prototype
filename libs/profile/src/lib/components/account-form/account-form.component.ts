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
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Language, UserCreateDTO, UserProfile } from '@keeps-platform-frontend-workspace/kp-keeps';
import { format } from 'date-fns';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatTooltip } from '@angular/material/tooltip';
import { MatInput } from '@angular/material/input';
import { KpPhoneInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-phone-input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { LowerCasePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

// Languages
marker('PROFILE_FEATURE.GENERAL.LANGUAGES.pt-br');
marker('PROFILE_FEATURE.GENERAL.LANGUAGES.es');
marker('PROFILE_FEATURE.GENERAL.LANGUAGES.pt-pt');
marker('PROFILE_FEATURE.GENERAL.LANGUAGES.en');

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatTooltip,
    MatLabel,
    MatInput,
    MatError,
    KpPhoneInputComponent,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatSelect,
    MatOption,
    MatButton,
    LowerCasePipe,
    TranslocoPipe,
  ],
})
export class AccountFormComponent implements OnChanges {
  @Output() submitForm = new EventEmitter<UserCreateDTO>();
  @Input() profile: UserProfile;
  @Input() languages: Language[];

  accountForm: FormGroup;

  constructor(private _fb: FormBuilder) {
    this.accountForm = this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profile']) {
      this.populateForm(this.profile);
    }
  }

  initForm(): FormGroup {
    return this._fb.group({
      name: new FormControl({ value: null, disabled: true }, Validators.required),
      nickname: new FormControl(null),
      phone: new FormControl(null),
      birthday: new FormControl(null),
      email: new FormControl({ value: null, disabled: true }, Validators.required),
      secondary_email: new FormControl(null, Validators.email),
      country: new FormControl({ value: null, disabled: true }),
      language_id: new FormControl({ value: null }, Validators.required),
      address: new FormControl(null),
    });
  }

  populateForm(userProfile: UserProfile): void {
    if (!userProfile) {
      return;
    }

    const patchedProfile: Partial<UserProfile> = {
      ...userProfile,
      phone: userProfile.phone,
    };
    this.accountForm.patchValue(patchedProfile);
  }

  onSubmitForm(): void {
    if (this.accountForm.invalid) {
      return;
    }
    this.submitForm.emit(this.normalizeProfile(this.accountForm.getRawValue()));
    this.accountForm.markAsPristine();
  }

  normalizeProfile(form: Partial<UserProfile & { language_id: string }>): UserCreateDTO {
    const { phone, nickname, birthday, secondary_email, language_id, address } = form;
    return {
      phone,
      nickname,
      secondary_email,
      address,
      language_id,
      birthday: form.birthday && format(new Date(birthday), 'yyyy-MM-dd'),
    };
  }
}
