import { ChangeDetectionStrategy, Component, effect, input, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserImportErrorsViewModel } from 'app/main/users/user-import-types';
import { toSignal } from '@angular/core/rxjs-interop';
import { userImportsErrorsFeature } from '../store/features';
import { UserImportErrorsActions } from '../store/actions';
import { MatDivider } from '@angular/material/divider';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpLoadingShadeComponent } from '@keeps-platform-frontend-workspace/ui/kp-loading-shade';
import { ImportErrorsListComponent } from '../components';
import { MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-import-errors',
  imports: [
    MatDivider,
    TranslocoPipe,
    KpLoadingShadeComponent,
    ImportErrorsListComponent,
    MatIconButton,
    RouterLink,
    MatIcon,
    MatTooltip,
  ],
  template: `
    @let vm = viewModel();
    <div class="flex flex-wrap gap-6 items-center py-12 px-6 sticky bg-default">
      <a matIconButton [routerLink]="'../../'" [matTooltip]="'GENERAL.BACK' | transloco">
        <mat-icon>arrow_back</mat-icon>
      </a>
      <div class="text-3xl">{{ 'USERS.IMPORT_ERRORS.TITLE' | transloco }}</div>
    </div>
    <mat-divider></mat-divider>
    <app-import-errors-list [errors]="vm.items"></app-import-errors-list>
    @if (vm.isLoading) {
      <kp-loading-shade></kp-loading-shade>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserImportErrorsComponent {
  readonly id = input<string>();
  readonly viewModel: Signal<UserImportErrorsViewModel>;

  constructor(private readonly store: Store) {
    this.viewModel = toSignal(this.store.select(userImportsErrorsFeature.selectViewModel));

    effect(() => {
      const id = this.id();
      this.store.dispatch(UserImportErrorsActions.loadUserImportErrors({ importId: id }));
    });
  }
}
