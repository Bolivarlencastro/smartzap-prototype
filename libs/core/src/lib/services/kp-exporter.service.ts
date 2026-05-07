import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable, { ColumnInput } from 'jspdf-autotable';
import { TranslocoService } from '@jsverse/transloco';
import { saveAs } from 'file-saver-es';

export type KpExportFormat = 'csv' | 'pdf';

@Injectable({ providedIn: 'root' })
export class KpExporterService {
  static exportAsTabulatedData(fileName: string, tableElementId: string) {
    exportFromTable(tableElementId, fileName);
  }

  constructor(private _translateService: TranslocoService) {}

  exportPDF(tableId: string, fileName: string, columnsNames: string[]): void {
    const columns = this.getColumnInputs(columnsNames);
    const doc = new jsPDF({ orientation: 'landscape' });
    autoTable(doc, { html: tableId, columns });
    doc.save(fileName);
  }

  private getColumnInputs(columnsHeaders: string[]): ColumnInput[] {
    return columnsHeaders.map((header) => ({ header: this._translateService.translate(header) }));
  }
}

function exportFromTable(tableElementId: string, filename: string) {
  const tableElement = document.getElementById(tableElementId);
  if (!tableElement) {
    console.error(`Failure to export table, could not find table with id ${tableElementId}`);
    return;
  }
  const headers: HTMLTableCellElement[] = Array.from(tableElement.querySelectorAll('th'));
  const headersData = headers.map((cell) => normalizeEmptyString(cell.innerText));
  const rows = Array.from(tableElement.querySelectorAll('tbody tr'));
  const rowsData = rows.map((row) =>
    Array.from(row.querySelectorAll('td')).map((cell) => normalizeEmptyString(cell.innerText)),
  );
  exportDataToCSV(filename, headersData, rowsData);
}

function exportDataToCSV(filename: string, headers: string[], data: string[][]) {
  try {
    let csv = '';
    csv += headers.join(',') + '\n';
    csv += data.map((row) => row.join(',')).join('\n');
    const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(csvBlob, `${filename}.csv`);
  } catch (error) {
    console.error('Unable to export data to CSV - ', error);
    return;
  }
}

function normalizeEmptyString(value: string): string {
  return value.replace(/,/g, '').trim();
}
