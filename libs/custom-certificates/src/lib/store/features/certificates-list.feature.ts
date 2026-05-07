import { createFeature, createReducer, on } from '@ngrx/store';
import { CertificateLearnContentActions, CertificatesListActions } from '../actions';
import { CustomCertificateDto, CustomCertificatesFilter } from '@keeps-platform-frontend-workspace/kp-keeps';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface CertificatesListFeatureState extends EntityState<CustomCertificateDto> {
  isLoading: boolean;
  totalItems: number;
  filter: CustomCertificatesFilter;
  learnContentCertificate: CustomCertificateDto | undefined;
}

const adapter = createEntityAdapter<CustomCertificateDto>();

export const certificatesListInitialState: CertificatesListFeatureState = adapter.getInitialState({
  isLoading: false,
  totalItems: 0,
  filter: { search: '', page: 1, per_page: 10 },
  learnContentCertificate: undefined,
});

const reducer = createReducer(
  certificatesListInitialState,

  on(CertificatesListActions.loadCertificates, (state): CertificatesListFeatureState => {
    return adapter.removeAll({ ...state, isLoading: true });
  }),

  on(
    CertificatesListActions.loadCertificatesFailure,
    (state): CertificatesListFeatureState => ({ ...state, isLoading: false }),
  ),

  on(CertificatesListActions.loadCertificatesSuccess, (state, { response }): CertificatesListFeatureState => {
    return adapter.setAll(response.data, { ...state, isLoading: false, totalItems: response.meta.totalItems });
  }),

  on(CertificatesListActions.search, (state, { search }): CertificatesListFeatureState => {
    const currentFilter = state.filter;
    return { ...state, filter: { ...currentFilter, search, page: 1 } };
  }),

  on(CertificatesListActions.setPagination, (state, { pagination }): CertificatesListFeatureState => {
    const currentFilter = state.filter;
    console.log(pagination);
    return { ...state, filter: { ...currentFilter, page: pagination.page, per_page: pagination.per_page } };
  }),

  on(
    CertificateLearnContentActions.vinculateLearnContentSuccess,
    (state, { certificate }): CertificatesListFeatureState => {
      return { ...state, learnContentCertificate: certificate };
    },
  ),

  on(CertificateLearnContentActions.desvinculateLearnContentSuccess, (state): CertificatesListFeatureState => {
    return { ...state, learnContentCertificate: undefined };
  }),

  on(
    CertificateLearnContentActions.loadLearnContentCertificateSuccess,
    (state, { certificate }): CertificatesListFeatureState => {
      return { ...state, learnContentCertificate: certificate };
    },
  ),

  on(CertificatesListActions.resetState, (): CertificatesListFeatureState => certificatesListInitialState),
);

export const certificatesListFeature = createFeature({
  name: 'certificatesFeatureList',
  reducer,
  extraSelectors: ({ selectCertificatesFeatureListState }) => ({
    ...adapter.getSelectors(selectCertificatesFeatureListState),
  }),
});
