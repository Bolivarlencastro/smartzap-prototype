import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { JobEnum, JobModel, JobTab } from '../../models';
import { JobManagementActions, jobManagementFeature } from '../../store';
import { MatCard } from '@angular/material/card';
import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';
import { AsyncPipe } from '@angular/common';
import { JobListComponent } from '../../components/job-list/job-list.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-job-management-wrapper',
  templateUrl: './job-management-wrapper.component.html',
  imports: [MatCard, MatTabNav, MatTabLink, MatTabNavPanel, JobListComponent, AsyncPipe, TranslocoPipe],
})
export class JobManagementWrapperComponent implements OnInit, OnDestroy {
  activeTab$: Observable<JobEnum>;
  tabs$: Observable<JobTab[]>;
  searchTerm$: Observable<string>;
  items$: Observable<JobModel[]>;
  selectAddJobButtonLabel$: Observable<string>;
  selectEmptyListMessage$: Observable<string>;
  loading$: Observable<boolean>;

  activeTab: JobEnum;
  private _unsubscribeAll: Subject<any>;

  constructor(private store: Store) {
    store.dispatch(JobManagementActions.loadItems());
    this.activeTab$ = store.select(jobManagementFeature.selectActiveTab);
    this.tabs$ = store.select(jobManagementFeature.selectTabs);
    this.searchTerm$ = store.select(jobManagementFeature.selectSearchTerm);
    this.items$ = store.select(jobManagementFeature.selectAll);
    this.selectAddJobButtonLabel$ = store.select(jobManagementFeature.selectAddJobButtonLabel);
    this.selectEmptyListMessage$ = store.select(jobManagementFeature.selectEmptyListMessage);
    this.loading$ = store.select(jobManagementFeature.selectLoading);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.activeTab$.pipe(takeUntil(this._unsubscribeAll)).subscribe((tab) => (this.activeTab = tab));
  }

  isActive(tab: JobEnum): boolean {
    return this.activeTab === tab;
  }

  changeTab(tab: JobEnum): void {
    if (this.isActive(tab)) {
      return;
    }
    this.store.dispatch(JobManagementActions.changeTab({ tab }));
  }

  updateSearchTerm(searchTerm: string): void {
    this.store.dispatch(JobManagementActions.updateSearchTerm({ searchTerm }));
  }

  openDialog(item?: JobModel): void {
    this.store.dispatch(JobManagementActions.openDialog({ item }));
  }

  onDelete(id: string | string[]): void {
    this.store.dispatch(JobManagementActions.deleteItem({ id }));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this.store.dispatch(JobManagementActions.resetState());
  }
}
