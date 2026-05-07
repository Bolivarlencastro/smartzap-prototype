import { Routes } from '@angular/router';
import { TransferListComponent } from './containers/transfer-list/transfer-list.component';
import { TRANSFERS_PROVIDERS } from './transfers.providers';

export default [
  {
    path: '',
    component: TransferListComponent,
    providers: TRANSFERS_PROVIDERS,
  },
] as Routes;
