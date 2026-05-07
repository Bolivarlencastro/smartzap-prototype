import { FormControl, FormGroup } from '@angular/forms';

export interface TableColumnModel<T> {
  [key: string]: T;
}

export type TableColumn = TableColumnModel<boolean>;
export type TableColumnForm = TableColumnModel<FormControl<boolean>>;

export function loadFormValuesFromLocalStorage(form: FormGroup, storageKey: string): void {
  const storedValues = localStorage.getItem(storageKey);
  if (storedValues) {
    const parsedValues = JSON.parse(storedValues);
    Object.keys(parsedValues).forEach((key) => {
      if (form.controls[key]) {
        form.controls[key].setValue(parsedValues[key]);
      }
    });
  }
}

export function saveFormValuesToLocalStorage(values: TableColumn, storageKey: string): void {
  localStorage.setItem(storageKey, JSON.stringify(values));
}
