import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpCategoryLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-category-label';
import { KpMobileToggleComponent } from '@keeps-platform-frontend-workspace/ui/kp-mobile-toggle';
import {
  KpSelectMenuTriggerComponent,
  KpSelectTriggerContentDirective,
} from '@keeps-platform-frontend-workspace/ui/kp-select-menu';
import { Store } from '@ngrx/store';
import { SideFilterOption } from '../../models/view-models';
import { FeedActions, feedFeature } from '../../store';

@Component({
  selector: 'app-mobile-filter-bar',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    MatIcon,
    MatSelect,
    MatOption,
    KpMobileToggleComponent,
    KpSelectMenuTriggerComponent,
    KpSelectTriggerContentDirective,
    KpCategoryLabelPipe,
  ],
  template: `
    @let d = vm();

    <div [formGroup]="form" class="h-16 flex items-center gap-3 flex-nowrap overflow-x-auto">
      @for (opt of d?.generalOptions; track opt.id) {
        <kp-mobile-toggle
          [label]="opt.name | transloco"
          [icon]="generalIcon(opt.id)"
          [selected]="d?.selectedGeneral === opt.id"
          (toggleChange)="onToggleGeneral(opt)"
        />
      }

      <kp-select-menu-trigger [label]="'PULSES_FEED.SIDE_FILTERS.LANGUAGE.TITLE' | transloco">
        <mat-icon class="s-6 text-primary">language</mat-icon>
        <mat-select kpSelectTriggerContent multiple formControlName="languages">
          @for (opt of d?.languageOptions; track opt.id) {
            <mat-option [value]="opt.id">{{ opt.name | transloco }}</mat-option>
          }
        </mat-select>
      </kp-select-menu-trigger>

      @if (d?.selectedTab === 'feed') {
        <kp-select-menu-trigger [label]="'PULSES_FEED.SIDE_FILTERS.TYPE.TITLE' | transloco">
          <mat-icon class="s-1 filled text-primary">circle</mat-icon>
          <mat-select kpSelectTriggerContent multiple formControlName="types">
            @for (opt of d?.typeOptions; track opt.id) {
              <mat-option [value]="opt.id">{{ opt.name | kpCategoryLabel | transloco }}</mat-option>
            }
          </mat-select>
        </kp-select-menu-trigger>
      }

      @if (d?.categoryOptions?.length) {
        <kp-select-menu-trigger [label]="'PULSES_FEED.SIDE_FILTERS.CATEGORY.TITLE' | transloco">
          <mat-icon class="s-6 text-primary">folder</mat-icon>
          <mat-select kpSelectTriggerContent multiple formControlName="categories">
            @for (opt of d?.categoryOptions; track opt.id) {
              <mat-option [value]="opt.id">{{ opt.name }}</mat-option>
            }
          </mat-select>
        </kp-select-menu-trigger>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileFilterBarComponent {
  private readonly store = inject(Store);

  protected readonly vm = toSignal(this.store.select(feedFeature.selectSideFiltersViewModel));

  readonly form = new FormGroup({
    languages: new FormControl<string[]>([], { nonNullable: true }),
    types: new FormControl<string[]>([], { nonNullable: true }),
    categories: new FormControl<string[]>([], { nonNullable: true }),
  });

  constructor() {
    this.init();
  }

  generalIcon(id: string): string {
    if (id === 'favorites') {
      return 'bookmark';
    }

    if (id === 'created_by_me') {
      return 'edit';
    }

    return 'subscriptions';
  }

  onToggleGeneral(opt: SideFilterOption): void {
    const current = this.vm()?.selectedGeneral;
    this.store.dispatch(FeedActions.setSideFilters({ general: current === opt.id ? null : opt.id }));
  }

  private init(): void {
    effect(() => {
      const vm = this.vm();

      if (!vm) {
        return;
      }

      this.form.setValue(
        {
          languages: vm.selectedLanguages,
          types: vm.selectedTypes,
          categories: vm.selectedCategories,
        },
        { emitEvent: false },
      );
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.store.dispatch(
        FeedActions.setSideFilters({
          languages: value.languages ?? [],
          types: value.types ?? [],
          categories: value.categories ?? [],
        }),
      );
    });
  }
}
