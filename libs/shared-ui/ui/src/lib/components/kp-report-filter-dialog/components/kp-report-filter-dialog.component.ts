import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FilterDialogReportType } from '../model/filter-dialog-report-type';
import { FilterGroupConfig } from '../model/filter-group-config';
import { DialogForm } from '../model/forms-models';
import { KpReportFilterDialogData } from '../model/report-filter-dialog-data';
import { ReportFilterDialogService } from '../services/report-filter-dialog.service';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatButton } from '@angular/material/button';
import { FilterGroupComponent } from './filter-group/filter-group.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

marker('UI.REPORT_FILTER_DIALOG.GENERATE_REPORT');

@Component({
  selector: 'kp-report-filter-dialog',
  templateUrl: './kp-report-filter-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ReportFilterDialogService],
  imports: [
    MatDialogTitle,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    CdkScrollable,
    MatDialogContent,
    FilterGroupComponent,
    MatButton,
    MatDialogActions,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class KpReportFilterDialogComponent {
  filterForm$: Observable<FormGroup<DialogForm>>;
  selectors$: Observable<FilterGroupConfig[]>;
  canAddFilter$: Observable<boolean>;
  reportType = new FormControl<FilterDialogReportType>(FilterDialogReportType.XLSX);

  constructor(
    public dialogRef: MatDialogRef<KpReportFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: KpReportFilterDialogData,
    private filterDialogService: ReportFilterDialogService,
  ) {
    this.filterForm$ = this.filterDialogService.filterForm$;
    this.selectors$ = this.filterDialogService.selectors$;
    this.canAddFilter$ = this.filterDialogService.canAddFilter$;
    this.filterDialogService.setOptions(data.selectors);

    this.dialogRef.afterOpened().subscribe(() => {
      this.filterDialogService.restoreFilter(data.currentFilter);
    });
  }

  add(): void {
    this.filterDialogService.addFilterGroup();
  }

  removeFilterGroup(index: number, currentSelectorValue?: string): void {
    this.filterDialogService.removeFilterGroup(index, currentSelectorValue);
  }

  clearFilters() {
    this.filterDialogService.clearFilters();
  }

  getSelector(selectorValue: string): FilterGroupConfig | undefined {
    if (!selectorValue) {
      return undefined;
    }
    return this.filterDialogService.getSelectorByValue(selectorValue);
  }

  generateReport(): void {
    const filterValue = this.filterDialogService.getFilterValue();
    if (filterValue === null) {
      return;
    }
    this.dialogRef.close(filterValue);
  }
}
