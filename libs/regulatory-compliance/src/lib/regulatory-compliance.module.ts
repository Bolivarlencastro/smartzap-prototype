import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import {
  ComplianceFormComponent,
  CompliancesCollectionComponent,
  CycleActionsComponent,
  CycleCreateFormComponent,
  CycleEnrollmentsListComponent,
  CycleProgressComponent,
  CyclesCollectionComponent,
} from './components';
import {
  ComplianceDialogComponent,
  CycleCreateComponent,
  CycleEnrollmentsComponent,
  CycleEnrollmentsFilterComponent,
  CyclesListComponent,
  RegulatoryComplianceComponent,
} from './containers';
import { RegulatoryComplianceRoutingModule } from './regulatory-compliance-routing.module';
import { cycleCreateFeature, cyclesListFeature, FEATURE_EFFECTS } from './store';
import {
  ComplianceDialogService,
  CycleCreateService,
  CycleEnrollmentsFilterService,
  CycleEnrollmentsService,
} from './services';
import { complianceDialogFeature, cycleEnrollmentsFeature, cycleEnrollmentsFilterFeature } from './store/features';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CycleEnrollmentStatusPipe } from './pipes/cycle-enrollment-status.pipe';
import { MatBadgeModule } from '@angular/material/badge';
import { CycleEnrollmentProgressPipe } from './pipes/cycle-enrollment-progress.pipe';
import { CycleIconPipe } from './pipes/cycle-icon.pipe';
import { CycleDurationTypePipe } from './pipes/cycle-duration-type.pipe';
import { CycleEnrollmentStatusColorPipe } from './pipes/cycle-enrollment-status-color.pipe';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';

const loader: InlineLoader = ['en', 'es', 'pt-BR', 'pt-PT'].reduce((acc, lang) => {
  acc[lang] = () => import(`../assets/i18n/${lang}.json`);
  return acc;
}, {} as InlineLoader);

const MATERIAL_MODULES = [
  MatTabsModule,
  MatDividerModule,
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatSortModule,
  MatBadgeModule,
];

@NgModule({
  imports: [
    ...MATERIAL_MODULES,
    CommonModule,
    RegulatoryComplianceRoutingModule,
    StoreModule.forFeature(cyclesListFeature),
    StoreModule.forFeature(cycleCreateFeature),
    StoreModule.forFeature(cycleEnrollmentsFeature),
    StoreModule.forFeature(complianceDialogFeature),
    StoreModule.forFeature(cycleEnrollmentsFilterFeature),
    EffectsModule.forFeature(FEATURE_EFFECTS),
    RegulatoryComplianceComponent,
    CycleEnrollmentsComponent,
    CyclesListComponent,
    CyclesCollectionComponent,
    CycleCreateComponent,
    CycleCreateFormComponent,
    ComplianceDialogComponent,
    ComplianceFormComponent,
    CompliancesCollectionComponent,
    CycleEnrollmentsListComponent,
    CycleProgressComponent,
    CycleActionsComponent,
    CycleEnrollmentStatusPipe,
    CycleEnrollmentProgressPipe,
    CycleIconPipe,
    CycleEnrollmentsFilterComponent,
    CycleDurationTypePipe,
    CycleEnrollmentStatusColorPipe,
  ],
  providers: [
    CycleCreateService,
    ComplianceDialogService,
    CycleEnrollmentsService,
    CycleEnrollmentsFilterService,
    provideTranslocoScope({
      scope: 'regulatory-compliance',
      alias: 'REGULATORY_COMPLIANCE',
      loader,
    }),
  ],
})
export class RegulatoryComplianceModule {}
