import { Provider } from '@angular/core';
import {
  createInterceptorCondition,
  CUSTOM_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  CustomBearerTokenCondition,
} from 'keycloak-angular';

export function provideBearerTokenInterceptorConfig(bearerUrls: string[], apiDomainPattern: string): Provider {
  const LEARNING_PLATFORM_API_URL_REGEX = new RegExp(apiDomainPattern, 'i');

  const keepsBearerApisCondition = createInterceptorCondition<CustomBearerTokenCondition>({
    shouldAddToken: async (req, _next, _keycloak) => bearerUrls.find((url) => req.url.includes(url)) !== undefined,
  });

  const keepsApiEmptyBearerPrefixCondition = createInterceptorCondition<CustomBearerTokenCondition>({
    shouldAddToken: async (req, _next, _keycloak) => {
      const isBearerUrl = bearerUrls.find((url) => req.url.includes(url)) !== undefined;
      const isLearningPlatformApiUrl = LEARNING_PLATFORM_API_URL_REGEX.test(req.url);
      return !isBearerUrl && isLearningPlatformApiUrl;
    },
    bearerPrefix: '',
  });

  return {
    provide: CUSTOM_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    useValue: [keepsBearerApisCondition, keepsApiEmptyBearerPrefixCondition],
  };
}
