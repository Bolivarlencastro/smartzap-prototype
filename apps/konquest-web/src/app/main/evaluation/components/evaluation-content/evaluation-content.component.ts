import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { EvaluationQuestion } from '@core/model/evaluation.model';
import { NgClass } from '@angular/common';
import { KpRateButtonComponent } from '@keeps-platform-frontend-workspace/ui/kp-rate-button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-evaluation-content',
  templateUrl: './evaluation-content.component.html',
  styleUrls: ['./evaluation-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  imports: [FormsModule, ReactiveFormsModule, KpRateButtonComponent, NgClass, MatFormField, MatInput, TranslocoPipe],
})
export class EvaluationContentComponent {
  @Input() questions!: EvaluationQuestion[];
  @Input() form!: UntypedFormGroup;
  @Input() isOnCourse = false;
  @Input() disabled = false;
}
