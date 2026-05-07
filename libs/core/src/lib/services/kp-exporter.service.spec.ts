import { KpExporterService } from './kp-exporter.service';
import { TranslocoService } from '@jsverse/transloco';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver-es';
import { jsPDF } from 'jspdf';

jest.mock('jspdf-autotable', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('file-saver-es', () => ({
  __esModule: true,
  saveAs: jest.fn(),
}));

jest.mock('jspdf');

const mockHeaders = [
  { innerText: 'mock_header_1' },
  { innerText: 'mock_header_2' },
] as unknown as NodeListOf<HTMLTableCellElement>;
const mockFirstRow = {
  querySelectorAll: jest.fn().mockImplementation(() => [{ innerText: 'row_1_cell_1' }, { innerText: 'row_1_cell_2' }]),
};
const mockSecondRow = {
  querySelectorAll: jest.fn().mockImplementation(() => [{ innerText: 'row_2_cell_1' }, { innerText: 'row_2_cell_2' }]),
};
const mockCells = [mockFirstRow, mockSecondRow] as unknown as NodeListOf<HTMLTableCellElement>;

const mockTableElement = {
  querySelectorAll: jest.fn().mockImplementation((selectors: string) => {
    if (selectors === 'th') {
      return mockHeaders;
    }
    return mockCells;
  }),
};

describe('KpExporterService', () => {
  let service: KpExporterService;
  let translateServiceMock: jest.Mocked<TranslocoService>;
  const mockAutoTable = autoTable as jest.Mock;
  const mockSaveAs = saveAs as jest.Mock;
  const mockJsPDF = { save: jest.fn().mockImplementation() } as unknown as jest.Mocked<jsPDF>;
  const mockedJsPdf = jsPDF as jest.MockedClass<typeof jsPDF>;
  mockedJsPdf.mockImplementation(() => mockJsPDF);

  beforeEach(() => {
    translateServiceMock = {
      translate: jest.fn().mockImplementation((value) => value),
    } as unknown as jest.Mocked<TranslocoService>;

    service = new KpExporterService(translateServiceMock);
  });

  it('should export a table as PDF', () => {
    service.exportPDF('table_id', 'file_name', ['column_name']);
    expect(translateServiceMock.translate).toHaveBeenCalledWith('column_name');
    expect(mockAutoTable).toHaveBeenCalledWith(expect.anything(), {
      html: 'table_id',
      columns: [{ header: 'column_name' }],
    });
    expect(mockJsPDF.save).toHaveBeenCalledWith('file_name');
  });

  it('should export a table as csv', () => {
    jest.spyOn(document, 'getElementById').mockReturnValueOnce(mockTableElement as unknown as HTMLElement);
    KpExporterService.exportAsTabulatedData('mock_name', 'mock_table_id');
    expect(mockSaveAs).toHaveBeenCalledWith(expect.anything(), 'mock_name.csv');
  });
});
