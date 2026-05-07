import { ChangeDetectionStrategy, Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ImportMenuItem } from '@app/main/mission/mission.model';
import { TranslocoPipe } from '@jsverse/transloco';
import { ImportListViewMode } from '../../models/import-list';

@Component({
  selector: 'app-import-list-footer',
  template: `
    <div class="flex items-center justify-end px-6 h-16 gap-1">
      @switch (viewMode()) {
        @case ('select') {
          <button mat-button mat-dialog-close>
            {{ 'GENERAL.CANCEL' | transloco }}
          </button>
        }
        @case ('import-error') {
          <button mat-button mat-dialog-close [disabled]="loading()">
            {{ 'GENERAL.CANCEL' | transloco }}
          </button>

          <button mat-stroked-button class="text-primary flex gap-1" [matMenuTriggerFor]="menu" [disabled]="loading()">
            <mat-icon>upload</mat-icon>
            {{ 'MISSION.ATTENDANCE_LIST.IMPORT_LIST' | transloco }}
          </button>
          <mat-menu #menu xPosition="before">
            @for (item of importSourceItems(); track item.name) {
              <a
                mat-menu-item
                class="pl-1 pr-2.5"
                (click)="!item.disabled && fileInput.click()"
                [disabled]="item.disabled"
              >
                <div class="w-12 h-12 mr-1.5 bg-{{ item.icon }}"></div>
                <span>
                  {{ item.name }}
                  @if (item.disabled) {
                    ({{ 'MISSION.ATTENDANCE_LIST.SOON' | transloco }})
                  }
                </span>
              </a>
            }
          </mat-menu>
        }
        @case ('import-success') {
          <button mat-button mat-dialog-close>{{ 'GENERAL.CANCEL' | transloco }}</button>

          <button mat-stroked-button class="text-primary" (click)="onContinue()">
            {{ 'GENERAL.CONTINUE' | transloco }}
          </button>
        }
        @case ('import-confirmation') {
          <button mat-button mat-dialog-close [disabled]="loading()">
            {{ 'GENERAL.CANCEL' | transloco }}
          </button>

          <button mat-stroked-button class="text-primary flex gap-1" (click)="onConfirm()" [disabled]="loading()">
            <mat-icon>check</mat-icon>
            {{ 'GENERAL.CONFIRM' | transloco }}
          </button>
        }
      }
    </div>

    <input hidden type="file" accept=".csv" #fileInput (change)="onFileChange()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon, MatMenuTrigger, MatMenu, MatMenuItem, TranslocoPipe, MatDialogModule],
  styles: [
    `
      .bg-teams {
        background: url('/assets/images/integration-icons.png') -214px -146px;
      }

      .bg-meet {
        background: url('/assets/images/integration-icons.png') -78px -214px;
      }

      .bg-zoom {
        background: url('/assets/images/integration-icons.png') -146px -214px;
      }
    `,
  ],
})
export class ImportListFooterComponent {
  viewMode = input<ImportListViewMode>();
  loading = input<boolean>();
  importSourceItems = input<ImportMenuItem[]>();

  fileSelected = output<File>();
  continueImport = output<void>();
  confirmImport = output<void>();

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  onFileChange() {
    const input = this.fileInput.nativeElement;

    const file: File = input?.files?.[0];
    if (!file) {
      return;
    }

    this.fileSelected.emit(file);
    input.value = null;
  }

  onContinue() {
    this.continueImport.emit();
  }

  onConfirm() {
    this.confirmImport.emit();
  }
}
