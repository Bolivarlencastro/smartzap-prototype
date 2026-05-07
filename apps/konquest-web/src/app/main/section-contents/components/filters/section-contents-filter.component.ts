import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatPrefix } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { Language } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpCategoryLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-category-label';
import { KpLanguageColorTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-language-color-tag';
import { KpMobileToggleComponent } from '@keeps-platform-frontend-workspace/ui/kp-mobile-toggle';
import {
  KpSelectMenuTriggerComponent,
  KpSelectTriggerContentDirective,
} from '@keeps-platform-frontend-workspace/ui/kp-select-menu';
import { MissionCategory, MissionProvider } from '@app/main/mission/mission.model';
import { debounceTime } from 'rxjs';
import { Filter, FilterForm, SectionFilterType } from '../../models/section-contents-filter';

@Component({
  selector: 'app-section-contents-filter',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInput,
    MatIcon,
    TranslocoPipe,
    KpMobileToggleComponent,
    MatPrefix,
    KpSelectMenuTriggerComponent,
    KpSelectTriggerContentDirective,
    KpLanguageColorTagComponent,
    KpCategoryLabelPipe,
  ],
  template: `
    <form [formGroup]="form">
      <div class="flex flex-col xxs:flex-row justify-between items-center gap-6">
        <mat-form-field class="w-full" appearance="outline" subscriptSizing="dynamic">
          <mat-icon matPrefix>search</mat-icon>
          <input
            data-test="input-content-name"
            matInput
            formControlName="search"
            class="grow"
            autocomplete="off"
            [placeholder]="'GENERAL.SEARCH' | transloco"
          />
        </mat-form-field>

        <div class="flex gap-2 max-xxs:overflow-x-auto max-xxs:w-full max-xxs:overflow-y-hidden">
          @if (allCourses) {
            <kp-mobile-toggle
              [label]="'MISSIONS.MY_LIST' | transloco"
              icon="bookmark"
              [selected]="form?.value.favorites"
              (toggleChange)="toggleFavorites()"
            ></kp-mobile-toggle>
          }

          @if (allCourses || allTrails) {
            <kp-select-menu-trigger [label]="'GENERAL.LANGUAGE' | transloco">
              <mat-icon class="s-6 text-primary">language</mat-icon>
              <mat-select kpSelectTriggerContent multiple formControlName="language">
                @for (language of languages(); track language.name) {
                  <mat-option [value]="language.name">
                    <div class="flex items-center gap-1">
                      <kp-language-color-tag class="mr-1" [language]="language.name"></kp-language-color-tag>
                      <span>{{ 'GENERAL.LANGUAGES.' + (language.name | lowercase) | transloco }}</span>
                    </div>
                  </mat-option>
                }
              </mat-select>
            </kp-select-menu-trigger>
          }

          @if (allCourses) {
            <kp-select-menu-trigger [label]="'GLOBAL_SEARCH.CATEGORIES' | transloco">
              <mat-icon class="s-6 text-primary">folder</mat-icon>
              <mat-select kpSelectTriggerContent multiple formControlName="mission_category">
                @for (category of categories(); track category.id) {
                  <mat-option [value]="category.id">
                    <div class="flex items-center gap-1">
                      <span>{{ category.name | kpCategoryLabel | transloco }}</span>
                    </div>
                  </mat-option>
                }
              </mat-select>
            </kp-select-menu-trigger>

            <kp-select-menu-trigger [label]="'GLOBAL_SEARCH.PROVIDERS' | transloco">
              <mat-icon class="s-6 text-primary">trending_up</mat-icon>
              <mat-select kpSelectTriggerContent multiple formControlName="provider">
                @for (provider of providers(); track provider.id) {
                  <mat-option [value]="provider.id">
                    {{ provider.name }}
                  </mat-option>
                }
              </mat-select>
            </kp-select-menu-trigger>
          }
        </div>
      </div>
    </form>
  `,
  styles: `
    :host {
      --mdc-outlined-text-field-container-shape: 50px;
      --mat-form-field-container-vertical-padding: 12px;
      --mat-form-field-container-height: 48px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionContentsFilterComponent {
  readonly filterType = input<SectionFilterType>();
  readonly languages = input<Language[]>();
  readonly providers = input<MissionProvider[]>();
  readonly categories = input<MissionCategory[]>();

  readonly filterChange = output<Filter>();

  protected readonly form: FormGroup<FilterForm>;
  private readonly destroyRef = inject(DestroyRef);

  get allCourses(): boolean {
    return this.filterType() === 'all-courses';
  }

  get allTrails(): boolean {
    return this.filterType() === 'all-trails';
  }

  constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.buildForm();
    this.registerSearchListener();
  }

  protected toggleFavorites() {
    const control = this.form.get('favorites');
    const newValue = control?.value ? undefined : true;
    control.setValue(newValue);
  }

  private buildForm() {
    return this.formBuilder.group<FilterForm>({
      search: new FormControl(),
      provider: new FormControl(),
      mission_category: new FormControl(),
      language: new FormControl(),
      favorites: new FormControl(),
      managed: new FormControl(),
    });
  }

  private registerSearchListener() {
    this.form.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: () => this.onSearch() });
  }

  private onSearch() {
    const formValue = this.form.value;
    this.filterChange.emit(formValue);
  }
}
