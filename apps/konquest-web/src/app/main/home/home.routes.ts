import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HomeComponent } from './home.component';
import { BannerSettingsService } from './services/banner-settings.service';
import { BannersService } from './services/banners.service';
import { EventsService } from './services/events.service';
import { HomeResolver } from './services/home.resolver';
import { HomeService } from './services/home.service';
import { BannersEffects, BannerSettingsEffects, EventsEffects, HomeEffects } from './store/effects';
import { bannerSettingsFeature, bannersFeature, eventsFeature, homeFeature } from './store/features';

const SERVICES = [BannersService, BannerSettingsService, HomeService, EventsService];
const EFFECTS = [HomeEffects, BannersEffects, BannerSettingsEffects, EventsEffects];

const PROVIDERS = [
  importProvidersFrom([
    StoreModule.forFeature(homeFeature),
    StoreModule.forFeature(bannersFeature),
    StoreModule.forFeature(bannerSettingsFeature),
    StoreModule.forFeature(eventsFeature),
    EffectsModule.forFeature(EFFECTS),
  ]),
  ...SERVICES,
];

export default [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      filterData: HomeResolver,
    },
    providers: [PROVIDERS],
  },
];
