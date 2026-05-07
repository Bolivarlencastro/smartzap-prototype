import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@jsverse/transloco';
import {
  CustomSectionsFeature,
  LearningObjectType,
  LearningObjectTypeModel,
  PageType,
} from '../../models/custom-sections';

@Component({
  selector: 'app-custom-sections-header',
  imports: [MatDividerModule, TranslocoModule, MatButtonModule, MatIconModule, NgClass, MatMenuModule],
  template: `
    <div class="flex flex-col pl-8 pr-6 pt-8 pb-4 gap-4">
      <span class="text-2xl">{{ 'CUSTOM_SECTIONS.HEADER.TITLE' | transloco }}</span>
      <div class="flex items-center justify-between">
        <div class="flex gap-3">
          @for (feature of activeFeatures(); track feature.id) {
            <button
              class="h-9 pl-2 pr-3 text-sm flex items-center border rounded-lg border-default"
              [ngClass]="{ 'filter-chip-bg': feature.id === pageType() }"
              (click)="onChangePage(feature.id)"
              [attr.data-test]="'custom-sections-tab-' + feature.id"
            >
              <mat-icon class="mr-2.5 s-6">{{ feature.icon }}</mat-icon>
              <span>{{ feature.label | transloco }}</span>
            </button>
          }
        </div>
        <div class="flex gap-1">
          <button data-test="button-create-new-section" mat-button [matMenuTriggerFor]="menu" color="primary">
            <mat-icon>add</mat-icon>
            <span class="text-primary">{{ 'CUSTOM_SECTIONS.HEADER.CREATE_BUTTON' | transloco }}</span>
          </button>
        </div>
      </div>
    </div>
    <mat-divider></mat-divider>

    <mat-menu #menu="matMenu" data-test="menu-create-section">
      @for (filter of sectionFilter(); track filter.id) {
        <button
          mat-menu-item
          (click)="onCreateSection(filter.id)"
          [attr.data-test]="
            'button-create-section-' +
            (filter.id?.includes('.') ? filter.id?.split('.').slice(1).join('-') : filter.id)
              ?.replaceAll('_', '-')
              ?.toLowerCase()
          "
        >
          <mat-icon class="s-6">{{ filter.icon }}</mat-icon>
          <span>{{ filter.label | transloco }}</span>
        </button>
      }
    </mat-menu>
  `,
  styles: [
    `
      .filter-chip-bg {
        background-color: var(--mat-sys-primary-container);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSectionsHeaderComponent {
  pageType = input<PageType>();
  activeFeatures = input<CustomSectionsFeature[]>();
  sectionFilter = input<LearningObjectTypeModel[]>();

  changePage = output<PageType>();
  createSection = output<LearningObjectType>();

  onChangePage(pageType: PageType) {
    this.changePage.emit(pageType);
  }

  onCreateSection(id: LearningObjectType) {
    this.createSection.emit(id);
  }
}
