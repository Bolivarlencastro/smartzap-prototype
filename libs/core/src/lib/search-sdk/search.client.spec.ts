import { HttpClient } from '@angular/common/http';
import { CoreConfig } from '../core-config';
import { SearchClient } from './search.client';

const mockCoreConfig: CoreConfig = {
  apis: { apiKonquestUrl: 'https://mockKonquestApi/v1', apiSearchUrl: 'https://mockSearchApi' },
  appId: 'mock_app_id',
  production: false,
};

describe('SearchClient', () => {
  let service: SearchClient;
  const mockHttpClient: jest.Mocked<HttpClient> = {} as unknown as jest.Mocked<HttpClient>;

  beforeEach(() => {
    service = new SearchClient(mockHttpClient, mockCoreConfig);
  });

  it('should be created with the provided Search API Url', () => {
    expect(service).toBeTruthy();
    expect(service.API_URL).toBe('https://mockSearchApi/v1');
  });

  it('should use an empty string when apiSearchUrl is not provided', () => {
    const configWithoutSearchUrl: CoreConfig = {
      ...mockCoreConfig,
      apis: { apiKonquestUrl: 'https://mockKonquestApi/v1' },
    };
    const serviceWithoutUrl = new SearchClient(mockHttpClient, configWithoutSearchUrl);

    expect(serviceWithoutUrl.API_URL).toBe('/v1');
  });
});
