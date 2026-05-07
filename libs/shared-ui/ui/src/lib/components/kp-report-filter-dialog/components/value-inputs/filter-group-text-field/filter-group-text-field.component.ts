import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatInput } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'kp-filter-group-text-field',
  templateUrl: './filter-group-text-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  imports: [MatFormField, MatInput, FormsModule, ReactiveFormsModule, TranslocoPipe],
})
export class FilterGroupTextFieldComponent {}
