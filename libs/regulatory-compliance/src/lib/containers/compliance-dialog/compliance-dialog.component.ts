import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComplianceDialogActions } from '../../store/actions';
import { ComplianceDialogViewModel, ComplianceListItem } from '../../models';
import { Observable } from 'rxjs';
import { complianceDialogFeature } from '../../store/features';
import {
  ComplianceFormComponent,
  ComplianceListItemToggleEvent,
  CompliancesCollectionComponent,
} from '../../components';
import { MatDialogActions, MatDialogClose, MatDialogTitle } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { KpGlobalSearchInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-input';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'kp-compliance-dialog',
  template: `
    @if (complianceDialogViewModel$ | async; as vm) {
      <div mat-dialog-title class="flex justify-between">
        <h1 class="text-2xl">
          {{ 'REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.TITLE' | transloco }}
        </h1>
        <button data-test="button-close-normative-dialog" mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <kp-compliance-form
        class="px-6"
        (saveCompliance)="onSaveCompliance($event)"
        [complianceName]="vm.normativeInputValue"
      ></kp-compliance-form>
      <mat-divider class="my-4"></mat-divider>
      <kp-global-search-input (filterEvent)="onFilter($event)"></kp-global-search-input>
      <mat-divider class="mt-4"></mat-divider>
      <kp-compliance-collection
        [items]="vm.listItems"
        [itemsTotal]="vm.itemsTotal"
        [selectedTotal]="vm.selectedTotal"
        [isLoading]="vm.isLoading"
        (batchDelete)="onBatchDelete()"
        (toggleItemSelection)="onToggleSelection($event)"
        (toggleSelectAll)="onToggleSelectAll($event)"
        (editItem)="onEditCompliance($event)"
        (deleteItem)="onDeleteCompliance($event)"
        (loadMoreItems)="onLoadMoreItems()"
      ></kp-compliance-collection>
      <mat-divider></mat-divider>
      <div mat-dialog-actions [align]="'end'">
        <button mat-button mat-dialog-close>
          {{ 'REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.ACTIONS.LEAVE' | transloco }}
        </button>
        <button mat-flat-button color="primary" mat-dialog-close>
          {{ 'REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.ACTIONS.SAVE_AND_CLOSE' | transloco }}
        </button>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatIconButton,
    MatDialogClose,
    MatIcon,
    ComplianceFormComponent,
    MatDivider,
    KpGlobalSearchInputComponent,
    CompliancesCollectionComponent,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class ComplianceDialogComponent {
  protected readonly complianceDialogViewModel$: Observable<ComplianceDialogViewModel>;

  constructor(private store: Store) {
    this.complianceDialogViewModel$ = this.store.select(complianceDialogFeature.selectDialogViewModel);
  }

  onFilter(filter: string): void {
    this.store.dispatch(ComplianceDialogActions.filterCompliance({ filter }));
  }

  onToggleSelection(event: ComplianceListItemToggleEvent): void {
    this.store.dispatch(ComplianceDialogActions.toggleSelectCompliance({ ...event }));
  }

  onToggleSelectAll(selected: boolean): void {
    this.store.dispatch(ComplianceDialogActions.toggleSelectAllCompliance({ selected }));
  }

  onEditCompliance(compliance: ComplianceListItem): void {
    this.store.dispatch(ComplianceDialogActions.saveCompliance({ compliance }));
  }

  onSaveCompliance(name: string): void {
    this.store.dispatch(ComplianceDialogActions.saveCompliance({ compliance: { name } }));
  }

  onDeleteCompliance(id: string): void {
    this.store.dispatch(ComplianceDialogActions.deleteCompliance({ id }));
  }

  onBatchDelete(): void {
    this.store.dispatch(ComplianceDialogActions.batchDeleteCompliance());
  }

  onLoadMoreItems(): void {
    this.store.dispatch(ComplianceDialogActions.loadMoreItems());
  }
}
