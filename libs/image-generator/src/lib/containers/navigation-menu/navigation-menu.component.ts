import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ImageSource } from '../../models/image-source';
import { ImageWizardType } from '../../models/image-wizard-type';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatButton, MatButtonAppearance } from '@angular/material/button';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { ImageWizardService } from '../../services/image-wizard.service';

@Component({
  selector: 'ig-navigation-menu',
  imports: [MatIcon, TranslocoPipe, MatButton],
  template: `
    <h2 class="text-xl mb-4">{{ 'IMAGE_WIZARD.IMAGE_SOURCE' | transloco }}</h2>
    <div class="flex flex-col gap-2">
      @for (source of imageSources; track source.type) {
        <button [matButton]="getButtonType(source.type)" (click)="setWizardType(source.type)">
          <mat-icon>
            {{ source.icon }}
          </mat-icon>
          <span class="ml-2">{{ source.label | transloco }}</span>
        </button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        @apply border-r border-default p-4;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationMenuComponent {
  private readonly imageWizard = inject(ImageWizardService);
  protected readonly currentType = this.imageWizard.wizardType;

  protected readonly imageSources: ImageSource[] = [
    { type: 'FILE_UPLOAD', label: marker('IMAGE_WIZARD.SOURCES.FILE_UPLOAD'), icon: 'devices' },
    { type: 'AI_IMAGE_GEN', label: marker('IMAGE_WIZARD.SOURCES.AI_IMAGE_GEN'), icon: 'auto_awesome' },
  ];

  setWizardType(type: ImageWizardType) {
    this.imageWizard.setType(type);
  }

  getButtonType(type: ImageWizardType): MatButtonAppearance {
    return type === this.currentType() ? 'filled' : 'text';
  }
}
