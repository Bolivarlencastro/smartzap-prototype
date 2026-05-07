import { Injectable, Injector, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { saveAs } from 'file-saver-es';

type PipeClass<T extends PipeTransform = PipeTransform> = new (...args: any[]) => T;

export type CSVColumnDefinition = {
  title: string;
  pipe?: PipeClass;
};

export type CSVExportDefinition<T> = Partial<Record<keyof T, CSVColumnDefinition>>;

@Injectable()
export class DataExporterService {
  constructor(
    private readonly translateService: TranslocoService,
    private readonly injector: Injector,
  ) {}

  exportToCSV<T>(fileName: string, data: T[], definition: CSVExportDefinition<T>) {
    if (!data?.length || !definition) {
      return;
    }

    try {
      const csvData = this.buildCSVData(data, definition);
      this.saveCSVFile(fileName, csvData);
    } catch (error) {
      console.error('Error exporting CSV', error);
    }
  }

  private buildCSVData<T>(data: T[], definition: CSVExportDefinition<T>): string {
    const properties = Object.keys(definition);
    const definitions = Object.values<CSVColumnDefinition>(definition);
    const headers: string[] = definitions.map((def) => def.title);
    const translatedHeaders = this.translateHeaders(headers);

    let csvData = '';
    csvData += translatedHeaders.join(',') + '\n';

    for (const row of data) {
      const rowData = this.buildCSVRow<T>(row, properties, definition);
      csvData += rowData + '\n';
    }

    return csvData;
  }

  private translateHeaders(headers: string[]): string[] {
    return headers.map((header) => this.translateService.translate(header));
  }

  private buildCSVRow<T>(rowData: T, properties: string[], definition: CSVExportDefinition<T>): string {
    let rowTextValue = '';

    for (let propertyIndex = 0; propertyIndex < properties.length; propertyIndex++) {
      const property = properties[propertyIndex] as keyof T;
      const isLastProperty = propertyIndex === properties.length - 1;
      const pipeClass = definition[property].pipe;
      const propertyValue = rowData[property];
      const propertyTextValue = pipeClass ? this.getTransformedData(rowData, property, pipeClass) : propertyValue;

      rowTextValue += `${propertyTextValue}`;

      if (!isLastProperty) {
        rowTextValue += ',';
      }
    }

    return rowTextValue;
  }

  private getTransformedData<T>(data: T, property: keyof T, pipe: PipeClass) {
    const pipeInstance = this.injector.get<PipeTransform>(pipe);

    if (!pipeInstance) {
      return data[property];
    }

    return pipeInstance.transform(data[property]);
  }

  private saveCSVFile(fileName: string, data: string) {
    const csvBlob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    saveAs(csvBlob, fileName);
  }
}
