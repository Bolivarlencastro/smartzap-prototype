import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';
import { Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';
import { IfRolesDirective } from 'app/shared/auth';

@Component({
  selector: 'app-workspace-form',
  templateUrl: './workspace-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    IfRolesDirective,
    TranslocoPipe,
    MatIcon,
    MatSuffix,
    MatTooltip,
  ],
})
export class WorkspaceFormComponent {
  @Output() deleted = new EventEmitter<string>();
  @Output() updated = new EventEmitter<Workspace>();

  private _workspace: Workspace;

  @Input() set workspace(workspace: Workspace) {
    this._workspace = workspace;
    this.form.patchValue(workspace);
  }

  get workspace() {
    return this._workspace;
  }

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: '',
      name: ['', [Validators.required, Validators.minLength(4)]],
      hash_id: ['', [Validators.required]],
      doc_number: '',
      duns_number: '',
      description: '',
      address: '',
      city: '',
      state: '',
      post_code: '',
      country: '',
    });
  }

  onSubmit() {
    this.updated.emit(this.form.value);
  }

  onDelete(id: string) {
    this.deleted.emit(id);
  }
}
