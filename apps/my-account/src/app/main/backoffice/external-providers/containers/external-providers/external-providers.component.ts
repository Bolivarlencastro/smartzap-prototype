import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalProvidersHeaderComponent } from '../../components/external-providers-header/external-providers-header.component';
import { ExternalProvidersListComponent } from '../../components/external-providers-list/external-providers-list.component';
import { ProviderDto } from '../../model/external-providers.dto';
import { Store } from '@ngrx/store';
import { ExternalProviderHeaderActions, ExternalProviderListActions } from '../../store/actions';
import { Observable } from 'rxjs';
import { externalProviderFeature } from '../../store/features';

@Component({
  selector: 'app-external-providers',
  imports: [CommonModule, ExternalProvidersHeaderComponent, ExternalProvidersListComponent],
  template: `
    <kp-external-providers-header (sendNewProvider)="newProvider($event)"></kp-external-providers-header>
    <kp-external-providers-list
      [isLoading]="isLoading$ | async"
      [providers]="providers$ | async"
      (setIdProviderDelete)="deleteProvider($event)"
      (editProvider)="editProvider($event)"
    ></kp-external-providers-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalProvidersComponent {
  providers$: Observable<ProviderDto[]>;
  isLoading$: Observable<boolean>;
  constructor(private store: Store) {
    this.providers$ = store.select(externalProviderFeature.selectAll);
    this.isLoading$ = store.select(externalProviderFeature.selectIsLoading);
    this.store.dispatch(ExternalProviderListActions.loadProviders());
  }

  deleteProvider(idProvider: string) {
    this.store.dispatch(ExternalProviderListActions.OpenDialogDelete({ idProvider }));
  }

  editProvider(provider: ProviderDto) {
    this.store.dispatch(ExternalProviderListActions.openDialogEdit({ provider }));
  }

  newProvider(newProvider: ProviderDto) {
    this.store.dispatch(ExternalProviderHeaderActions.newProvider({ newProvider }));
  }
}
