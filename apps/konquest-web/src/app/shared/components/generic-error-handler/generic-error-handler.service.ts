import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GenericErrorHandlerComponent } from './generic-error-handler.component';

@Injectable()
export class GenericErrorHandlerService {
  constructor(private _dialog: MatDialog) {}

  showImportEnrollmentsErrorDialog(data: any): void {
    if (!data) {
      return;
    }

    const {
      group_user_errors,
      enrollment_errors,
      group_mission_errors,
      group_user_import_errors,
      group_mission_import_errors,
      group_learning_trail_errors,
    } = data;

    const hasGroupErrors = group_user_errors?.length;
    const hasEnrollmentErrors = enrollment_errors?.length;
    const hasGroupMissionErrors = group_mission_errors?.length;
    const hasGroupUserImportErrors = group_user_import_errors?.length;
    const hasGroupMissionImportErrors = group_mission_import_errors?.length;
    const hasGroupLearningTrailImportErrors = group_learning_trail_errors?.length;

    if (
      !hasGroupErrors &&
      !hasEnrollmentErrors &&
      !hasGroupMissionErrors &&
      !hasGroupUserImportErrors &&
      !hasGroupLearningTrailImportErrors &&
      !hasGroupMissionImportErrors
    ) {
      return;
    }

    const errors = [];

    if (hasGroupErrors) {
      errors.push(...group_user_errors);
    }

    if (hasEnrollmentErrors) {
      errors.push(...enrollment_errors);
    }

    if (hasGroupMissionErrors) {
      errors.push(...group_mission_errors);
    }

    if (hasGroupUserImportErrors) {
      errors.push(...group_user_import_errors);
    }

    if (hasGroupMissionImportErrors) {
      errors.push(...group_mission_import_errors);
    }

    if (hasGroupLearningTrailImportErrors) {
      errors.push(...group_learning_trail_errors);
    }

    this._dialog.open(GenericErrorHandlerComponent, {
      data: errors,
    });
  }
}
