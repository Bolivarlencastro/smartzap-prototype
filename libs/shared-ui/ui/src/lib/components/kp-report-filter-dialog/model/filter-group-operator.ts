export enum FilterGroupOperator {
  IS_NOT = 'IS_NOT',
  IT_IS = 'IT_IS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
}

export const FilterGroupDefaultOperators = [FilterGroupOperator.IT_IS, FilterGroupOperator.IS_NOT];
