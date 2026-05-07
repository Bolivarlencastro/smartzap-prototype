import { createAction, props } from '@ngrx/store';

export const uploadImage = createAction(
  '[Course-Upload] Upload Course Image',
  props<{ file: File; imageType: 'holder_image' | 'thumb_image' }>(),
);

export const uploadImageFailure = createAction(
  '[Course-Upload] Upload Course Image Failure',
  props<{ error: Error }>(),
);

export const uploadImageSuccess = createAction(
  '[Course-Upload] Upload Course Image Success',
  props<{ image: string; imageType: 'holder_image' | 'thumb_image' }>(),
);
