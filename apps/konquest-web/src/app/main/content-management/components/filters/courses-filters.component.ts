import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { KpMobileToggleComponent } from '@keeps-platform-frontend-workspace/ui/kp-mobile-toggle';
import { KpLanguageColorTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-language-color-tag';
import { MatSelectModule } from '@angular/material/select';
import {
  KpSelectMenuTriggerComponent,
  KpSelectTriggerContentDirective,
} from '@keeps-platform-frontend-workspace/ui/kp-select-menu';
import { DevelopmentStatus, Language } from '@keeps-platform-frontend-workspace/kp-keeps';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MissionCategory, MissionProvider } from 'app/main/mission/mission.model';
import { KpCategoryLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-category-label';
import { debounceTime } from 'rxjs';
import { CoursesListParams } from '@core/model/search-api';

type FilterForm = {
  managed: FormControl<boolean>;
  favorites: FormControl<boolean>;
  development_status: FormControl<string>;
  language: FormControl<string[]>;
  mission_category: FormControl<string[]>;
  provider: FormControl<string[]>;
};

@Component({
  selector: 'app-courses-filters',
  imports: [
    CommonModule,
    TranslocoPipe,
    MatIcon,
    ReactiveFormsModule,
    KpMobileToggleComponent,
    KpLanguageColorTagComponent,
    KpSelectMenuTriggerComponent,
    MatSelectModule,
    KpSelectTriggerContentDirective,
    KpCategoryLabelPipe,
  ],
  template: `
    @let isContentCreator = this.isContentCreator();

    <form [formGroup]="searchForm" class="flex gap-2 items-center">
      @if (!isContentCreator) {
        <!--Created by me-->
        <kp-mobile-toggle
          data-test="button-my-missions"
          [label]="'MISSIONS.MY_MISSIONS' | transloco"
          icon="edit"
          [selected]="searchForm?.value.managed"
          (toggleChange)="toggleCreatedByMe()"
        ></kp-mobile-toggle>
      }

      <!--Bookmarked-->
      <kp-mobile-toggle
        [label]="'MISSIONS.MY_LIST' | transloco"
        icon="bookmark"
        [selected]="searchForm?.value.favorites"
        (toggleChange)="toggleFavorites()"
      ></kp-mobile-toggle>

      <!--Languages-->
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

      <!--Development status-->
      <kp-select-menu-trigger [label]="'GENERAL.STATUS' | transloco">
        <mat-icon class="s-1 filled text-primary">circle</mat-icon>
        <mat-select kpSelectTriggerContent formControlName="development_status">
          @for (status of developmentStatuses(); track status) {
            <mat-option [value]="status">
              <span>{{ 'MISSION.CREATE.DEVELOPMENT_STATUS_TAG.' + status | transloco }}</span>
            </mat-option>
          }
        </mat-select>
      </kp-select-menu-trigger>

      <!--Category-->
      <kp-select-menu-trigger [label]="'GLOBAL_SEARCH.CATEGORIES' | transloco">
        <mat-icon class="s-6 text-primary">folder</mat-icon>
        <mat-select kpSelectTriggerContent multiple formControlName="mission_category">
          @for (category of categories(); track category.id) {
            <mat-option data-test="courses-filters-category-option" [value]="category.id">
              <div class="flex items-center gap-1">
                <span>{{ category.name | kpCategoryLabel | transloco }}</span>
              </div>
            </mat-option>
          }
        </mat-select>
      </kp-select-menu-trigger>

      <!--Provider-->
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
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesFiltersComponent {
  readonly languages = input<Language[]>();
  readonly providers = input<MissionProvider[]>();
  readonly categories = input<MissionCategory[]>();
  readonly isContentCreator = input<boolean>();
  readonly filterChange = output<CoursesListParams>();
  protected readonly developmentStatuses: Signal<DevelopmentStatus[]> = signal([
    DevelopmentStatus.DONE,
    DevelopmentStatus.IN_PROGRESS,
    DevelopmentStatus.PROCESSING,
    DevelopmentStatus.IN_REVIEW,
    DevelopmentStatus.INACTIVATED,
  ]);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly searchForm: FormGroup<FilterForm>;

  constructor(private readonly formBuilder: FormBuilder) {
    this.searchForm = this.buildForm();
    this.registerSearchListener();
  }

  protected toggleCreatedByMe() {
    const control = this.searchForm.get('managed');
    const newValue = control?.value ? undefined : true;
    control.setValue(newValue);
  }

  protected toggleFavorites() {
    const control = this.searchForm.get('favorites');
    const newValue = control?.value ? undefined : true;
    control.setValue(newValue);
  }

  private onSearch() {
    const formValue = this.searchForm.value;
    this.filterChange.emit(formValue);
  }

  private buildForm() {
    return this.formBuilder.group<FilterForm>({
      managed: new FormControl(),
      favorites: new FormControl(),
      development_status: new FormControl(),
      language: new FormControl(),
      mission_category: new FormControl(),
      provider: new FormControl(),
    });
  }

  private registerSearchListener() {
    this.searchForm.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: () => this.onSearch() });
  }
}
