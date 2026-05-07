import { CSVExportDefinition, DataExporterService } from './data-exporter.service';
import { TranslocoService } from '@jsverse/transloco';
import { Injector, PipeTransform } from '@angular/core';
import { saveAs } from 'file-saver-es';

jest.mock('file-saver-es', () => ({
  __esModule: true,
  saveAs: jest.fn(),
}));

class MockPipe implements PipeTransform {
  transform(value: any): any {
    return `#${value}`;
  }
}

const originalBlob = (globalThis as any).Blob;

beforeAll(() => {
  class BlobPolyfill {
    private readonly _text: string;

    constructor(parts: any[] = [], _options?: any) {
      this._text = parts.map((p) => (typeof p === 'string' ? p : '')).join('');
    }

    text(): Promise<string> {
      return Promise.resolve(this._text);
    }
  }

  (globalThis as any).Blob = BlobPolyfill as any;
});

afterAll(() => {
  (globalThis as any).Blob = originalBlob;
});

type MockRow = { name: string; age: number };

describe('DataExporterService', () => {
  let service: DataExporterService;
  let translateServiceMock: jest.Mocked<TranslocoService>;
  let injectorMock: jest.Mocked<Injector>;
  const mockSaveAs = saveAs as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    translateServiceMock = {
      translate: jest.fn((key: string) => `T-${key}`),
    } as unknown as jest.Mocked<TranslocoService>;
    injectorMock = { get: jest.fn() } as unknown as jest.Mocked<Injector>;
    service = new DataExporterService(translateServiceMock, injectorMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('exportToCSV', () => {
    it('should do nothing when there is no data to export', () => {
      service.exportToCSV('mock_file.csv', [], {} as any);

      expect(translateServiceMock.translate).not.toHaveBeenCalled();
      expect(injectorMock.get).not.toHaveBeenCalled();
      expect(mockSaveAs).not.toHaveBeenCalled();
    });

    it('should export CSV with translated headers and raw values', () => {
      const data: MockRow[] = [{ name: 'Alice', age: 30 }];
      const definition: CSVExportDefinition<MockRow> = {
        name: { title: 'col.name' },
        age: { title: 'col.age' },
      };

      service.exportToCSV<MockRow>('users.csv', data, definition);

      expect(translateServiceMock.translate).toHaveBeenCalledTimes(2);
      expect(translateServiceMock.translate).toHaveBeenCalledWith('col.name');
      expect(translateServiceMock.translate).toHaveBeenCalledWith('col.age');
      expect(injectorMock.get).not.toHaveBeenCalled();
      expect(mockSaveAs).toHaveBeenCalledWith(expect.anything(), 'users.csv');
    });

    it('should apply pipe transformation using when a pipe is provided', async () => {
      const data: MockRow[] = [{ name: 'Alice', age: 30 }];
      const definition: CSVExportDefinition<MockRow> = {
        name: { title: 'col.name' },
        age: { title: 'col.age', pipe: MockPipe },
      };
      injectorMock.get.mockReturnValueOnce(new MockPipe());

      service.exportToCSV<MockRow>('users.csv', data, definition);

      expect(injectorMock.get).toHaveBeenCalledWith(MockPipe);
      const savedBlob = mockSaveAs.mock.calls[0][0] as Blob;
      const blobText = await savedBlob.text();
      expect(blobText).toBe('T-col.name,T-col.age\nAlice,#30\n');
    });

    it('should fallback to original value when injector does not provide the pipe instance', async () => {
      const data: MockRow[] = [{ name: 'Alice', age: 30 }];
      const definition: CSVExportDefinition<MockRow> = {
        name: { title: 'col.name' },
        age: { title: 'col.age', pipe: MockPipe },
      };

      service.exportToCSV<MockRow>('users.csv', data, definition);

      const savedBlob = mockSaveAs.mock.calls[0][0] as Blob;
      const blobText = await savedBlob.text();
      expect(blobText).toBe('T-col.name,T-col.age\nAlice,30\n');
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementationOnce(() => {});
      translateServiceMock.translate.mockImplementationOnce(() => {
        throw new Error('translation-error');
      });

      const data: MockRow[] = [{ name: 'Alice', age: 30 }];
      const definition: CSVExportDefinition<MockRow> = {
        name: { title: 'col.name' },
      };

      service.exportToCSV<MockRow>('users.csv', data, definition);
      expect(consoleSpy).toHaveBeenCalledWith('Error exporting CSV', expect.any(Error));
    });
  });
});
