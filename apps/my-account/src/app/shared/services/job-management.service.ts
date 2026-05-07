import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { JobDialogComponent } from '@app/main/job-management/containers/job-dialog/job-dialog.component';
import { JobEnum, JobModel, JobResponse } from '@app/main/job-management/models';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { MyAccountV2API } from 'app/shared/api/myaccount-v2.api';
import { forkJoin, Observable, tap } from 'rxjs';
import { getErrorMessage, getSuccessMessage, JobOperation } from 'app/shared/services/job-management-messages';

@Injectable({ providedIn: 'root' })
export class JobManagementService {
  constructor(
    private _dialog: MatDialog,
    private _messageService: KpMessageService,
    private _http: MyAccountV2API,
  ) {}

  openDialog(): MatDialogRef<JobDialogComponent> {
    return this._dialog.open(JobDialogComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
    });
  }

  getJobs(jobType: JobEnum, search?: string): Observable<JobModel[]> {
    const params = search ? { searchName: search } : {};
    return this._http.get<JobModel[]>(this.getBaseUrl(jobType), params);
  }

  createJob(jobType: JobEnum, job: JobModel): Observable<JobModel> {
    const data: JobResponse = { name: job.name };
    return this._http.post<JobModel>(this.getBaseUrl(jobType), data).pipe(
      tap({
        next: () => this.displaySuccessMessage(jobType, 'create'),
        error: () => this.displayErrorMessage(jobType, 'create'),
      }),
    );
  }

  editJob(jobType: JobEnum, job: JobModel): Observable<JobModel> {
    const data: JobResponse = { name: job.name };
    return this._http.patch<JobModel>(`${this.getBaseUrl(jobType)}/${job.id}`, data).pipe(
      tap({
        next: () => this.displaySuccessMessage(jobType, 'edit'),
        error: () => this.displayErrorMessage(jobType, 'edit'),
      }),
    );
  }

  openDeleteConfirmDialog(jobType: JobEnum, reference?: string | string[]): Observable<boolean> {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent, {
      autoFocus: 'dialog',
      width: '360px',
      disableClose: true,
    });

    const instance = dialogRef.componentInstance;
    instance.negativeButtonLabel = 'JOB_MANAGEMENT.DELETE_BUTTON';
    instance.positiveButtonLabel = 'JOB_MANAGEMENT.CLOSE_BUTTON';
    if (isArray(reference)) {
      instance.confirmTitle = 'JOB_MANAGEMENT.DELETE_SELECTION_TITLE';
      instance.confirmMessage = 'JOB_MANAGEMENT.DELETE_SELECTION_DESCRIPTION';
    } else if (jobType === JobEnum.JOB_FUNCTION) {
      instance.confirmTitle = 'JOB_MANAGEMENT.JOB_FUNCTION.DELETE_DIALOG_TITLE';
      instance.confirmMessage = 'JOB_MANAGEMENT.JOB_FUNCTION.DELETE_DIALOG_DESCRIPTION';
    } else {
      instance.confirmTitle = 'JOB_MANAGEMENT.JOB_POSITION.DELETE_DIALOG_TITLE';
      instance.confirmMessage = 'JOB_MANAGEMENT.JOB_POSITION.DELETE_DIALOG_DESCRIPTION';
    }

    return dialogRef.afterClosed();
  }

  deleteJob(jobType: JobEnum, jobIds: string | string[]) {
    if (isArray(jobIds)) {
      return this.batchDeleteJobs(jobType, jobIds);
    }

    return this.deleteSingleJob(jobType, jobIds);
  }

  private deleteSingleJob(jobType: JobEnum, id: string) {
    return this._http.delete(`${this.getBaseUrl(jobType)}/${id}`).pipe(
      tap({
        next: () => this.displaySuccessMessage(jobType, 'delete'),
        error: () => this.displayErrorMessage(jobType, 'delete'),
      }),
    );
  }

  private batchDeleteJobs(jobType: JobEnum, jobIds: string[]) {
    const operations: Record<string, Observable<unknown>> = {};
    jobIds.forEach((id) => {
      operations[id] = this.deleteSingleJob(jobType, id);
    });

    return forkJoin(operations).pipe(
      tap({
        next: () => this.displaySuccessMessage(jobType, 'batchDelete'),
        error: () => this.displayErrorMessage(jobType, 'batchDelete'),
      }),
    );
  }

  private getBaseUrl(jobType: JobEnum): string {
    return jobType === JobEnum.JOB_FUNCTION ? '/job-functions' : '/jobs';
  }

  private displaySuccessMessage(jobType: JobEnum, operation: JobOperation) {
    const message = getSuccessMessage(jobType, operation);
    this._messageService.success(message);
  }

  private displayErrorMessage(jobType: JobEnum, operation: JobOperation) {
    const message = getErrorMessage(jobType, operation);
    this._messageService.error(message);
  }
}

function isArray<T>(value: any): value is T[] {
  return Array.isArray(value);
}
