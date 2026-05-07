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
import { ChannelsListParams } from '@core/model/search-api';
import { ChannelCategory } from 'app/main/channel/channel.model';
import { KpCategoryLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-category-label';

type FilterForm = {
  managed: FormControl<boolean>;
  channel_category: FormControl<string[]>;
  language: FormControl<string[]>;
  inactive: FormControl<boolean>;
};

@Component({
  selector: 'app-channels-filters',
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

      <kp-select-menu-trigger [label]="'GLOBAL_SEARCH.CATEGORIES' | transloco">
        <mat-icon class="s-6 text-primary">folder</mat-icon>
        <mat-select kpSelectTriggerContent multiple formControlName="channel_category">
          @for (category of categories(); track category.id) {
            <mat-option [value]="category.id">
              <span>{{ category.name | kpCategoryLabel | transloco }}</span>
            </mat-option>
          }
        </mat-select>
      </kp-select-menu-trigger>

      <kp-mobile-toggle
        [label]="'CONTENT_MANAGEMENT.FILTERS.CHANNELS.INACTIVE' | transloco"
        icon="toggle_off"
        [selected]="searchForm?.value.inactive"
        (toggleChange)="toggleInactive()"
      ></kp-mobile-toggle>

      @if (!isContentCreator) {
        <kp-mobile-toggle
          [label]="'CHANNEL.MY_CHANNELS' | transloco"
          icon="edit"
          [selected]="searchForm?.value.managed"
          (toggleChange)="toggleCreatedByMe()"
        ></kp-mobile-toggle>
      }
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelsFiltersComponent {
  readonly isContentCreator = input<boolean>();
  readonly categories = input<ChannelCategory[]>();
  readonly languages = input<Language[]>();
  readonly filterChange = output<ChannelsListParams>();
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

  protected toggleInactive() {
    const control = this.searchForm.get('inactive');
    const newValue = control?.value ? undefined : true;
    control.setValue(newValue);
  }

  private onSearch() {
    const formValue = this.searchForm.value;
    this.filterChange.emit({ ...formValue, active: !formValue.inactive });
  }

  private buildForm() {
    return this.formBuilder.group<FilterForm>({
      managed: new FormControl(),
      channel_category: new FormControl(),
      language: new FormControl(),
      inactive: new FormControl(),
    });
  }

  private registerSearchListener() {
    this.searchForm.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: () => this.onSearch() });
  }
}
