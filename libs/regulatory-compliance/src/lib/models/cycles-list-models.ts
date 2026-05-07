import { CycleDto, CycleListResponseDto, CyclesFilterDto } from '@keeps-platform-frontend-workspace/kp-keeps';

export type CyclesListPagination = { totalItems: number; perPage: number; currentPage: number };

export type CyclesListPaginationEvent = Pick<CyclesFilterDto, 'page' | 'perPage'>;

export type CyclesListFilterEvent = Pick<CyclesFilterDto, 'search'>;

export type CyclesListResponse = Pick<CycleListResponseDto, 'items' | 'total'>;

export type CyclesListViewModel = {
  currentSearch: string;
  items: CycleDto[];
  isLoading: boolean;
  pagination: CyclesListPagination;
};
