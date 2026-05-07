import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EvaluationQuestion } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoModule } from '@jsverse/transloco';
import { KpRateButtonComponent } from '../kp-rate-button';

@Component({
  selector: 'kp-evaluation-content',
  templateUrl: './kp-evaluation-content.component.html',
  styleUrls: ['./kp-evaluation-content.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoModule,
    KpRateButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class KpEvaluationContentComponent {
  @Input() questions!: EvaluationQuestion[];
  @Input() form!: UntypedFormGroup;
  @Input() isOnCourse = false;
  @Input() disabled = false;
}
