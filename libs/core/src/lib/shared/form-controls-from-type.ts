import { FormControl } from '@angular/forms';

/**
 * Helper type to implement reactive forms typing using an interface or type as base.
 * @example
 *
 * type DtoType = {
 *   age: number;
 * }
 *
 * type FormType = FormGroup<FormGroupControls<DtoType>>
 *
 * const form: FormGroup<FormType>;
 * // formType -> FormGroup<{ age: FormControl<number> }>
 *
 */
export type FormControlsFromType<T> = { [K in keyof T]: FormControl<T[K]> };
