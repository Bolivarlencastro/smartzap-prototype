import { createAction, props } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export const Go = createAction(
  '[Router] Go',
  props<{
    payload: {
      path: any[];
      query?: Record<string, unknown>;
      extras?: NavigationExtras;
    };
  }>(),
);

export const Back = '[Router] Back';
export const Forward = '[Router] Forward';
