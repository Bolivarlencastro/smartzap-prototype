import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { EvaluationsFilterModalComponent } from '../pages/legacy-mission-detail/containers/mission-detail/evaluation/evaluations-filter-modal/evaluations-filter-modal.component';
import { EvaluationsFilterService } from './evaluations-filter.service';

describe('EvaluationsFilterService', () => {
  let service: EvaluationsFilterService;
  let matDialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EvaluationsFilterService,
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn(() => ({
              afterClosed: jest.fn(() => of()),
            })),
          },
        },
      ],
    });

    service = TestBed.inject(EvaluationsFilterService);
    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open filters dialog', () => {
    const id = '123';
    service.openFiltersDialog(id);
    expect(matDialog.open).toHaveBeenCalledWith(EvaluationsFilterModalComponent, {
      minWidth: '400px',
      maxWidth: '90vw',
      autoFocus: 'dialog',
      data: { id },
    });
  });
});
