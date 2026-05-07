import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  DestroyRef,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  output,
  Output,
  Renderer2,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobModel } from '@app/main/job-management/models';
import {
  KeepsUtils,
  Language,
  UserCreateDTO,
  UserProfile,
  UserProfileService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { ETHNICITIES, GENRES, MARITAL_STATUSES } from 'app/shared/model';
import { UserDetailAction, UserDetailViewModel } from '../../users.types';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { NgxMaskDirective } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpLanguageColorTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-language-color-tag';
import { UpperCasePipe } from '@angular/common';
import { KpPhoneInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-phone-input';
import { RolesFormComponent } from '../roles-form/roles-form.component';
import { UserFooterComponent } from '../user-footer/user-footer.component';
import { UserFormType } from './user-form.type';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { KpSkeletonComponent } from '@keeps-platform-frontend-workspace/ui/kp-skeleton';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: flex;
        width: 100%;
      }

      .ring-bg {
        @apply ring-[var(--mat-sys-primary-container)];
      }

      .photo-text-color {
        color: var(--mat-sys-primary-container);
      }

      .header-button-bg {
        background-color: var(--mat-sys-primary-container);
      }
    `,
  ],
  imports: [
    ReactiveFormsModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    TranslocoPipe,
    MatTabsModule,
    MatFormFieldModule,
    MatInput,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    NgxMaskDirective,
    MatSelectModule,
    KpLanguageColorTagComponent,
    UpperCasePipe,
    KpPhoneInputComponent,
    UserFooterComponent,
    MatAutocomplete,
    MatAutocompleteTrigger,
    KpSkeletonComponent,
  ],
})
export class UserFormComponent implements OnChanges, AfterContentInit {
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('editIcon') editIcon: ElementRef<HTMLElement>;
  rolesForm = contentChild<RolesFormComponent>(RolesFormComponent);
  idpAccessToggle = contentChild<MatSlideToggle>('idpAccessToggle');
  twoFactorAuthToggle = contentChild<MatSlideToggle>('twoFactorAuthToggle');

  @Input() vm: UserDetailViewModel;
  @Input() languages!: Language[];
  @Input() jobs!: JobModel[];

  @Output() userAction = new EventEmitter<UserDetailAction>();
  @Output() formSubmitted = new EventEmitter<UserCreateDTO>();
  @Output() avatarSelected = new EventEmitter<File>();

  form: FormGroup<UserFormType>;
  editingUser = false;
  firstChange = true;
  isCompanyAdmin: boolean;
  ethnicities = ETHNICITIES;
  genres = GENRES;
  maritalStatuses = MARITAL_STATUSES;
  protected imageSrc!: any;
  protected secondaryFormChanged = signal<boolean>(false);
  protected leaderSearch = output<string>();

  get displayImportDataButton(): boolean {
    return this.isCompanyAdmin && this.editingUser;
  }

  constructor(
    private _fb: FormBuilder,
    private _renderer: Renderer2,
    _userProfileService: UserProfileService,
  ) {
    this.form = this.buildForm();
    this.isCompanyAdmin = _userProfileService.hasRoles(['company_admin', 'keeps_admin']);
    this.registerRolesChangedListener();
    this.registerLeaderChangeListener();
  }

  ngAfterContentInit() {
    this.registerIdpAccessChangeListener();
    this.registerTwoFactorAuthChangeListener();
  }

  get submitDisabled() {
    if (this.vm?.loading || this.form.invalid) {
      return true;
    }

    return this.form.pristine && !this.secondaryFormChanged();
  }

  get avatarButtonIcon() {
    return this.imageSrc || this.vm?.currentUser?.avatar;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['vm']) {
      this.setUserForEdition();
      this.disableForm(this.vm?.loading);
    }
  }

  toggleShowUploadButton(action: 'addClass' | 'removeClass'): void {
    if (!this.imageSrc) {
      return;
    }

    if (this.editIcon) {
      this._renderer[action](this.editIcon.nativeElement, 'opacity-0');
    }
  }

  onChangeAvatar(event: any): void {
    if (!event?.target?.files[0]) {
      return;
    }

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => (this.imageSrc = reader.result);
    reader.readAsDataURL(file);
    this.form.markAsDirty();
    this.avatarSelected.emit(file);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.getRawValue();
    const selectedLeader = this.form.get('related_user_leader_id')?.value;
    const updatedFormValue: UserCreateDTO = { ...formValue, related_user_leader_id: selectedLeader?.id || null };
    this.formSubmitted.emit(updatedFormValue);
  }

  onSendEmail() {
    this.userAction.emit('sendInvitation');
  }

  onResetPassword() {
    this.userAction.emit('resetPassword');
  }

  onImportData() {
    this.userAction.emit('importData');
  }

  onFooterAction(action: UserDetailAction) {
    this.userAction.emit(action);
  }

  leaderDisplayWith(profile: UserProfile) {
    return profile?.name || '';
  }

  private _normalizePhone(phone: string) {
    if (!phone) {
      return '';
    }

    if (!phone.startsWith('+')) {
      return '+' + phone.replace('[^0-9]', '');
    }

    return phone;
  }

  private buildForm() {
    return this._fb.group<UserFormType>({
      email: new FormControl('', { validators: [Validators.required, Validators.email], updateOn: 'blur' }),
      name: new FormControl('', [Validators.required]),
      nickname: new FormControl(''),
      birthday: new FormControl(''),
      cpf: new FormControl(null, Validators.minLength(11)),
      ethnicity: new FormControl(''),
      gender: new FormControl(''),
      marital_status: new FormControl(''),
      language_id: new FormControl('', [Validators.required]),
      secondary_email: new FormControl(null, Validators.email),
      phone: new FormControl(''),
      address: new FormControl(''),
      country: new FormControl(''),
      admission_date: new FormControl(null),
      education: new FormControl(''),
      hierarchical_level: new FormControl(''),
      contract_type: new FormControl(''),
      ein: new FormControl(''),
      employee_info: new FormGroup({
        area_of_activity: new FormControl(null),
        director: new FormControl(null),
        manager: new FormControl(null),
        job_position_id: new FormControl(null),
      }),
      related_user_leader_id: new FormControl(null, KeepsUtils.objectKeyValidator('id')),
    });
  }

  private setUserForEdition() {
    if (!this.vm?.currentUser || !this.firstChange) {
      return;
    }

    this.patchForm(this.vm?.currentUser, this.form);
    this.imageSrc = this.vm?.currentUser?.avatar;
    this.editingUser = true;
    this.firstChange = false;
  }

  private patchForm(user: UserProfile, form: FormGroup<UserFormType>) {
    const phone = this._normalizePhone(user.phone);
    const language_id = user.language?.id;
    form.patchValue({
      ...user,
      phone,
      language_id,
      ...this.extractEmployeeInfoData(user),
      related_user_leader_id: user.related_user_leader,
    });
    form.enable({ emitEvent: false });
    form.updateValueAndValidity();
  }

  private extractEmployeeInfoData(user: UserProfile) {
    const employee_info = user.employee_info;

    if (!employee_info) {
      return undefined;
    }

    const { area_of_activity, director, manager, job_position } = employee_info;
    return { employee_info: { area_of_activity, director, manager, job_position_id: job_position?.id } };
  }

  private disableForm(disabled: boolean) {
    if (disabled) {
      this.form?.disable();
      return;
    }

    this.form?.enable();

    if (this.editingUser) {
      this.form.get('email').disable({ emitEvent: false });
    }
  }

  private registerRolesChangedListener() {
    effect(() => {
      const roleForm = this.rolesForm();
      if (roleForm) {
        this.rolesForm().roleChanged.subscribe(() => this.secondaryFormChanged.set(true));
      }
    });
  }

  private registerIdpAccessChangeListener() {
    const adpAccessToggle = this.idpAccessToggle();
    if (!adpAccessToggle) {
      return;
    }
    adpAccessToggle.change.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.secondaryFormChanged.update(() => true);
    });
  }

  private registerTwoFactorAuthChangeListener() {
    const twoFactorAuthToggle = this.twoFactorAuthToggle();
    if (!twoFactorAuthToggle) {
      return;
    }
    twoFactorAuthToggle.change.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.secondaryFormChanged.update(() => true);
    });
  }

  private registerLeaderChangeListener() {
    this.form
      .get('related_user_leader_id')
      .valueChanges.pipe(
        debounceTime(200),
        filter((value: unknown): value is string => value && typeof value === 'string'),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => this.leaderSearch.emit(value));
  }
}
