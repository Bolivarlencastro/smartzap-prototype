import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { CycleCreateActions, cycleCreateFeature } from '../../store';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { CycleCreateDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CycleCreateFilter } from '../../models';
import { CycleCreateViewModel } from '../../models/cycle-create-view-model';
import { MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CycleCreateFormComponent } from '../../components';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'kp-cycle-create',
  template: `
    @if (cycleCreateVm$ | async; as vm) {
      <div mat-dialog-title class="flex justify-between items-start">
        <div>
          <p class="text-2xl mb-4">{{ title | transloco }}</p>
          <p class="text-sm break-words">{{ subtitle | transloco }}</p>
        </div>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <kp-cycle-create-form
        mat-dialog-content
        [cycle]="vm.cycle"
        (formSubmit)="onSubmit($event)"
        (deleteCycle)="onDelete($event)"
        (filterItem)="onFilter($event)"
        [compliances]="vm.compliances"
        [learningObjects]="vm.learningObjects"
        [editingCycle]="vm.editingCycle"
        [jobs]="vm.jobs"
        [functions]="vm.jobFunctions"
      ></kp-cycle-create-form>
    }
  `,
  imports: [
    MatDialogTitle,
    MatIconButton,
    MatDialogClose,
    MatIcon,
    CycleCreateFormComponent,
    MatDialogContent,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class CycleCreateComponent {
  protected readonly cycleCreateVm$: Observable<CycleCreateViewModel>;
  protected editingCycle: boolean;

  constructor(private store: Store) {
    this.cycleCreateVm$ = store
      .select(cycleCreateFeature.selectViewModel)
      .pipe(tap(({ editingCycle }) => (this.editingCycle = editingCycle)));
  }

  protected get title() {
    return this.editingCycle
      ? marker('REGULATORY_COMPLIANCE.EDIT_NORMATIVE_CYCLE')
      : marker('REGULATORY_COMPLIANCE.CREATE_NORMATIVE_CYCLE');
  }

  protected get subtitle() {
    return this.editingCycle
      ? marker('REGULATORY_COMPLIANCE.EDIT_NORMATIVE_CYCLE_DIALOG_DESCRIPTION')
      : marker('REGULATORY_COMPLIANCE.CREATE_NORMATIVE_CYCLE_DIALOG_DESCRIPTION');
  }

  onSubmit(cycle: CycleCreateDto): void {
    this.store.dispatch(CycleCreateActions.saveNormativeCycle({ cycle }));
  }

  onDelete(id: string): void {
    this.store.dispatch(CycleCreateActions.deleteNormativeCycles({ ids: [id] }));
  }

  onFilter(search: CycleCreateFilter) {
    this.store.dispatch(CycleCreateActions.filterItems({ search }));
  }
}
