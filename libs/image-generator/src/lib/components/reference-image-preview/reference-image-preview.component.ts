import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ig-reference-image-preview',
  template: `
    <button matIconButton mat-dialog-close>
      <mat-icon>close</mat-icon>
    </button>
  `,
  styles: [
    `
      :host {
        @apply bg-contain bg-center bg-no-repeat flex p-2 justify-end;

        width: 80vw;
        height: 80vh;
      }
    `,
  ],
  imports: [MatButtonModule, MatIconModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferenceImagePreviewComponent {
  constructor(@Inject(MAT_DIALOG_DATA) protected data: string) {}

  @HostBinding('style.background-image')
  get backgroundImage(): string {
    return `url('${this.data}')`;
  }
}
