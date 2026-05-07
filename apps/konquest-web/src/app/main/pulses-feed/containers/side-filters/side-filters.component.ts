import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { KpCategoryLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-category-label';
import { SideFilterOption } from '../../models/view-models';
import { FeedActions, feedFeature } from '../../store';

@Component({
  selector: 'app-side-filters',
  imports: [TranslocoPipe, MatIcon, NgxSkeletonLoaderModule, MatButton, KpCategoryLabelPipe],
  templateUrl: './side-filters.component.html',
  styleUrl: './side-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideFiltersComponent {
  private readonly store = inject(Store);

  protected readonly vm = toSignal(this.store.select(feedFeature.selectSideFiltersViewModel));
  protected readonly hasSelectedFilter = toSignal(this.store.select(feedFeature.selectHasSelectedFilter));

  protected readonly skeletonRows = [0, 1, 2, 3, 4, 5];
  protected readonly maxCategories = 10;
  protected readonly showAllCategories = signal(false);

  protected readonly visibleCategories = computed(() => {
    const items = this.vm()?.categoryOptions ?? [];
    return this.showAllCategories() ? items : items.slice(0, this.maxCategories);
  });

  toggleShowAllCategories() {
    this.showAllCategories.update((v) => !v);
  }

  protected isSelected(selected: string[] | undefined, id: string): boolean {
    return selected?.includes(id) ?? false;
  }

  onToggleGeneral(opt: SideFilterOption) {
    const current = this.vm()?.selectedGeneral;
    this.store.dispatch(FeedActions.setSideFilters({ general: current === opt.id ? null : opt.id }));
  }

  onToggleLanguage(opt: SideFilterOption) {
    this.store.dispatch(
      FeedActions.setSideFilters({ languages: this.toggle(this.vm()?.selectedLanguages ?? [], opt.id) }),
    );
  }

  onToggleType(opt: SideFilterOption) {
    this.store.dispatch(FeedActions.setSideFilters({ types: this.toggle(this.vm()?.selectedTypes ?? [], opt.id) }));
  }

  onToggleCategory(opt: SideFilterOption) {
    this.store.dispatch(
      FeedActions.setSideFilters({ categories: this.toggle(this.vm()?.selectedCategories ?? [], opt.id) }),
    );
  }

  onClearAll() {
    this.store.dispatch(FeedActions.clearSideFilters());
  }

  private toggle(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter((i) => i !== id) : [...list, id];
  }
}
