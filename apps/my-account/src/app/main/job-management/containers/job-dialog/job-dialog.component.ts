import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JobModel } from '../../models';
import { JobManagementActions, jobManagementFeature } from '../../store';
import { JobDialogFormComponent } from '../../components/job-dialog-form/job-dialog-form.component';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  imports: [JobDialogFormComponent, AsyncPipe, TranslocoPipe],
})
export class JobDialogComponent {
  title$: Observable<string>;
  description$: Observable<string>;
  placeholder$: Observable<string>;
  buttonSubmit$: Observable<string>;
  item$: Observable<JobModel>;

  constructor(private store: Store) {
    this.title$ = store.select(jobManagementFeature.selectTitleDialog);
    this.description$ = store.select(jobManagementFeature.selectDescriptionDialog);
    this.placeholder$ = store.select(jobManagementFeature.selectPlaceholderDialog);
    this.buttonSubmit$ = store.select(jobManagementFeature.selectSubmitButtonDialog);
    this.item$ = store.select(jobManagementFeature.selectItem);
  }

  onSubmit(item: JobModel): void {
    this.store.dispatch(JobManagementActions.saveItem({ response: item }));
  }
}
