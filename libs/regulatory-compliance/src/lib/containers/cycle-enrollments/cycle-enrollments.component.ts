import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CycleEnrollmentsActions, CycleEnrollmentsFilterActions } from '../../store/actions';
import { CycleManagementSort, CycleManagementViewModel } from '../../models';
import { Observable } from 'rxjs';
import { cycleEnrollmentsFeature } from '../../store/features';
import { EnrollmentCycleDto, KpExporterService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CycleEnrollmentsListComponent } from '../../components';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { KpExportFormat, KpExportMenuComponent } from '@keeps-platform-frontend-workspace/ui/kp-export-menu';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'kp-management',
  template: `
    @if (viewModel$ | async; as vm) {
      <div class="flex items-center justify-between px-6 w-full h-32 border-b border-default">
        <span class="text-2xl font-semibold">
          {{ 'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.TITLE' | transloco }}
        </span>
      </div>
      <kp-table-layout
        class="grow"
        [totalItems]="vm.totalItems"
        [pageIndex]="(vm.filter?.page || 1) - 1"
        [pageSize]="vm.filter?.perPage || 50"
        (pageChange)="onPageChange($event)"
        (searchChange)="searchEnrollments($event)"
      >
        <div kpTableFilterAfter class="flex items-center gap-2">
          <button mat-icon-button (click)="openFilters()">
            <mat-icon>filter_alt</mat-icon>
          </button>
          <button mat-stroked-button color="primary" (click)="generateReport()">
            {{ 'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.TABLE.REPORT' | transloco }}
          </button>
          <kp-export-menu
            [label]="'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.TABLE.EXPORT' | transloco"
            (export)="exportTable($event)"
          ></kp-export-menu>
        </div>
        <kp-cycle-enrollments-list
          kpTable
          [enrollments]="vm.items"
          [isLoading]="vm.isLoading"
          (sortChange)="sortChange($event)"
          (renewCycle)="renewCycle($event)"
          (inactivateCycle)="inactivateCycle($event)"
        ></kp-cycle-enrollments-list>
      </kp-table-layout>
    }
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
    `,
  ],
  imports: [
    MatIconButton,
    MatButton,
    MatIcon,
    KpTableLayoutComponent,
    KpExportMenuComponent,
    CycleEnrollmentsListComponent,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class CycleEnrollmentsComponent implements OnDestroy {
  protected viewModel$: Observable<CycleManagementViewModel>;

  constructor(
    private readonly store: Store,
    private readonly pdfExporterService: KpExporterService,
  ) {
    store.dispatch(CycleEnrollmentsActions.loadEnrollments());
    this.viewModel$ = store.select(cycleEnrollmentsFeature.selectViewModel);
  }

  searchEnrollments(filter: string) {
    this.store.dispatch(CycleEnrollmentsActions.searchEnrollments({ filter }));
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(
      CycleEnrollmentsActions.pageChange({ event: { page: event.pageIndex + 1, per_page: event.pageSize } }),
    );
  }

  sortChange(sort: CycleManagementSort): void {
    this.store.dispatch(CycleEnrollmentsActions.sortEnrollments({ sort }));
  }

  renewCycle(cycle: EnrollmentCycleDto): void {
    this.store.dispatch(CycleEnrollmentsActions.renewCycle({ cycle }));
  }

  inactivateCycle(cycle: EnrollmentCycleDto): void {
    this.store.dispatch(CycleEnrollmentsActions.inactivateCycle({ cycle }));
  }

  openFilters() {
    this.store.dispatch(CycleEnrollmentsFilterActions.openFilterDialog());
  }

  generateReport() {
    this.store.dispatch(CycleEnrollmentsActions.generateReport());
  }

  exportTable(format: KpExportFormat): void {
    if (format === 'pdf') {
      const columns = [
        'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.TABLE.USER_NAME',
        'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.TABLE.LEADER_NAME',
        'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.TABLE.NORMATIVE',
        'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.TABLE.LEARNING_OBJECT',
        'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.TABLE.VALIDITY',
        'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.TABLE.RENEW_DATE',
        'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.TABLE.EXPIRATION_DATE',
        'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.TABLE.STATUS',
      ];
      this.pdfExporterService.exportPDF('#cycle-enrollments-table', 'cycle-enrollments.pdf', columns);
      return;
    }

    KpExporterService.exportAsTabulatedData('cycle-enrollments', 'cycle-enrollments-table');
  }

  ngOnDestroy() {
    this.store.dispatch(CycleEnrollmentsActions.reset());
  }
}
