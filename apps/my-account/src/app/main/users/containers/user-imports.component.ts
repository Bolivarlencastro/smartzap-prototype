import { ChangeDetectionStrategy, Component, OnDestroy, Signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { UserImportsActions } from '../store/actions';
import { UserImportViewModel } from 'app/main/users/user-import-types';
import { toSignal } from '@angular/core/rxjs-interop';
import { userImportsFeature } from 'app/main/users/store/features';
import { UserImportsComponentList } from '../components';
import { MatDivider } from '@angular/material/divider';
import { KpLoadingShadeComponent } from '@keeps-platform-frontend-workspace/ui/kp-loading-shade';

@Component({
  selector: 'app-user-imports',
  imports: [TranslocoPipe, UserImportsComponentList, MatDivider, KpLoadingShadeComponent],
  template: `
    @let vm = viewModel();
    <div class="flex flex-wrap gap-6 justify-between items-center py-12 px-6 sticky bg-default">
      <div class="text-3xl">{{ 'USERS.IMPORT_LIST.TITLE' | transloco }}</div>
    </div>
    <mat-divider></mat-divider>
    <app-user-imports-list [imports]="vm.items"></app-user-imports-list>
    @if (vm.isLoading) {
      <kp-loading-shade></kp-loading-shade>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
      flex-grow: 1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserImportsComponent implements OnDestroy {
  readonly viewModel: Signal<UserImportViewModel>;

  constructor(private readonly store: Store) {
    this.store.dispatch(UserImportsActions.loadUserImports());
    this.viewModel = toSignal(this.store.select(userImportsFeature.selectViewModel));
  }

  ngOnDestroy() {
    this.store.dispatch(UserImportsActions.resetState());
  }
}
