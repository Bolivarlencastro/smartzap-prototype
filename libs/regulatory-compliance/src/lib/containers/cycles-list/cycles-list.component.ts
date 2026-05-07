import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CycleCreateActions, CyclesListActions, cyclesListFeature } from '../../store';
import { ComplianceDialogActions } from '../../store/actions';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CyclesListViewModel } from '../../models';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { CyclesCollectionComponent } from '../../components';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'kp-cycles-list',
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
  template: `
    @if (vm$ | async; as vm) {
      <div class="flex items-center justify-between px-6 w-full h-32 border-b border-default">
        <span class="text-2xl font-bold">
          {{ 'REGULATORY_COMPLIANCE.NORMATIVE_CYCLES' | transloco }}
        </span>
        <div class="flex gap-2">
          <button
            data-test="button-new-normative"
            mat-stroked-button
            class="h-10 w-44"
            (click)="openComplianceDialog()"
          >
            {{ 'REGULATORY_COMPLIANCE.REGISTER_NORMATIVE' | transloco }}
          </button>
          <button
            data-test="button-new-regulatory-compliance-cycle"
            mat-flat-button
            color="primary"
            class="h-10 w-32"
            (click)="createCycle()"
          >
            <mat-icon>add</mat-icon>
            <span class="ml-2.5">
              {{ 'REGULATORY_COMPLIANCE.CREATE_CYCLE' | transloco }}
            </span>
          </button>
        </div>
      </div>
      <kp-table-layout
        class="grow"
        [totalItems]="vm.pagination.totalItems"
        [pageIndex]="vm.pagination.currentPage"
        [pageSize]="vm.pagination.perPage"
        (pageChange)="onPageChange($event)"
        (searchChange)="searchCycles($event)"
      >
        <kp-cycles-collection
          kpTable
          [cycles]="vm.items"
          [isLoading]="vm.isLoading"
          (editCycle)="editCycle($event)"
          (deleteCycle)="deleteCycle($event)"
        ></kp-cycles-collection>
      </kp-table-layout>
    }
  `,
  imports: [MatButton, MatIcon, KpTableLayoutComponent, CyclesCollectionComponent, AsyncPipe, TranslocoPipe],
})
export class CyclesListComponent {
  protected readonly vm$: Observable<CyclesListViewModel>;

  constructor(private store: Store) {
    store.dispatch(CyclesListActions.loadCycles());
    this.vm$ = store.select(cyclesListFeature.selectViewModel);
  }

  createCycle(): void {
    this.store.dispatch(CycleCreateActions.openNewCycleDialog());
  }

  editCycle(cycle: CycleDto): void {
    this.store.dispatch(CycleCreateActions.openEditCycleDialog({ cycle }));
  }

  deleteCycle(ids: string[]): void {
    this.store.dispatch(CyclesListActions.deleteCycle({ ids }));
  }

  openComplianceDialog() {
    this.store.dispatch(ComplianceDialogActions.openDialog());
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(
      CyclesListActions.setPagination({ pagination: { page: event.pageIndex + 1, perPage: event.pageSize } }),
    );
  }

  searchCycles(search: string) {
    this.store.dispatch(CyclesListActions.setFilter({ filter: { search } }));
  }
}
