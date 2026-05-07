export interface CypressResponse<T = any> {
  allRequestResponses?: any[];
  body?: T;
  duration?: number;
  headers?: { [key: string]: string };
  isOkStatusCode?: boolean;
  redirectedToUrl?: string;
  requestHeaders?: { [key: string]: string };
  status?: number;
  statusCode?: number;
  statusText?: string;
}

export interface RequestOptions {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: any;
  response?: { body: { id: string; name: string } };
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'document' | 'stream';
  timeout?: number;
}
