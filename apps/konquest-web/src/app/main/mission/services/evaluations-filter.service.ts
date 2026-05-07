import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EvaluationsFilterModalComponent } from '../pages/legacy-mission-detail/containers/mission-detail/evaluation/evaluations-filter-modal/evaluations-filter-modal.component';
import { EvaluationsFilterResult } from '../pages/legacy-mission-detail/containers/mission-detail/evaluation/evaluations-filter-modal/models';
import { filter, map } from 'rxjs';

@Injectable()
export class EvaluationsFilterService {
  constructor(private dialog: MatDialog) {}

  openFiltersDialog(id: string) {
    return this.dialog
      .open<EvaluationsFilterModalComponent, any, EvaluationsFilterResult>(EvaluationsFilterModalComponent, {
        minWidth: '400px',
        maxWidth: '90vw',
        autoFocus: 'dialog',
        data: { id },
      })
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        map((result) => ({
          ...result,
          filter: { created_date__gte: null, created_date__lte: null, sentiment_analysis: null, ...result.filter },
        })),
      );
  }
}
