import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImportErrorDialogComponent } from './import-error-dialog.component';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';

describe('ImportErrorDialogComponent', () => {
  let component: ImportErrorDialogComponent;
  let fixture: ComponentFixture<ImportErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportErrorDialogComponent, getTranslocoTestingModule()],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('exportToExcel', () => {
    it('should export enrollment and user errors report', () => {
      const enrollmentErrorsMock = [
        {
          id: 'id',
          email: 'email',
          name: 'name',
          phone: 'phone',
          error: ['error'],
        },
      ];
      const userErrorsMock = [
        {
          id: 'id',
          email: 'email',
          name: 'name',
          phone: 'phone',
          error: ['error'],
        },
      ];
      const matDataMock = {
        enrollment_errors: enrollmentErrorsMock,
        user_errors: userErrorsMock,
      };
      jest.spyOn(component, 'exportExcel').mockImplementation();
      component.data = matDataMock as any;

      component.exportToExcel();

      expect(component.exportExcel).toHaveBeenCalledTimes(2);
    });

    it('should export only enrollment errors report when user errors is empty', () => {
      const enrollmentErrorsMock = [
        {
          id: 'id',
          email: 'email',
          name: 'name',
          phone: 'phone',
          error: ['error'],
        },
      ];
      const userErrorsMock = [];
      const matDataMock = {
        enrollment_errors: enrollmentErrorsMock,
        user_errors: userErrorsMock,
      };
      jest.spyOn(component, 'exportExcel').mockImplementation();
      component.data = matDataMock as any;

      component.exportToExcel();

      expect(component.exportExcel).toHaveBeenCalledTimes(1);
    });

    it('should export only user errors report when enrollment errors is empty', () => {
      const enrollmentErrorsMock = [];
      const userErrorsMock = [
        {
          id: 'id',
          email: 'email',
          name: 'name',
          phone: 'phone',
          error: ['error'],
        },
      ];
      const matDataMock = {
        enrollment_errors: enrollmentErrorsMock,
        user_errors: userErrorsMock,
      };

      jest.spyOn(component, 'exportExcel').mockImplementation();
      component.data = matDataMock as any;

      component.exportToExcel();

      expect(component.exportExcel).toHaveBeenCalledTimes(1);
    });
  });

  describe('extractReportDataAndHeaders', () => {
    it('should return data and headers by a list of report errors', () => {
      const reportErrors = [
        {
          id: 'b442a3fc-0530-4ef4-8aed-3eff99c87466',
          name: 'Test',
          phone: '5511900000000',
          email: 'test@keeps.com.br',
          tags: 'tag 1, tag 2',
          sync_check: 'phone_ok',
          error: 'error message',
          created: '2022-01-01T00:00:00',
          updated: '2022-01-01T00:00:00',
        },
      ];
      const expectedData = [
        [
          'b442a3fc-0530-4ef4-8aed-3eff99c87466',
          'Test',
          '5511900000000',
          'test@keeps.com.br',
          'tag 1, tag 2',
          'phone_ok',
          'error message',
          '2022-01-01T00:00:00',
          '2022-01-01T00:00:00',
        ],
      ];
      const expectedHeaders = ['id', 'name', 'phone', 'email', 'tags', 'sync_check', 'error', 'created', 'updated'];

      const response = component.extractReportDataAndHeaders(reportErrors);

      expect(response.data).toEqual(expectedData);
      expect(response.headers).toEqual(expectedHeaders);
    });
  });

  describe('transformEnrollmentErrors', () => {
    it('should transform enrollment errors', () => {
      const enrollmentErrors = [
        {
          avatar: null,
          created: '2022-01-01T00:00:00',
          email: 'test@keeps.com.br',
          error: ['error message'],
          id: 'b442a3fc-0530-4ef4-8aed-3eff99c87466',
          my_account_user: true,
          name: 'Test',
          phone: '5511900000000',
          sync_check: 'phone_ok',
          tags: 'tag 1, tag 2',
          updated: '2022-01-01T00:00:00',
        },
      ];
      const expectedResponse = [
        {
          id: 'b442a3fc-0530-4ef4-8aed-3eff99c87466',
          name: 'Test',
          phone: '5511900000000',
          email: 'test@keeps.com.br',
          tags: 'tag 1, tag 2',
          sync_check: 'phone_ok',
          error: 'error message',
          created: '2022-01-01T00:00:00',
          updated: '2022-01-01T00:00:00',
        },
      ];

      const response = component.transformEnrollmentErrors(enrollmentErrors);

      expect(response).toEqual(expectedResponse);
    });
  });

  describe('transformUserErrors', () => {
    it('should transform user errors', () => {
      const userErrors = [
        {
          email: '',
          error: ['error message'],
          myacc: false,
          name: '',
          phone: '5511900000000',
          tags: '',
        },
      ];
      const expectedResponse = [
        {
          name: '',
          phone: '5511900000000',
          email: '',
          tags: '',
          myacc: 'false',
          error: 'error message',
        },
      ];

      const response = component.transformUserErrors(userErrors);

      expect(response).toEqual(expectedResponse);
    });
  });
});
