import { createReducer, on } from '@ngrx/store';
import { UploadActions } from '../actions';

export const featureKey = 'upload';

export interface State {
  selectedImage: string;
  isLoading: boolean;
  pendingUploads: number;
}

const initialState = {
  selectedImage: '',
  isLoading: false,
  pendingUploads: 0,
};

export const reducer = createReducer(
  initialState,
  on(UploadActions.uploadImage, (state): State => {
    const pendingUploads = state.pendingUploads + 1;
    return { ...state, pendingUploads, isLoading: pendingUploads > 0 };
  }),

  on(UploadActions.uploadImageSuccess, (state, { image: selectedImage }): State => {
    const pendingUploads = Math.max(0, state.pendingUploads - 1);
    return { ...state, selectedImage, pendingUploads, isLoading: pendingUploads > 0 };
  }),

  on(UploadActions.uploadImageFailure, (state): State => {
    const pendingUploads = Math.max(0, state.pendingUploads - 1);
    return { ...state, pendingUploads, isLoading: pendingUploads > 0 };
  }),
);
