import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogClose } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ReportModalListComponent } from '../../components/report-modal-list/report-modal-list.component';
import { ReportType } from '../../enums/report';
import { FilterDialogData, SimpleFilterListItem, SimpleFilterReportModel } from '../../interfaces';
import { ReportActions, SimpleFilterReportActions } from '../../store/actions';
import { SimpleFilterReportSelectors } from '../../store/selectors';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  imports: [ReportModalListComponent, MatIconButton, MatDialogClose, MatIcon, AsyncPipe, TranslocoPipe],
})
export class ReportModalComponent implements OnInit, OnDestroy {
  reportType: ReportType;
  items$: Observable<SimpleFilterListItem[]>;
  isLoading$: Observable<boolean>;

  @ViewChild('selectionList') selectionList!: ReportModalListComponent;

  get validFilter(): boolean {
    return this.selectionList?.selectedCount > 0;
  }

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<ReportModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterDialogData,
  ) {
    this.items$ = store.select(SimpleFilterReportSelectors.selectItems);
    this.isLoading$ = store.select(SimpleFilterReportSelectors.selectIsLoading);
    this.reportType = data.reportType;
  }

  ngOnInit(): void {
    const filter: SimpleFilterReportModel = { page: 1, reportType: this.reportType, search: '' };
    this.store.dispatch(SimpleFilterReportActions.loadFilterItems({ filter }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(SimpleFilterReportActions.clear());
  }

  onSearch(search: string): void {
    const filter = { page: 1, reportType: this.reportType, search };
    this.store.dispatch(SimpleFilterReportActions.searchItems({ filter }));
  }

  fetchMoreItems(): void {
    this.store.dispatch(SimpleFilterReportActions.fetchMoreItems());
  }

  reportGenerate(): void {
    const ids = this.selectionList.selection.selected.map((item) => item.id);
    this.store.dispatch(ReportActions.getReport({ filter: { reportType: this.reportType, objectIds: ids } }));
  }
}
