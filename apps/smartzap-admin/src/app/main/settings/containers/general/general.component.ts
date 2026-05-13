import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GlobalSettingsActions } from '@app/shared/store/actions';
import { globalSettingsFeature } from '@app/shared/store/features';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  SmartzapConfiguration,
  SmartzapConfigurationForm,
  Workspace,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { Store } from '@ngrx/store';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-settings-general',
  templateUrl: './general.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSlideToggle,
    TranslocoPipe,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    MatIconModule,
    MatTooltipModule,
  ],
  providers: [provideNgxMask()],
})
export class SettingsGeneralComponent {
  readonly smartzapConfigForm: FormGroup<SmartzapConfigurationForm>;
  readonly userTokenExpirationForm = new FormControl<number | null>(null, [Validators.min(1), Validators.required]);
  readonly userTokenExpirationTooltipKey = () =>
    this.userTokenExpirationForm.disabled
      ? 'GENERAL.APPS_SERVICES.SMARTZAP_SETTINGS.USER_TOKEN_EXPIRATION.DISABLED_TOOLTIP'
      : 'GENERAL.APPS_SERVICES.SMARTZAP_SETTINGS.USER_TOKEN_EXPIRATION.TOOLTIP';

  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  private readonly smartzapConfiguration: Signal<SmartzapConfiguration> = toSignal(
    this.store.select(globalSettingsFeature.selectSmartzapConfiguration),
  );
  private readonly selectedWorkspace: Signal<Workspace> = toSignal(
    this.store.select(globalSettingsFeature.selectWorkspace),
  );

  constructor() {
    this.smartzapConfigForm = this.buildForm();
    this.configPatchForms();
    this.initFormListeners();
  }

  private buildForm() {
    return this.fb.group<SmartzapConfigurationForm>({
      messagesContentEmbed: new FormControl<boolean>({ value: false, disabled: true }),
      sendCoursesRecommendationMessage: new FormControl<boolean>(false),
      sendCourseReminderMessage: new FormControl<boolean>(false),
      interactWithRandomMessages: new FormControl<boolean>(false),
      enrollmentIdleDaysLimit: new FormControl<number | null>(null, [Validators.min(7), Validators.max(30)]),
      coursesPortalUrl: new FormControl<string>('', Validators.pattern(constants.defaultLinkRegex)),
    });
  }

  private configPatchForms() {
    this.patchSmartzapConfigForm();
    this.patchUserExpirationForm();
  }

  private patchSmartzapConfigForm() {
    effect(() => {
      const config = this.smartzapConfiguration();
      if (config) {
        this.syncUserTokenExpirationAvailability(config.messagesContentEmbed ?? false);
        this.smartzapConfigForm.patchValue(
          {
            messagesContentEmbed: config.messagesContentEmbed ?? false,
            sendCoursesRecommendationMessage: config.sendCoursesRecommendationMessage ?? false,
            sendCourseReminderMessage: config.sendCourseReminderMessage ?? false,
            interactWithRandomMessages: config.interactWithRandomMessages ?? false,
            enrollmentIdleDaysLimit: config.enrollmentIdleDaysLimit ?? null,
            coursesPortalUrl: config.coursesPortalUrl ?? '',
          },
          { emitEvent: false },
        );
        this.smartzapConfigForm.markAsPristine();
      }
    });
  }

  private patchUserExpirationForm() {
    effect(() => {
      const workspace = this.selectedWorkspace();
      this.userTokenExpirationForm.patchValue(workspace?.user_token_expiration, { emitEvent: false });
      this.userTokenExpirationForm.markAsPristine();
    });
  }

  private initFormListeners() {
    this.initSmartzapConfigFormListener();
    this.initUserTokenExpirationFormListener();
  }

  private initSmartzapConfigFormListener() {
    this.smartzapConfigForm.controls.messagesContentEmbed.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((messagesContentEmbed) => this.syncUserTokenExpirationAvailability(!!messagesContentEmbed));

    this.smartzapConfigForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(() => this.smartzapConfigForm.valid && this.smartzapConfigForm.dirty),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() =>
        this.store.dispatch(
          GlobalSettingsActions.updateSmartzapConfiguration({
            smartzapConfiguration: this.smartzapConfigForm.getRawValue() as SmartzapConfiguration,
          }),
        ),
      );
  }

  private initUserTokenExpirationFormListener() {
    this.userTokenExpirationForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(
          (value) =>
            this.userTokenExpirationForm.enabled &&
            !!value &&
            this.userTokenExpirationForm.valid &&
            this.userTokenExpirationForm.dirty,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) =>
        this.store.dispatch(GlobalSettingsActions.updateUserTokenExpiration({ user_token_expiration: value })),
      );
  }

  private syncUserTokenExpirationAvailability(messagesContentEmbed: boolean) {
    if (messagesContentEmbed) {
      this.userTokenExpirationForm.disable({ emitEvent: false });
      return;
    }

    this.userTokenExpirationForm.enable({ emitEvent: false });
  }
}
