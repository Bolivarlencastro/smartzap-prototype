import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Observable } from 'rxjs';
import { BannerSettingsFormComponent } from '../../components/banner-settings-form/banner-settings-form.component';
import { BannerSettingsViewModel, CustomSettings, CustomSettingsForm } from '../../models/banner-settings';
import { BannerSettingsActions } from '../../store/actions';
import { bannerSettingsFeature } from '../../store/features';

@Component({
  selector: 'app-banner-settings',
  imports: [
    TranslocoModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSlideToggleModule,
    AsyncPipe,
    NgxSkeletonLoaderModule,
    NgTemplateOutlet,
    BannerSettingsFormComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './banner-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerSettingsComponent {
  vm$: Observable<BannerSettingsViewModel>;
  form: FormGroup<CustomSettingsForm>;
  protected readonly modeControl = new FormControl<boolean>(null);

  get isPublishButtonDisabled(): boolean {
    return this.form.invalid || this.form.pristine;
  }

  constructor(
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
  ) {
    store.dispatch(BannerSettingsActions.loadInternalContents({}));
    this.form = this.buildForm(formBuilder);
    this.vm$ = store.select(bannerSettingsFeature.selectViewModel);
  }

  onSetMode(event: MatSlideToggleChange) {
    const mode = event.checked ? 'MANUAL' : 'RECOMMENDATION';
    this.store.dispatch(BannerSettingsActions.setMode({ mode }));
  }

  onFilterInternalContents(search: string) {
    this.store.dispatch(BannerSettingsActions.loadInternalContents({ search }));
  }

  onPublish() {
    const data = this.form.value as CustomSettings;
    this.store.dispatch(BannerSettingsActions.publish({ data }));
  }

  onClose() {
    const dirtyForm = this.form.dirty;
    this.store.dispatch(BannerSettingsActions.close({ dirtyForm }));
  }

  private buildForm(formBuilder: FormBuilder): FormGroup<CustomSettingsForm> {
    return formBuilder.group<CustomSettingsForm>(
      {
        start_date: new FormControl({ value: null, disabled: true }, Validators.required),
        end_date: new FormControl({ value: null, disabled: true }, Validators.required),
        learning_resources: new FormControl(null, Validators.required),
      },
      { validators: this.dateRangeValidator() },
    );
  }

  private dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const startDate = group.get('start_date')?.value;
      const endDate = group.get('end_date')?.value;

      if (!startDate || !endDate) {
        return null;
      }

      return endDate < startDate ? { invalidDateRange: true } : null;
    };
  }
}
