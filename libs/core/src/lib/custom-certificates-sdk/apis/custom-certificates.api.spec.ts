import { CustomCertificatesApi } from './custom-certificates.api';
import { CustomCertificatesClient } from './custom-certificates.client';
import { EMPTY, of } from 'rxjs';
import {
  CustomCertificateDto,
  CustomCertificateListParamDto,
  CustomCertificatesFilter,
  VinculateCertificateLearnContentDto,
} from '../models';
import { Chance } from 'chance';

describe('CustomCertificatesApi', () => {
  let service: CustomCertificatesApi;
  let http: jest.Mocked<CustomCertificatesClient>;
  const chance = new Chance();

  beforeEach(() => {
    http = {
      get: jest.fn().mockReturnValue(of(EMPTY)),
      post: jest.fn().mockReturnValue(of(EMPTY)),
      patch: jest.fn().mockReturnValue(of(EMPTY)),
      delete: jest.fn().mockReturnValue(of(EMPTY)),
      postFormData: jest.fn().mockReturnValue(of(EMPTY)),
      patchFormData: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<CustomCertificatesClient>;
    service = new CustomCertificatesApi(http);
  });

  it('should fetch custom certificates with the provided filter and correct endpoint', () => {
    const mockFilter: CustomCertificatesFilter = { search: 'mock_filter', template: 'mission', page: 1 };
    const expectedFilter: CustomCertificateListParamDto = {
      search: mockFilter.search,
      'filter.template': '$eq:mission',
      page: 1,
      limit: 100,
    };

    service.list(mockFilter);

    expect(http.get).toHaveBeenCalledWith('/certificates', expectedFilter);
  });

  it('should fetch a custom certificates by its id', () => {
    const certificateId = chance.guid();

    service.getById(certificateId);

    expect(http.get).toHaveBeenCalledWith(`/certificates/${certificateId}`);
  });

  it('create a custom certificate', () => {
    const certificate = { name: chance.name() } as CustomCertificateDto;
    const expectedFormData = new FormData();
    expectedFormData.append('name', certificate.name);

    service.create(certificate);

    expect(http.postFormData).toHaveBeenCalledWith('/certificates', expectedFormData);
  });

  it('should update a custom certificate', () => {
    const certificateId = chance.guid();
    const certificate = { name: chance.name() } as CustomCertificateDto;
    const expectedFormData = new FormData();
    expectedFormData.append('name', certificate.name);

    service.update(certificateId, certificate);

    expect(http.patchFormData).toHaveBeenCalledWith(`/certificates/${certificateId}`, expectedFormData);
  });

  it('should delete a custom certificate', () => {
    const certificateId = chance.guid();

    service.delete(certificateId);

    expect(http.delete).toHaveBeenCalledWith(`/certificates/${certificateId}`);
  });

  it('toggle the default certificate for a workspace', () => {
    const certificateId = chance.guid();

    service.toggleDefault(certificateId);

    expect(http.post).toHaveBeenCalledWith('/certificates/toggle-default', { certificateId });
  });

  it('should vinculate a learn content to a certificate', () => {
    const certificateId = chance.guid();
    const learnContentId = chance.guid();
    const payload: VinculateCertificateLearnContentDto = { certificateId, learnContentId };

    service.vinculateLearnContent(payload);

    expect(http.post).toHaveBeenCalledWith('/certificates/vinculate', payload);
  });

  it('should desvinculate a learn content form a certificate', () => {
    const learnContentId = chance.guid();

    service.desvinculateLearnContent(learnContentId);

    expect(http.delete).toHaveBeenCalledWith(`/certificates/vinculate/${learnContentId}`);
  });

  it('should retrieve a learn content certificate', () => {
    const learnContentId = chance.guid();

    service.getLearnContentCertificate(learnContentId);

    expect(http.get).toHaveBeenCalledWith(`/certificates/vinculate/${learnContentId}`);
  });

  it('should upload a certificate image', () => {
    const file = new File([], 'image.png');
    const expectedFormData = new FormData();
    expectedFormData.append('file', file);

    service.uploadImage(file);

    expect(http.postFormData).toHaveBeenCalledWith('/certificates/images', expect.objectContaining(expectedFormData));
  });
});
