import { UsersListEffects } from './users-list.effects';
import { UserDetailsEffects } from './user-details.effects';
import { UserRolesEffects } from './user-roles.effects';
import { UserDataTransferEffects } from './user-data-transfer.effects';
import { UsersListFilterEffects } from './users-list-filter.effects';
import { UsersImportDialogEffects } from './users-import-dialog-effects.service';
import { BatchActionsEffects } from './batch-actions.effects';
import { UserWorkspacesEffects } from './user-workspaces.effects';
import { UserImportsEffects } from './user-imports.effects';
import { UserImportErrorsEffects } from './user-import-errors.effects';

export const EFFECTS = [
  UsersListEffects,
  UserDetailsEffects,
  UserRolesEffects,
  UserDataTransferEffects,
  UsersListFilterEffects,
  UsersImportDialogEffects,
  BatchActionsEffects,
  UserWorkspacesEffects,
  UserImportsEffects,
  UserImportErrorsEffects,
];
