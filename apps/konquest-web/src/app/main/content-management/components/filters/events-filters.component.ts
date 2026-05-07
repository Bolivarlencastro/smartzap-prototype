import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal, Signal } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { KpMobileToggleComponent } from '@keeps-platform-frontend-workspace/ui/kp-mobile-toggle';
import { MatSelectModule } from '@angular/material/select';
import {
  KpSelectMenuTriggerComponent,
  KpSelectTriggerContentDirective,
} from '@keeps-platform-frontend-workspace/ui/kp-select-menu';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MissionCategory } from 'app/main/mission/mission.model';
import { KpCategoryLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-category-label';
import { debounceTime } from 'rxjs';
import { CoursesListParams } from '@core/model/search-api';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpDateRangeFilterV2Component } from '@keeps-platform-frontend-workspace/ui/kp-range-filter';

type FilterForm = {
  managed: FormControl<boolean>;
  favorites: FormControl<boolean>;
  mission_category: FormControl<string[]>;
  development_status: FormControl<string>;
  mission_model: FormControl<string[]>;
  event_date__gte: FormControl<string>;
  event_date__lte: FormControl<string>;
};

@Component({
  selector: 'app-events-filters',
  imports: [
    TranslocoPipe,
    MatIcon,
    ReactiveFormsModule,
    KpMobileToggleComponent,
    KpSelectMenuTriggerComponent,
    MatSelectModule,
    KpSelectTriggerContentDirective,
    KpCategoryLabelPipe,
    KpDateRangeFilterV2Component,
  ],
  template: `
    @let isContentCreator = this.isContentCreator();

    <form [formGroup]="searchForm" class="flex gap-2 items-center">
      @if (!isContentCreator) {
        <!--Created by me-->
        <kp-mobile-toggle
          [label]="'MISSIONS.MY_MISSIONS' | transloco"
          icon="edit"
          [selected]="searchForm?.value.managed"
          (toggleChange)="toggleCreatedByMe()"
        ></kp-mobile-toggle>
      }

      <!--Bookmarked-->
      @if (displayFavorites) {
        <kp-mobile-toggle
          [label]="'MISSIONS.MY_LIST' | transloco"
          icon="bookmark"
          [selected]="searchForm?.value.favorites"
          (toggleChange)="toggleFavorites()"
        ></kp-mobile-toggle>
      }

      <!--Category-->
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

      <!--Mission Model-->
      <kp-select-menu-trigger [label]="'GENERAL.TYPE' | transloco">
        <mat-icon class="s-2 text-primary">hexagon</mat-icon>
        <mat-select kpSelectTriggerContent formControlName="mission_model">
          <mat-option value="LIVE">{{ 'MISSION.MISSION_MODEL.LIVE' | transloco }}</mat-option>
          <mat-option value="PRESENTIAL">{{ 'MISSION.MISSION_MODEL.PRESENTIAL' | transloco }}</mat-option>
        </mat-select>
      </kp-select-menu-trigger>

      <!--Development Status-->
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

      <kp-date-range-filter-v2
        [parentFormGroup]="searchForm"
        gteFcName="event_date__gte"
        lteFcName="event_date__lte"
        icon="today"
        [label]="'CONTENT_MANAGEMENT.HEADER.COMPLETION_DATE' | transloco"
      ></kp-date-range-filter-v2>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsFiltersComponent {
  categories = input<MissionCategory[]>();
  isContentCreator = input<boolean>();
  filterChange = output<CoursesListParams>();
  private readonly destroyRef = inject(DestroyRef);
  protected readonly searchForm: FormGroup<FilterForm>;
  protected readonly displayFavorites = false;
  protected readonly developmentStatuses: Signal<DevelopmentStatus[] | string[]> = signal([
    DevelopmentStatus.IN_PROGRESS,
    DevelopmentStatus.DONE,
    DevelopmentStatus.CLOSED,
  ]);

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
      mission_category: new FormControl(),
      development_status: new FormControl(),
      mission_model: new FormControl(),
      event_date__gte: new FormControl(),
      event_date__lte: new FormControl(),
    });
  }

  private registerSearchListener() {
    this.searchForm.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: () => this.onSearch() });
  }
}
