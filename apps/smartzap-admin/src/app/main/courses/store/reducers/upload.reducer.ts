import { createReducer, on } from '@ngrx/store';
import { UploadActions } from '../actions';

export const featureKey = 'upload';

export interface State {
  selectedImage: string;
  isLoading: boolean;
}

const initialState = {
  selectedImage: '',
  isLoading: false,
};

export const reducer = createReducer(
  initialState,
  on(UploadActions.uploadImage, (state): State => {
    return { ...state, isLoading: true };
  }),

  on(UploadActions.uploadImageSuccess, (state, { image: selectedImage }): State => {
    return { selectedImage, isLoading: false };
  }),

  on(UploadActions.uploadImageFailure, (state): State => {
    return { ...state, isLoading: false };
  }),
);
