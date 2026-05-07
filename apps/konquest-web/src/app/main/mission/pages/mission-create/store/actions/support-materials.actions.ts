import { createAction, props } from '@ngrx/store';
import { SupportMaterial } from '@keeps-platform-frontend-workspace/kp-keeps';

export const loadSupportMaterialsSuccess = createAction(
  '[MISSION CREATION] Load Support Materials Success',
  props<{ supportMaterials: SupportMaterial[] }>(),
);

export const loadSupportMaterialsFailure = createAction(
  '[MISSION CREATION] Load Support Materials Failures',
  props<{ error: unknown }>(),
);

export const uploadSupportMaterial = createAction(
  '[MISSION CREATION] Upload Support Material',
  props<{ files: File[] }>(),
);

export const uploadSupportMaterialSuccess = createAction(
  '[MISSION CREATION] Upload Support Material Success',
  props<{ supportMaterial: SupportMaterial }>(),
);

export const deleteSupportMaterial = createAction(
  '[MISSION CREATION] Delete Support Material',
  props<{ id: string }>(),
);

export const deleteSupportMaterialSuccess = createAction(
  '[MISSION CREATION] Delete Support Material Success',
  props<{ id: string }>(),
);

export const deleteSupportMaterialFailure = createAction(
  '[MISSION CREATION] Delete Support Material Failure',
  props<{ error: unknown }>(),
);
