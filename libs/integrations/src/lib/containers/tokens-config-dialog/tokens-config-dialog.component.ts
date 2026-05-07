import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { getTranslocoScope } from '../../utils';
import { TokensConfigService } from '../../services';
import { TokensDialogViewModel } from '../../models';
import { Store } from '@ngrx/store';
import { filter, Observable, tap } from 'rxjs';
import { tokensDialogFeature } from '../../store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControlsFromType, IntegrationTokensDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TokensDialogActions } from '../../store/actions';
import { KpLoadingShadeComponent } from '@keeps-platform-frontend-workspace/ui/kp-loading-shade';

type TokensForm = FormControlsFromType<IntegrationTokensDto>;

@Component({
  selector: 'kp-alura-tokens-config-dialog',
  providers: [getTranslocoScope()],
  imports: [
    CommonModule,
    MatButton,
    MatDialogClose,
    MatError,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    TranslocoPipe,
    MatLabel,
    KpLoadingShadeComponent,
  ],
  template: `
    @if (vm$ | async; as vm) {
      <div class="p-3.5 w-full">
        <div class="text-2xl font-normal">{{ 'INTEGRATIONS.DIALOG.TITLE' | transloco }}</div>
        <div class="text-sm font-normal mt-2">
          {{ 'INTEGRATIONS.DIALOG.SUBTITLE' | transloco }}
        </div>
        <form class="flex flex-col w-full mt-3" [formGroup]="form" id="form" (ngSubmit)="saveTokens()">
          @if (vm.showSpinner) {
            <kp-loading-shade class="h-90 block"></kp-loading-shade>
          } @else {
            <mat-form-field class="w-full mt-1" appearance="outline">
              <mat-label>{{ 'INTEGRATIONS.DIALOG.SSO' | transloco }}</mat-label>
              <input formControlName="sso" matInput #sso />
              @if (form.get('sso').errors?.['invalidToken']) {
                <mat-error>
                  {{ 'INTEGRATIONS.DIALOG.TOKEN_ERROR' | transloco }}
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field class="w-full mt-1" appearance="outline">
              <mat-label>{{ 'INTEGRATIONS.DIALOG.COURSE_CATALOGUE' | transloco }}</mat-label>
              <input formControlName="courses" matInput #courseCatalogue />
              @if (form.get('courses').errors?.['invalidToken']) {
                <mat-error>{{ 'INTEGRATIONS.DIALOG.TOKEN_ERROR' | transloco }} </mat-error>
              }
            </mat-form-field>

            <mat-form-field class="w-full mt-1" appearance="outline">
              <mat-label>{{ 'INTEGRATIONS.DIALOG.PROGRESS' | transloco }}</mat-label>
              <input formControlName="enrollment_progress" matInput #progress />
              @if (form.get('enrollment_progress').errors?.['invalidToken']) {
                <mat-error>{{ 'INTEGRATIONS.DIALOG.TOKEN_ERROR' | transloco }} </mat-error>
              }
            </mat-form-field>

            <mat-form-field class="w-full mt-1" appearance="outline">
              <mat-label>{{ 'INTEGRATIONS.DIALOG.COURSE_CONCLUSION' | transloco }}</mat-label>

              <input formControlName="finished_enrollments" matInput #courseConclusion />
              @if (form.get('finished_enrollments').errors?.['invalidToken']) {
                <mat-error>{{ 'INTEGRATIONS.DIALOG.TOKEN_ERROR' | transloco }} </mat-error>
              }
            </mat-form-field>
          }
          <div class="flex justify-end mt-5 gap-1.5">
            <button mat-button mat-dialog-close class="h-10 w-22 text-primary" type="button">
              {{ 'GENERAL.CANCEL' | transloco }}
            </button>
            <button
              type="submit"
              mat-flat-button
              color="primary"
              class="text-sm"
              [disabled]="vm.isLoading || form?.invalid || form?.pending"
            >
              {{ 'INTEGRATIONS.DIALOG.ACTIVATE' | transloco }}
            </button>
          </div>
        </form>
      </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensConfigDialogComponent implements OnDestroy {
  form!: FormGroup<TokensForm>;
  readonly vm$: Observable<TokensDialogViewModel>;

  constructor(
    private fb: FormBuilder,
    private tokensConfigService: TokensConfigService,
    private store: Store,
  ) {
    this.form = this.buildForm();
    this.vm$ = store
      .select(tokensDialogFeature.selectViewModel)
      .pipe(tap({ next: (vm) => this.formToggle(vm.isLoading) }));
    this.registerFormChanges();
  }

  saveTokens() {
    this.store.dispatch(TokensDialogActions.saveTokens({ tokens: this.form.getRawValue() }));
  }

  ngOnDestroy() {
    this.store.dispatch(TokensDialogActions.reset());
  }

  private buildForm(): FormGroup<TokensForm> {
    return this.fb.group(
      {
        sso: new FormControl<string>('', { validators: Validators.required }),
        courses: new FormControl<string>('', { validators: Validators.required }),
        enrollment_progress: new FormControl<string>('', { validators: Validators.required }),
        finished_enrollments: new FormControl<string>('', { validators: Validators.required }),
      },
      { updateOn: 'blur' },
    );
  }

  private formToggle(disable: boolean) {
    if (disable) {
      this.form.disable();
      return;
    }
    this.form.enable();
  }

  private registerFormChanges() {
    this.vm$
      .pipe(
        filter(({ tokens }) => !!tokens),
        takeUntilDestroyed(),
      )
      .subscribe(({ tokens }) => this.patchFormValue(tokens));
  }

  private patchFormValue(tokens: IntegrationTokensDto) {
    this.removeValidators();
    this.form.patchValue(tokens, { emitEvent: false });
    setTimeout(() => this.addValidators(), 100);
  }

  private removeValidators() {
    this.form.get('sso').clearAsyncValidators();
    this.form.get('courses').clearAsyncValidators();
    this.form.get('enrollment_progress').clearAsyncValidators();
    this.form.get('finished_enrollments').clearAsyncValidators();
  }

  private addValidators() {
    this.form.get('sso').setAsyncValidators(this.tokensConfigService.integrationTokenValidator('sso'));
    this.form.get('courses').setAsyncValidators(this.tokensConfigService.integrationTokenValidator('courses'));
    this.form
      .get('enrollment_progress')
      .setAsyncValidators(this.tokensConfigService.integrationTokenValidator('enrollment_progress'));
    this.form
      .get('finished_enrollments')
      .setAsyncValidators(this.tokensConfigService.integrationTokenValidator('finished_enrollments'));
  }
}
