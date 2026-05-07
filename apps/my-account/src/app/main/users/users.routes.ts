import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import {
  UserAsideComponent,
  UserImportErrorsComponent,
  UserImportsComponent,
  UserManagementComponent,
} from './containers';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducers } from 'app/main/users/store/reducers';
import {
  batchActionsFeature,
  userDataTransferFeature,
  userImportsErrorsFeature,
  userImportsFeature,
  usersImportDialogFeature,
  usersListFilterFeature,
  userWorkspacesFeature,
} from 'app/main/users/store/features';
import { EffectsModule } from '@ngrx/effects';
import { EFFECTS } from 'app/main/users/store/effects';
import { provideNgxMask } from 'ngx-mask';

const PROVIDERS = [
  importProvidersFrom(
    StoreModule.forFeature(featureKey, reducers),
    StoreModule.forFeature(userDataTransferFeature),
    StoreModule.forFeature(usersListFilterFeature),
    StoreModule.forFeature(usersImportDialogFeature),
    StoreModule.forFeature(batchActionsFeature),
    StoreModule.forFeature(userWorkspacesFeature),
    StoreModule.forFeature(userImportsFeature),
    StoreModule.forFeature(userImportsErrorsFeature),
    EffectsModule.forFeature(EFFECTS),
  ),
  provideNgxMask(),
];

export default [
  {
    path: '',
    providers: PROVIDERS,
    children: [
      {
        path: 'imports',
        component: UserImportsComponent,
      },
      { path: 'imports/errors/:id', component: UserImportErrorsComponent },
      {
        path: '',
        component: UserManagementComponent,
        children: [
          {
            path: 'new',
            component: UserAsideComponent,
          },
          {
            path: ':id',
            component: UserAsideComponent,
          },
        ],
      },
    ],
  },
] as Routes;
