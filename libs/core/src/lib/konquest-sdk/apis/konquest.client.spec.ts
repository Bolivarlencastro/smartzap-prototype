import { HttpClient } from '@angular/common/http';
import { CoreConfig } from '../../core-config';

import { KonquestClient } from './konquest.client';

const mockCoreConfig: CoreConfig = {
  apis: { apiKonquestUrl: 'https://mockKonquestApi/v1' },
  appId: 'mock_app_id',
  production: false,
};

describe('KonquestClient', () => {
  let service: KonquestClient;
  const mockHttpClient: jest.Mocked<HttpClient> = {} as unknown as jest.Mocked<HttpClient>;

  beforeEach(() => {
    service = new KonquestClient(mockHttpClient, mockCoreConfig);
  });

  it('should be created with the the provided Konquest API Url', () => {
    expect(service).toBeTruthy();
    expect(service.API_URL).toBe('https://mockKonquestApi/v1');
  });
});
