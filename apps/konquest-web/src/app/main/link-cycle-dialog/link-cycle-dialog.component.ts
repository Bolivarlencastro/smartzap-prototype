import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LinkCycleActions, linkCycleFeature } from './store';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LinkCycleDialogFormComponent } from './components/link-cycle-dialog-form/link-cycle-dialog-form.component';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-link-cycle-dialog',
  templateUrl: './link-cycle-dialog.component.html',
  imports: [LinkCycleDialogFormComponent, AsyncPipe, TranslocoPipe],
})
export class LinkCycleDialogComponent {
  cycles$: Observable<CycleDto[]>;

  constructor(private store: Store) {
    this.cycles$ = store.select(linkCycleFeature.selectCycles);
  }

  onSubmit(cycleId: string): void {
    this.store.dispatch(LinkCycleActions.linkCycle({ cycleId }));
  }

  filterCycle(filter: string) {
    this.store.dispatch(LinkCycleActions.filterCycles({ filter }));
  }
}
