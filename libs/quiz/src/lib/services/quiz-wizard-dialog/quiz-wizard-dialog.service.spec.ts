import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import {
  QuizWizardDialogComponent,
  QuizWizardDialogResult,
} from '../../components/quiz-wizard-dialog/quiz-wizard-dialog.component';
import { QuizWizardDialogService } from './quiz-wizard-dialog.service';

describe('QuizWizardDialogService', () => {
  let service: QuizWizardDialogService;
  let dialog: jest.Mocked<MatDialog>;

  beforeEach(() => {
    dialog = { open: jest.fn() } as unknown as jest.Mocked<MatDialog>;

    TestBed.configureTestingModule({
      providers: [QuizWizardDialogService, { provide: MatDialog, useValue: dialog }],
    });

    service = TestBed.inject(QuizWizardDialogService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('open()', () => {
    it('should open QuizWizardDialogComponent with the correct config', () => {
      const mockDialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(undefined)),
      } as unknown as MatDialogRef<QuizWizardDialogComponent, QuizWizardDialogResult>;
      dialog.open.mockReturnValue(mockDialogRef);

      service.open().subscribe();

      expect(dialog.open).toHaveBeenCalledWith(QuizWizardDialogComponent, { width: '600px', disableClose: false });
    });

    it('should return the result emitted by afterClosed when user confirms', (done) => {
      const mockResult: QuizWizardDialogResult = { quizType: 'assessment', creationMethod: 'manual' };
      const mockDialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(mockResult)),
      } as unknown as MatDialogRef<QuizWizardDialogComponent, QuizWizardDialogResult>;
      dialog.open.mockReturnValue(mockDialogRef);

      service.open().subscribe((result) => {
        expect(result).toEqual(mockResult);
        done();
      });
    });

    it('should return undefined when user dismisses the dialog', (done) => {
      const mockDialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(undefined)),
      } as unknown as MatDialogRef<QuizWizardDialogComponent, QuizWizardDialogResult>;
      dialog.open.mockReturnValue(mockDialogRef);

      service.open().subscribe((result) => {
        expect(result).toBeUndefined();
        done();
      });
    });
  });
});
