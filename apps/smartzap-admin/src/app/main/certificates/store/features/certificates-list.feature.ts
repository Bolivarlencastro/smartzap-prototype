import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { CustomCertificateDto, CustomCertificatesFilter } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CertificatesListActions } from '../actions';

export interface CertificatesListFeatureState extends EntityState<CustomCertificateDto> {
  isLoading: boolean;
  totalItems: number;
  filter: CustomCertificatesFilter;
}

const adapter = createEntityAdapter<CustomCertificateDto>();

const initialState: CertificatesListFeatureState = adapter.getInitialState({
  isLoading: false,
  totalItems: 0,
  filter: { search: '', page: 1, per_page: 10 },
});

const reducer = createReducer(
  initialState,

  on(CertificatesListActions.loadCertificates, (state): CertificatesListFeatureState => {
    return adapter.removeAll({ ...state, isLoading: true });
  }),

  on(
    CertificatesListActions.loadCertificatesFailure,
    (state): CertificatesListFeatureState => ({
      ...state,
      isLoading: false,
    }),
  ),

  on(CertificatesListActions.loadCertificatesSuccess, (state, { response }): CertificatesListFeatureState => {
    return adapter.setAll(response.data, { ...state, isLoading: false, totalItems: response.meta.totalItems });
  }),

  on(
    CertificatesListActions.search,
    (state, { search }): CertificatesListFeatureState => ({
      ...state,
      filter: { ...state.filter, search, page: 1 },
    }),
  ),

  on(
    CertificatesListActions.setPagination,
    (state, { pagination }): CertificatesListFeatureState => ({
      ...state,
      filter: { ...state.filter, ...pagination },
    }),
  ),

  on(CertificatesListActions.resetState, (): CertificatesListFeatureState => initialState),
);

export const certificatesListFeature = createFeature({
  name: 'certificatesFeatureList',
  reducer,
  extraSelectors: ({ selectCertificatesFeatureListState }) => ({
    ...adapter.getSelectors(selectCertificatesFeatureListState),
  }),
});
