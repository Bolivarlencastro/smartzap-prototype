import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@jsverse/transloco';
import { CustomMenuItem } from '@keeps-platform-frontend-workspace/kp-keeps';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { ToolForm, toolsHubIcons } from '../../models/tools-hub';

@Component({
  selector: 'app-tool-config-dialog',
  imports: [
    TranslocoModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
  ],
  template: `
    <span mat-dialog-title class="text-2xl">
      {{ 'TOOLS_HUB.' + (editionMode() ? 'EDIT_TOOL' : 'CREATE_TOOL') | transloco }}
    </span>

    <form [formGroup]="form" class="p-6 flex flex-col gap-3">
      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-label>{{ 'GENERAL.NAME' | transloco }}</mat-label>
        <input matInput formControlName="name" />
      </mat-form-field>

      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-label>URL</mat-label>
        <input matInput formControlName="url" />
      </mat-form-field>

      <div class="flex items-center gap-2 h-14">
        <span class="text-sm">{{ 'TOOLS_HUB.ICON' | transloco }}:</span>

        @if (selectedIcon) {
          <button type="button" mat-icon-button [matMenuTriggerFor]="icons">
            <mat-icon class="s-6">{{ selectedIcon }}</mat-icon>
          </button>
        } @else {
          <button type="button" mat-button [matMenuTriggerFor]="icons" class="text-primary text-sm">
            {{ 'TOOLS_HUB.SELECT_ICON' | transloco }}
          </button>
        }

        <mat-menu #icons="matMenu" class="w-96">
          <div class="flex items-center justify-center gap-0.5 flex-wrap w-full h-56">
            @for (icon of toolsHubIcons; track icon) {
              <button type="button" mat-icon-button (click)="onSelectIcon(icon)">
                <mat-icon class="s-6">{{ icon }}</mat-icon>
              </button>
            }
          </div>
        </mat-menu>
      </div>
    </form>

    <div mat-dialog-actions class="p-6 flex justify-end rounded-b-3xl">
      <button mat-button mat-dialog-close>
        {{ 'GENERAL.CLOSE' | transloco }}
      </button>

      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="onSave()">
        {{ 'GENERAL.SAVE' | transloco }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolConfigDialogComponent implements OnInit {
  form: FormGroup<ToolForm>;
  editionMode = signal<boolean>(false);

  protected readonly toolsHubIcons = toolsHubIcons;

  get selectedIcon(): string {
    return this.form.get('icon').value;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: CustomMenuItem,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<ToolConfigDialogComponent>,
  ) {
    this.form = this.buildForm(formBuilder);
  }

  ngOnInit() {
    if (this.data) {
      this.editionMode.set(true);
      this.patchForm();
    }
  }

  onSave() {
    const data = this.form.value;
    this.dialogRef.close({ ...this.data, ...data });
  }

  onSelectIcon(icon: string) {
    this.form.get('icon').setValue(icon);
  }

  private buildForm(formBuilder: FormBuilder): FormGroup<ToolForm> {
    return formBuilder.group<ToolForm>({
      name: new FormControl(null, Validators.required),
      url: new FormControl(null, [Validators.required, Validators.pattern(constants.defaultLinkRegex)]),
      icon: new FormControl(null, Validators.required),
    });
  }

  private patchForm() {
    const { name, url, icon } = this.data;
    this.form.patchValue({ name, url, icon });
  }
}
