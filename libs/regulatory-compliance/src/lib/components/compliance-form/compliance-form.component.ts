import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormField, MatLabel, MatSuffix, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

interface ComplianceForm {
  name: FormControl<string>;
}

@Component({
  selector: 'kp-compliance-form',
  templateUrl: './compliance-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    MatSuffix,
    MatIcon,
    MatHint,
    TranslocoPipe,
  ],
})
export class ComplianceFormComponent implements OnChanges {
  @Input() complianceName: string;
  @Output() saveCompliance = new EventEmitter<string>();
  @ViewChild(FormGroupDirective) fgDirective: FormGroupDirective;

  protected readonly COMPLIANCE_MAX_LENGTH = 30;
  readonly normativeFormGroup: FormGroup<ComplianceForm> = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(this.COMPLIANCE_MAX_LENGTH)]),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['complianceName']) {
      this.patchName(this.complianceName);
    }
  }

  addCompliance() {
    if (this.normativeFormGroup.invalid) {
      return;
    }

    this.saveCompliance.emit(this.normativeFormGroup.get('name').value);
  }

  private patchName(name: string): void {
    this.normativeFormGroup.get('name').setValue(name);

    if (!name && this.fgDirective) {
      this.fgDirective.resetForm();
    }
  }
}
