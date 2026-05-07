import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { EnrollmentApiResponse, EnrollmentError, EnrollmentUserError } from 'app/main/courses/model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

type ErrorTransformed = Record<string, string>;

type ReportDataAndHeaders = {
  data: string[][];
  headers: string[];
};

type ExcelData = { title: string } & ReportDataAndHeaders;

@Component({
  selector: 'app-import-error-dialog',
  templateUrl: './import-error-dialog.component.html',
  styleUrls: ['./import-error-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatTabGroup,
    MatTab,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslocoPipe,
  ],
})
export class ImportErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: EnrollmentApiResponse) {}

  exportExcel(excelData: ExcelData): void {
    const title = excelData.title;
    const header = excelData.headers;
    const data = excelData.data;

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Error');

    const headerRow = worksheet.addRow(header);

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
    });

    worksheet.addRows(data);

    workbook.xlsx.writeBuffer().then((workbookData) => {
      const blob = new Blob([workbookData], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, title + '.xlsx');
    });
  }

  exportToExcel(): void {
    const { enrollment_errors, user_errors } = this.data;

    if (enrollment_errors.length) {
      const errors = this.transformEnrollmentErrors(enrollment_errors);
      const { data, headers } = this.extractReportDataAndHeaders(errors);
      const enrollmentsReportData = {
        title: 'Enrollment Errors',
        data,
        headers,
      };
      this.exportExcel(enrollmentsReportData);
    }

    if (user_errors.length) {
      const errors = this.transformUserErrors(user_errors);
      const { data, headers } = this.extractReportDataAndHeaders(errors);
      const usersReportData = { title: 'Users Errors', data, headers };
      this.exportExcel(usersReportData);
    }
  }

  extractReportDataAndHeaders(errors: Array<Record<string, string>>): ReportDataAndHeaders {
    const data = errors.map((error) => Object.values(error));
    const [firstError] = errors;
    const headers = Object.keys(firstError);
    return { data, headers };
  }

  transformEnrollmentErrors(errors: EnrollmentError[]): ErrorTransformed[] {
    return errors.map(({ id, name, phone, email, tags, sync_check, error, created, updated }) => ({
      id: id || '',
      name,
      phone,
      email,
      tags,
      sync_check: sync_check || '',
      error: error?.join(', '),
      created: created || '',
      updated: updated || '',
    }));
  }

  transformUserErrors(errors: EnrollmentUserError[]): ErrorTransformed[] {
    return errors.map(({ name, phone, email, tags, myacc, error }) => ({
      name,
      phone,
      email,
      tags,
      myacc: myacc?.toString() || '',
      error: error?.join(', '),
    }));
  }
}
