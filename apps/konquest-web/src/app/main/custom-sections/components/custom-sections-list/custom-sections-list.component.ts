import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@jsverse/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  CustomSectionModel,
  DeleteContentModel,
  EmptyListMessageModel,
  LearningObjectType,
  LearningObjectTypeModel,
} from '../../models/custom-sections';
import { SectionComponent } from '../section/section.component';

@Component({
  selector: 'app-custom-sections-list',
  imports: [
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    SectionComponent,
    NgTemplateOutlet,
    NgxSkeletonLoaderModule,
    CdkDropList,
    CdkDrag,
  ],
  template: `
    @if (loading()) {
      <ng-container *ngTemplateOutlet="loader"></ng-container>
    } @else {
      @if (manageableSections().length) {
        <div cdkDropList class="w-full flex flex-col gap-4" (cdkDropListDropped)="onDrop($event)">
          @for (section of manageableSections(); track section.id) {
            <app-section
              cdkDrag
              [section]="section"
              (deleteSection)="onDeleteSection($event)"
              (editSection)="onEditSection($event)"
              (deleteContent)="onDeleteContent($event)"
            ></app-section>
          }
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center h-full text-sm">
          <span class="font-bold mb-1">{{ emptyListMessage()?.title | transloco }}</span>
          <span class="mb-2">{{ emptyListMessage()?.description | transloco }}</span>
          <button mat-button [matMenuTriggerFor]="menu" color="primary">
            <mat-icon>add</mat-icon>
            <span class="text-primary">{{ 'CUSTOM_SECTIONS.HEADER.CREATE_BUTTON' | transloco }}</span>
          </button>
        </div>
      }
    }

    <mat-menu #menu="matMenu">
      @for (filter of sectionFilter(); track filter.id) {
        <button mat-menu-item (click)="onCreateSection(filter.id)">
          <mat-icon class="s-6">{{ filter.icon }}</mat-icon>
          <span>{{ filter.label | transloco }}</span>
        </button>
      }
    </mat-menu>

    <ng-template #loader>
      <div class="h-36 w-full rounded-lg">
        <ngx-skeleton-loader
          animation="pulse"
          count="2"
          [theme]="{ height: '100%', width: '100%', 'margin-bottom': '0.75rem' }"
        ></ngx-skeleton-loader>
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        position: relative;
        overflow-y: scroll;
        height: 0;
        padding: 2rem;
        background-color: var(--mat-sys-surface-container-low);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSectionsListComponent {
  loading = input<boolean>();
  sections = input<CustomSectionModel[]>([]);
  sectionFilter = input<LearningObjectTypeModel[]>();
  emptyListMessage = input<EmptyListMessageModel>();

  createSection = output<LearningObjectType>();
  deleteSection = output<string>();
  editSection = output<CustomSectionModel>();
  reorderSections = output<string[]>();
  deleteContent = output<DeleteContentModel>();

  protected manageableSections = computed(() => [...this.sections()]);

  onCreateSection(id: LearningObjectType) {
    this.createSection.emit(id);
  }

  onDeleteSection(id: string) {
    this.deleteSection.emit(id);
  }

  onEditSection(data: CustomSectionModel) {
    this.editSection.emit(data);
  }

  onDeleteContent(data: DeleteContentModel) {
    this.deleteContent.emit(data);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.manageableSections(), event.previousIndex, event.currentIndex);
    this.reorderSections.emit(this.manageableSections().map((section) => section.id));
  }
}
