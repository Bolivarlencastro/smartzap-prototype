import { Routes } from '@angular/router';
import { ReportsComponent } from './container/reports.component';
import { environment } from 'environments/environment';
import { ReportService, SimpleFilterReportService } from 'app/main/report/services';
import { importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import * as fromStore from 'app/main/report/store/reducers';
import { reportFiltersFeature } from 'app/main/report/store/features';
import { EffectsModule } from '@ngrx/effects';
import {
  ChannelsFilterListEffects,
  CoursesFilterListEffects,
  LatestReportEffects,
  ReportEffects,
  ReportFiltersEffects,
  SimpleFilterReportEffects,
  UsersFilterListEffects,
} from 'app/main/report/store/effects';

export default [
  {
    path: '',
    component: ReportsComponent,
    providers: [
      SimpleFilterReportService,
      ReportService,
      importProvidersFrom(
        StoreModule.forFeature(fromStore.featureKey, fromStore.reducers),
        StoreModule.forFeature(reportFiltersFeature),
        EffectsModule.forFeature([
          LatestReportEffects,
          SimpleFilterReportEffects,
          CoursesFilterListEffects,
          UsersFilterListEffects,
          ChannelsFilterListEffects,
          ReportEffects,
          ReportFiltersEffects,
        ]),
      ),
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: environment.routeHome,
      },
    ],
  },
] as Routes;
