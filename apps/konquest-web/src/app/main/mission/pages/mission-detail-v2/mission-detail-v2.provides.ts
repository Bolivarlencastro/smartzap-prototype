import { importProvidersFrom } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  DETAIL_DIALOG_FEATURE_EFFECTS,
  missionDetailDialogFeatureKey,
  missionDetailDialogFeatureReducers,
} from './store';
import { MISSION_TRANSFER_PROVIDERS } from 'app/main/mission-transfer/mission-transfer.providers';
import { BATCH_ENROLLMENT_DIALOG_PROVIDERS } from 'app/shared/components/batch-enrollment-dialog/batch-enrollment-dialog.providers';
import { CONTRIBUTORS_DIALOG_PROVIDERS } from 'app/shared/components/contributors-dialog/contributors-dialog.providers';
import { CERTIFICATE_UPLOAD_PROVIDERS } from 'app/shared/components/certificate-upload/certificate-upload.providers';

export const MISSION_DETAIL_PROVIDERS = [
  importProvidersFrom(
    StoreModule.forFeature(missionDetailDialogFeatureKey, missionDetailDialogFeatureReducers),
    EffectsModule.forFeature(DETAIL_DIALOG_FEATURE_EFFECTS),
  ),
  ...MISSION_TRANSFER_PROVIDERS,
  ...BATCH_ENROLLMENT_DIALOG_PROVIDERS,
  ...CONTRIBUTORS_DIALOG_PROVIDERS,
  ...CERTIFICATE_UPLOAD_PROVIDERS,
];
