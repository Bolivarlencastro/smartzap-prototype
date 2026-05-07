import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LearnContentActions } from '@app/shared/store';
import { TranslocoModule } from '@jsverse/transloco';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { LearnContentActionData } from '@keeps-platform-frontend-workspace/ui/models';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { map, Observable } from 'rxjs';
import { BannerComponent } from './components/banner/banner.component';
import { SectionCarouselComponent } from './components/section-carousel/section-carousel.component';
import { EventsComponent } from './containers/events/events.component';
import { BannerActionData, BannersViewModel } from './models/banners';
import { HomePageType, HomeViewModel } from './models/home';
import { BannersActions, BannerSettingsActions, HomeActions } from './store/actions';
import { bannersFeature, homeFeature } from './store/features';

@Component({
  selector: 'app-home',
  imports: [
    TranslocoModule,
    MatIcon,
    BannerComponent,
    AsyncPipe,
    NgxSkeletonLoaderModule,
    SectionCarouselComponent,
    NgClass,
    RouterLink,
    EventsComponent,
  ],
  template: `
    @let isMobile = isMobile$ | async;

    @if (bannersVm()?.loading) {
      <ngx-skeleton-loader
        count="1"
        animation="pulse"
        [theme]="{
          'height.px': isMobile ? 200 : 450,
          width: '100%',
          'margin-bottom': '12px',
        }"
      ></ngx-skeleton-loader>
    } @else {
      <div class="p-2 pb-4 xxs:p-8 sm:p-12">
        <app-banner
          [items]="bannersVm()?.banners"
          (action)="onBannerAction($event)"
          (openSettings)="onOpenBannerSettings()"
        ></app-banner>
      </div>
    }

    <div class="pb-2 px-2 xxs:pb-8 xxs:px-8 sm:pb-12 sm:px-12 flex gap-3 overflow-x-auto">
      @for (feature of homeVm()?.activateFeatures; track feature.icon) {
        <button
          class="h-9 pl-2 pr-3 text-sm flex items-center border border-solid border-default rounded-lg"
          [ngClass]="{ 'active-link': filter() === feature.id }"
          [routerLink]="[]"
          [queryParams]="{ filter: feature.id }"
        >
          <mat-icon class="mr-2.5 s-6 text-primary">{{ feature.icon }}</mat-icon>
          <span>{{ feature.label | transloco }}</span>
        </button>
      }
    </div>

    @if (filter() === 'events') {
      <app-events [isMobile]="isMobile"></app-events>
    } @else {
      <div
        class="carousel-container flex flex-col gap-12 px-2 xxs:mt-0 xxs:px-8 sm:px-12"
        [ngClass]="{ 'gap-2': homeVm()?.loading }"
      >
        @if (homeVm()?.loading) {
          <ngx-skeleton-loader
            count="1"
            animation="pulse"
            [theme]="{
              'height.px': 20,
              'width.px': 150,
            }"
          ></ngx-skeleton-loader>

          <ngx-skeleton-loader
            count="1"
            animation="pulse"
            [theme]="{
              'height.px': 20,
              'width.px': 80,
            }"
          ></ngx-skeleton-loader>

          <ngx-skeleton-loader
            count="1"
            animation="pulse"
            [theme]="{
              'height.px': 300,
              width: '100%',
            }"
          ></ngx-skeleton-loader>
        } @else {
          @for (section of homeVm()?.sections; track section.id) {
            <app-section-carousel
              [section]="section"
              [isMobile]="isMobile"
              (cardAction)="onCardAction($event)"
            ></app-section-carousel>
          }

          @if (!homeVm()?.sections?.length && !homeVm()?.loading) {
            <div class="flex flex-col justify-center items-center opacity-75 mt-5">
              <mat-icon class="icon">{{ pageIcon() }}</mat-icon>
              <div class="text-base text-center font-bold">{{ 'HOME.EMPTY_STATE.PAGE.TITLE' | transloco }}</div>
              <div class="text-sm text-center">{{ 'HOME.EMPTY_STATE.PAGE.DESCRIPTION' | transloco }}</div>
            </div>
          }
        }
      </div>
    }
  `,
  styles: [
    `
      .carousel-container {
        margin: 0.5rem auto 5rem;
      }

      .active-link {
        @apply bg-primary text-on-primary;
        @apply border-none #{'!important'};

        mat-icon {
          @apply filled text-on-primary #{'!important'};
        }
      }

      .icon {
        @apply mb-2;

        font-size: 48px;
        width: 48px;
        height: 48px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  filter = input<HomePageType>();

  homeVm: Signal<HomeViewModel>;
  bannersVm: Signal<BannersViewModel>;
  isMobile$: Observable<boolean>;

  protected readonly pageIcon: Signal<string> = computed(() => this.getPageIcon());

  constructor(
    private readonly store: Store,
    private readonly breakpointObserver: BreakpointObserver,
  ) {
    store.dispatch(HomeActions.init());
    this.homeVm = toSignal(store.select(homeFeature.selectHomeViewModel));
    this.bannersVm = toSignal(store.select(bannersFeature.selectViewModel));

    this.initialConfig();
  }

  ngOnInit() {
    this.isMobile$ = this.breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(map((result) => result.matches));
  }

  onBannerAction(data: BannerActionData) {
    this.store.dispatch(BannersActions.dispatchAction({ data }));
  }

  onOpenBannerSettings() {
    this.store.dispatch(BannerSettingsActions.openDialog());
  }

  onCardAction(learnContentAction: LearnContentActionData) {
    this.store.dispatch(LearnContentActions.learnContentAction({ learnContentAction }));
  }

  private initialConfig() {
    effect(() => this.store.dispatch(HomeActions.loadSections({ id: this.filter() })));
  }

  private getPageIcon(): string {
    return this.homeVm()?.activateFeatures?.find((feature) => feature.id === this.filter())?.icon;
  }
}
