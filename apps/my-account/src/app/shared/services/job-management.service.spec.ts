import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MyAccountAPI } from '@app/shared/api/myaccount.api';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { of } from 'rxjs';
import { JobManagementService } from './job-management.service';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { MyAccountV2API } from 'app/shared/api/myaccount-v2.api';
import { JobDialogComponent } from '@app/main/job-management/containers/job-dialog/job-dialog.component';
import { JobEnum, JobModel } from '@app/main/job-management/models';

describe('JobManagementService', () => {
  let service: JobManagementService;
  let matDialog: MatDialog;
  let matDialogRef: MatDialogRef<any>;
  let myAccountV2Api: jest.Mocked<MyAccountV2API>;
  let messageService: jest.Mocked<KpMessageService>;
  let successSpy: jest.SpyInstance<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        JobManagementService,
        MyAccountAPI,
        { provide: MatDialog, useValue: { open: jest.fn(() => matDialogRef) } },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
            afterClosed: jest.fn(),
            componentInstance: {},
          },
        },
        { provide: KpMessageService, useValue: { success: jest.fn() } },
        {
          provide: MyAccountV2API,
          useValue: {
            get: jest.fn(() => of(true)),
            post: jest.fn(() => of(true)),
            patch: jest.fn(() => of(true)),
            delete: jest.fn(() => of(true)),
          },
        },
      ],
    }).compileComponents();

    service = TestBed.inject(JobManagementService);
    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    matDialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<any>>;
    myAccountV2Api = TestBed.inject(MyAccountV2API) as jest.Mocked<MyAccountV2API>;
    messageService = TestBed.inject(KpMessageService) as jest.Mocked<KpMessageService>;
    successSpy = jest.spyOn(messageService, 'success');
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should open main dialog', () => {
    const spy = jest.spyOn(matDialog, 'open');
    service.openDialog();
    expect(spy).toHaveBeenCalledWith(JobDialogComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
    });
  });

  describe('API access', () => {
    const cases = [
      [JobEnum.JOB_FUNCTION, '/job-functions'],
      [JobEnum.JOB_POSITION, '/jobs'],
    ];

    test.each(cases)('should get %p', (type, baseUrl) => {
      const spy = jest.spyOn(myAccountV2Api, 'get');
      const term = 'test';
      service.getJobs(type as JobEnum, term);
      expect(spy).toHaveBeenCalledWith(baseUrl, { searchName: term });
    });

    test.each(cases)('should create %p', (type, baseUrl, done: any) => {
      const spy = jest.spyOn(myAccountV2Api, 'post');
      const job: JobModel = { id: null, name: 'Job 1' };
      service.createJob(type as JobEnum, job).subscribe(() => {
        expect(successSpy).toHaveBeenCalledWith(`JOB_MANAGEMENT.${type}.CREATION_SUCCESSFUL_MESSAGE`);
        expect(spy).toHaveBeenCalledWith(baseUrl, { name: job.name });
        done();
      });
    });

    test.each(cases)('should edit %p', (type, baseUrl, done: any) => {
      const spy = jest.spyOn(myAccountV2Api, 'patch');
      const job: JobModel = { id: '1', name: 'Job Changed 1' };
      service.editJob(type as JobEnum, job).subscribe(() => {
        expect(successSpy).toHaveBeenCalledWith(`JOB_MANAGEMENT.${type}.EDITION_SUCCESSFUL_MESSAGE`);
        expect(spy).toHaveBeenCalledWith(`${baseUrl}/${job.id}`, { name: job.name });
        done();
      });
    });

    test.each(cases)('should delete %p', (type, baseUrl, done: any) => {
      const spy = jest.spyOn(myAccountV2Api, 'delete');
      const id = '1';
      service.deleteJob(type as JobEnum, id).subscribe(() => {
        expect(successSpy).toHaveBeenCalledWith(`JOB_MANAGEMENT.${type}.DELETION_SUCCESSFUL_MESSAGE`);
        expect(spy).toHaveBeenCalledWith(`${baseUrl}/${id}`);
        done();
      });
    });

    test.each(cases)('should delete many %p', (type, done: any) => {
      const spy = jest.spyOn(myAccountV2Api, 'delete');
      service.deleteJob(type as JobEnum, ['1', '2', '3']).subscribe(() => {
        expect(successSpy).toHaveBeenCalledWith('JOB_MANAGEMENT.DELETE_SELECTION_SUCCESSFUL_MESSAGE');
        expect(spy).toHaveBeenCalledTimes(3);
        done();
      });
    });

    test.each(cases)('should open delete confirm dialog to many %p', (type) => {
      const instance = matDialogRef.componentInstance;
      const spy = jest.spyOn(matDialog, 'open');
      service.openDeleteConfirmDialog(type as JobEnum, ['1', '2', '3']);
      expect(spy).toHaveBeenCalledWith(KpConfirmDialogComponent, {
        autoFocus: 'dialog',
        width: '360px',
        disableClose: true,
      });
      expect(instance.negativeButtonLabel).toBe('JOB_MANAGEMENT.DELETE_BUTTON');
      expect(instance.positiveButtonLabel).toBe('JOB_MANAGEMENT.CLOSE_BUTTON');
      expect(instance.confirmTitle).toBe('JOB_MANAGEMENT.DELETE_SELECTION_TITLE');
      expect(instance.confirmMessage).toBe('JOB_MANAGEMENT.DELETE_SELECTION_DESCRIPTION');
    });

    test.each(cases)('should open delete confirm dialog to %p', (type) => {
      const instance = matDialogRef.componentInstance;
      const spy = jest.spyOn(matDialog, 'open');
      service.openDeleteConfirmDialog(type as JobEnum, '1');
      expect(spy).toHaveBeenCalledWith(KpConfirmDialogComponent, {
        autoFocus: 'dialog',
        width: '360px',
        disableClose: true,
      });
      expect(instance.negativeButtonLabel).toBe('JOB_MANAGEMENT.DELETE_BUTTON');
      expect(instance.positiveButtonLabel).toBe('JOB_MANAGEMENT.CLOSE_BUTTON');
      expect(instance.confirmTitle).toBe(`JOB_MANAGEMENT.${type}.DELETE_DIALOG_TITLE`);
      expect(instance.confirmMessage).toBe(`JOB_MANAGEMENT.${type}.DELETE_DIALOG_DESCRIPTION`);
    });
  });
});
