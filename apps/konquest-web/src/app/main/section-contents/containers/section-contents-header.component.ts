import { ChangeDetectionStrategy, Component, input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CustomSectionModel } from '@app/main/custom-sections/models/custom-sections';
import { RETURN_ROUTE_MAP } from '@app/main/home/models/home';
import { Language, LanguagesService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { MissionCategory, MissionProvider } from 'app/main/mission/mission.model';
import { SectionContentActions } from 'app/main/section-contents/store/actions';
import { categoriesFeature, providersFeature } from 'app/shared/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SectionContentsFilterComponent } from '../components/filters/section-contents-filter.component';
import { Filter, SectionFilterType } from '../models/section-contents-filter';
import { sectionContentsFeature } from '../store/section-contents.feature';

@Component({
  selector: 'app-section-content-header',
  imports: [SectionContentsFilterComponent, MatButtonModule, MatIconModule, NgxSkeletonLoaderModule],
  template: `
    <div class="flex items-center gap-2">
      <button mat-icon-button (click)="onBack()" class="mr-1">
        <mat-icon>chevron_left</mat-icon>
      </button>

      <div class="flex flex-col">
        @if (!section() && loading()) {
          <ngx-skeleton-loader animation="pulse" [theme]="titleLoaderTheme"></ngx-skeleton-loader>
          <ngx-skeleton-loader animation="pulse" [theme]="descriptionLoaderTheme"></ngx-skeleton-loader>
        } @else {
          <h1 class="text-xl">{{ section()?.title }}</h1>
          <h2>{{ section()?.description }}</h2>
        }
      </div>
    </div>

    <app-section-contents-filter
      class="mt-4"
      [filterType]="filterType()"
      [languages]="languages()"
      [providers]="providers()"
      [categories]="categories()"
      (filterChange)="onFilterChange($event)"
    ></app-section-contents-filter>
  `,
  styles: `
    :host {
      @apply px-6 mt-6;
      display: flex;
      flex-direction: column;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionContentsHeaderComponent {
  filterType = input<SectionFilterType>();
  loading = input<boolean>();

  readonly section: Signal<CustomSectionModel>;
  protected readonly languages: Signal<Language[]>;
  protected readonly categories: Signal<MissionCategory[]>;
  protected readonly providers: Signal<MissionProvider[]>;

  readonly baseLoaderTheme = { 'border-radius': '4px', height: '18px' };
  readonly titleLoaderTheme = { ...this.baseLoaderTheme, width: '200px' };
  readonly descriptionLoaderTheme = { ...this.baseLoaderTheme, width: '500px' };

  constructor(
    private readonly store: Store,
    protected readonly languagesService: LanguagesService,
    private readonly router: Router,
  ) {
    this.section = toSignal(store.select(sectionContentsFeature.selectSection));
    this.languages = this.languagesService.languages;
    this.categories = toSignal(store.select(categoriesFeature.selectMissions));
    this.providers = toSignal(store.select(providersFeature.selectProviders));
  }

  onFilterChange(filter: Filter) {
    this.store.dispatch(SectionContentActions.filter({ filter }));
  }

  onBack() {
    this.router.navigate(['/home'], { queryParams: RETURN_ROUTE_MAP[this.section()?.learning_object_type] });
  }
}
