export enum RangeFilterType {
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  BETWEEN = 'BETWEEN',
}

export interface RangeFilterOptions {
  label: string;
  value: RangeFilterType;
}
