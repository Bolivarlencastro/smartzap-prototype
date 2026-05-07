export * from './learn-content.model';
export * from './pulse.model';
export * from './analytics.model';
export * from './base-entity.model';
export * from './mission-external';
export * from './user.model';
export * from './workspace.model';
export * from './mission-rating';

export interface PaginationParams {
  finished?: boolean;
  nextPage?: string | null;
}

export interface Pagination<T> {
  count?: number;
  next?: string;
  previous?: string;
  started?: boolean;
  finished?: boolean;
  results?: T[];
}

export interface ImageResponse {
  large: string;
  small: string;
  vertical?: string;
}
