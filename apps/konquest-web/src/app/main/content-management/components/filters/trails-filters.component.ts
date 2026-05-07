import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
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
import { Language } from '@keeps-platform-frontend-workspace/kp-keeps';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { CoursesListParams } from '@core/model/search-api';

type FilterForm = {
  managed: FormControl<boolean>;
  language: FormControl<string[]>;
};

@Component({
  selector: 'app-trails-filters',
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
  ],
  template: `
    @let isContentCreator = this.isContentCreator();

    <form [formGroup]="searchForm" class="flex gap-2 items-center">
      @if (!isContentCreator) {
        <!--Created by me-->
        <kp-mobile-toggle
          [label]="'LEARNING_TRAIL.MY_LEARNING_TRAILS' | transloco"
          icon="edit"
          [selected]="searchForm?.value.managed"
          (toggleChange)="toggleCreatedByMe()"
        ></kp-mobile-toggle>
      }

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
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrailsFiltersComponent {
  readonly languages = input<Language[]>();
  readonly isContentCreator = input<boolean>();
  readonly filterChange = output<CoursesListParams>();
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

  private onSearch() {
    const formValue = this.searchForm.value;
    this.filterChange.emit(formValue);
  }

  private buildForm() {
    return this.formBuilder.group<FilterForm>({
      managed: new FormControl(),
      language: new FormControl(),
    });
  }

  private registerSearchListener() {
    this.searchForm.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: () => this.onSearch() });
  }
}
