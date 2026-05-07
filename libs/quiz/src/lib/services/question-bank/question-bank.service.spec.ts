import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { QuestionBankService } from './question-bank.service';
import { QuestionBankComponent } from '../../containers/question-bank/question-bank.component';
import { QuestionBankOutput } from '../../models/quiz';

const mockQuestion: QuestionBankOutput = {
  id: 'q1',
  question: 'O que é Angular?',
  options: [{ id: 'o1', option: 'Um framework', correct_answer: true }],
  tags: [],
  created_date: '2024-01-01',
};

describe('QuestionBankService', () => {
  let service: QuestionBankService;
  let dialog: jest.Mocked<MatDialog>;

  beforeEach(() => {
    dialog = { open: jest.fn() } as unknown as jest.Mocked<MatDialog>;

    TestBed.configureTestingModule({
      providers: [QuestionBankService, { provide: MatDialog, useValue: dialog }],
    });

    service = TestBed.inject(QuestionBankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('open()', () => {
    it('should open QuestionBankComponent with the correct config', () => {
      const mockDialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(undefined)),
      } as unknown as MatDialogRef<QuestionBankComponent, QuestionBankOutput[]>;
      dialog.open.mockReturnValue(mockDialogRef);

      service.open().subscribe();

      expect(dialog.open).toHaveBeenCalledWith(QuestionBankComponent, {
        width: '600px',
        maxWidth: '90vw',
        autoFocus: 'dialog',
      });
    });

    it('should return undefined when the dialog is dismissed', (done) => {
      const mockDialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(undefined)),
      } as unknown as MatDialogRef<QuestionBankComponent, QuestionBankOutput[]>;
      dialog.open.mockReturnValue(mockDialogRef);

      service.open().subscribe((result) => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should return the selected questions when the dialog closes with data', (done) => {
      const mockDialogRef = {
        afterClosed: jest.fn().mockReturnValue(of([mockQuestion])),
      } as unknown as MatDialogRef<QuestionBankComponent, QuestionBankOutput[]>;
      dialog.open.mockReturnValue(mockDialogRef);

      service.open().subscribe((result) => {
        expect(result).toEqual([mockQuestion]);
        done();
      });
    });
  });
});
