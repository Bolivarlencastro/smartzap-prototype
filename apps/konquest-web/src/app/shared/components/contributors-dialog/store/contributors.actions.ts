import { createAction, props } from '@ngrx/store';
import { Contributor } from '@core/model/contributor.model';
import { ContributorsDialogContentType } from '../models/contributors-dialog-content.type';
import { User } from '@keeps-platform-frontend-workspace/kp-keeps';

const openDialog = createAction(
  '[Contributors Dialog] Open Dialog',
  props<{
    relatedContentId: string;
    contentType: ContributorsDialogContentType;
  }>(),
);

const loadContributors = createAction('[Contributors Dialog] Load Contributors');

const loadContributorsSuccess = createAction(
  '[Contributors Dialog] Load Contributors Success',
  props<{
    contributors: Contributor[];
  }>(),
);

const loadContributorsFailure = createAction('[Contributors Dialog] Load Contributors Failure');

const filterContributors = createAction('[Contributors Dialog] Filter Contributor Users ', props<{ search: string }>());

const filterContributorsSuccess = createAction(
  '[Contributors Dialog] Filter Contributor Users Success',
  props<{ users: User[] }>(),
);

const filterContributorsFailure = createAction('[Contributors Dialog] Filter Contributors Failure');

const addContributor = createAction('[Contributors Dialog] Add Contributor', props<{ userId: string }>());

const addContributorSuccess = createAction(
  '[Contributors Dialog] Add Contributor Success',
  props<{
    contributor: Contributor;
  }>(),
);

const addContributorFailure = createAction('[Contributors Dialog] Add Contributor Failure');

const removeContributor = createAction('[Contributors Dialog] Remove Contributor', props<{ userId: string }>());

const removeContributorSuccess = createAction(
  '[Contributors Dialog] Remove Contributor Success',
  props<{
    userId: string;
  }>(),
);

const removeContributorFailure = createAction('[Contributors Dialog] Remove Contributor Failure');

const reset = createAction('[Contributors Dialog] Reset');

export const ContributorDialogActions = {
  openDialog,
  loadContributors,
  loadContributorsSuccess,
  loadContributorsFailure,
  filterContributors,
  filterContributorsSuccess,
  filterContributorsFailure,
  addContributor,
  addContributorSuccess,
  addContributorFailure,
  removeContributor,
  removeContributorSuccess,
  removeContributorFailure,
  reset,
};
