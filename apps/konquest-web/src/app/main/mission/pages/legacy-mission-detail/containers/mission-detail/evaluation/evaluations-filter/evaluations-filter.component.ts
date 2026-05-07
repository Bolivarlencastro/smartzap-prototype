import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { EvaluationsFilterActions } from '../../store/actions';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { KpGlobalSearchInputComponent } from '@keeps-platform-frontend-workspace/ui/kp-global-search-input';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-evaluations-filter',
  templateUrl: './evaluations-filter.component.html',
  imports: [MatIconButton, MatIcon, KpGlobalSearchInputComponent, TranslocoPipe],
})
export class EvaluationsFilterComponent {
  @Input() missionId: string;
  @Output() applyInputFilter = new EventEmitter<string>();

  constructor(private store: Store) {}

  openFiltersModal() {
    this.store.dispatch(EvaluationsFilterActions.openFilterDialog({ id: this.missionId }));
  }

  searchTerm(term: string): void {
    this.applyInputFilter.emit(term);
  }
}
